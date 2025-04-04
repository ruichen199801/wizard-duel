import {
  getTarget,
  getEffects,
  hasEffect,
  hasSameEffect,
  removeEffects,
  selectEffectsByGroup,
  removeEffectsByGroup,
  undoEffect,
  getChanceEffect,
  isUnique,
} from './effectUtils';
import {
  EffectType,
  EffectDuration,
  EffectGroupName,
  freeze as freezeEffect,
} from '../data/cardEffects';
import { getDeckForLevel } from '../data/deck';
import { shuffle } from './gameUtils';
import { levelFreezeRate } from './level';
import { PowerClass, getPowerConfigs } from './power';

const damage = (G, target, { value = 0 }, ctx) => {
  const player = target === '0' ? '1' : '0';

  // Trigger counter attack.
  if (hasEffect(G, target, EffectType.counterAttack)) {
    G.players[player].hp = Math.max(
      1,
      G.players[player].hp -
        getEffects(G, target, EffectType.counterAttack)[0].value
    );
  }

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
    return 0; // Exit early so that prevent damage effect is not exhausted
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
    G.players[target].hp = getEffects(G, target, EffectType.resurrect)[0].value;
    removeEffects(G, target, EffectType.resurrect);
    return 0;
  }

  // Apply the final damage to the target's HP.
  G.players[target].hp -= value;

  if (target === '1' && sessionStorage.getItem('power') === PowerClass.erebo) {
    G.players[target].maxHp -= value; // Erebo buff
  }

  return value;
};

const heal = (G, target, { value = 0 }) => {
  if (
    hasEffect(G, target, EffectType.poison) ||
    (target === '0' && sessionStorage.getItem('power') === PowerClass.cryo) // Cryo debuff
  ) {
    return;
  }
  // Caused by playing Mutate in final level
  if (G.players[target].maxHp < G.players[target].hp) {
    return;
  }
  G.players[target].hp = Math.min(
    G.players[target].hp + value,
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

  // Handle the edge case where deck becomes empty after playing `Sandstorm`
  if (G.deck.length === 0) {
    console.log('Deck is empty, shuffling...');
    G.deck = shuffle([...getDeckForLevel(G.level)]);
  }
};

const swapHp = (G, target) => {
  const opponent = target === '0' ? '1' : '0';
  const temp = G.players[target].hp;
  G.players[target].hp = G.players[opponent].hp;
  G.players[opponent].hp = temp;
};

const stealBuff = (G, target, effect, ctx) => {
  const opponentBuffs = selectEffectsByGroup(G, target, EffectGroupName.buff);
  if (opponentBuffs.length === 0) {
    return;
  }
  const chosenBuff =
    opponentBuffs[Math.floor(Math.random() * opponentBuffs.length)];

  // Remove the chosen buff from the opponent.
  const opponentEffects = G.players[target].effects;
  const index = opponentEffects.findIndex(
    (effect) => JSON.stringify(effect) === JSON.stringify(chosenBuff)
  );
  if (index !== -1) {
    undoEffect(G, target, opponentEffects[index]);
    opponentEffects.splice(index, 1);
  }

  // Apply the chosen buff to the player if not already present.
  const player = target === '0' ? '1' : '0';
  const playerEffects = G.players[player].effects;
  const alreadyExists = playerEffects.some(
    (effect) => JSON.stringify(effect) === JSON.stringify(chosenBuff)
  );
  if (!alreadyExists) {
    effectHandlers[chosenBuff.type](G, player, { ...chosenBuff }, ctx);
    playerEffects.push({ ...chosenBuff });
  }
};

const showEnemyHand = (G, target, effect, ctx) => {
  if (ctx.currentPlayer === '0') {
    G.globalEffects.showEnemyHand = true;
  }
};

const lifesteal = (G, target, effect, ctx) => {
  const player = target === '0' ? '1' : '0';
  const value = damage(G, target, effect, ctx);
  if (value > 0) {
    heal(G, player, { value });
  }
};

const counterAttack = () => {};

const poison = () => {};

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
  [EffectType.swapHp]: swapHp,
  [EffectType.stealBuff]: stealBuff,
  [EffectType.showEnemyHand]: showEnemyHand,
  [EffectType.lifesteal]: lifesteal,
  [EffectType.counterAttack]: counterAttack,
  [EffectType.poison]: poison,
};

export const applyEffect = (G, ctx, effect) => {
  const handler = effectHandlers[effect.type];

  if (!handler) {
    console.error(`Invalid effect type: ${effect.type}`);
    return;
  }

  const target = getTarget(ctx.currentPlayer, effect.target);

  // If you are frozen, the card you play this turn has no effect.
  if (hasEffect(G, ctx.currentPlayer, EffectType.freeze)) {
    return;
  }
  // If you already have a non-stackable effect, playing the same card will have no effect.
  if (isUnique(effect) && hasEffect(G, target, effect.type)) {
    return;
  }
  // If you already have an existing aura effect of the exact same kind, playing the same card will have no effect.
  if (
    effect.type === EffectType.aura &&
    hasSameEffect(G, ctx.currentPlayer, effect)
  ) {
    return;
  }

  handler(G, target, effect, ctx);

  if (effect.duration === EffectDuration.enduring) {
    G.players[target].effects.push(effect);
  }
};

const applyDamageLevelEffects = (G, target, damage, ctx) => {
  switch (G.level) {
    case '3':
      if (getChanceEffect(levelFreezeRate)) {
        G.players[target].effects.push(freezeEffect);
      }
      return damage;

    case '4':
      return G.globalEffects.shouldMiss?.[ctx.turn - 1] ? -1 : damage;

    case '8':
      if (
        target === '1' &&
        sessionStorage.getItem('power') === PowerClass.cryo
      ) {
        if (getChanceEffect(getPowerConfigs().cryoFreezeRate)) {
          G.players[target].effects.push(freezeEffect); // Cryo buff
        }
      }
      return G.globalEffects.shouldPlayerMiss?.[ctx.turn - 1] ? -1 : damage;

    default:
      return damage;
  }
};
