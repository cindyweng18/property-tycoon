import { useEffect, useReducer } from 'react';
import PlayerPanel from './components/playerPanel';
import LogPanel from './components/logPanel';
import Controls from './components/controls';
import Board from './components/board';
import { initialState, reducer } from './games/engine';
import type { GameState } from './games/types';

export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined as unknown as GameState,
    () =>
      initialState([
        { name: 'You', color: '#3b82f6', isBot: false },
        { name: 'Player 2', color: '#ef4444', isBot: true },
      ])
  );

  useEffect(() => {
    const cp = state.players[state.currentPlayer];
    if (!cp?.isBot || cp.bankrupt) return;

    const t = setTimeout(() => {
      dispatch({ type: 'ROLL' });
      setTimeout(() => {
        if (state.phase === 'buy_prompt') {
          dispatch({ type: 'BUY' });
        }
        setTimeout(() => {
          dispatch({ type: 'END_TURN' });
        }, 300);
      }, 350);
    }, 400);

    return () => clearTimeout(t);
  }, [state.currentPlayer, state.players, state.phase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 p-4 sm:p-6 text-zinc-800">
      <h1 className="text-4xl font-extrabold mb-4">Property Tycoon</h1>

      <div className="mx-auto max-w-[1500px] grid grid-cols-1 sm:grid-cols-[360px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">

        <div className="flex flex-col gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow p-4">
            <PlayerPanel state={state} />
          </div>
          <LogPanel entries={state.log} />
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow p-4 space-y-4">
          <Controls
            state={state}
            onRoll={() => dispatch({ type: 'ROLL' })}
            onBuy={() => dispatch({ type: 'BUY' })}
            onSkip={() => dispatch({ type: 'SKIP_BUY' })}
            onEnd={() => dispatch({ type: 'END_TURN' })}
          />

          <div className="flex justify-center">
            <Board state={state} />
          </div>

          <button
            className="px-3 py-1.5 rounded-md border border-zinc-300 hover:bg-zinc-50 transition"
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}