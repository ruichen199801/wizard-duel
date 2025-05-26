import { Ctx } from 'boardgame.io';
import { aura, buffAtk, debuffDef, heal } from '../../model/cardEffects';
import { CardId, Fireball1, Fireball2, Weaken, Wish1 } from '../../model/cards';
import { getDeckForLevel } from '../../model/deck';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { FINAL_LEVEL, maxTurn } from '../level/level';
import {
  dealCards,
  executeEndOfTurnEffects,
  executeGlobalEndOfTurnEffects,
  executeStartOfTurnEffects,
  getCardById,
  getCurrentLevel,
  isVictory,
  removeCardById,
  setNextLevel,
  setPrevLevel,
} from './gameUtils';

describe('gameUtils', () => {
  let G: WizardDuelState;
  let ctx: Ctx;

  beforeEach(() => {
    G = {
      players: {
        0: { ...p0, hand: [], effects: [] },
        1: { ...p1, hand: [], effects: [] },
      },
      deck: getDeckForLevel('1'),
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

  describe('dealCards', () => {
    it('fills hand to 5 cards', () => {
      const hand = G.players[0].hand;
      const deckSize = G.deck.length;

      dealCards(hand, G.deck);

      expect(hand).toHaveLength(5);
      expect(G.deck).toHaveLength(deckSize - 5);
    });
  });

  describe('getCardById', () => {
    it('returns the correct card', () => {
      expect(getCardById(G.deck, CardId.Fireball1)).toEqual(Fireball1);
    });
  });

  describe('removeCardById', () => {
    it('removes a card with given id', () => {
      const deck = [Fireball1, Fireball2];
      removeCardById(deck, CardId.Fireball2);
      expect(deck).toContainEqual(Fireball1);
    });
  });

  describe('isVictory', () => {
    it('returns draw if both players dead', () => {
      G.players[0].hp = 0;
      G.players[1].hp = 0;
      expect(isVictory({ G, ctx })).toEqual({ draw: true });
    });

    it('returns draw if turn limit reached', () => {
      ctx.turn = maxTurn + 1;
      expect(isVictory({ G, ctx })).toEqual({ draw: true });
    });

    it('returns winner if one player dead', () => {
      G.players[1].hp = 0;
      expect(isVictory({ G, ctx })).toEqual({ winner: '0' });
    });
  });

  describe('level storage utils', () => {
    it('gets default level if sessionStorage is empty', () => {
      expect(getCurrentLevel()).toBe('1');
    });

    it('sets next level', () => {
      sessionStorage.setItem('level', '1');
      setNextLevel();
      expect(sessionStorage.getItem('level')).toBe('2');
    });

    it('does not increment past final level', () => {
      sessionStorage.setItem('level', FINAL_LEVEL);
      setNextLevel();
      expect(sessionStorage.getItem('level')).toBe(null); // cleared
    });

    it('sets previous level', () => {
      sessionStorage.setItem('level', '3');
      setPrevLevel();
      expect(sessionStorage.getItem('level')).toBe('2');
    });

    it('does nothing if level is 1', () => {
      sessionStorage.setItem('level', '1');
      setPrevLevel();
      expect(sessionStorage.getItem('level')).toBe('1');
    });
  });

  describe('executeStartOfTurnEffects', () => {
    it('replaces "Wish" cards, current p0', () => {
      G.players[0].hand = [Wish1];
      G.players[1].hand = [Wish1];
      executeStartOfTurnEffects(G, ctx);

      // Only transform the current player's Wish card
      expect(G.players[0].hand).not.toContainEqual(Wish1);
      expect(G.players[1].hand).toContainEqual(Wish1);
    });
  });

  describe('executeEndOfTurnEffects', () => {
    it('applies aura on correct target, current p0', () => {
      const auraEffect = aura(heal(3), '+3 HP per Turn', '+3 HP per Turn');
      G.players[0].effects = [auraEffect];
      G.players[1].effects = [auraEffect];
      G.players[0].hp = 10;
      G.players[1].hp = 10;

      executeEndOfTurnEffects(G, ctx);
      expect(G.players[0].hp).toBe(13);
      expect(G.players[1].hp).toBe(10);
    });
  });

  describe('executeGlobalEndOfTurnEffects', () => {
    it('clears all effects on scheduled turn', () => {
      G.globalEffects.shouldClearEffects = [true];
      G.players[0].effects = [buffAtk(3), debuffDef(3)];
      G.players[1].effects = [buffAtk(3), debuffDef(3)];

      executeGlobalEndOfTurnEffects(G, ctx, Fireball1, false);
      expect(G.players[0].effects).toHaveLength(0);
      expect(G.players[1].effects).toHaveLength(0);
    });

    it('does not clear effect on non scheduled turn', () => {
      G.globalEffects.shouldClearEffects = [false];
      G.players[0].effects = [buffAtk(3), debuffDef(3)];
      G.players[1].effects = [buffAtk(3), debuffDef(3)];

      executeGlobalEndOfTurnEffects(G, ctx, Fireball1, false);
      expect(G.players[0].effects).toHaveLength(2);
      expect(G.players[1].effects).toHaveLength(2);
    });

    it('reduces HP if non-damage and not frozen', () => {
      G.globalEffects.loseHpAmount = 5;
      G.players[0].hp = 20;
      executeGlobalEndOfTurnEffects(G, ctx, Weaken, false);
      expect(G.players[0].hp).toBe(15);
    });

    it('does not reduce HP if card is damage', () => {
      G.globalEffects.loseHpAmount = 5;
      G.players[0].hp = 20;
      executeGlobalEndOfTurnEffects(G, ctx, Fireball1, false);
      expect(G.players[0].hp).toBe(20);
    });

    it('does not reduce HP if freeze is triggered', () => {
      G.globalEffects.loseHpAmount = 5;
      G.players[0].hp = 20;
      executeGlobalEndOfTurnEffects(G, ctx, Weaken, true);
      expect(G.players[0].hp).toBe(20);
    });
  });
});
