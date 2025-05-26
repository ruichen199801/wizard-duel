import { Ctx, PlayerID } from 'boardgame.io';

import {
  Effect,
  EffectDuration,
  EffectGroupName,
  EffectType,
  freeze as freezeEffect,
} from '../../model/cardEffects';
import { CardId } from '../../model/cards';
import { getDeckForLevel } from '../../model/deck';
import { WizardDuelState } from '../../model/shared';
import { shuffle } from '../../utils/commonUtils';
import { levelRules } from '../level/level';
import { PowerClass, getPowerConfigs } from '../power/power';
import {
  getChanceEffect,
  getEffects,
  getTarget,
  hasEffect,
  hasSameEffect,
  isUnique,
  removeEffects,
  removeEffectsByGroup,
  selectEffectsByGroup,
  undoEffect,
} from './effectUtils';

interface EffectHandlerParams {
  readonly G: WizardDuelState;
  readonly ctx: Ctx;
  readonly target: PlayerID;
  readonly effect: Effect;
}

type EffectHandler = (params: EffectHandlerParams) => void | number;

// --- Effect Handlers ---

const damage: EffectHandler = ({ G, ctx, target, effect }) => {
  let { value = 0 } = effect;
  const player = target === '0' ? '1' : '0';

  // Trigger counter attack.
  if (hasEffect(G, target, EffectType.counterAttack)) {
    const e = getEffects(G, target, EffectType.counterAttack);
    if (e && e.length === 1) {
      const ctrAtkValue = e[0].value!;
      G.players[player].hp = Math.max(1, G.players[player].hp - ctrAtkValue);
    }
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
  value = applyDamageLevelEffects(G, ctx, target, value);
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
    G.players[target].hp = getEffects(
      G,
      target,
      EffectType.resurrect
    )[0].value!;
    removeEffects(G, target, EffectType.resurrect);
    return value;
  }

  // Apply the final damage to the target's HP.
  G.players[target].hp -= value;

  if (target === '1' && sessionStorage.getItem('power') === PowerClass.erebo) {
    G.players[target].maxHp -= value; // Erebo buff
  }

  return value;
};

const heal: EffectHandler = ({ G, target, effect }) => {
  const { value = 0 } = effect;
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

const buffAtk: EffectHandler = ({ G, target, effect }) => {
  const { value = 0 } = effect;
  G.players[target].atk += value;
};

const buffDef: EffectHandler = ({ G, target, effect }) => {
  const { value = 0 } = effect;
  G.players[target].def += value;
};

const debuffAtk: EffectHandler = ({ G, target, effect }) => {
  const { value = 0 } = effect;
  G.players[target].atk -= value;
};

const debuffDef: EffectHandler = ({ G, target, effect }) => {
  const { value = 0 } = effect;
  G.players[target].def -= value;
};

const removeDebuff: EffectHandler = ({ G, target }) => {
  const debuffs = selectEffectsByGroup(G, target, EffectGroupName.debuff);

  if (!debuffs || debuffs.length === 0) return;

  debuffs.forEach((e: Effect) => {
    undoEffect(G, target, e);
  });

  removeEffectsByGroup(G, target, EffectGroupName.debuff);
};

const removeBuff: EffectHandler = ({ G, target }) => {
  const buffs = selectEffectsByGroup(G, target, EffectGroupName.buff);

  if (!buffs || buffs.length === 0) return;

  buffs.forEach((e: Effect) => {
    undoEffect(G, target, e);
  });

  removeEffectsByGroup(G, target, EffectGroupName.buff);
};

const doubleDmg: EffectHandler = () => {};

const preventDmg: EffectHandler = () => {};

const resurrect: EffectHandler = () => {};

const freeze: EffectHandler = () => {};

const aura: EffectHandler = () => {};

const replaceHand: EffectHandler = ({ G, target }) => {
  const hand = G.players[target].hand;
  let hasSkippedFirstSandstorm = false;

  for (let i = 0; i < hand.length; i++) {
    if (hand[i].id === CardId.Sandstorm) {
      if (!hasSkippedFirstSandstorm) {
        hasSkippedFirstSandstorm = true;
        continue;
      }
    }
    if (G.deck.length === 0) {
      console.debug('Deck is empty, shuffling...');
      G.deck = shuffle([...getDeckForLevel(G.level)]);
    }

    const card = G.deck.pop();
    if (!card) throw new Error('Tried to replace hand from an empty deck.');
    hand[i] = card;
  }

  // Handle the edge case where deck becomes empty after playing `Sandstorm`
  if (G.deck.length === 0) {
    console.debug('Deck is empty, shuffling...');
    G.deck = shuffle([...getDeckForLevel(G.level)]);
  }
};

const swapHp: EffectHandler = ({ G, target }) => {
  const opponent = target === '0' ? '1' : '0';
  const temp = G.players[target].hp;
  G.players[target].hp = G.players[opponent].hp;
  G.players[opponent].hp = temp;
};

const stealBuff: EffectHandler = ({ G, ctx, target }) => {
  const opponentBuffs = selectEffectsByGroup(G, target, EffectGroupName.buff);
  if (opponentBuffs.length === 0) return;
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

  // Apply the chosen buff to the player unless the buff is unique and already exists.
  const player = target === '0' ? '1' : '0';
  const playerEffects = G.players[player].effects;
  const uniqueEffectExists = playerEffects.some(
    (e) => isUnique(e) && e.type === chosenBuff.type
  );
  if (!uniqueEffectExists) {
    effectHandlers[chosenBuff.type]({
      G,
      ctx,
      target: player,
      effect: { ...chosenBuff },
    });
    playerEffects.push({ ...chosenBuff });
  }
};

const copyEnemyHand: EffectHandler = ({ G, target }) => {
  const opponent = target === '0' ? '1' : '0';
  const hand = G.players[target].hand;

  // `Vision` is removed AFTER effect is applied, so we want to keep at least one `Vision` in hand.
  let hasSkippedFirstVision = false;
  let enemyIndex = 0;

  for (let i = 0; i < hand.length; i++) {
    if (hand[i].id === CardId.Vision && !hasSkippedFirstVision) {
      hasSkippedFirstVision = true;
      continue;
    }
    if (enemyIndex >= G.players[opponent].hand.length) break;
    hand[i] = { ...G.players[opponent].hand[enemyIndex++] };
  }
};

const lifesteal: EffectHandler = ({ G, ctx, target, effect }) => {
  const player = target === '0' ? '1' : '0';
  const value = damage({ G, ctx, target, effect });
  if (typeof value === 'number' && value > 0) {
    heal({ G, ctx, target: player, effect: { ...effect, value } });
  }
};

const counterAttack: EffectHandler = () => {};

const poison: EffectHandler = () => {};

const effectHandlers: Record<EffectType, EffectHandler> = {
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
  [EffectType.copyEnemyHand]: copyEnemyHand,
  [EffectType.lifesteal]: lifesteal,
  [EffectType.counterAttack]: counterAttack,
  [EffectType.poison]: poison,
};

export const applyEffect = (G: WizardDuelState, ctx: Ctx, effect: Effect) => {
  const handler = effectHandlers[effect.type];
  if (!handler) {
    console.error(`Invalid effect type: ${effect.type}`);
    return;
  }

  const target = getTarget(ctx.currentPlayer, effect.target);

  // If you are frozen, the card you play this turn has no effect.
  if (hasEffect(G, ctx.currentPlayer, EffectType.freeze)) return;

  // If the effect is unique and already active, skip applying it.
  if (isUnique(effect) && hasEffect(G, target, effect.type)) return;

  // Skip duplicate auras.
  if (
    effect.type === EffectType.aura &&
    hasSameEffect(G, ctx.currentPlayer, effect)
  )
    return;

  // Invoke the effect handler.
  handler({ G, ctx, target, effect });

  if (effect.duration === EffectDuration.enduring) {
    G.players[target].effects.push(effect);
  }
};

const applyDamageLevelEffects = (
  G: WizardDuelState,
  ctx: Ctx,
  target: PlayerID,
  damage: number
): number => {
  switch (G.level) {
    case '3':
      if (getChanceEffect(levelRules.freezeRate)) {
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
