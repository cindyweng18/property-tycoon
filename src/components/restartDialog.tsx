export default function RestartDialog({
  open,
  onClose,
  onSoft,
  onHard,
}: {
  open: boolean;
  onClose: () => void;
  onSoft: () => void; 
  onHard: () => void; 
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px] grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restart-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl text-zinc-800">
        <div className="p-4 border-b border-zinc-200">
          <h2 id="restart-title" className="text-lg font-semibold">Restart Game</h2>
          <p className="text-sm text-zinc-600 mt-1">
            How would you like to restart?
          </p>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={onSoft}
            className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            New round (keep players)
          </button>
          <p className="text-xs text-zinc-500 -mt-1">
            Resets the board and log but keeps current players and colors.
          </p>

          <button
            onClick={onHard}
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 transition"
          >
            Full setup (change players)
          </button>
          <p className="text-xs text-zinc-500 -mt-1">
            Return to the setup screen to edit names, colors, and bot settings.
          </p>
        </div>

        <div className="p-3 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-zinc-300 hover:bg-zinc-50 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
