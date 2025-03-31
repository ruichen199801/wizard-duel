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
        shouldPlayerMiss: generateAttackOutcomes(maxTurn, 0.2),
      };
      break;
    // Dentro buff+debuff
    case PowerClass.dentro:
      G.globalEffects.drawMode = DrawMode.select;
      G.players[1].hp += 20;
      G.players[1].maxHp += 20;
      break;
    // Hydro debuff
    case PowerClass.hydro:
      G.players[1].atk += 3;
      G.players[1].baseAtk += 3;
      G.players[1].def += 3;
      G.players[1].baseDef += 3;
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

const wishTransformOptions = [Wish2, Wish3, Wish4, Wish5];
const wishCards = [Wish1, ...wishTransformOptions];
const wishRate = 0.2;
const randomCardToWish = (G, ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(wishRate)) return;
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

const fireHandDistribution = [0.4, 0.4, 0.1, 0.09, 0.01];
const applyRandomFireHand = (G, ctx) => {
  if (ctx.currentPlayer === '1') return;
  const newHand = randomPopulateHand(
    [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
    fireHandDistribution,
    4
  );
  G.players[0].hand = newHand;
};

const randomBuffList = [buffAtk(2), buffDef(2), doubleDmg, preventDmg];
const buffRate = 0.3;
const applyRandomBuff = (G, ctx) => {
  if (ctx.currentPlayer === '1' || !getChanceEffect(buffRate)) return;
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
