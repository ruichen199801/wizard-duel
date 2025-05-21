import { Ctx } from 'boardgame.io';
import {
  aura,
  buffAtk,
  debuffDef,
  doubleDmg,
  EffectGroupName,
  EffectTarget,
  EffectType,
  freeze,
  heal,
  poison,
  preventDmg,
} from '../../model/cardEffects';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import {
  getChanceEffect,
  getEffects,
  getTarget,
  hasEffect,
  hasSameEffect,
  isUnique,
  removeEffects,
  removeEffectsByGroup,
  selectEffectsByGroup,
  undoEffect,
} from './effectUtils';

describe('effectUtils', () => {
  let G: WizardDuelState;
  let ctx: Ctx;

  beforeEach(() => {
    G = {
      players: {
        0: { ...p0, hand: [], effects: [] },
        1: { ...p1, hand: [], effects: [] },
      },
      deck: [],
      level: '1',
      globalEffects: {},
    };

    ctx = {
      currentPlayer: '0',
      turn: 1,
      gameover: undefined,
      phase: 'default',
      playOrder: ['0', '1'],
      playOrderPos: 0,
      numPlayers: 2,
      activePlayers: {},
    };
  });

  describe('getTarget', () => {
    it('returns self when target is self', () => {
      expect(getTarget('0', EffectTarget.self)).toBe('0');
      expect(getTarget('1', EffectTarget.self)).toBe('1');
    });

    it('returns opponent when target is opponent', () => {
      expect(getTarget('0', EffectTarget.opponent)).toBe('1');
      expect(getTarget('1', EffectTarget.opponent)).toBe('0');
    });
  });

  describe('hasEffect', () => {
    it('returns true if player has effect', () => {
      G.players[0].effects = [buffAtk(3)];
      expect(hasEffect(G, '0', EffectType.buffAtk)).toBe(true);
    });

    it('returns false if player does not have effect', () => {
      expect(hasEffect(G, '1', EffectType.buffAtk)).toBe(false);
    });
  });

  describe('hasSameEffect', () => {
    it('returns true if player has exact same effect', () => {
      const auraEffect = aura(heal(3), '+3 HP per Turn', '+3 HP per Turn');
      G.players[0].effects = [auraEffect];
      expect(hasSameEffect(G, '0', auraEffect)).toBe(true);
    });

    it('returns false if player does not have exact same effect', () => {
      const auraEffect1 = aura(heal(3), '+3 HP per Turn', '+3 HP per Turn');
      const auraEffect2 = aura(heal(6), '+6 HP per Turn', '+6 HP per Turn');
      G.players[0].effects = [auraEffect1];
      expect(hasSameEffect(G, '0', auraEffect2)).toBe(false);
    });
  });

  describe('getEffects', () => {
    it('returns effects of specified type', () => {
      G.players[0].effects = [buffAtk(3)];
      expect(getEffects(G, '0', EffectType.buffAtk)).toContainEqual(buffAtk(3));
    });

    it('returns empty array if none found', () => {
      expect(getEffects(G, '1', EffectType.buffAtk)).toHaveLength(0);
    });
  });

  describe('removeEffects', () => {
    it('removes all effects of given type', () => {
      G.players[0].effects = [buffAtk(3), freeze];
      removeEffects(G, '0', EffectType.freeze);
      expect(G.players[0].effects).toContainEqual(buffAtk(3));
    });
  });

  describe('selectEffectsByGroup', () => {
    it('returns effects in the specified group', () => {
      G.players[0].effects = [buffAtk(3), doubleDmg, freeze];
      expect(selectEffectsByGroup(G, '0', EffectGroupName.buff)).toEqual([
        buffAtk(3),
        doubleDmg,
      ]);
    });
  });

  describe('removeEffectsByGroup', () => {
    it('removes all effects in the specified group', () => {
      G.players[1].effects = [debuffDef(3), poison, preventDmg];
      removeEffectsByGroup(G, '1', EffectGroupName.debuff);
      expect(G.players[1].effects).toContainEqual(preventDmg);
    });
  });

  describe('undoEffect', () => {
    it('reverts buffAtk by reducing atk', () => {
      G.players[0].atk = 5;
      undoEffect(G, '0', buffAtk(3));
      expect(G.players[0].atk).toBe(2); // 5 - 2
    });

    it('reverts debuffDef by increasing def', () => {
      G.players[1].def = -3;
      undoEffect(G, '1', debuffDef(3));
      expect(G.players[1].def).toBe(0); // -3 + 3
    });
  });

  describe('getChanceEffect', () => {
    it('returns true/false based on chance', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.4);
      expect(getChanceEffect(0.5)).toBe(true);
      expect(getChanceEffect(0.3)).toBe(false);
      jest.spyOn(Math, 'random').mockRestore();
    });
  });

  describe('isUnique', () => {
    it('returns true if effect type is unique', () => {
      expect(isUnique(poison)).toBe(true);
    });

    it('returns false if effect type is not unique', () => {
      expect(isUnique(buffAtk(3))).toBe(false);
    });
  });
});
