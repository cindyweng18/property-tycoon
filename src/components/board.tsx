import type { GameState } from '../games/types';

export default function Board({ state }: { state: GameState }) {
  const { boardSize, tiles, players } = state;
  const boardClass = "relative aspect-square w-full " + "max-w-[600px] sm:max-w-[700px] md:max-w-[820px] lg:max-w-[900px] xl:max-w-[960px]";
  const cellMinHeights ="min-h-[110px] sm:min-h-[125px] md:min-h-[140px] lg:min-h-[150px]";
  const gridGap = "gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5";
  const byPos = new Map<string, typeof tiles[number]>();
  tiles.forEach((t) => byPos.set(`${t.row},${t.col}`, t));
  const fallback = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4'];
  const colorOf = (id: number) => players[id].color ?? fallback[id % fallback.length];

  return (
    <div className="w-full flex justify-center">
      <div className={boardClass}>
        <div
          className={`absolute inset-0 grid place-items-center ${gridGap}`}
          style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))` }} >
          {Array.from({ length: boardSize }).map((_, r) =>
            Array.from({ length: boardSize }).map((__, c) => {
              const tile = byPos.get(`${r},${c}`);

              if (!tile) {
                return (
                  <div
                    key={`${r},${c}`}
                    className="rounded-lg bg-white/30"
                    aria-hidden="true"/> );}

              const isProperty = tile.type === 'PROPERTY';
              const ownerId = (isProperty ? tile.ownerId : null) ?? null;
              const owned = ownerId !== null && ownerId !== undefined;
              const occupants = players.filter(
                (p) => p.position === tile.id && !p.bankrupt);

              return (
                <div
                  key={`${r},${c}`}
                  className={[
                    "relative rounded-lg border bg-white/95 backdrop-blur",
                    "flex flex-col items-center justify-between p-2 sm:p-3 md:p-4",
                    owned ? "border-2" : "border-zinc-200",
                    "text-zinc-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                  ].join(" ")}
                  style={{
                    aspectRatio: '1 / 1',
                    minWidth: '90px',
                    minHeight: '90px',
                    borderColor: owned ? colorOf(ownerId!) : undefined,
                  }}>
                  <div
                    className="font-semibold text-center text-xs sm:text-sm md:text-base leading-tight break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                    {tile.name}
                  </div>

                  <div className="text-[10px] sm:text-xs md:text-sm text-zinc-600 text-center">
                    {tile.type === 'PROPERTY'
                      ? `$${tile.price} • Rent $${tile.rent}`
                      : tile.type === 'GO'
                      ? 'Collect $200'
                      : tile.type === 'JAIL'
                      ? 'Jail'
                      : tile.type === 'FREE'
                      ? 'Free Parking'
                      : tile.type === 'GO_TO_JAIL'
                      ? 'Go to Jail'
                      : tile.type === 'TAX'
                      ? 'Pay Tax'
                      : ''}
                  </div>

                  <div className="grid grid-cols-2 grid-rows-2 gap-1 place-items-center w-full mt-2">
                    {occupants.map((p) => (
                      <div
                        key={p.id}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full ring-2 ring-white/90 shadow"
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