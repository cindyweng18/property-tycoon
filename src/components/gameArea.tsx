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
    if (!cp?.isBot || cp.bankrupt || rolling) return;
    if (state.phase !== 'idle') return;

    const t1 = setTimeout(() => {
      onRollRequest();
      const t2 = setTimeout(() => {
        if (state.phase === 'buy_prompt') {
          dispatch({ type: 'BUY' });
        }
        const t3 = setTimeout(() => {
          dispatch({ type: 'END_TURN' });
        }, 350);
        return () => clearTimeout(t3);
      }, 700); 
      return () => clearTimeout(t2);
    }, 450);

    return () => clearTimeout(t1);
  }, [state.currentPlayer, state.phase, state.players, rolling]);

  return <>{children({ state, dispatch, rolling, onRollRequest })}</>;
}