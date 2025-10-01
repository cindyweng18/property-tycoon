import { useEffect, useRef } from 'react';

export default function LogPanel({ entries }: { entries: string[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [entries]);

  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow p-4 text-zinc-800">
      <div className="text-lg md:text-xl font-semibold mb-2">Game Log</div>
      <div
        ref={scrollerRef}
        className="max-h-56 md:max-h-64 overflow-auto pr-2 space-y-1"
        aria-live="polite"
      >
        {entries.length === 0 ? (
          <div className="text-sm text-zinc-500">No events yet.</div>
        ) : (
          entries.map((line, i) => (
            <div key={i} className="text-xs md:text-sm text-zinc-700">
              • {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}