import { useState } from 'react';
import PlayerPanel from './components/playerPanel';
import LogPanel from './components/logPanel';
import Controls from './components/controls';
import Board from './components/board';
import GameArea from './components/gameArea';
import RestartDialog from './components/restartDialog';
import type { Player } from './games/types';

export default function App() {
  const [setupPlayers, setSetupPlayers] = useState<
    Array<Pick<Player, 'name' | 'color' | 'isBot'>>>([
    { name: 'You', color: '#3b82f6', isBot: false },
    { name: 'Player 2', color: '#ef4444', isBot: true },]);


  const [started, setStarted] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [showRestart, setShowRestart] = useState(false);

  const canAdd = setupPlayers.length < 4;
  const addPlayer = () => {
    if (!canAdd) return;
    const idx = setupPlayers.length + 1;
    const palette = ['#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
    setSetupPlayers(prev => [
      ...prev,
      { name: `Player ${idx}`, color: palette[(idx - 1) % palette.length], isBot: false },
    ]);
  };

  const canStart = setupPlayers.length >= 2 && !setupPlayers[0].isBot;   

  const onStart = () => {
    if (setupPlayers.length === 0) return;
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 p-4 sm:p-6 text-zinc-800">
      <h1 className="text-4xl font-extrabold mb-4 text-center">Property Tycoon</h1>

      {!started && (
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 sm:grid-cols-[360px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-white/90 backdrop-blur rounded-xl shadow p-4">
              <PlayerPanel
                started={false}
                setupPlayers={setupPlayers}
                onChangeSetup={setSetupPlayers}
                onAddPlayer={addPlayer}
                canAdd={canAdd}/>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-xl shadow p-4 text-zinc-700">
              <div className="text-sm">
                Add <b>at least 2 players</b> to begin. Player 1 must be human.
              </div>
              {startError && (
                <div className="mt-2 text-sm text-red-600">{startError}</div>
              )}
            </div>
          </div>

          <div className="relative bg-white/90 backdrop-blur rounded-xl shadow p-4 space-y-4">
            <div className="opacity-60 pointer-events-none">
              <div className="mb-3 text-sm text-zinc-600">
                Set up players on the left, then press Start.
              </div>
              <div className="flex justify-center">
                <div className="aspect-square w-full max-w-[600px] bg-zinc-100 rounded-lg border border-zinc-300" />
              </div>
            </div>

            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] rounded-xl grid place-items-center">
              <button
                onClick={onStart}
                disabled={!canStart}
                className={`px-5 py-2.5 rounded-lg font-semibold shadow transition
                  ${canStart
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                title={
                  canStart
                    ? 'Start the game'
                    : setupPlayers.length < 2
                      ? 'Add at least 2 players'
                      : 'Player 1 must be human'
                }>
                Start Game
              </button>

              {!canStart && (
                <div className="mt-3 text-xs text-zinc-600">
                  Players: {setupPlayers.length} / 2+ required
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {started && (
        <GameArea initialPlayers={setupPlayers}>
          {({ state, dispatch, rolling, onRollRequest }) => {
            const current = state.players[state.currentPlayer];
            const canAct = !current.isBot && !current.bankrupt;

            return (
              <div className="relative mx-auto max-w-[1600px] grid grid-cols-1 sm:grid-cols-[360px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
                <div className="flex flex-col gap-4">
                  <div className="bg-white/90 backdrop-blur rounded-xl shadow p-4">
                    <PlayerPanel
                      started
                      setupPlayers={setupPlayers}
                      onChangeSetup={setSetupPlayers}
                      onAddPlayer={() => {}}
                      canAdd={false}
                      state={state}/>
                  </div>
                  <LogPanel entries={state.log} />
                </div>

                <div className="relative bg-white/90 backdrop-blur rounded-xl shadow p-4 space-y-4">
                  <button
                    onClick={() => setShowRestart(true)}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-md border border-zinc-300 bg-white/80 hover:bg-zinc-50 text-sm font-medium shadow-sm transition"
                    aria-label="Restart">
                    Restart
                  </button>

                  <Controls
                    state={state}
                    rolling={rolling}
                    canAct={canAct}              
                    onRollRequest={onRollRequest}
                    onBuy={() => dispatch({ type: 'BUY' })}
                    onSkip={() => dispatch({ type: 'SKIP_BUY' })}
                    onEnd={() => dispatch({ type: 'END_TURN' })}
                    onJailRoll={() => dispatch({ type: 'JAIL_ROLL' })}
                    onJailPay={() => dispatch({ type: 'JAIL_PAY' })}
                    onJailUseCard={() => dispatch({ type: 'JAIL_USE_CARD' })}
                  />

                  <div className="flex justify-center">
                    <Board state={state} />
                  </div>

                  <RestartDialog
                    open={showRestart}
                    onClose={() => setShowRestart(false)}
                    onSoft={() => {
                      dispatch({ type: 'RESET' });
                      setShowRestart(false);
                    }}
                    onHard={() => {
                      setShowRestart(false);
                      setStarted(false);
                    }}
                  />
                </div>
              </div>
            );
          }}
        </GameArea>
      )}
    </div>
  );
}