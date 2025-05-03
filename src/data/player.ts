import { Effect } from './cardEffects';
import { Card } from './cards';

export enum PlayerID {
  human = '0',
  ai = '1',
}

export interface Player {
  name: string;
  id: PlayerID;
  maxHp: number;
  baseAtk: number;
  baseDef: number;
  hp: number;
  atk: number;
  def: number;
  hand: Card[];
  effects: Effect[];
}

export const p0: Player = {
  name: `Player`,
  id: PlayerID.human,
  maxHp: 45,
  baseAtk: 0,
  baseDef: 0,
  hp: 45,
  atk: 0,
  def: 0,
  hand: [],
  effects: [],
};

export const p1: Player = {
  name: `Opponent`,
  id: PlayerID.ai,
  maxHp: 45,
  baseAtk: 0,
  baseDef: 0,
  hp: 45,
  atk: 0,
  def: 0,
  hand: [],
  effects: [],
};
