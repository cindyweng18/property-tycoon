import type { Tile } from "./types";

export const makeTiles = (): Tile[] => ([
  { id: 0,  name: 'GO',            type: 'GO' },
  { id: 1,  name: 'Maple Ave',     type: 'PROPERTY', price: 60,  rent: 6,  ownerId: null },
  { id: 2,  name: 'Income Tax',    type: 'TAX' },
  { id: 3,  name: 'Oak Street',    type: 'PROPERTY', price: 60,  rent: 6,  ownerId: null },
  { id: 4,  name: 'Jail / Just',   type: 'JAIL' },
  { id: 5,  name: 'Pine Road',     type: 'PROPERTY', price: 100, rent: 10, ownerId: null },
  { id: 6,  name: 'Free Parking',  type: 'FREE' },
  { id: 7,  name: 'Birch Blvd',    type: 'PROPERTY', price: 100, rent: 10, ownerId: null },
  { id: 8,  name: 'Go To Jail',    type: 'GO_TO_JAIL' },
  { id: 9,  name: 'Elm Street',    type: 'PROPERTY', price: 140, rent: 14, ownerId: null },
  { id: 10, name: 'Luxury Tax',    type: 'TAX' },
  { id: 11, name: 'Cedar Court',   type: 'PROPERTY', price: 140, rent: 14, ownerId: null },
]);