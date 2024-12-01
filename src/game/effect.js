import {
  getTarget,
  hasEffect,
  hasSameEffect,
  getEffects,
  removeEffects,
  selectEffectsByGroup,
  removeEffectsByGroup,
  undoEffect,
  getChanceEffect,
} from './effectUtils';
import {
  EffectType,
  EffectDuration,
  EffectGroupName,
  EffectGroup,
  freeze as freezeEffect,
} from '../data/cardEffects';
import { getDeckForLevel } from '../data/deck';
import { shuffle } from './gameUtils';

const damage = (G, target, { value = 0 }, ctx) => {
  const player = target === '0' ? '1' : '0';

  // Calculate base damage: card damage + player's attack - target's defense.
  value = value + G.players[player].atk - G.players[target].def;

  // Make sure damage value is non-negative.
  value = Math.max(value, 0);

  // Check if the attacking player has double damage effect.
  if (hasEffect(G, player, EffectType.doubleDmg)) {
    value *= 2;
  }
  removeEffects(G, player, EffectType.doubleDmg);

  // Apply level-specific side effects related to damage calculation.
  value = applyDamageLevelEffects(G, target, value, ctx);
  if (value === -1) {
    return; // Exit early so that prevent damage effect is not exhausted
  }

  // Check if the target has prevent damage effect.
  if (hasEffect(G, target, EffectType.preventDmg)) {
    value = 0;
  }
  removeEffects(G, target, EffectType.preventDmg);

  // Check if the target has resurrect effect.
  if (
    G.players[target].hp <= value &&
    hasEffect(G, target, EffectType.resurrect)
  ) {
    G.players[target].hp = 15;
    removeEffects(G, target, EffectType.resurrect);
    return;
  }

  // Apply the final damage to the target's HP.
  G.players[target].hp -= value;
};

const heal = (G, target, { value = 0 }) => {
  G.players[target].hp += value;

  G.players[target].hp = Math.min(
    G.players[target].hp,
    G.players[target].maxHp
  );
};

const buffAtk = (G, target, { value = 0 }) => {
  G.players[target].atk += value;
};

const buffDef = (G, target, { value = 0 }) => {
  G.players[target].def += value;
};

const debuffAtk = (G, target, { value = 0 }) => {
  G.players[target].atk -= value;
};

const debuffDef = (G, target, { value = 0 }) => {
  G.players[target].def -= value;
};

const removeDebuff = (G, target) => {
  const debuffs = selectEffectsByGroup(G, target, EffectGroupName.debuff);

  if (!debuffs || debuffs.length === 0) return;

  debuffs.forEach((e) => {
    undoEffect(G, target, e);
  });

  removeEffectsByGroup(G, target, EffectGroupName.debuff);
};

const removeBuff = (G, target) => {
  const buffs = selectEffectsByGroup(G, target, EffectGroupName.buff);

  if (!buffs || buffs.length === 0) return;

  buffs.forEach((e) => {
    undoEffect(G, target, e);
  });

  removeEffectsByGroup(G, target, EffectGroupName.buff);
};

const doubleDmg = () => {};

const preventDmg = () => {};

const resurrect = () => {};

const freeze = () => {};

const aura = () => {};

const replaceHand = (G, target) => {
  const hand = G.players[target].hand;
  let skippedCurrent = false; // Skip the current `Sandstorm` card (once)

  for (let i = 0; i < hand.length; i++) {
    if (hand[i].id === '24') {
      if (!skippedCurrent) {
        skippedCurrent = true;
        continue;
      }
    }
    if (G.deck.length === 0) {
      console.log('Deck is empty, shuffling...');
      G.deck = shuffle([...getDeckForLevel(G.level)]);
    }

    hand[i] = G.deck.pop();
  }
};

const effectHandlers = {
  [EffectType.damage]: damage,
  [EffectType.heal]: heal,
  [EffectType.buffAtk]: buffAtk,
  [EffectType.buffDef]: buffDef,
  [EffectType.debuffAtk]: debuffAtk,
  [EffectType.debuffDef]: debuffDef,
  [EffectType.removeDebuff]: removeDebuff,
  [EffectType.removeBuff]: removeBuff,
  [EffectType.doubleDmg]: doubleDmg,
  [EffectType.preventDmg]: preventDmg,
  [EffectType.resurrect]: resurrect,
  [EffectType.freeze]: freeze,
  [EffectType.aura]: aura,
  [EffectType.replaceHand]: replaceHand,
};

export const applyEffect = (G, ctx, effect, shouldProcessEoT = true) => {
  const handler = effectHandlers[effect.type];

  if (!handler) {
    console.error(`Invalid effect type: ${effect.type}`);
    return;
  }

  const target = getTarget(ctx.currentPlayer, effect.target);

  // If you are frozen, the card you play this turn has no effect.
  if (hasEffect(G, ctx.currentPlayer, EffectType.freeze)) {
    removeEffects(G, ctx.currentPlayer, EffectType.freeze);
    executeEndOfTurnEffects(G, ctx, shouldProcessEoT);
    return;
  }

  // If you already have an active non-stackable effect, playing the same card will have no effect.
  if (
    EffectGroup.unique.some((e) => e === effect.type) &&
    hasEffect(G, target, effect.type)
  ) {
    executeEndOfTurnEffects(G, ctx, shouldProcessEoT);
    return;
  }

  // If an active aura effect with an exact match is found, playing the same card will have no effect.
  // It is not put under `unique` group because multiple different `aura` type effects can co-exist.
  if (
    effect.type === EffectType.aura &&
    hasSameEffect(G, ctx.currentPlayer, effect)
  ) {
    executeEndOfTurnEffects(G, ctx, shouldProcessEoT);
    return;
  }

  handler(G, target, effect, ctx);

  if (effect.duration === EffectDuration.enduring) {
    G.players[target].effects.push(effect);
  }

  executeEndOfTurnEffects(G, ctx, shouldProcessEoT);
};

const executeEndOfTurnEffects = (G, ctx, shouldProcessEoT) => {
  if (shouldProcessEoT && hasEffect(G, ctx.currentPlayer, EffectType.aura)) {
    const auraEffects = getEffects(G, ctx.currentPlayer, EffectType.aura);

    auraEffects.forEach((auraEffect) => {
      auraEffect.effectsToExecute.forEach((e) => {
        applyEffect(G, ctx, e, false); // Skip the aura check to avoid recursive hell
      });
    });
  }
  // Add more end of turn effect types here
};

const applyDamageLevelEffects = (G, target, damage, ctx) => {
  switch (G.level) {
    case '3':
      if (getChanceEffect(0.2)) {
        G.players[target].effects.push(freezeEffect);
      }
      return damage;

    case '4':
      const shouldMissObj = G.globalEffects.find((e) => e.shouldMiss);
      if (shouldMissObj?.shouldMiss[ctx.turn - 1]) {
        return -1;
      } else {
        return damage;
      }

    default:
      return damage;
  }
};
