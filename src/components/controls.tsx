import type { GameState } from "../games/types";
import GameButton from "./gamebutton";
import DicePair from "./dice";

export default function Controls({
  state,
  rolling,
  onRollRequest,
  onBuy,
  onSkip,
  onEnd,
}: {
  state: GameState;
  rolling: boolean;
  onRollRequest: () => void;
  onBuy: () => void;
  onSkip: () => void;
  onEnd: () => void;
}) {
  const cp = state.players[state.currentPlayer];

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">
        Turn: {cp.name}{" "}
        {state.dice ? (
          <span className="text-zinc-600">
            • Dice {state.dice[0]} + {state.dice[1]}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          <GameButton disabled={state.phase !== "idle" || rolling} onClick={onRollRequest}>
            Roll
          </GameButton>
          <GameButton disabled={state.phase !== "buy_prompt" || rolling} onClick={onBuy}>
            Buy
          </GameButton>
          <GameButton disabled={state.phase !== "buy_prompt" || rolling} onClick={onSkip}>
            Skip
          </GameButton>
          <GameButton disabled={state.phase !== "end" || rolling} onClick={onEnd}>
            End Turn
          </GameButton>
        </div>

        <DicePair values={state.dice} rolling={rolling} />
      </div>
    </div>
  );
}