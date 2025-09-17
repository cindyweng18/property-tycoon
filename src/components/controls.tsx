import type { GameState } from "../games/types";
import GameButton from './components/gamebutton';

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
        <GameButton disabled={phase !== 'roll'} onClick={rollDice}>Roll</GameButton>
        <GameButton disabled={phase !== 'buy_prompt'} onClick={buyProperty}>Buy</GameButton>
        <GameButton disabled={phase !== 'buy_prompt'} onClick={skip}>Skip</GameButton>
        <GameButton disabled={phase !== 'end_turn'} onClick={endTurn}>End Turn</GameButton>
      </div>
    </div>
  );
}