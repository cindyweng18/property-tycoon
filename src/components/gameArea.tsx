import React, { useEffect, useReducer, useRef } from 'react';
import { initialState, reducer } from '../games/engine';
import type { GameState, Player } from '../games/types';

export default function GameArea({
  initialPlayers,
  children,
}: {
  initialPlayers: Array<Pick<Player, 'name' | 'color' | 'isBot'>>;
  children: (ctx: { state: GameState; dispatch: React.Dispatch<any> }) => React.ReactNode;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined as unknown as GameState,
    () => initialState(initialPlayers)
  );
  const busyRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
      busyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const cp = state.players[state.currentPlayer];
    const inputPhase = state.phase === 'idle' || state.phase === 'buy_prompt' || state.phase === 'end';
    if (!cp?.isBot || cp.bankrupt || !inputPhase || busyRef.current) return;

    busyRef.current = true;
    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    if (state.phase === 'idle') {
      after(300, () => dispatch({ type: 'ROLL' }));
    } else if (state.phase === 'buy_prompt') {
      after(280, () => dispatch({ type: 'BUY' }));
    } else if (state.phase === 'end') {
      after(240, () => {
        dispatch({ type: 'END_TURN' });
        busyRef.current = false;
        timersRef.current.forEach(id => clearTimeout(id));
        timersRef.current = [];
      });
      return;
    }

    after(1000, () => {
      const stillBot = state.players[state.currentPlayer]?.isBot;
      if (stillBot) {
        if (state.phase === 'buy_prompt') {
          dispatch({ type: 'BUY' });
          after(250, () => dispatch({ type: 'END_TURN' }));
        } else if (state.phase === 'end') {
          dispatch({ type: 'END_TURN' });
        }
      }
      busyRef.current = false;
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    });

    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
      busyRef.current = false;
    };
  }, [state.currentPlayer, state.phase, state.players]);
  return <>{children({ state, dispatch })}</>;
}