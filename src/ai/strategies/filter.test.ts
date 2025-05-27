import { Ctx } from 'boardgame.io';
import { FINAL_LEVEL } from '../../core/level/level';
import { aura, doubleDmg, heal } from '../../model/cardEffects';
import {
  Aura,
  Block,
  Dispel,
  Enrage,
  Fireball1,
  Fireball2,
  Heal1,
  Heal2,
  Mutate,
  Purify,
  Wish1,
} from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { filterActions } from './filter';

describe('filterActions', () => {
  let G: WizardDuelState;
  let ctx: Ctx;

  beforeEach(() => {
    G = {
      level: FINAL_LEVEL,
      players: {
        0: { ...p0, hand: [], effects: [] },
        1: { ...p1, hand: [], effects: [] },
      },
      deck: [],
      globalEffects: {},
    };

    ctx = {
      currentPlayer: '1', // Current player is AI
      turn: 2,
      gameover: undefined,
      phase: 'default',
      playOrder: ['0', '1'],
      playOrderPos: 0,
      numPlayers: 2,
      activePlayers: {},
    };
  });

  it('filters out useless cards', () => {
    const cards = [Wish1, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Wish1);
  });

  it('filters out Mutate', () => {
    G.players[0].hp = 30;
    G.players[1].hp = 45;
    const cards = [Mutate, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Mutate);
  });

  it('filters out removeDebuff cards', () => {
    G.players[1].effects = [];
    const cards = [Purify, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Purify);
  });

  it('filters out removeBuff cards', () => {
    G.players[0].effects = [];
    const cards = [Dispel, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Dispel);
  });

  it('filters out healing cards', () => {
    G.players[1].maxHp = 40;
    G.players[1].hp = 40;
    const cards = [Heal1, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Heal1);
  });

  it('filters out unique effect cards', () => {
    G.players[1].effects = [doubleDmg];
    const cards = [Enrage, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Enrage);
  });

  it('filters out identical aura cards', () => {
    G.players[1].effects = [aura(heal(3), '+3 HP per Turn', '+3 HP per Turn')];
    const cards = [Aura, Fireball1, Fireball2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Aura);
  });

  it('filters out damage cards if global miss is active on level 4', () => {
    G = { ...G, level: '4' };
    G.globalEffects.shouldMiss = [false, true];
    G.players[1].maxHp = 40;
    G.players[1].hp = 10; // Make sure healing cards are not filtered out

    const cards = [Fireball1, Heal1, Heal2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Fireball1);
  });

  it('filters out effect cards if global clearEffects is active on level 6', () => {
    G = { ...G, level: '6' };
    G.globalEffects.shouldClearEffects = [false, true];
    G.players[1].maxHp = 40;
    G.players[1].hp = 10; // Make sure healing cards are not filtered out

    const cards = [Block, Heal1, Heal2];
    const result = filterActions(cards, G, ctx);
    expect(result).not.toContainEqual(Block);
  });

  it('returns a single result if only one card remains after filtering', () => {
    const cards = [Fireball1];
    const result = filterActions(cards, G, ctx);
    expect(result).toEqual([Fireball1]);
  });
});
