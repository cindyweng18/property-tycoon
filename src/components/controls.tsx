import type { GameState } from "../games/types";
import GameButton from "./gamebutton";
import DicePair from "./dice";

export default function Controls({
  state,
  rolling = false,
  canAct = true,
  onRollRequest,
  onBuy,
  onSkip,
  onEnd,
  onJailRoll,
  onJailPay,
  onJailUseCard,
}: {
  state: GameState;
  rolling?: boolean;
  canAct?: boolean;
  onRollRequest: () => void;
  onBuy: () => void;
  onSkip: () => void;
  onEnd: () => void;
  onJailRoll: () => void;
  onJailPay: () => void;
  onJailUseCard?: () => void;
}) {
  const cp = state.players[state.currentPlayer];
  const inJailChoice = state.phase === 'jail_choice';
  const canUseCard = (cp.getOutCards ?? 0) > 0;
  const globalDisabled = !canAct || rolling;

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

      {!inJailChoice ? (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <GameButton
              disabled={globalDisabled || state.phase !== "idle"}
              onClick={onRollRequest}
              tooltip={!canAct ? "Wait for your turn" : "Roll the dice"}>
              Roll
            </GameButton>

            <GameButton
              disabled={globalDisabled || state.phase !== "buy_prompt"}
              onClick={onBuy}
              tooltip={!canAct ? "Not your turn" : "Buy property"}>
              Buy
            </GameButton>

            <GameButton
              disabled={globalDisabled || state.phase !== "buy_prompt"}
              onClick={onSkip}
              tooltip={!canAct ? "Not your turn" : "Skip buying"}>
              Skip
            </GameButton>

            <GameButton
              disabled={globalDisabled || state.phase !== "end"}
              onClick={onEnd}
              tooltip={!canAct ? "Wait for your turn" : "End your turn"}>
              End Turn
            </GameButton>
          </div>

          <DicePair values={state.dice} rolling={rolling} />
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <GameButton
              disabled={globalDisabled}
              onClick={onJailRoll}
              tooltip={!canAct ? "Wait for your turn" : "Try rolling doubles to get out of jail"}>
              Roll for Doubles
            </GameButton>

            <GameButton
              disabled={globalDisabled}
              onClick={onJailPay}
              tooltip={!canAct ? "Wait for your turn" : "Pay $50 to get out of jail"}>
              Pay $50
            </GameButton>

            <GameButton
              disabled={globalDisabled || !canUseCard}
              onClick={onJailUseCard}
              tooltip={
                !canAct
                  ? "Wait for your turn"
                  : canUseCard
                  ? "Use your Get Out of Jail Free card"
                  : "You don't have any cards"
              }>
              Use Card {canUseCard ? `(${cp.getOutCards})` : ''}
            </GameButton>
          </div>

          <DicePair values={state.dice} rolling={rolling} />
        </div>
      )}
    </div>
  );
}