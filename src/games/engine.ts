import type { Action, GameState, Player, Tile, Phase } from './types';
import { makeTiles } from './tiles';

const startCash = 1500;
const passGoAmount = 100;

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
  const newPos = (old + steps) % size;
  const passedGo = old + steps >= size;
  return { newPos, passedGo };
};

const pay = (p: Player, amount: number): void => { p.cash -= amount; };
const credit = (p: Player, amount: number): void => { p.cash += amount; };
const goToJail = (p: Player): void => { p.position = 4; p.inJailTurns = 1; };
const log = (gs: GameState, msg: string) => { gs.log = [msg, ...gs.log].slice(0, 50); };

export const initialState = (playerNames = ['Alice','Bob']): GameState => ({
  tiles: makeTiles(),
  players: playerNames.map((name, i) => ({
    id: i, name, position: 0, cash: 1500, inJailTurns: 0, bankrupt: false
  })),
  currentPlayer: 0,
  dice: null,
  phase: 'idle' as Phase, 
  log: ['Game started']
});

const resolveLanding = (gs: GameState, p: Player, tile: Tile) => {
  switch (tile.type) {
    case 'GO':
      break;
    case 'PROPERTY':
      if (tile.ownerId == null) {
        gs.phase = 'buy_prompt';
        log(gs, `${p.name} landed on ${tile.name} — available for $${tile.price}`);
      } else if (tile.ownerId !== p.id) {
        const owner = gs.players[tile.ownerId];
        if (!owner.bankrupt) {
          pay(p, tile.rent!);
          credit(owner, tile.rent!);
          log(gs, `${p.name} paid $${tile.rent} rent to ${owner.name} for ${tile.name}`);
        }
      }
      break;
    case 'TAX':
      pay(p, 100);
      log(gs, `${p.name} paid $100 tax`);
      break;
    case 'GO_TO_JAIL':
      goToJail(p);
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

export const reducer = (gs: GameState, action: Action): GameState => {
  gs = {
    ...gs,
    players: gs.players.map(p => ({ ...p })),
    tiles: gs.tiles.map(t => ({ ...t })),
    log: [...gs.log],
    phase: gs.phase as Phase
  };

  const current = gs.players[gs.currentPlayer];


  if (current.bankrupt) {
    gs.currentPlayer = nextAlive(gs, gs.currentPlayer);
    gs.phase = 'idle';
    return gs;
  }

  switch (action.type) {
    case 'ROLL': {
      if (gs.phase !== 'idle') return gs;

      if (current.inJailTurns > 0) {
        current.inJailTurns -= 1;
        log(gs, `${current.name} is in Jail (skip move)`);
        gs.phase = 'end';
        return gs;
      }

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
      if (tile.type === 'PROPERTY' && tile.ownerId == null && current.cash >= (tile.price || 0)) {
        pay(current, tile.price!);
        tile.ownerId = current.id;
        log(gs, `${current.name} bought ${tile.name} for $${tile.price}`);
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
      return initialState(gs.players.map(p => p.name));
  }
  return gs;
};