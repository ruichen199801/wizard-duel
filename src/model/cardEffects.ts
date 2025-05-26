export enum EffectType {
  damage = 'damage',
  heal = 'heal',
  buffAtk = 'buffAtk',
  buffDef = 'buffDef',
  debuffAtk = 'debuffAtk',
  debuffDef = 'debuffDef',
  removeBuff = 'removeBuff',
  removeDebuff = 'removeDebuff',
  doubleDmg = 'doubleDmg',
  preventDmg = 'preventDmg',
  resurrect = 'resurrect',
  freeze = 'freeze',
  aura = 'aura',
  replaceHand = 'replaceHand',
  swapHp = 'swapHp',
  stealBuff = 'stealBuff',
  copyEnemyHand = 'copyEnemyHand',
  lifesteal = 'lifesteal',
  counterAttack = 'counterAttack',
  poison = 'poison',
}

export enum EffectDuration {
  instant = 'instant',
  enduring = 'enduring',
}

export enum EffectTarget {
  self = 'self',
  opponent = 'opponent',
}

export enum EffectGroupName {
  buff = 'buff',
  debuff = 'debuff',
  unique = 'unique',
}

export const effectsByGroup: Record<EffectGroupName, EffectType[]> = {
  // Positive effects applied to the player.
  [EffectGroupName.buff]: [
    EffectType.buffAtk,
    EffectType.buffDef,
    EffectType.doubleDmg,
    EffectType.preventDmg,
    EffectType.resurrect,
    EffectType.aura,
    EffectType.counterAttack,
  ],

  // Negative effects applied to the opponent.
  [EffectGroupName.debuff]: [
    EffectType.debuffAtk,
    EffectType.debuffDef,
    EffectType.freeze,
    EffectType.poison,
  ],

  // Only one effect of the same type can exist at a time. Can be either buff or debuff.
  // NOTE: This enum isn't set in card effects. ALWAYS USE isUnique() to check uniqueness
  // instead of accessing the group field directly.
  [EffectGroupName.unique]: [
    EffectType.doubleDmg,
    EffectType.preventDmg,
    EffectType.resurrect,
    EffectType.counterAttack,
    EffectType.freeze,
    EffectType.poison,
  ],
};

export interface Effect {
  readonly type: EffectType;
  readonly duration: EffectDuration;
  readonly target: EffectTarget;
  readonly value?: number;

  // Only enduring effects have text and group (buff/debuff) field for logging purpose
  readonly group?: EffectGroupName;
  readonly text?: string;
  readonly abbrevText?: string;

  // Only aura effect has this field
  readonly effect?: Effect;
}

/**
 * Deal damage to the opponent by value.
 * Damage = (card damage + player attack - opponent defense), modifiers applied afterward.
 */
export const damage = (value: number): Effect => {
  return {
    type: EffectType.damage,
    duration: EffectDuration.instant,
    target: EffectTarget.opponent,
    value,
  };
};

/**
 * Increase your HP by value.
 */
export const heal = (value: number): Effect => {
  return {
    type: EffectType.heal,
    duration: EffectDuration.instant,
    target: EffectTarget.self,
    value,
  };
};

/**
 * Increase your attack by value.
 */
export const buffAtk = (value: number): Effect => {
  return {
    type: EffectType.buffAtk,
    duration: EffectDuration.enduring,
    target: EffectTarget.self,
    value,
    group: EffectGroupName.buff,
    text: `+${value} Attack`,
    abbrevText: `+${value} Atk`,
  };
};

/**
 * Increase your defense by value.
 */
export const buffDef = (value: number): Effect => {
  return {
    type: EffectType.buffDef,
    duration: EffectDuration.enduring,
    target: EffectTarget.self,
    value,
    group: EffectGroupName.buff,
    text: `+${value} Shield`,
    abbrevText: `+${value} Def`,
  };
};

/**
 * Decrease the opponent's attack by value.
 */
export const debuffAtk = (value: number): Effect => {
  return {
    type: EffectType.debuffAtk,
    duration: EffectDuration.enduring,
    target: EffectTarget.opponent,
    value,
    group: EffectGroupName.debuff,
    text: `-${value} Attack`,
    abbrevText: `-${value} Atk`,
  };
};

/**
 * Decrease the opponent's defense by value.
 */
export const debuffDef = (value: number): Effect => {
  return {
    type: EffectType.debuffDef,
    duration: EffectDuration.enduring,
    target: EffectTarget.opponent,
    value,
    group: EffectGroupName.debuff,
    text: `-${value} Shield`,
    abbrevText: `-${value} Def`,
  };
};

/**
 * Remove all your debuffs.
 */
export const removeDebuff: Effect = {
  type: EffectType.removeDebuff,
  duration: EffectDuration.instant,
  target: EffectTarget.self,
};

/**
 * Remove all the opponent's buffs.
 */
export const removeBuff: Effect = {
  type: EffectType.removeBuff,
  duration: EffectDuration.instant,
  target: EffectTarget.opponent,
};

/**
 * Double your next card damage.
 */
export const doubleDmg: Effect = {
  type: EffectType.doubleDmg,
  duration: EffectDuration.enduring,
  target: EffectTarget.self,
  group: EffectGroupName.buff,
  text: 'Next Damage x2',
  abbrevText: '2x Dmg',
};

/**
 * Prevent next card damage from the opponent.
 */
export const preventDmg: Effect = {
  type: EffectType.preventDmg,
  duration: EffectDuration.enduring,
  target: EffectTarget.self,
  group: EffectGroupName.buff,
  text: 'Prevent Next Damage',
  abbrevText: 'Prevent Dmg',
};

/**
 * Before receiving fatal card damage from the opponent, prevent it and set your HP to 15.
 */
export const resurrect = (value: number): Effect => {
  return {
    type: EffectType.resurrect,
    duration: EffectDuration.enduring,
    target: EffectTarget.self,
    value,
    group: EffectGroupName.buff,
    text: `+${value} HP on Death`,
    abbrevText: `+${value} HP on Death`,
  };
};

/**
 * Invalidate the opponent's next card. Triggered immediately during their next turn.
 */
export const freeze: Effect = {
  type: EffectType.freeze,
  duration: EffectDuration.enduring,
  target: EffectTarget.opponent,
  group: EffectGroupName.debuff,
  text: 'Next Card Invalidated',
  abbrevText: 'Next Card Inval',
};

/**
 * Trigger a positive instant effect at the end of your turn.
 */
export const aura = (
  effect: Effect,
  text: string,
  abbrevText: string
): Effect => {
  return {
    type: EffectType.aura,
    duration: EffectDuration.enduring,
    target: EffectTarget.self,
    group: EffectGroupName.buff,
    text,
    abbrevText,
    effect,
  };
};

/**
 * Replace your hand with new cards drawn from the deck.
 */
export const replaceHand: Effect = {
  type: EffectType.replaceHand,
  duration: EffectDuration.instant,
  target: EffectTarget.self,
};

/**
 * Swap your current HP with your opponent's.
 */
export const swapHp: Effect = {
  type: EffectType.swapHp,
  duration: EffectDuration.instant,
  target: EffectTarget.self,
};

/**
 * Removes a random buff effect from your opponent and applies it on you.
 */
export const stealBuff: Effect = {
  type: EffectType.stealBuff,
  duration: EffectDuration.instant,
  target: EffectTarget.opponent,
};

export const copyEnemyHand: Effect = {
  type: EffectType.copyEnemyHand,
  duration: EffectDuration.instant,
  target: EffectTarget.self,
};

/**
 * Deal damage to the opponent and heal for the same amount.
 */
export const lifesteal = (value: number): Effect => {
  return {
    type: EffectType.lifesteal,
    duration: EffectDuration.instant,
    target: EffectTarget.opponent,
    value,
  };
};

/**
 * Reduce the opponent's HP by value when attacked (cannot be reduced below 1).
 * This effect will be triggered whenever a damage card targeting the player is played,
 * regardless of whether any actual damage is dealt (e.g. miss/freeze/preventDamage/etc.)
 */
export const counterAttack = (value: number): Effect => {
  return {
    type: EffectType.counterAttack,
    duration: EffectDuration.enduring,
    target: EffectTarget.self,
    value,
    group: EffectGroupName.buff,
    text: `Counter Attack ${value}`,
    abbrevText: `Counter Atk ${value}`,
  };
};

/**
 * All healing effects applied to the opponent are invalidated.
 */
export const poison: Effect = {
  type: EffectType.poison,
  duration: EffectDuration.enduring,
  target: EffectTarget.opponent,
  group: EffectGroupName.debuff,
  text: 'Healing Invalidated',
  abbrevText: 'Heal Inval',
};
