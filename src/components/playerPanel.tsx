import type { GameState } from '../games/types';

export default function PlayerPanel({ state }: { state: GameState }) {
  return (
    <div className="flex flex-wrap gap-2">
      {state.players.map((p, idx) => (
        <div
          key={p.id}
          className={[
            'min-w-[180px] rounded-lg border p-3',
            idx === state.currentPlayer ? 'ring-2 ring-blue-500' : 'border-zinc-200',
          ].join(' ')}
        >
          <div className="text-sm font-semibold">{p.name} {p.bankrupt && '💀'}</div>
          <div className="text-xs text-zinc-600">Cash: ${p.cash}</div>
          <div className="text-xs text-zinc-600">Pos: {p.position}</div>
          <div className="text-xs text-zinc-600">Jail: {p.inJailTurns ? `${p.inJailTurns} turn` : 'no'}</div>
        </div>
      ))}
    </div>
  );
}
