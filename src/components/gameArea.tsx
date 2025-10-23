import { useEffect, useMemo, useState, useReducer } from 'react';
import { initialState, reducer } from '../games/engine';
import type { GameState, Player } from '../games/types';

type Props = {
  initialPlayers: Array<Pick<Player, 'name' | 'color' | 'isBot'>>;
  children: (args: {
    state: GameState;
    dispatch: React.Dispatch<any>;
    rolling: boolean;
    onRollRequest: () => void;
  }) => React.ReactNode;
};

export default function GameArea({ initialPlayers, children }: Props) {
  const init = useMemo(() => initialState(initialPlayers), [initialPlayers]);
  const [state, dispatch] = useReducer(reducer, init);
  const [rolling, setRolling] = useState(false);
  
  const onRollRequest = () => {
    if (state.phase !== 'idle' || rolling) return;
    setRolling(true);
    setTimeout(() => {
      dispatch({ type: 'ROLL' });          
      setTimeout(() => setRolling(false), 600);
    }, 400); 
  };


  useEffect(() => {
    const cp = state.players[state.currentPlayer];
    if (!cp?.isBot || cp.bankrupt) return;

    const t = setTimeout(() => {

      if (state.phase === 'idle' && !rolling) {
        onRollRequest(); 
        return;
      }

      if (state.phase === 'buy_prompt') {
        const tile = state.tiles[state.players[state.currentPlayer].position];
        const canBuy =
          tile.type === 'PROPERTY' &&
          tile.price != null &&
          tile.ownerId == null &&
          cp.cash >= tile.price;

        dispatch({ type: canBuy ? 'BUY' : 'SKIP_BUY' });
        return;
      }

      if (state.phase === 'jail_choice') {
        if (cp.cash >= 50) {
          dispatch({ type: 'JAIL_PAY' });
        } else {
          dispatch({ type: 'JAIL_ROLL' });
        }
        return;
      }

      if (state.phase === 'end') {
        dispatch({ type: 'END_TURN' });
        return;
      }
    }, 450); 

    return () => clearTimeout(t);
  }, [
    state.currentPlayer,
    state.phase,
    state.players,
    state.tiles,
    rolling,
    onRollRequest,
    dispatch,
  ]);

  return <>{children({ state, dispatch, rolling, onRollRequest })}</>;
}