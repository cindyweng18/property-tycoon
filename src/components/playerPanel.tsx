import type { Player } from '../games/types';

type Editable = Pick<Player, 'name' | 'color' | 'isBot'>;

export default function PlayerPanel({
  started,
  setupPlayers,
  onChangeSetup,
  onAddPlayer,
  canAdd,
}: {
  started: boolean;
  setupPlayers: Editable[];
  onChangeSetup: (next: Editable[]) => void;
  onAddPlayer: () => void;
  canAdd: boolean;
}) {
  if (!started) {
    return (
      <div>
        <div className="text-lg md:text-xl font-bold mb-3">Players</div>
        <div className="space-y-3">
          {setupPlayers.map((p, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm"
                value={p.name}
                onChange={(e) => {
                  const v = e.target.value;
                  onChangeSetup(setupPlayers.map((sp, i) => i === idx ? { ...sp, name: v } : sp));
                }}
                placeholder={`Player ${idx + 1}`}
              />
              <input
                type="color"
                className="h-8 w-10 rounded border border-zinc-300"
                value={p.color}
                onChange={(e) => {
                  onChangeSetup(setupPlayers.map((sp, i) => i === idx ? { ...sp, color: e.target.value } : sp));
                }}
                title="Token color"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between">
          <button
            className={`px-3 py-1.5 rounded-md border border-zinc-300 ${canAdd ? 'hover:bg-zinc-50' : 'opacity-50 cursor-not-allowed'}`}
            onClick={onAddPlayer}
            disabled={!canAdd}
            title={canAdd ? 'Add player' : 'Max 4 players'}
          >
            + Add Player
          </button>
          <div className="text-xs text-zinc-600">{setupPlayers.length} / 4</div>
        </div>

        <div className="mt-3 text-xs text-zinc-600">
          Tip: pick different colors to see distinct tokens on the board.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-lg md:text-xl font-bold mb-3">Players</div>
      <div className="space-y-2">
        {setupPlayers.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="h-3.5 w-3.5 rounded-full ring-2 ring-white/90"
              style={{ background: p.color }}
              aria-hidden
            />
            <div className="font-semibold">{p.name}</div>
            {p.isBot && <span className="ml-2 text-xs text-zinc-500">(Bot)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}