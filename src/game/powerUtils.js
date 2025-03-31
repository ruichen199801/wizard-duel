import { buffAtk, buffDef, doubleDmg, preventDmg } from '../data/cardEffects';
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
} from '../data/cards';
import { applyEffect } from './effect';
import { hasSameEffect, getChanceEffect } from './effectUtils';
import { finalLevel, maxTurn, DrawMode } from './level';
import { randomPopulateHand, generateAttackOutcomes } from './levelUtils';
import { PowerClass } from './power';
import {
  pyroHandDistribution,
  psammoMissRate,
  psammoWishRate,
  dentroEnemyBuffValue,
  hydroBuffRate,
  hydroPlayerBuffValue,
  hydroEnemyBuffValue,
} from './power';

/**
 * Apply overrides to G based on the selected power class when the game initializes.
 */
const applyPowerOverride = (G) => {
  if (G.level !== finalLevel) return;
  const powerClass = sessionStorage.getItem('power');
  switch (powerClass) {
    // Psammo debuff
    case PowerClass.psammo:
      G.globalEffects = {
        ...G.globalEffects,
        shouldPlayerMiss: generateAttackOutcomes(maxTurn, psammoMissRate),
      };
      break;
    // Dentro buff+debuff
    case PowerClass.dentro:
      G.globalEffects.drawMode = DrawMode.select;
      G.players[1].hp += dentroEnemyBuffValue;
      G.players[1].maxHp += dentroEnemyBuffValue;
      break;
    // Hydro debuff
    case PowerClass.hydro:
      G.players[1].atk += hydroEnemyBuffValue;
      G.players[1].baseAtk += hydroEnemyBuffValue;
      G.players[1].def += hydroEnemyBuffValue;
      G.players[1].baseDef += hydroEnemyBuffValue;
      break;
    // Erebo debuff
    case PowerClass.erebo:
      G.players[0].hp /= 2;
      G.players[0].maxHp /= 2;
      break;
    default:
      return;
  }
};

/**
 * Apply power effects on the target(s) triggered at the start of turn.
 */
const applyStartOfTurnPowerEffects = (G, ctx) => {
  if (G.level !== finalLevel) return;
  const powerClass = sessionStorage.getItem('power');
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
const applyEndOfTurnPowerEffects = (G, ctx) => {
  if (G.level !== finalLevel) return;
  const powerClass = sessionStorage.getItem('power');
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

const randomCardToWish = (G, ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(psammoWishRate)) return;
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

const applyRandomFireHand = (G, ctx) => {
  if (ctx.currentPlayer === '1') return;
  const newHand = randomPopulateHand(
    [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
    pyroHandDistribution,
    4
  );
  G.players[0].hand = newHand;
};

const applyRandomBuff = (G, ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(hydroBuffRate)) return;
  const randomBuffList = [
    buffAtk(hydroPlayerBuffValue),
    buffDef(hydroPlayerBuffValue),
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
  applyPowerOverride,
  applyStartOfTurnPowerEffects,
  applyEndOfTurnPowerEffects,
};
