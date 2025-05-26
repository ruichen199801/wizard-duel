import { Ctx } from 'boardgame.io';
import {
  aura,
  buffAtk,
  buffDef,
  copyEnemyHand,
  counterAttack,
  damage,
  debuffAtk,
  debuffDef,
  doubleDmg,
  freeze,
  heal,
  lifesteal,
  poison,
  preventDmg,
  removeBuff,
  removeDebuff,
  replaceHand,
  resurrect,
  stealBuff,
  swapHp,
} from '../../model/cardEffects';
import { Fireball1, Fireball2, Sandstorm } from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { PowerClass } from '../power/power';
import { applyEffect } from './effect';

describe('applyEffect', () => {
  let G: WizardDuelState;
  let ctx: Ctx;

  beforeEach(() => {
    G = {
      players: {
        // Deep copy nested arrays/objects as we mutate this G instance directly across test cases
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

  describe('damage handler', () => {
    it('applies normal damage, current p0', () => {
      G.players[0].atk = 5;
      G.players[1].def = 1;
      G.players[1].hp = 30;

      applyEffect(G, ctx, damage(3));
      expect(G.players[1].hp).toBe(23); // 3 + 5 - 1 = 7
    });

    it('applies double damage, current p0', () => {
      G.players[0].atk = 5;
      G.players[1].def = 1;
      G.players[1].hp = 30;
      G.players[0].effects.push(doubleDmg);

      applyEffect(G, ctx, damage(6));

      expect(G.players[1].hp).toBe(10); // (6 + 5 - 1) * 2 = 20
      expect(G.players[0].effects).toHaveLength(0);
    });

    it('prevents damage, current p0', () => {
      G.players[1].hp = 30;
      G.players[1].effects.push(preventDmg);

      applyEffect(G, ctx, damage(3));

      expect(G.players[1].hp).toBe(30); // No damage taken
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('resurrects when taking fatal damage, current p0', () => {
      G.players[1].hp = 5;
      G.players[1].effects.push(resurrect(15));

      applyEffect(G, ctx, damage(16));

      expect(G.players[1].hp).toBe(15); // Target resurrects to 15 HP
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('triggers counter attack when damaged, current p0', () => {
      G.players[0].hp = 30;
      G.players[1].hp = 30;
      G.players[1].effects.push(counterAttack(9));

      applyEffect(G, ctx, damage(5));

      expect(G.players[0].hp).toBe(21); // 30 - 9
      expect(G.players[1].hp).toBe(25); // 30 - 5
      expect(G.players[1].effects).toHaveLength(1);
    });

    it('applies Erebo buff in final level, current p0', () => {
      G.players[1].hp = 30;
      G.players[1].maxHp = 30;
      sessionStorage.setItem('power', PowerClass.erebo);

      applyEffect(G, ctx, damage(9));

      expect(G.players[1].hp).toBe(21); // Reduce both hp and maxHp
      expect(G.players[1].maxHp).toBe(21);
    });

    it('does not apply damage when missed in level 4, current p0', () => {
      const mutatedG = { ...G, level: '4' }; // level is read-only field
      G.globalEffects.shouldMiss = [true];
      G.players[1].hp = 30;

      applyEffect(mutatedG, ctx, damage(9));
      expect(G.players[1].hp).toBe(30); // No damage taken
    });
  });

  describe('heal handler', () => {
    it('heals target, current p0', () => {
      G.players[0].hp = 15;
      G.players[0].maxHp = 30;

      applyEffect(G, ctx, heal(10));
      expect(G.players[0].hp).toBe(25);
    });

    it('heals target to maxHp, current p0', () => {
      G.players[0].hp = 25;
      G.players[0].maxHp = 30;

      applyEffect(G, ctx, heal(10));
      expect(G.players[0].hp).toBe(30);
    });

    it('does not heal when target has Poison, current p0', () => {
      G.players[0].hp = 15;
      G.players[0].maxHp = 30;
      G.players[0].effects.push(poison);

      applyEffect(G, ctx, heal(10));
      expect(G.players[0].hp).toBe(15);
    });

    it('does not heal when Cyro is active, current p0', () => {
      G.players[0].hp = 15;
      G.players[0].maxHp = 30;
      sessionStorage.setItem('power', PowerClass.cryo);

      applyEffect(G, ctx, heal(10));
      expect(G.players[0].hp).toBe(15);
    });

    it('does not heal when maxHp < hp, current p0', () => {
      G.players[0].hp = 30;
      G.players[0].maxHp = 15;

      applyEffect(G, ctx, heal(10));
      expect(G.players[0].hp).toBe(30);
    });
  });

  describe('buffAtk handler', () => {
    it('buffs self attack, current p0', () => {
      G.players[0].atk = 0;
      applyEffect(G, ctx, buffAtk(3));
      expect(G.players[0].atk).toBe(3);
    });

    it('buffs self attack, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[1].atk = 0;
      applyEffect(G, ctx, buffAtk(3));
      expect(G.players[1].atk).toBe(3);
    });
  });

  describe('buffDef handler', () => {
    it('buffs self shield, current p0', () => {
      G.players[0].def = 0;
      applyEffect(G, ctx, buffDef(3));
      expect(G.players[0].def).toBe(3);
    });

    it('buffs self shield, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[1].def = 0;
      applyEffect(G, ctx, buffDef(3));
      expect(G.players[1].def).toBe(3);
    });
  });

  describe('debuffAtk handler', () => {
    it('debuffs enemy attack, current p0', () => {
      G.players[1].atk = 5;
      applyEffect(G, ctx, debuffAtk(3));
      expect(G.players[1].atk).toBe(2);
    });

    it('debuffs enemy attack, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[0].atk = 5;
      applyEffect(G, ctx, debuffAtk(3));
      expect(G.players[0].atk).toBe(2);
    });
  });

  describe('debuffDef handler', () => {
    it('debuffs enemy shield, current p0', () => {
      G.players[1].def = 0;
      applyEffect(G, ctx, debuffDef(3));
      expect(G.players[1].def).toBe(-3);
    });

    it('debuffs enemy shield, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[0].def = 0;
      applyEffect(G, ctx, debuffDef(3));
      expect(G.players[0].def).toBe(-3);
    });
  });

  describe('removeDebuff handler', () => {
    it('removes self debuffs, current p0', () => {
      G.players[0].effects = [debuffAtk(3), debuffDef(3)];
      expect(G.players[0].effects).toHaveLength(2);

      applyEffect(G, ctx, removeDebuff);
      expect(G.players[0].effects).toHaveLength(0);
    });

    it('removes self debuffs, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[1].effects = [debuffAtk(3), debuffDef(3)];
      expect(G.players[1].effects).toHaveLength(2);

      applyEffect(G, ctx, removeDebuff);
      expect(G.players[1].effects).toHaveLength(0);
    });
  });

  describe('removeBuff handler', () => {
    it('removes enemy buffs, current p0', () => {
      G.players[1].effects = [buffAtk(3), buffDef(3)];
      expect(G.players[1].effects).toHaveLength(2);

      applyEffect(G, ctx, removeBuff);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('removes enemy buffs, current p1', () => {
      ctx.currentPlayer = '1';
      G.players[0].effects = [buffAtk(3), buffDef(3)];
      expect(G.players[0].effects).toHaveLength(2);

      applyEffect(G, ctx, removeBuff);
      expect(G.players[0].effects).toHaveLength(0);
    });
  });

  describe('replaceHand handler', () => {
    it('replaces hand, current p0', () => {
      G.players[0].hand = [
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
      ];
      G.deck = [
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
      ];
      applyEffect(G, ctx, replaceHand);

      expect(G.players[0].hand).toHaveLength(5);
      expect(G.deck).toHaveLength(1); // 6 - 5
      expect(G.players[0].hand).not.toContainEqual(Fireball1);
      expect(G.players[0].hand).toContainEqual(Fireball2);
    });

    it('replaces hand with empty deck, current p0', () => {
      G.players[0].hand = [
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
      ];
      applyEffect(G, ctx, replaceHand);

      expect(G.players[0].hand).toHaveLength(5);
      expect(G.deck).not.toHaveLength(0);
    });

    it('replaces hand with Sandstorm, current p0', () => {
      G.players[0].hand = [
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
        Sandstorm,
      ];
      G.deck = [
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
      ];
      applyEffect(G, ctx, replaceHand);

      expect(G.players[0].hand).toHaveLength(5);
      expect(G.deck).toHaveLength(2); // 6 - 4
      expect(G.players[0].hand).not.toContainEqual(Fireball1);
      expect(G.players[0].hand).toContainEqual(Fireball2);
      expect(G.players[0].hand).toContainEqual(Sandstorm);
    });
  });

  describe('swapHp handler', () => {
    it('swaps hp, current p0', () => {
      G.players[0].hp = 5;
      G.players[0].maxHp = 45;
      G.players[1].hp = 30;
      G.players[1].maxHp = 50;

      applyEffect(G, ctx, swapHp);

      expect(G.players[0].hp).toBe(30);
      expect(G.players[0].maxHp).toBe(45);
      expect(G.players[1].hp).toBe(5);
      expect(G.players[1].maxHp).toBe(50);
    });
  });

  describe('stealBuff handler', () => {
    it('steals a different buff, current p0', () => {
      G.players[1].effects = [buffAtk(3), buffAtk(3), buffDef(3)];
      applyEffect(G, ctx, stealBuff);

      expect(G.players[0].effects).toHaveLength(1);
      expect(G.players[1].effects).toHaveLength(2);
    });

    it('steals a duplicate unique buff, current p0', () => {
      G.players[0].effects = [preventDmg];
      G.players[1].effects = [preventDmg];
      applyEffect(G, ctx, stealBuff);

      expect(G.players[0].effects).toHaveLength(1);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('steals an identical aura effect, current p0', () => {
      G.players[0].effects = [
        aura(heal(3), '+3 HP per Turn', '+3 HP per Turn'),
      ];
      G.players[1].effects = [
        aura(heal(3), '+3 HP per Turn', '+3 HP per Turn'),
      ];
      applyEffect(G, ctx, stealBuff);

      expect(G.players[0].effects).toHaveLength(1);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('steals a different aura effect, current p0', () => {
      G.players[0].effects = [
        aura(heal(3), '+3 HP per Turn', '+3 HP per Turn'),
      ];
      G.players[1].effects = [
        aura(heal(5), '+5 HP per Turn', '+5 HP per Turn'),
      ];
      applyEffect(G, ctx, stealBuff);

      expect(G.players[0].effects).toHaveLength(2);
      expect(G.players[1].effects).toHaveLength(0);
    });
  });

  describe('copyEnemyHand handler', () => {
    it('copies hand, current p0', () => {
      G.players[0].hand = [
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
        Fireball1,
      ];
      G.players[1].hand = [
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
        Fireball2,
      ];
      applyEffect(G, ctx, copyEnemyHand);

      expect(G.players[0].hand).toHaveLength(5);
      expect(G.players[0].hand).not.toContainEqual(Fireball1);
      expect(G.players[0].hand).toContainEqual(Fireball2);
    });
  });

  describe('lifesteal handler', () => {
    it('applies damage and heal correctly, current p0', () => {
      G.players[0].hp = 15;
      G.players[0].maxHp = 45;
      G.players[0].atk = 2;
      G.players[1].hp = 30;
      G.players[1].def = 0;

      applyEffect(G, ctx, lifesteal(18));

      // Damage = 18 + 2 - 0 = 20
      expect(G.players[0].hp).toBe(35);
      expect(G.players[1].hp).toBe(10);
    });
  });

  describe('general', () => {
    it('does not apply effect when frozen, current p0', () => {
      G.players[1].hp = 30;
      G.players[0].effects.push(freeze);
      applyEffect(G, ctx, damage(9));
      expect(G.players[1].hp).toBe(30);
    });

    it('does not apply duplicate unique effect, current p0', () => {
      G.players[0].effects = [doubleDmg];
      applyEffect(G, ctx, doubleDmg);
      expect(G.players[0].effects).toHaveLength(1);
    });

    it('does not apply duplicate aura effect, current p0', () => {
      const auraEffect = aura(heal(3), '+3 HP per Turn', '+3 HP per Turn');
      G.players[0].effects = [auraEffect];
      applyEffect(G, ctx, auraEffect);
      expect(G.players[0].effects).toHaveLength(1);
    });

    it('applies different aura effect, current p0', () => {
      const auraEffect1 = aura(heal(3), '+3 HP per Turn', '+3 HP per Turn');
      const auraEffect2 = aura(heal(6), '+6 HP per Turn', '+6 HP per Turn');
      G.players[0].effects = [auraEffect1];
      applyEffect(G, ctx, auraEffect2);
      expect(G.players[0].effects).toHaveLength(2);
    });

    it('mutates effect array for enduring effect, current p0', () => {
      applyEffect(G, ctx, freeze);
      expect(G.players[1].effects).toContainEqual(freeze);
    });
  });
});
