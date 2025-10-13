import type { Action, GameState, Player, Tile, Phase } from './types';
import { makeSquareBoard } from './tiles';

const startCash = 1500;
const passGoAmount = 200;
const bailCost = 50;

type InitInput = string[] | Array<Partial<Player> & { name: string }>;

const nextAlive = (gs: GameState, idx: number): number => {
  const n = gs.players.length;
  for (let i = 1; i <= n; i++) {
    const j = (idx + i) % n;
    if (!gs.players[j].bankrupt) return j;
  }
  return idx;
};

const movePlayer = (player: Player, steps: number, tiles: Tile[]): { newPos: number; passedGo: boolean } => {
  const old = player.position;
  const size = tiles.length;
  const raw = old + steps;
  const newPos = raw % size;
  const passedGo = raw >= size;
  return { newPos, passedGo };
};

const pay = (p: Player, amount: number): void => { p.cash -= amount; };
const credit = (p: Player, amount: number): void => { p.cash += amount; };

const sendToJail = (gs: GameState, p: Player): void => {
  const jailIdx = gs.tiles.findIndex(t => t.type === 'JAIL');
  if (jailIdx >= 0) p.position = jailIdx;
  p.inJailTurns = 3;
};

const log = (gs: GameState, msg: string) => {
  gs.log = [msg, ...gs.log].slice(0, 50);
};

export const initialState = (players: InitInput = ['You','Bot']): GameState => {
  const boardSize = 6;
  const tiles = makeSquareBoard(boardSize);

  const normalized: Player[] = (players as Array<Partial<Player> & { name: string }>)
    .map((p, i) => ({
      id: i,
      name: typeof p === 'string' ? (p as unknown as string) : p.name,
      position: 0,
      cash: startCash,
      inJailTurns: 0,
      bankrupt: false,
      color: (p as Player).color ?? undefined,
      isBot: !!(p as Player).isBot,
      getOutCards: (p as Player).getOutCards ?? 0,
    }));

  return {
    tiles,
    players: normalized.length ? normalized : [
      { id: 0, name: 'You',  position: 0, cash: startCash, inJailTurns: 0, bankrupt: false },
      { id: 1, name: 'Bot',  position: 0, cash: startCash, inJailTurns: 0, bankrupt: false, isBot: true },
    ],
    currentPlayer: 0,
    dice: null,
    phase: 'idle',
    log: ['Game started'],
    boardSize,
  };
};

const resolveLanding = (gs: GameState, p: Player, tile: Tile) => {
  switch (tile.type) {
    case 'GO': break;
    case 'PROPERTY': {
      if (tile.ownerId == null) {
        gs.phase = 'buy_prompt';
        log(gs, `${p.name} landed on ${tile.name} — available for $${tile.price}`);
      } else if (tile.ownerId !== p.id) {
        const owner = gs.players[tile.ownerId];
        if (!owner.bankrupt && tile.rent != null) {
          pay(p, tile.rent);
          credit(owner, tile.rent);
          log(gs, `${p.name} paid $${tile.rent} rent to ${owner.name} for ${tile.name}`);
        }
      }
      break;
    }
    case 'TAX':
      pay(p, 100);
      log(gs, `${p.name} paid $100 tax`);
      break;
    case 'GO_TO_JAIL':
      sendToJail(gs, p);
      log(gs, `${p.name} is sent to Jail`);
      break;
    case 'JAIL':
    case 'FREE':
      break;
  }

  if (p.cash < 0) {
    p.bankrupt = true;
    gs.tiles = gs.tiles.map(t => (t.ownerId === p.id ? { ...t, ownerId: null } : t));
    log(gs, `${p.name} is bankrupt!`);
  }
};

export const reducer = (state: GameState, action: Action): GameState => {
  let gs: GameState = {
    ...state,
    players: state.players.map(p => ({ ...p })),
    tiles: state.tiles.map(t => ({ ...t })),
    log: [...state.log],
    phase: state.phase as Phase,
  };

  const current = gs.players[gs.currentPlayer];

  if (current.bankrupt) {
    gs.currentPlayer = nextAlive(gs, gs.currentPlayer);
    gs.phase = 'idle';
    gs.dice = null;
    return gs;
  }

  if (gs.phase === 'idle' && current.inJailTurns > 0) {
    gs.phase = 'jail_choice';
    return gs;
  }

  switch (action.type) {
    case 'JAIL_PAY': {
      if (gs.phase !== 'jail_choice') return gs;
      if (current.cash >= bailCost) {
        pay(current, bailCost);
        current.inJailTurns = 0;
        log(gs, `${current.name} paid $${bailCost} and left Jail`);
        gs.phase = 'idle';
      } else {
        log(gs, `${current.name} cannot afford bail ($${bailCost})`);
        gs.phase = 'end';
      }
      return gs;
    }

    case 'JAIL_USE_CARD': {
      if (gs.phase !== 'jail_choice') return gs;
      if ((current.getOutCards ?? 0) > 0) {
        current.getOutCards = (current.getOutCards ?? 1) - 1;
        current.inJailTurns = 0;
        log(gs, `${current.name} used a Get Out of Jail Free card`);
        gs.phase = 'idle';
      } else {
        log(gs, `${current.name} has no Get Out of Jail Free card`);
        gs.phase = 'jail_choice';
      }
      return gs;
    }

    case 'JAIL_ROLL': {
      if (gs.phase !== 'jail_choice') return gs;

      const d1 = 1 + Math.floor(Math.random() * 6);
      const d2 = 1 + Math.floor(Math.random() * 6);
      gs.dice = [d1, d2];
      const isDouble = d1 === d2;

      if (isDouble) {
        current.inJailTurns = 0;
        log(gs, `${current.name} rolled doubles (${d1}+${d2}) and left Jail`);
        const steps = d1 + d2;
        const { newPos, passedGo } = movePlayer(current, steps, gs.tiles);
        if (passedGo) {
          credit(current, passGoAmount);
          log(gs, `${current.name} passed GO +$${passGoAmount}`);
        }
        current.position = newPos;
        const tile = gs.tiles[newPos];
        resolveLanding(gs, current, tile);
        if (gs.phase === ('buy_prompt' as Phase)) return gs;
        gs.phase = 'end';
        return gs;
      }

      current.inJailTurns = Math.max(0, current.inJailTurns - 1);
      if (current.inJailTurns === 0) {
        pay(current, bailCost);
        log(gs, `${current.name} failed 3rd attempt, paid $${bailCost} and left Jail`);
        const steps = d1 + d2;
        const { newPos, passedGo } = movePlayer(current, steps, gs.tiles);
        if (passedGo) {
          credit(current, passGoAmount);
          log(gs, `${current.name} passed GO +$${passGoAmount}`);
        }
        current.position = newPos;
        const tile = gs.tiles[newPos];
        resolveLanding(gs, current, tile);
        if (gs.phase === ('buy_prompt' as Phase)) return gs;
        gs.phase = 'end';
      } else {
        log(gs, `${current.name} did not roll doubles (${d1}+${d2}), ${current.inJailTurns} attempt(s) left`);
        gs.phase = 'end';
      }
      return gs;
    }

    case 'ROLL': {
      if (gs.phase !== 'idle') return gs;

      const d1 = 1 + Math.floor(Math.random() * 6);
      const d2 = 1 + Math.floor(Math.random() * 6);
      gs.dice = [d1, d2];

      const { newPos, passedGo } = movePlayer(current, d1 + d2, gs.tiles);
      if (passedGo) {
        credit(current, passGoAmount);
        log(gs, `${current.name} passed GO +$${passGoAmount}`);
      }
      current.position = newPos;

      const tile = gs.tiles[newPos];
      resolveLanding(gs, current, tile);

      if (gs.phase === ('buy_prompt' as Phase)) return gs;
      gs.phase = 'end';
      return gs;
    }

    case 'BUY': {
      if (gs.phase !== 'buy_prompt') return gs;
      const tile = gs.tiles[current.position];
      if (tile.type === 'PROPERTY' && tile.ownerId == null && tile.price != null && current.cash >= tile.price) {
        pay(current, tile.price);
        tile.ownerId = current.id;
        log(gs, `${current.name} bought ${tile.name} for $${tile.price}`);
      } else {
        log(gs, `${current.name} could not buy ${tile.name}`);
      }
      gs.phase = 'end';
      return gs;
    }

    case 'SKIP_BUY': {
      if (gs.phase !== 'buy_prompt') return gs;
      log(gs, `${current.name} skipped buying`);
      gs.phase = 'end';
      return gs;
    }

    case 'END_TURN': {
      gs.currentPlayer = nextAlive(gs, gs.currentPlayer);
      gs.phase = 'idle';
      gs.dice = null;
      return gs;
    }

    case 'RESET':
      return initialState(gs.players.map(p => ({ name: p.name, color: p.color, isBot: p.isBot })));

    default:
      return gs;
  }
};