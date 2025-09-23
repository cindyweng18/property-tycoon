import type { GameState } from '../games/types';

export default function PlayerPanel({ state }: { state: GameState }) {
  const fallback = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];
  const colorOf = (idx: number) => state.players[idx].color ?? fallback[idx % fallback.length];

  return (
    <div className="flex flex-wrap gap-2">
      {state.players.map((p, idx) => {
        const isCurrent = idx === state.currentPlayer;
        const color = colorOf(idx);

        return (
          <div
            key={p.id}
            className={[
              'min-w-[200px] rounded-lg border p-3 bg-white/80 backdrop-blur',
              'text-zinc-800 dark:text-zinc-100',
              isCurrent ? 'ring-2 ring-blue-500 border-transparent' : 'border-zinc-200',
              p.bankrupt ? 'opacity-60' : '',
            ].join(' ')}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block h-3.5 w-3.5 rounded-full ring-2 ring-white/70 flex-shrink-0"
                  style={{ background: color }}
                  title={p.name}
                  aria-label={`Color for ${p.name}`}
                />
                <span
                  className="text-sm font-semibold truncate text-zinc-800"
                >
                  {p.name} {p.bankrupt && '💀'}
                </span>
              </div>

              <span
                className={[
                  'text-[11px] px-2 py-0.5 rounded-full select-none',
                  p.isBot
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
                ].join(' ')}
                title={p.isBot ? 'Computer player' : 'Human player'}
              >
                {p.isBot ? 'BOT' : 'HUMAN'}
              </span>
            </div>

            <div className="mt-2 space-y-0.5 text-xs">
              <div className="text-zinc-600 dark:text-zinc-400">Cash: ${p.cash}</div>
              <div className="text-zinc-600 dark:text-zinc-400">Position: {p.position}</div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Jail: {p.inJailTurns ? `${p.inJailTurns} turn` : 'no'}
              </div>
              {isCurrent && !p.bankrupt && (
                <div className="text-[11px] text-blue-600 dark:text-blue-300 font-medium mt-1">
                  Your turn
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
