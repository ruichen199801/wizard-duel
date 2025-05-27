import { PlayerID } from 'boardgame.io';
import { Effect } from './cardEffects';
import { Card } from './cards';

// Optional for level override, but required as part of the Player interface
export interface PlayerStats {
  maxHp?: number;
  baseAtk?: number;
  baseDef?: number;
  hp?: number;
  atk?: number;
  def?: number;
}

export interface Player extends Required<PlayerStats> {
  readonly name: string;
  readonly id: PlayerID; // '0': human, '1': ai
  hand: Card[];
  effects: Effect[];
}

export const p0: Player = {
  name: `Player`,
  id: '0',
  maxHp: 30,
  baseAtk: 0,
  baseDef: 0,
  hp: 30,
  atk: 0,
  def: 0,
  hand: [],
  effects: [],
};

export const p1: Player = {
  name: `Opponent`,
  id: '1',
  maxHp: 30,
  baseAtk: 0,
  baseDef: 0,
  hp: 30,
  atk: 0,
  def: 0,
  hand: [],
  effects: [],
};
