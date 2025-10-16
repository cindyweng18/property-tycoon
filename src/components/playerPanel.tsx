import type { Player, GameState } from '../games/types';

type Editable = Pick<Player, 'name' | 'color' | 'isBot'>;

export default function PlayerPanel({
  started,
  setupPlayers,
  onChangeSetup,
  onAddPlayer,
  canAdd,
  state,
}: {
  started: boolean;
  setupPlayers: Editable[];
  onChangeSetup: (next: Editable[]) => void;
  onAddPlayer: () => void;
  canAdd: boolean;
  state?: GameState;
}) {
  const updateAt = (idx: number, patch: Partial<Editable>) =>
    onChangeSetup(setupPlayers.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  if (!started) {
    return (
      <div>
        <div className="text-lg md:text-xl font-bold mb-3">Players</div>
        <div className="space-y-3">
          {setupPlayers.map((p, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 ${started ? 'opacity-90' : ''}`}>
                <input
                  type="color"
                  className="h-8 w-10 rounded border border-zinc-300"
                  value={p.color}
                  disabled={started}
                  onChange={(e) => updateAt(idx, { color: e.target.value })}
                  title="Token color"/>

                <input
                  className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm"
                  value={p.name}
                  disabled={started}
                  onChange={(e) => updateAt(idx, { name: e.target.value })}
                  placeholder={`Player ${idx + 1}`}/>

                <label
                  className={`ml-1 flex items-center gap-1 text-xs ${
                    started ? 'opacity-60' : 'text-zinc-700'
                  } ${isFirst ? 'opacity-40 cursor-not-allowed' : ''}`}
                  title={isFirst ? 'Player 1 must be human' : 'Mark this player as a bot'} >
                  <input
                    type="checkbox"
                    checked={!!p.isBot && !isFirst}
                    disabled={started || isFirst}
                    onChange={(e) => updateAt(idx, { isBot: e.target.checked })} />
                  Bot
                </label>
              </div>
            );
          })}
        </div>
        {!started && (
          <div className="mt-3 flex justify-between items-center">
            <button
              className={`px-3 py-1.5 rounded-md border border-zinc-300 ${
                canAdd ? 'hover:bg-zinc-50' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={onAddPlayer}
              disabled={!canAdd}
              title={canAdd ? 'Add player' : 'Max 4 players'} >
              + Add Player
            </button>
            <div className="text-xs text-zinc-600">{setupPlayers.length} / 4</div>
          </div>
        )}

        <div className="mt-3 text-xs text-zinc-600">
          Player 1 must be human. You can set Players 2–4 as bots.
        </div>
      </div>
    );
  }

  const players = state?.players ?? [];

  return (
    <div>
      <div className="text-lg md:text-xl font-bold mb-3">Players</div>
      <div className="space-y-3">
        {players.map((p) => (
          <div
            key={p.id}
            className={`flex justify-between items-center gap-2 rounded-md border px-2.5 py-1.5 ${
              p.bankrupt ? 'opacity-50 bg-red-50' : 'bg-white/80'
            }`}>
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: p.color }}
                title={`${p.name}'s token color`} />
              <span className="font-medium text-sm md:text-base">{p.name}</span>
            </div>

            <div className="text-right text-sm md:text-base font-semibold text-zinc-700">
              ${p.cash.toLocaleString()}
              {p.bankrupt && <div className="text-xs text-red-600">Bankrupt</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}