import { FINAL_LEVEL } from '../../core/level/level';
import {
  buffAtk,
  buffDef,
  debuffAtk,
  debuffDef,
  doubleDmg,
  freeze,
  poison,
} from '../../model/cardEffects';
import {
  Dispel,
  Fireball1,
  Fireball2,
  Heal1,
  Heal2,
  Mutate,
  Purify,
  Revenge,
} from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { random } from './random';
import { resolveAction } from './resolver';

jest.mock('./random');

describe('resolveAction', () => {
  let G: WizardDuelState;

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

    jest.mocked(random).mockImplementation((cards) => cards[0]);
  });

  it('resolves to random card when frozen', () => {
    G.players[1].effects.push(freeze);
    const actions = [Fireball1, Fireball2];
    const result = resolveAction(actions, G);
    expect(random).toHaveBeenCalledWith(actions);
    expect(result).toBe(actions[0]);
  });

  it('resolves to Mutate', () => {
    G.players[0].hp = 60;
    G.players[1].hp = 30;
    const actions = [Fireball1, Fireball2, Mutate];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to removeDebuff card', () => {
    G.players[1].effects = [debuffAtk(3), debuffDef(3)];
    const actions = [Fireball1, Fireball2, Purify];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to removeBuff card', () => {
    G.players[0].effects = [buffAtk(3), buffDef(3)];
    const actions = [Fireball1, Fireball2, Dispel];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to sustain card', () => {
    G.players[1].maxHp = 40;
    G.players[1].hp = 10;
    const actions = [Fireball1, Fireball2, Heal1];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('does not resolve to sustain card when healing invalidated', () => {
    G.players[1].maxHp = 40;
    G.players[1].hp = 10;
    G.players[1].effects.push(poison);
    const actions = [Fireball1, Fireball2, Heal1];
    const result = resolveAction(actions, G);
    expect(result).not.toBe(actions[2]);
  });

  it('resolves to damage card when p1 has doubleDmg', () => {
    G.players[1].effects = [doubleDmg];
    const actions = [Heal1, Heal2, Fireball1];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to damage card when p1 has high atk', () => {
    G.players[1].baseAtk = 0;
    G.players[1].atk = 3;
    const actions = [Heal1, Heal2, Fireball1];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to damage card when p0 has low def', () => {
    G.players[0].baseDef = 0;
    G.players[0].def = -3;
    const actions = [Heal1, Heal2, Fireball1];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to damage card when p0 has low HP', () => {
    G.players[0].maxHp = 40;
    G.players[0].hp = 10;
    const actions = [Heal1, Heal2, Fireball1];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });

  it('resolves to powerful card', () => {
    const actions = [Fireball1, Fireball2, Revenge];
    const result = resolveAction(actions, G);
    expect(result).toBe(actions[2]);
  });
});
