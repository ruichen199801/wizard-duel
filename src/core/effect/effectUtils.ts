import { PlayerID } from 'boardgame.io';
import {
  Effect,
  EffectGroupName,
  effectsByGroup,
  EffectTarget,
  EffectType,
} from '../../model/cardEffects';
import { WizardDuelState } from '../../model/shared';

/**
 * Returns the target player id of the card.
 */
export const getTarget = (
  currentPlayer: PlayerID,
  targetType: EffectTarget
): PlayerID => {
  switch (targetType) {
    case EffectTarget.self:
      return currentPlayer;
    case EffectTarget.opponent:
      return currentPlayer === '0' ? '1' : '0';
    default:
      throw new Error(`Invalid target type: ${targetType}`);
  }
};

/**
 * Checks if a specific effect type exists on the target player.
 */
export const hasEffect = (
  G: WizardDuelState,
  target: PlayerID,
  effectType: EffectType
): boolean => {
  return G.players[target].effects.some((e) => e.type === effectType);
};

/**
 * Checks if the target player has the *exact same* effect as the given one.
 */
export const hasSameEffect = (
  G: WizardDuelState,
  target: PlayerID,
  effect: Effect
): boolean => {
  return G.players[target].effects.some(
    (e) => JSON.stringify(e) === JSON.stringify(effect)
  );
};

/**
 * Returns all active effects of a specific type for the target player.
 */
export const getEffects = (
  G: WizardDuelState,
  target: PlayerID,
  effectType: EffectType
): Effect[] => {
  return G.players[target].effects.filter((e) => e.type === effectType);
};

/**
 * Removes all effects of a specific type from the target player.
 */
export const removeEffects = (
  G: WizardDuelState,
  target: PlayerID,
  effectType: EffectType
) => {
  G.players[target].effects = G.players[target].effects.filter(
    (e) => e.type !== effectType
  );
};

/**
 * Selects effects of a specific group type for the target player.
 */
export const selectEffectsByGroup = (
  G: WizardDuelState,
  target: PlayerID,
  groupName: EffectGroupName
): Effect[] => {
  return G.players[target].effects.filter((e) =>
    effectsByGroup[groupName].includes(e.type)
  );
};

/**
 * Removes all effects belonging to a specific group type from the target player.
 */
export const removeEffectsByGroup = (
  G: WizardDuelState,
  target: PlayerID,
  groupName: EffectGroupName
) => {
  G.players[target].effects = G.players[target].effects.filter(
    (e) => !effectsByGroup[groupName].includes(e.type)
  );
};

/**
 * Reverses the specified effect on the target player, such as stats changes.
 * - This method only applies on enduring effects.
 * - This method is *not* removing the effect names from player arrays, for that use `removeEffects` instead.
 * - If there is no applicable effect to reverse (other than removal from the array), this method has no impact.
 */
export const undoEffect = (
  G: WizardDuelState,
  target: PlayerID,
  effect: Effect
) => {
  const { type, value = 0 } = effect;

  switch (type) {
    case EffectType.buffAtk:
      G.players[target].atk -= value;
      break;
    case EffectType.buffDef:
      G.players[target].def -= value;
      break;
    case EffectType.debuffAtk:
      G.players[target].atk += value;
      break;
    case EffectType.debuffDef:
      G.players[target].def += value;
      break;
    case EffectType.doubleDmg:
      break;
    case EffectType.preventDmg:
      break;
    case EffectType.resurrect:
      break;
    case EffectType.freeze:
      break;
    case EffectType.aura:
      break;
    case EffectType.counterAttack:
      break;
    case EffectType.poison:
      break;
    default:
      console.error(`Invalid effect type: ${type}`);
      return;
  }
};

/**
 * Evaluates whether an effect should be executed based on a given probability.
 */
export const getChanceEffect = (chance: number): boolean => {
  return Math.random() < chance;
};

/**
 * Checks if an effect is unique.
 */
export const isUnique = (effect: Effect): boolean => {
  return effectsByGroup.unique.some((type) => type === effect.type);
};
