import { Ctx } from 'boardgame.io';

import { Effect, EffectType } from '../../model/cardEffects';
import {
  Card,
  CardId,
  CardKeyword,
  Wish2,
  Wish3,
  Wish4,
  Wish5,
} from '../../model/cards';
import { PlayerStats } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { applyEffect } from '../effect/effect';
import { getEffects, hasEffect, undoEffect } from '../effect/effectUtils';
import {
  FINAL_LEVEL,
  globalEffectsDefault,
  levelConfigs,
  maxTurn,
} from '../level/level';
import {
  applyEndOfTurnPowerEffects,
  applyPowerOverride,
  applyStartOfTurnPowerEffects,
} from '../power/powerUtils';

/**
 * Deal cards to a player's hand until it contains 5 cards.
 */
export const dealCards = (hand: Card[], deck: Card[]) => {
  hand.push(...deck.splice(0, 5 - hand.length));
};

/**
 * Get one copy of a card from a deck by id.
 */
export const getCardById = (deck: Card[], cardId: CardId): Card => {
  const card = deck.find((card) => card.id === cardId);
  if (!card) {
    throw new Error(`Card with id ${cardId} not found in the deck.`);
  }
  return card;
};

/**
 * Remove one copy of a card from deck or hand array by id.
 */
export const removeCardById = (array: Card[], cardId: CardId) => {
  const index = array.findIndex((card) => card.id === cardId);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

/**
 * Log the details of the current turn and game state in browser.
 */
export const logPlay = (G: WizardDuelState, ctx: Ctx, card: Card) => {
  const p = G.players[ctx.currentPlayer];
  console.log(`Turn ${ctx.turn}: ${p.name} played ${card.name} (${card.text})`);
  Object.keys(G.players).forEach((pid) => {
    const p = G.players[pid];
    console.log(
      `%c${p.name}: HP: ${p.hp}, Attack: ${p.atk}, Shield: ${p.def}`,
      `color: ${pid === '0' ? 'blue' : 'red'}`
    );
  });
};

/**
 * Determine if the game has ended and return the result.
 */
export const isVictory = ({ G, ctx }: { G: WizardDuelState; ctx: Ctx }) => {
  if (
    (G.players[0].hp <= 0 && G.players[1].hp <= 0) ||
    ctx.turn >= maxTurn + 1
  ) {
    return { draw: true };
  } else if (G.players[0].hp <= 0) {
    return { winner: '1' };
  } else if (G.players[1].hp <= 0) {
    return { winner: '0' };
  }
};

/**
 * Handle the end of game logic.
 *  1. Print game result in the console.
 *  2. Progress or reset the level based on the game result.
 */
export const onGameEnd = ({ G, ctx }: { G: WizardDuelState; ctx: Ctx }) => {
  if (!ctx.gameover.winner) {
    console.log('Draw!');
  } else {
    console.log(`${G.players[ctx.gameover.winner].name} wins!`);
  }

  // Enter next level when player wins, otherwise restarts from the last level.
  //  - If current level is the first level of the game, do nothing.
  //  - If current level is the final level of the game, do nothing.
  if (ctx.gameover.winner && ctx.gameover.winner === '0') {
    setNextLevel();
  } else {
    setPrevLevel();
  }
};

/**
 * Get current game level.
 */
export const getCurrentLevel = (): string => {
  try {
    return sessionStorage.getItem('level') || '1';
  } catch (e) {
    console.error('Error parsing sessionStorage data:', e);
    return '1';
  }
};

/**
 * Set game to previous level.
 */
export const setPrevLevel = () => {
  try {
    const currentLevel = getCurrentLevel();
    if (currentLevel === '1') {
      return;
    }
    const prevLevel = parseInt(currentLevel, 10) - 1;
    sessionStorage.setItem('level', prevLevel.toString());
    sessionStorage.removeItem('power');
    sessionStorage.removeItem('difficulty');
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
};

/**
 * Set game to next level.
 */
export const setNextLevel = () => {
  try {
    const currentLevel = getCurrentLevel();
    if (currentLevel === FINAL_LEVEL) {
      sessionStorage.removeItem('level');
      sessionStorage.removeItem('power');
      sessionStorage.removeItem('difficulty');
      return;
    }
    const nextLevel = parseInt(currentLevel, 10) + 1;
    sessionStorage.setItem('level', nextLevel.toString());
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
};

/**
 * Apply overrides to game state G based on the current level.
 */
export const applyLevelOverride = (G: WizardDuelState) => {
  const {
    playerStatsOverride,
    enemyStatsOverride,

    playerHandOverride,
    enemyHandOverride,

    playerEffectsOverride,
    enemyEffectsOverride,

    globalEffectsOverride,
  } = levelConfigs[G.level];

  for (const key in playerStatsOverride) {
    if (Object.prototype.hasOwnProperty.call(playerStatsOverride, key)) {
      const k = key as keyof PlayerStats;
      if (k in G.players[0]) {
        G.players[0][k] = playerStatsOverride[k]!;
      }
    }
  }
  for (const key in enemyStatsOverride) {
    if (Object.prototype.hasOwnProperty.call(enemyStatsOverride, key)) {
      const k = key as keyof PlayerStats;
      if (k in G.players[1]) {
        G.players[1][k] = enemyStatsOverride[k]!;
      }
    }
  }

  if (playerHandOverride) G.players[0].hand.push(...playerHandOverride);
  if (enemyHandOverride) G.players[1].hand.push(...enemyHandOverride);

  if (playerEffectsOverride)
    G.players[0].effects.push(...playerEffectsOverride);
  if (enemyEffectsOverride) G.players[1].effects.push(...enemyEffectsOverride);

  G.globalEffects = { ...globalEffectsDefault, ...globalEffectsOverride };

  applyPowerOverride(G);
};

/**
 * Apply effects at the start of turn if any, such as transforming the current player's hand.
 */
export const executeStartOfTurnEffects = (G: WizardDuelState, ctx: Ctx) => {
  const replaceWishCards = (hand: Card[]) => {
    const replacementOptions = [Wish2, Wish3, Wish4, Wish5];
    return hand.map((card) => {
      if (card.name === 'Wish') {
        const availableOptions = replacementOptions.filter(
          (option) => option.id !== card.id
        );
        return availableOptions[
          Math.floor(Math.random() * availableOptions.length)
        ];
      } else {
        return card;
      }
    });
  };
  // Transform `Wish` to a random effect
  G.players[ctx.currentPlayer].hand = replaceWishCards(
    G.players[ctx.currentPlayer].hand
  );

  applyStartOfTurnPowerEffects(G, ctx);
};

/**
 * Apply active end of turn effects on current player if any.
 * This must be applied after all effects have been executed for a card to avoid duplicates.
 */
export const executeEndOfTurnEffects = (G: WizardDuelState, ctx: Ctx) => {
  if (hasEffect(G, ctx.currentPlayer, EffectType.aura)) {
    const auraEffects = getEffects(G, ctx.currentPlayer, EffectType.aura);
    auraEffects.forEach((aura: Effect) => {
      applyEffect(G, ctx, aura.effect!);
    });
  }
};

/**
 * Apply global effects triggered at end of turn if any.
 */
export const executeGlobalEndOfTurnEffects = (
  G: WizardDuelState,
  ctx: Ctx,
  card: Card,
  freezeTriggered: boolean
) => {
  // Clear all buffs and debuffs on scheduled turns
  if (G.globalEffects.shouldClearEffects?.[ctx.turn - 1]) {
    console.debug(`Clearing all effects at turn ${ctx.turn}.`);
    G.players[0].effects.forEach((e) => {
      undoEffect(G, '0', e);
    });
    G.players[0].effects = [];

    G.players[1].effects.forEach((e) => {
      undoEffect(G, '1', e);
    });
    G.players[1].effects = [];
  }

  // Lose HP when a non-damage card is played this turn
  if (
    G.globalEffects.loseHpAmount &&
    !card.keywords.includes(CardKeyword.damage) &&
    !freezeTriggered
  ) {
    const player = G.players[ctx.currentPlayer];
    player.hp = Math.max(1, player.hp - G.globalEffects.loseHpAmount);
  }

  applyEndOfTurnPowerEffects(G, ctx);
};
