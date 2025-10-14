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

  const takeTurn = () => {

    if (state.phase === 'jail_choice') {
      if (cp.inJailTurns > 1) {
        dispatch({ type: 'JAIL_ROLL' });
      } else {
        dispatch({ type: 'JAIL_PAY' });
      }
      setTimeout(() => dispatch({ type: 'END_TURN' }), 800);
      return;
    }

    if (state.phase === 'idle') {
      dispatch({ type: 'ROLL' });
      setTimeout(() => {
        if (state.phase === 'buy_prompt') dispatch({ type: 'BUY' });
        setTimeout(() => dispatch({ type: 'END_TURN' }), 500);
      }, 600);
    }
  };

  const timer = setTimeout(takeTurn, 600);
  return () => clearTimeout(timer);
}, [state.currentPlayer, state.phase, state.players]);

  return <>{children({ state, dispatch, rolling, onRollRequest })}</>;
}