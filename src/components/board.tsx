import type { GameState } from '../games/types';

const playerColor = (id: number) => ['#3b82f6','#ef4444','#22c55e','#f59e0b'][id % 4];

export default function Board({ state }: { state: GameState }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${state.tiles.length}, minmax(90px, 1fr))` }}>
      {state.tiles.map((t, i) => {
        const occupants = state.players.filter(p => p.position === i && !p.bankrupt);
        const isProperty = t.type === 'PROPERTY';
        return (
          <div
            key={t.id}
            className={[
              'rounded-lg border p-2 shadow-sm transition-shadow',
              'bg-white/80 backdrop-blur border-zinc-200 hover:shadow',
            ].join(' ')}
          >
            <div className="text-xs font-semibold text-zinc-700 truncate">{t.name}</div>
            {isProperty && (
              <div className="text-[10px] text-zinc-500">
                ${t.price} • Rent ${t.rent} {t.ownerId != null ? `• P${t.ownerId + 1}` : ''}
              </div>
            )}
            <div className="mt-2 flex gap-1">
              {occupants.map(p => (
                <div
                  key={p.id}
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white/70"
                  style={{ background: playerColor(p.id) }}
                  title={p.name}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}