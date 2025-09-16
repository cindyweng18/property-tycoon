import { useReducer } from 'react';
import Board from './components/board';
import Controls from './components/controls';
import PlayerPanel from './components/playerPanel';
import { initialState, reducer } from './games/engine';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(['Alice', 'Bob']));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 p-6 space-y-4">
      <h1 className="text-3xl font-extrabold text-center">Property Tycoon (MVP)</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur rounded-xl shadow p-4">
          <PlayerPanel state={state} />
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
          <div className="space-y-1">
            <div className="text-sm font-semibold">Log</div>
            {state.log.map((l, i) => (
              <div key={i} className="text-xs text-zinc-700">• {l}</div>
            ))}
          </div>
          <button
            className="px-3 py-1.5 rounded-md border border-zinc-300"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
