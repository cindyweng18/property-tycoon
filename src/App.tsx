import { useEffect, useReducer, useState } from 'react';
import Board from './components/board';
import Controls from './components/controls';
import PlayerPanel from './components/playerPanel';
import Setup from './components/setup';
import LogPanel from './components/logPanel';
import { initialState, reducer } from './games/engine';
import type { Player } from './games/types';

type SetupPlayer = { name: string; color: string; isBot: boolean };

export default function App() {
  const [setupPlayers, setSetupPlayers] = useState<SetupPlayer[] | null>(null);

  if (!setupPlayers) {
    return <Setup onStart={(players) => setSetupPlayers(players)} />;
  }
  return <GameRuntime players={setupPlayers} onRestart={() => setSetupPlayers(null)} />;
}

function GameRuntime({
  players,
  onRestart,
}: {
  players: SetupPlayer[];
  onRestart: () => void;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    players,
    (playersArg) => {
      const normalized = (playersArg as SetupPlayer[]).map(
        (p, i): Partial<Player> & { name: string } => ({
          name: p.name || `Player ${i + 1}`,
          color: p.color,
          isBot: p.isBot,
        })
      );
      return initialState(normalized);
    }
  );

  useEffect(() => {
    const cp = state.players[state.currentPlayer];
    if (!cp || !cp.isBot || cp.bankrupt) return;

    let t: number | undefined;
    if (state.phase === 'idle') {
      t = window.setTimeout(() => dispatch({ type: 'ROLL' }), 350);
    } else if (state.phase === 'buy_prompt') {
      t = window.setTimeout(() => dispatch({ type: 'BUY' }), 350);
    } else if (state.phase === 'end') {
      t = window.setTimeout(() => dispatch({ type: 'END_TURN' }), 350);
    }
    return () => { if (t) clearTimeout(t); };
  }, [state.currentPlayer, state.phase, state.players]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 p-6 space-y-4 text-zinc-800">
      <h1 className="text-3xl font-extrabold text-center">Property Tycoon</h1>

      <div className="flex flex-col gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl shadow p-4">
          <PlayerPanel state={state} />
        </div>
        <LogPanel entries={state.log} />
      </div>
        <div className="col-span-2 bg-white/80 backdrop-blur rounded-xl shadow p-4 space-y-4">
          <Controls
            state={state}
            onRoll={() => dispatch({ type: 'ROLL' })}
            onBuy={() => dispatch({ type: 'BUY' })}
            onSkip={() => dispatch({ type: 'SKIP_BUY' })}
            onEnd={() => dispatch({ type: 'END_TURN' })}
          />
          <Board state={state} />

          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-md border border-zinc-300"
              onClick={onRestart}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
  );
}