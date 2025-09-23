import type { GameState } from '../games/types';

export default function Board({ state }: { state: GameState }) {
  const fallback = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];
  const colorOf = (id: number) => state.players[id].color ?? fallback[id % fallback.length];

  return (
    <div className="grid gap-3 md:gap-4"
      style={{ gridTemplateColumns: `repeat(${state.tiles.length}, minmax(140px, 1fr))` }}
    >
      {state.tiles.map((t, idx) => {
        const isProperty = t.type === 'PROPERTY';
        const ownerId = (isProperty ? t.ownerId : null) ?? null;
        const owned = ownerId !== null && ownerId !== undefined;

        const borderStyle: React.CSSProperties = owned
          ? { borderColor: colorOf(ownerId), boxShadow: `0 0 0 1px ${colorOf(ownerId)}20` }
          : {};

        const stripeStyle: React.CSSProperties = owned
          ? { background: colorOf(ownerId) }
          : { background: 'transparent' };

        const occupants = state.players.filter(p => p.position === idx && !p.bankrupt);

        return (
          <div
            key={t.id}
            className={[
              'relative rounded-lg border bg-white/90 backdrop-blur p-3',
              'shadow-sm transition-shadow',
              owned ? 'border-2' : 'border-zinc-200',
              'text-zinc-800',
              'hover:shadow-md'
            ].join(' ')}
            style={borderStyle}
            title={owned && isProperty ? `Owned by ${state.players[ownerId!].name}` : t.name}
          >
            <div
              className="absolute left-0 top-0 h-1.5 w-full rounded-t-lg"
              style={stripeStyle}
              aria-hidden="true"
            />
            <div className="text-sm md:text-[15px] font-semibold truncate pr-12">{t.name}</div>
            {isProperty && (
              <div className="mt-1 text-xs md:text-[13px] text-zinc-600">
                ${t.price} • Rent ${t.rent}{' '}
                {owned ? (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px]"
                        style={{ background: `${colorOf(ownerId!)}15`, color: colorOf(ownerId!) }}>
                    ● Owned by {state.players[ownerId!].name}
                  </span>
                ) : (
                  <span className="ml-1 text-[11px] text-zinc-500">Unowned</span>
                )}
              </div>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5">
              {occupants.map(p => (
                <div
                  key={p.id}
                  className="h-4 w-4 rounded-full ring-2 ring-white/80"
                  style={{ background: colorOf(p.id) }}
                  title={p.name}
                  aria-label={`${p.name} token`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
