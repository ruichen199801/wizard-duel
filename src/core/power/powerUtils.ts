import { Ctx } from 'boardgame.io';

import { applyEffect } from '@core/effect/effect';
import { getChanceEffect, hasSameEffect } from '@core/effect/effectUtils';
import { WizardDuelState } from '@core/game/game';
import { DrawMode, FINAL_LEVEL, maxTurn } from '@core/level/level';
import {
  generateAttackOutcomes,
  randomPopulateHand,
} from '@core/level/levelUtils';
import {
  buffAtk,
  buffDef,
  doubleDmg,
  preventDmg,
} from '@core/models/cardEffects';
import {
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Resurrect,
  Wish1,
  Wish2,
  Wish3,
  Wish4,
  Wish5,
} from '@core/models/cards';
import { CacheKey } from '@utils';
import { getPowerConfigs, PowerClass, PYRO_HAND_DISTRIBUTION } from './power';

const powerConfig: Record<string, number> = getPowerConfigs();

/**
 * Apply overrides to G based on the selected power class when the game initializes.
 */
const applyPowerOverride = (G: WizardDuelState) => {
  if (G.level !== FINAL_LEVEL) return;
  const powerClass = sessionStorage.getItem(CacheKey.power);
  switch (powerClass) {
    // Psammo debuff
    case PowerClass.psammo:
      G.globalEffects = {
        ...G.globalEffects,
        shouldPlayerMiss: generateAttackOutcomes(
          maxTurn,
          powerConfig.psammoMissRate
        ),
      };
      break;

    // Dentro buff+debuff
    case PowerClass.dentro:
      G.globalEffects.drawMode = DrawMode.select;
      G.players[1].hp += powerConfig.dentroEnemyHpBuffPoint;
      G.players[1].maxHp += powerConfig.dentroEnemyHpBuffPoint;
      break;

    // Hydro debuff
    case PowerClass.hydro:
      G.players[1].atk += powerConfig.hydroEnemyStatBuffPoint;
      G.players[1].baseAtk += powerConfig.hydroEnemyStatBuffPoint;
      G.players[1].def += powerConfig.hydroEnemyStatBuffPoint;
      G.players[1].baseDef += powerConfig.hydroEnemyStatBuffPoint;
      break;

    // Erebo debuff
    case PowerClass.erebo:
      G.players[0].hp = powerConfig.ereboPlayerInitialHp;
      G.players[0].maxHp = powerConfig.ereboPlayerInitialHp;
      break;

    default:
      return;
  }
};

/**
 * Apply power effects on the target(s) triggered at the start of turn.
 */
const applyStartOfTurnPowerEffects = (G: WizardDuelState, ctx: Ctx) => {
  if (G.level !== FINAL_LEVEL) return;
  const powerClass = sessionStorage.getItem(CacheKey.power);
  switch (powerClass) {
    // Psammo buff
    case PowerClass.psammo:
      randomCardToWish(G, ctx);
      break;
    default:
      return;
  }
};

/**
 * Apply power effects on the target(s) triggered at the end of turn.
 */
const applyEndOfTurnPowerEffects = (G: WizardDuelState, ctx: Ctx) => {
  if (G.level !== FINAL_LEVEL) return;
  const powerClass = sessionStorage.getItem(CacheKey.power);
  switch (powerClass) {
    // Pyro buff
    case PowerClass.pyro:
      applyRandomFireHand(G, ctx);
      break;
    // Hydro buff
    case PowerClass.hydro:
      applyRandomBuff(G, ctx);
      break;
    default:
      return;
  }
};

const randomCardToWish = (G: WizardDuelState, ctx: Ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(powerConfig.psammoWishRate))
    return;
  const wishTransformOptions = [Wish2, Wish3, Wish4, Wish5];
  const wishCards = [Wish1, ...wishTransformOptions];
  const playerHand = G.players[0].hand;
  const nonWishCards = playerHand.filter((card) => !wishCards.includes(card));
  if (nonWishCards.length) {
    playerHand[
      playerHand.indexOf(
        nonWishCards[Math.floor(Math.random() * nonWishCards.length)]
      )
    ] =
      wishTransformOptions[
        Math.floor(Math.random() * wishTransformOptions.length)
      ];
  }
};

const applyRandomFireHand = (G: WizardDuelState, ctx: Ctx) => {
  if (ctx.currentPlayer === '1') return;
  const newHand = randomPopulateHand(
    [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
    PYRO_HAND_DISTRIBUTION,
    4
  );
  G.players[0].hand = newHand;
};

const applyRandomBuff = (G: WizardDuelState, ctx: Ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(powerConfig.hydroBuffRate))
    return;
  const randomBuffList = [
    buffAtk(powerConfig.hydroPlayerStatBuffPoint),
    buffDef(powerConfig.hydroPlayerStatBuffPoint),
    doubleDmg,
    preventDmg,
  ];
  const availableBuffs = randomBuffList.filter(
    (buff) => !hasSameEffect(G, '0', buff)
  );
  if (availableBuffs.length > 0) {
    applyEffect(
      G,
      ctx,
      availableBuffs[Math.floor(Math.random() * availableBuffs.length)]
    );
  }
};

export {
  applyEndOfTurnPowerEffects,
  applyPowerOverride,
  applyStartOfTurnPowerEffects,
};
