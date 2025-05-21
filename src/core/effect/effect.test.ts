import { Ctx } from 'boardgame.io';
import {
  damage,
  doubleDmg,
  preventDmg,
  resurrect,
} from '../../model/cardEffects';
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
    it('applies normal damage', () => {
      // attacker = 0, target = 1
      G.players[0].atk = 5;
      G.players[1].def = 1;
      G.players[1].hp = 30;

      applyEffect(G, ctx, damage(3));

      // 3 + 5 - 1 = 7
      expect(G.players[1].hp).toBe(23);
    });

    it('applies double damage when doubleDmg is active', () => {
      // attacker = 0, target = 1
      G.players[0].atk = 5;
      G.players[1].def = 1;
      G.players[1].hp = 30;
      G.players[0].effects.push(doubleDmg);

      applyEffect(G, ctx, damage(6));

      // (6 + 5 - 1) * 2 = 20
      expect(G.players[1].hp).toBe(10);
      expect(G.players[0].effects).toHaveLength(0);
    });

    it('prevents damage if target has preventDmg effect', () => {
      // attacker = 0, target = 1
      G.players[1].hp = 30;
      G.players[1].effects.push(preventDmg);

      applyEffect(G, ctx, damage(3));

      // No damage taken
      expect(G.players[1].hp).toBe(30);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('resurrects when taking fatal damage', () => {
      // attacker = 0, target = 1
      G.players[1].hp = 5;
      G.players[1].effects.push(resurrect(15));

      applyEffect(G, ctx, damage(16));

      // Resurrects to 15 HP
      expect(G.players[1].hp).toBe(15);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('applies Erebo buff in final level', () => {
      // attacker = 0, target = 1
      G.players[1].hp = 30;
      G.players[1].maxHp = 30;
      sessionStorage.setItem('power', PowerClass.erebo);

      applyEffect(G, ctx, damage(9));

      // Reduce both hp and maxHp
      expect(G.players[1].hp).toBe(21);
      expect(G.players[1].maxHp).toBe(21);
    });

    it('does not apply damage when missed in level 4', () => {
      // attacker = 0, target = 1
      const mutatedG = { ...G, level: '4' }; // level is read-only field
      G.globalEffects.shouldMiss = [true];
      G.players[1].hp = 30;

      applyEffect(mutatedG, ctx, damage(9));

      // No damage taken
      expect(G.players[1].hp).toBe(30);
    });

    // TODO: applies Cyro buff in final level

    // TODO: adds freeze effect when freezed in level 3

    // TODO: triggers counter attack when damaged
  });
});
