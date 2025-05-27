import { Ctx } from 'boardgame.io';
import { Wish1 } from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { DrawMode, WizardDuelState } from '../../model/shared';
import { FINAL_LEVEL } from '../level/level';
import { PowerClass } from './power';
import { applyEndOfTurnPowerEffects, applyPowerOverride } from './powerUtils';

describe('powerUtils', () => {
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

  describe('applyPowerOverride', () => {
    it('applies Psammo global miss override', () => {
      sessionStorage.setItem('power', PowerClass.psammo);
      applyPowerOverride(G);
      expect(G.globalEffects.shouldPlayerMiss).toBeDefined();
    });

    it('applies Dentro draw override', () => {
      sessionStorage.setItem('power', PowerClass.dentro);
      applyPowerOverride(G);
      expect(G.globalEffects.drawMode).toBe(DrawMode.select);
    });
  });

  describe('applyEndOfTurnPowerEffects', () => {
    it('replaces p0 hand with fire cards', () => {
      sessionStorage.setItem('power', PowerClass.pyro);
      G.players[0].hand = [Wish1, Wish1, Wish1, Wish1];
      applyEndOfTurnPowerEffects(G, ctx);

      expect(G.players[0].hand.length).toBe(4);
      expect(G.players[0].hand).not.toContainEqual(Wish1);
    });
  });
});
