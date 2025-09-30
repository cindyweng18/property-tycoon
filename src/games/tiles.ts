import type { Tile, TileType } from './types';

function borderCoords(size: number): Array<{ row: number; col: number }> {
  const last = size - 1;
  const coords: Array<{ row: number; col: number }> = [];

  for (let c = 0; c < size; c++) coords.push({ row: last, col: c });
  for (let r = last - 1; r >= 0; r--) coords.push({ row: r, col: last });
  for (let c = last - 1; c >= 0; c--) coords.push({ row: 0, col: c });
  for (let r = 1; r <= last - 1; r++) coords.push({ row: r, col: 0 });

  return coords;
}

export function makeSquareBoard(size = 6): Tile[] {
  if (size < 5) size = 5; 
  const ring = borderCoords(size);
  const total = ring.length; 
  const corner_GO           = 0;                         
  const corner_JAIL         = size - 1;                  
  const corner_FREE         = size - 1 + (size - 1);     
  const corner_GO_TO_JAIL   = total - (size - 1);       

  const isCorner = (i: number) =>
    i === corner_GO || i === corner_JAIL || i === corner_FREE || i === corner_GO_TO_JAIL;

  return ring.map((pos, i) => {
    let type: TileType = 'PROPERTY';
    let name = `Property ${i + 1}`;
    const basePrice = 120 + (i % 6) * 30;   
    const baseRent  = Math.floor(basePrice * 0.25);

    if (i === corner_GO)               { type = 'GO';           name = 'GO'; }
    else if (i === corner_JAIL)        { type = 'JAIL';         name = 'Jail'; }
    else if (i === corner_FREE)        { type = 'FREE';         name = 'Free Parking'; }
    else if (i === corner_GO_TO_JAIL)  { type = 'GO_TO_JAIL';   name = 'Go to Jail'; }
    else if (!isCorner(i) && i % 5 === 0) {
      type = 'TAX'; name = 'Tax';
    }

    const tile: Tile = {
      id: i,
      name,
      type,
      ownerId: null,
      row: pos.row,
      col: pos.col,
      ...(type === 'PROPERTY' ? { price: basePrice, rent: baseRent } : {}),
    };

    return tile;
  });
}