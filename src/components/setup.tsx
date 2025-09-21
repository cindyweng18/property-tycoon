import { useMemo, useState } from 'react';

type SetupPlayer = {
  name: string;
  color: string;
  isBot: boolean;
};

const presetColors = ['#3b82f6','#ef4444','#22c55e','#f59e0b','#a855f7','#06b6d4'];

export default function Setup({ onStart }: { onStart: (players: SetupPlayer[]) => void }) {
  const [count, setCount] = useState(2);
  const [players, setPlayers] = useState<SetupPlayer[]>(() =>
    Array.from({ length: 2 }, (_, i) => ({
      name: i === 0 ? 'You' : 'Player 2',
      color: presetColors[i % presetColors.length],
      isBot: i === 0 ? false : true, 
    }))
  );
  const [error, setError] = useState<string>('');

  useMemo(() => {
    setPlayers(prev => {
      const next = [...prev];

      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          next.push({
            name: `Player ${i + 1}`,
            color: presetColors[i % presetColors.length],
            isBot: i === 0 ? false : true,
          });
        }
      }
      if (count < prev.length) {
        next.length = count;
      }
      if (next[0]) next[0].isBot = false;

      return next;
    });
    setError('');
  }, [count]);

  const update = (idx: number, patch: Partial<SetupPlayer>) => {
    setPlayers(ps =>
      ps.map((p, i) => {
        if (i !== idx) return p;
        const enforced: Partial<SetupPlayer> =
          i === 0 && 'isBot' in patch ? { ...patch, isBot: false } : patch;
        return { ...p, ...enforced };
      })
    );
    setError('');
  };

  const handleStart = () => {
    const hasBot = players.slice(1).some(p => p.isBot);
    if (!hasBot) {
      setError('At least one player (other than Player 1) must be a Computer.');
      return;
    }
    onStart(players);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-xl shadow p-6 text-zinc-800">
      <h2 className="text-2xl font-bold mb-4">Game Setup</h2>

      <label className="block mb-4">
        <span className="text-sm font-medium">Number of players</span>
        <select
          className="mt-1 block w-40 rounded border border-zinc-300 p-2"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {[2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      <div className="space-y-3">
        {players.map((p, idx) => (
          <div key={idx} className="rounded border border-zinc-200 p-3">
            <div className="font-medium mb-2">Player {idx + 1}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <input
                type="text"
                className="rounded border border-zinc-300 p-2"
                placeholder={`Player ${idx + 1} name`}
                value={p.name}
                onChange={(e) => update(idx, { name: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">Color</span>
                <input
                  type="color"
                  className="h-9 w-14 cursor-pointer"
                  value={p.color}
                  onChange={(e) => update(idx, { color: e.target.value })}
                  aria-label={`Player ${idx + 1} color`}
                />
              </div>

              {idx === 0 ? (
                <div className="text-sm text-zinc-500 select-none">
                  Computer: <span className="inline-block px-2 py-1 rounded bg-zinc-100 text-zinc-500">Not allowed</span>
                </div>
              ) : (
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.isBot}
                    onChange={(e) => update(idx, { isBot: e.target.checked })}
                  />
                  <span className="text-sm">Computer</span>
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}