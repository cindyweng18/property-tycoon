import type { GameState } from "../games/types";

export default function Controls({
  state, onRoll, onBuy, onSkip, onEnd
}: {
  state: GameState;
  onRoll: () => void;
  onBuy: () => void;
  onSkip: () => void;
  onEnd: () => void;
}) {
  const cp = state.players[state.currentPlayer];
  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">
        Turn: {cp.name} {state.dice ? `• Dice ${state.dice[0]} + ${state.dice[1]}` : ''}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRoll}
          disabled={state.phase !== 'idle' || cp.bankrupt}
          className="px-3 py-1.5 rounded-md bg-blue-600 text-white disabled:opacity-50"
        >Roll</button>
        <button
          onClick={onBuy}
          disabled={state.phase !== 'buy_prompt'}
          className="px-3 py-1.5 rounded-md border border-zinc-300"
        >Buy</button>
        <button
          onClick={onSkip}
          disabled={state.phase !== 'buy_prompt'}
          className="px-3 py-1.5 rounded-md border border-zinc-300"
        >Skip</button>
        <button
          onClick={onEnd}
          disabled={state.phase !== 'end'}
          className="px-3 py-1.5 rounded-md text-zinc-700"
        >End Turn</button>
      </div>
    </div>
  );
}