import {
  aura,
  buffAtk,
  buffDef,
  counterAttack,
  damage,
  debuffAtk,
  debuffDef,
  doubleDmg,
  Effect,
  freeze,
  heal,
  lifesteal,
  poison,
  preventDmg,
  removeBuff,
  removeDebuff,
  replaceHand,
  resurrect,
  showEnemyHand,
  stealBuff,
  swapHp,
} from './cardEffects';

export interface Card {
  readonly id: string;

  // Card name and text added only for logging purpose
  readonly name: string;
  readonly text: string;

  readonly effects: Effect[];
  readonly keywords: CardKeyword[];
}

/**
 * Defines keywords used by the frontend to execute logic based on card categories.
 */
export enum CardKeyword {
  // Cards that deal direct damage to your opponent
  damage = 'damage',

  // Cards that heal or add additional HP
  sustain = 'sustain',

  // Cards that impact you or your opponent's active effects
  effect = 'effect',
}

export const Fireball1: Card = {
  id: '0',
  name: 'Fireball',
  text: 'Damage 3',
  effects: [damage(3)],
  keywords: [CardKeyword.damage],
};

export const Fireball2: Card = {
  id: '1',
  name: 'Fireball+',
  text: 'Damage 6',
  effects: [damage(6)],
  keywords: [CardKeyword.damage],
};

export const Fireball3: Card = {
  id: '2',
  name: 'Fireball++',
  text: 'Damage 9',
  effects: [damage(9)],
  keywords: [CardKeyword.damage],
};

export const Frost1: Card = {
  id: '3',
  name: 'Frost',
  text: 'Damage 4',
  effects: [damage(4)],
  keywords: [CardKeyword.damage],
};

export const Frost2: Card = {
  id: '4',
  name: 'Frost+',
  text: 'Damage 7',
  effects: [damage(7)],
  keywords: [CardKeyword.damage],
};

export const Frost3: Card = {
  id: '5',
  name: 'Frost++',
  text: 'Damage 10',
  effects: [damage(10)],
  keywords: [CardKeyword.damage],
};

export const Thunder1: Card = {
  id: '6',
  name: 'Thunder',
  text: 'Damage 8',
  effects: [damage(8)],
  keywords: [CardKeyword.damage],
};

export const Thunder2: Card = {
  id: '7',
  name: 'Thunder+',
  text: 'Damage 12',
  effects: [damage(12)],
  keywords: [CardKeyword.damage],
};

export const Thunder3: Card = {
  id: '8',
  name: 'Thunder++',
  text: 'Damage 16',
  effects: [damage(16)],
  keywords: [CardKeyword.damage],
};

export const Heal1: Card = {
  id: '9',
  name: 'Heal',
  text: '+5 HP',
  effects: [heal(5)],
  keywords: [CardKeyword.sustain],
};

export const Heal2: Card = {
  id: '10',
  name: 'Heal+',
  text: '+10 HP',
  effects: [heal(10)],
  keywords: [CardKeyword.sustain],
};

export const Heal3: Card = {
  id: '11',
  name: 'Heal++',
  text: '+15 HP',
  effects: [heal(15)],
  keywords: [CardKeyword.sustain],
};

export const Blessing: Card = {
  id: '12',
  name: 'Blessing',
  text: '+3 Attack',
  effects: [buffAtk(3)],
  keywords: [CardKeyword.effect],
};

export const Armor: Card = {
  id: '13',
  name: 'Armor',
  text: '+3 Shield',
  effects: [buffDef(3)],
  keywords: [CardKeyword.effect],
};

export const Weaken: Card = {
  id: '14',
  name: 'Weaken',
  text: 'Enemy -3 Attack',
  effects: [debuffAtk(3)],
  keywords: [CardKeyword.effect],
};

export const Curse: Card = {
  id: '15',
  name: 'Curse',
  text: 'Enemy -3 Shield',
  effects: [debuffDef(3)],
  keywords: [CardKeyword.effect],
};

export const Purify: Card = {
  id: '16',
  name: 'Purify',
  text: 'Remove Debuff',
  effects: [removeDebuff],
  keywords: [CardKeyword.effect],
};

export const Dispel: Card = {
  id: '17',
  name: 'Dispel',
  text: 'Remove Enemy Buff',
  effects: [removeBuff],
  keywords: [CardKeyword.effect],
};

export const Enrage: Card = {
  id: '18',
  name: 'Enrage',
  text: 'Next Damage x2',
  effects: [doubleDmg],
  keywords: [CardKeyword.effect],
};

export const Block: Card = {
  id: '19',
  name: 'Block',
  text: 'Prevent Next Damage',
  effects: [preventDmg],
  keywords: [CardKeyword.effect],
};

export const Flame: Card = {
  id: '20',
  name: 'Flame',
  text: 'Damage 12 and +5 Attack',
  effects: [damage(12), buffAtk(5)],
  keywords: [CardKeyword.damage, CardKeyword.effect],
};

export const Resurrect: Card = {
  id: '21',
  name: 'Resurrect',
  text: '+15 HP on Death',
  effects: [resurrect(15)],
  keywords: [CardKeyword.sustain, CardKeyword.effect],
};

export const Petrify: Card = {
  id: '22',
  name: 'Petrify',
  text: 'Freeze Enemy 1 Turn',
  effects: [freeze],
  keywords: [CardKeyword.effect],
};

export const Aura: Card = {
  id: '23',
  name: 'Aura',
  text: '+3 HP per Turn',
  effects: [aura(heal(3), '+3 HP per Turn', '+3 HP per Turn')],
  keywords: [CardKeyword.sustain, CardKeyword.effect],
};

export const Sandstorm: Card = {
  id: '24',
  name: 'Sandstorm',
  text: 'Replace Hand',
  effects: [replaceHand],
  keywords: [],
};

export const Wish1: Card = {
  id: '25',
  name: 'Wish',
  text: 'Changes Effect Each Turn!',
  effects: [],
  keywords: [],
};

export const Wish2: Card = {
  id: '26',
  name: 'Wish',
  text: 'Remove Buff and Freeze 1 Turn',
  effects: [removeBuff, freeze],
  keywords: [CardKeyword.effect],
};

export const Wish3: Card = {
  id: '27',
  name: 'Wish',
  text: '+10 Attack',
  effects: [buffAtk(10)],
  keywords: [CardKeyword.effect],
};

export const Wish4: Card = {
  id: '28',
  name: 'Wish',
  text: 'Remove Debuff and +15 HP',
  effects: [removeDebuff, heal(15)],
  keywords: [CardKeyword.effect, CardKeyword.sustain],
};

export const Wish5: Card = {
  id: '29',
  name: 'Wish',
  text: 'Damage 20',
  effects: [damage(20)],
  keywords: [CardKeyword.damage],
};

export const Mutate: Card = {
  id: '30',
  name: 'Mutate',
  text: 'Swap HP',
  effects: [swapHp],
  keywords: [],
};

export const Ambush: Card = {
  id: '31',
  name: 'Ambush',
  text: 'Steal 1 Buff',
  effects: [stealBuff],
  keywords: [CardKeyword.effect],
};

export const Vision: Card = {
  id: '32',
  name: 'Vision',
  text: 'Show Enemy Hand',
  effects: [showEnemyHand],
  keywords: [],
};

export const Tide: Card = {
  id: '33',
  name: 'Tide',
  text: 'Damage 18 and + Same HP',
  effects: [lifesteal(18)],
  keywords: [CardKeyword.damage, CardKeyword.sustain],
};

export const Revenge: Card = {
  id: '34',
  name: 'Revenge',
  text: 'Counter Attack 9',
  effects: [counterAttack(9)],
  keywords: [CardKeyword.effect],
};

export const Poison: Card = {
  id: '35',
  name: 'Poison',
  text: "Enemy Can't Heal",
  effects: [poison],
  keywords: [CardKeyword.effect],
};
