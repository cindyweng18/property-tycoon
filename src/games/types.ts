export type TileType = 'GO' | 'PROPERTY' | 'TAX' | 'JAIL' | 'GO_TO_JAIL' | 'FREE';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  rent?: number;
  ownerId?: number | null;
  row: number; 
  col: number; 
}

export interface Player {
  id: number;
  name: string;
  position: number;
  cash: number;
  inJailTurns: number;
  bankrupt: boolean;
  color?: string;
  isBot?: boolean;
}

export type Phase = 'idle' | 'buy_prompt' | 'end';

export interface GameState {
  tiles: Tile[];
  players: Player[];
  currentPlayer: number;
  dice: [number, number] | null;
  phase: Phase;
  log: string[];
  boardSize: number;
}

export type Action =
  | { type: 'ROLL' }
  | { type: 'BUY' }
  | { type: 'SKIP_BUY' }
  | { type: 'END_TURN' }
  | { type: 'RESET' };