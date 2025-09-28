import type { GameState } from '../games/types';

export default function Board({ state }: { state: GameState }) {
  const { boardSize, tiles, players } = state;
  const boardClass ="relative aspect-square w-full " + "max-w-[640px] sm:max-w-[760px] md:max-w-[900px] lg:max-w-[1040px] xl:max-w-[1160px]";
  const cellMinHeights = "min-h-[64px] sm:min-h-[76px] md:min-h-[90px] lg:min-h-[104px]";
  const tokenClass = "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full ring-2 ring-white/90";
  const byPos = new Map<string, typeof tiles[number]>();
  tiles.forEach((t) => byPos.set(`${t.row},${t.col}`, t));

  const fallback = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
  const colorOf = (id: number) => players[id].color ?? fallback[id % fallback.length];

  return (
    <div className="w-full flex justify-center">
      <div className={boardClass}>
        <div
          className="absolute inset-0 grid p-2 gap-2 md:gap-2.5 lg:gap-3"
          style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
          {Array.from({ length: boardSize }).map((_, r) =>
            Array.from({ length: boardSize }).map((__, c) => {
              const tile = byPos.get(`${r},${c}`);

              if (!tile) {
                return (
                  <div
                    key={`${r},${c}`}
                    className="rounded-lg bg-white/30"
                    aria-hidden="true"/>);}

              const isProperty = tile.type === 'PROPERTY';
              const ownerId = (isProperty ? tile.ownerId : null) ?? null;
              const owned = ownerId !== null && ownerId !== undefined;
              const occupants = players.filter((p) => p.position === tile.id && !p.bankrupt);

              return (
                <div
                  key={`${r},${c}`}
                  className={[
                    "relative rounded-lg border bg-white/95 backdrop-blur",
                    "px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-3.5 md:py-3.5",
                    cellMinHeights,
                    owned ? "border-2" : "border-zinc-200",
                    "text-zinc-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                  ].join(" ")}
                  style={owned ? { borderColor: colorOf(ownerId!) } : {}}
                  title={
                    owned && isProperty
                      ? `${tile.name} • Owned by ${players[ownerId!].name}`
                      : tile.name}>
                  <div
                    className="absolute left-0 top-0 h-2 w-full rounded-t-lg"
                    style={{ background: owned ? colorOf(ownerId!) : 'transparent' }}
                    aria-hidden="true"/>

                  <div
                    className="
                      font-semibold text-center leading-tight break-words
                      text-[11px] sm:text-[12px] md:text-sm lg:text-[15px]"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                    {tile.name}
                  </div>

                  {isProperty ? (
                    <div className="mt-1 text-center leading-tight text-[10px] sm:text-[11px] md:text-xs lg:text-sm text-zinc-700">
                      ${tile.price} • Rent ${tile.rent}{' '}
                      {owned ? (
                        <span
                          className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-[2px]"
                          style={{
                            background: `${colorOf(ownerId!)}18`,
                            color: colorOf(ownerId!),
                          }} >
                          ● {players[ownerId!].name}
                        </span>
                      ) : (
                        <span className="ml-1 text-zinc-500">Unowned</span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 text-center leading-tight text-[10px] sm:text-[11px] md:text-xs lg:text-sm text-zinc-600">
                      {tile.type === 'GO' && 'Collect $200 when passing'}
                      {tile.type === 'JAIL' && 'Just visiting'}
                      {tile.type === 'FREE' && 'Free Parking'}
                      {tile.type === 'GO_TO_JAIL' && 'Go directly to Jail'}
                      {tile.type === 'TAX' && 'Pay tax'}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {occupants.map((p) => (
                      <div
                        key={p.id}
                        className={tokenClass}
                        style={{ background: colorOf(p.id) }}
                        title={p.name}
                        aria-label={`${p.name} token`}/>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}