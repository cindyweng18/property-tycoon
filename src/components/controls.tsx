import type { GameState } from "../games/types";
import GameButton from "./gamebutton";

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
  const phase = state.phase; 
  const canRoll = phase === 'idle' && !cp.bankrupt;
  const canBuy  = phase === 'buy_prompt';
  const canEnd  = phase === 'end';

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold">
        Turn: {cp.name} {state.dice ? `• Dice ${state.dice[0]} + ${state.dice[1]}` : ''}
      </div>

      <div className="flex flex-wrap gap-2">
        <GameButton disabled={!canRoll} onClick={onRoll}>Roll</GameButton>
        <GameButton disabled={!canBuy}  onClick={onBuy}>Buy</GameButton>
        <GameButton disabled={!canBuy}  onClick={onSkip}>Skip</GameButton>
        <GameButton disabled={!canEnd}  onClick={onEnd}>End Turn</GameButton>
      </div>
    </div>
  );
}
