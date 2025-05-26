import {
  aura,
  buffAtk,
  buffDef,
  copyEnemyHand,
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
  stealBuff,
  swapHp,
} from './cardEffects';

export interface Card {
  readonly id: CardId;

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

export enum CardId {
  Fireball1 = '0',
  Fireball2 = '1',
  Fireball3 = '2',
  Frost1 = '3',
  Frost2 = '4',
  Frost3 = '5',
  Thunder1 = '6',
  Thunder2 = '7',
  Thunder3 = '8',
  Heal1 = '9',
  Heal2 = '10',
  Heal3 = '11',
  Blessing = '12',
  Armor = '13',
  Weaken = '14',
  Curse = '15',
  Purify = '16',
  Dispel = '17',
  Enrage = '18',
  Block = '19',
  Flame = '20',
  Resurrect = '21',
  Petrify = '22',
  Aura = '23',
  Sandstorm = '24',
  Wish1 = '25',
  Wish2 = '26',
  Wish3 = '27',
  Wish4 = '28',
  Wish5 = '29',
  Mutate = '30',
  Ambush = '31',
  Vision = '32',
  Tide = '33',
  Revenge = '34',
  Poison = '35',
}

export const getCardCount = () => {
  return Object.keys(CardId).length;
};

// --- Cards ---

export const Fireball1: Card = {
  id: CardId.Fireball1,
  name: 'Fireball',
  text: 'Damage 3',
  effects: [damage(3)],
  keywords: [CardKeyword.damage],
};

export const Fireball2: Card = {
  id: CardId.Fireball2,
  name: 'Fireball+',
  text: 'Damage 6',
  effects: [damage(6)],
  keywords: [CardKeyword.damage],
};

export const Fireball3: Card = {
  id: CardId.Fireball3,
  name: 'Fireball++',
  text: 'Damage 9',
  effects: [damage(9)],
  keywords: [CardKeyword.damage],
};

export const Frost1: Card = {
  id: CardId.Frost1,
  name: 'Frost',
  text: 'Damage 4',
  effects: [damage(4)],
  keywords: [CardKeyword.damage],
};

export const Frost2: Card = {
  id: CardId.Frost2,
  name: 'Frost+',
  text: 'Damage 7',
  effects: [damage(7)],
  keywords: [CardKeyword.damage],
};

export const Frost3: Card = {
  id: CardId.Frost3,
  name: 'Frost++',
  text: 'Damage 10',
  effects: [damage(10)],
  keywords: [CardKeyword.damage],
};

export const Thunder1: Card = {
  id: CardId.Thunder1,
  name: 'Thunder',
  text: 'Damage 8',
  effects: [damage(8)],
  keywords: [CardKeyword.damage],
};

export const Thunder2: Card = {
  id: CardId.Thunder2,
  name: 'Thunder+',
  text: 'Damage 12',
  effects: [damage(12)],
  keywords: [CardKeyword.damage],
};

export const Thunder3: Card = {
  id: CardId.Thunder3,
  name: 'Thunder++',
  text: 'Damage 16',
  effects: [damage(16)],
  keywords: [CardKeyword.damage],
};

export const Heal1: Card = {
  id: CardId.Heal1,
  name: 'Heal',
  text: '+5 HP',
  effects: [heal(5)],
  keywords: [CardKeyword.sustain],
};

export const Heal2: Card = {
  id: CardId.Heal2,
  name: 'Heal+',
  text: '+10 HP',
  effects: [heal(10)],
  keywords: [CardKeyword.sustain],
};

export const Heal3: Card = {
  id: CardId.Heal3,
  name: 'Heal++',
  text: '+15 HP',
  effects: [heal(15)],
  keywords: [CardKeyword.sustain],
};

export const Blessing: Card = {
  id: CardId.Blessing,
  name: 'Blessing',
  text: '+3 Attack',
  effects: [buffAtk(3)],
  keywords: [CardKeyword.effect],
};

export const Armor: Card = {
  id: CardId.Armor,
  name: 'Armor',
  text: '+3 Shield',
  effects: [buffDef(3)],
  keywords: [CardKeyword.effect],
};

export const Weaken: Card = {
  id: CardId.Weaken,
  name: 'Weaken',
  text: 'Enemy -3 Attack',
  effects: [debuffAtk(3)],
  keywords: [CardKeyword.effect],
};

export const Curse: Card = {
  id: CardId.Curse,
  name: 'Curse',
  text: 'Enemy -3 Shield',
  effects: [debuffDef(3)],
  keywords: [CardKeyword.effect],
};

export const Purify: Card = {
  id: CardId.Purify,
  name: 'Purify',
  text: 'Remove Debuff',
  effects: [removeDebuff],
  keywords: [CardKeyword.effect],
};

export const Dispel: Card = {
  id: CardId.Dispel,
  name: 'Dispel',
  text: 'Remove Enemy Buff',
  effects: [removeBuff],
  keywords: [CardKeyword.effect],
};

export const Enrage: Card = {
  id: CardId.Enrage,
  name: 'Enrage',
  text: 'Next Damage x2',
  effects: [doubleDmg],
  keywords: [CardKeyword.effect],
};

export const Block: Card = {
  id: CardId.Block,
  name: 'Block',
  text: 'Prevent Next Damage',
  effects: [preventDmg],
  keywords: [CardKeyword.effect],
};

export const Flame: Card = {
  id: CardId.Flame,
  name: 'Flame',
  text: 'Damage 12 and +5 Attack',
  effects: [damage(12), buffAtk(5)],
  keywords: [CardKeyword.damage, CardKeyword.effect],
};

export const Resurrect: Card = {
  id: CardId.Resurrect,
  name: 'Resurrect',
  text: '+15 HP on Death',
  effects: [resurrect(15)],
  keywords: [CardKeyword.sustain, CardKeyword.effect],
};

export const Petrify: Card = {
  id: CardId.Petrify,
  name: 'Petrify',
  text: 'Freeze Enemy 1 Turn',
  effects: [freeze],
  keywords: [CardKeyword.effect],
};

export const Aura: Card = {
  id: CardId.Aura,
  name: 'Aura',
  text: '+3 HP per Turn',
  effects: [aura(heal(3), '+3 HP per Turn', '+3 HP per Turn')],
  keywords: [CardKeyword.sustain, CardKeyword.effect],
};

export const Sandstorm: Card = {
  id: CardId.Sandstorm,
  name: 'Sandstorm',
  text: 'Replace Hand',
  effects: [replaceHand],
  keywords: [],
};

export const Wish1: Card = {
  id: CardId.Wish1,
  name: 'Wish',
  text: 'Changes Effect Each Turn!',
  effects: [],
  keywords: [],
};

export const Wish2: Card = {
  id: CardId.Wish2,
  name: 'Wish',
  text: 'Remove Buff and Freeze Enemy',
  effects: [removeBuff, freeze],
  keywords: [CardKeyword.effect],
};

export const Wish3: Card = {
  id: CardId.Wish3,
  name: 'Wish',
  text: '+10 Attack',
  effects: [buffAtk(10)],
  keywords: [CardKeyword.effect],
};

export const Wish4: Card = {
  id: CardId.Wish4,
  name: 'Wish',
  text: 'Remove Debuff and +15 HP',
  effects: [removeDebuff, heal(15)],
  keywords: [CardKeyword.effect, CardKeyword.sustain],
};

export const Wish5: Card = {
  id: CardId.Wish5,
  name: 'Wish',
  text: 'Damage 20',
  effects: [damage(20)],
  keywords: [CardKeyword.damage],
};

export const Mutate: Card = {
  id: CardId.Mutate,
  name: 'Mutate',
  text: 'Swap HP',
  effects: [swapHp],
  keywords: [],
};

export const Ambush: Card = {
  id: CardId.Ambush,
  name: 'Ambush',
  text: 'Steal 1 Buff',
  effects: [stealBuff],
  keywords: [CardKeyword.effect],
};

export const Vision: Card = {
  id: CardId.Vision,
  name: 'Vision',
  text: 'Copy Enemy Hand',
  effects: [copyEnemyHand],
  keywords: [],
};

export const Tide: Card = {
  id: CardId.Tide,
  name: 'Tide',
  text: 'Damage 18 and + Same HP',
  effects: [lifesteal(18)],
  keywords: [CardKeyword.damage, CardKeyword.sustain],
};

export const Revenge: Card = {
  id: CardId.Revenge,
  name: 'Revenge',
  text: 'Counter Attack 9',
  effects: [counterAttack(9)],
  keywords: [CardKeyword.effect],
};

export const Poison: Card = {
  id: CardId.Poison,
  name: 'Poison',
  text: "Enemy Can't Heal",
  effects: [poison],
  keywords: [CardKeyword.effect],
};
