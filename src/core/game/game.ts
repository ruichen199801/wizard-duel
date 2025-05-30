import { Game, Move } from 'boardgame.io';

import { EffectType } from '../../model/cardEffects';
import { CardId } from '../../model/cards';
import { getDeckForLevel } from '../../model/deck';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { shuffle } from '../../utils/commonUtils';
import { applyEffect } from '../effect/effect';
import { hasEffect, removeEffects } from '../effect/effectUtils';
import {
  applyLevelOverride,
  dealCards,
  executeEndOfTurnEffects,
  executeGlobalEndOfTurnEffects,
  executeStartOfTurnEffects,
  getCardById,
  getCurrentLevel,
  isVictory,
  logPlay,
  onGameEnd,
  removeCardById,
} from './gameUtils';

const setupData = (): WizardDuelState => {
  const level = getCurrentLevel();

  const G: WizardDuelState = {
    players: {
      0: { ...p0 },
      1: { ...p1 },
    },
    deck: shuffle([...getDeckForLevel(level)]),
    level,
    globalEffects: {},
  };

  applyLevelOverride(G);

  dealCards(G.players[0].hand, G.deck);
  dealCards(G.players[1].hand, G.deck);

  return G;
};

const drawCard: Move<WizardDuelState> = ({ G, ctx }, cardId?: CardId) => {
  if (ctx.turn <= 2) return;

  executeStartOfTurnEffects(G, ctx);

  const hand = G.players[ctx.currentPlayer].hand;
  if (hand.length >= 5 || G.deck.length === 0) {
    throw new Error('Invalid move: cannot draw more cards.');
  }

  if (cardId) {
    // Select mode
    const card = getCardById(G.deck, cardId);
    if (!card) throw new Error(`Card with id ${cardId} not found in the deck.`);
    hand.push(card);
    removeCardById(G.deck, cardId);
  } else {
    // Draw mode
    const card = G.deck.pop();
    if (!card) throw new Error('Tried to draw from an empty deck.');
    hand.push(card);
  }

  if (G.deck.length === 0) {
    console.debug('Deck is empty, shuffling...');
    G.deck = shuffle([...getDeckForLevel(G.level)]);
  }
};

const playCard: Move<WizardDuelState> = ({ G, ctx }, index: number) => {
  const hand = G.players[ctx.currentPlayer].hand;
  if (index < 0 || index >= hand.length) {
    throw new Error('Invalid move: card index out of bounds.');
  }

  const card = hand[index];
  if (card.effects) {
    card.effects.forEach((e) => {
      applyEffect(G, ctx, e);
    });
  }

  let freezeTriggered = false;
  if (hasEffect(G, ctx.currentPlayer, EffectType.freeze)) {
    removeEffects(G, ctx.currentPlayer, EffectType.freeze);
    freezeTriggered = true;
  }

  executeEndOfTurnEffects(G, ctx);

  executeGlobalEndOfTurnEffects(G, ctx, card, freezeTriggered);

  removeCardById(hand, card.id);

  logPlay(G, ctx, card);
};

export const WizardDuel: Game<WizardDuelState> = {
  name: 'wizard-duel',

  setup: setupData,

  moves: {
    drawCard,
    playCard,
  },

  turn: {
    minMoves: 2,
    maxMoves: 2,
  },

  endIf: isVictory,

  onEnd: onGameEnd,
};
