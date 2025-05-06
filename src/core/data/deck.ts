import { GameDifficulty, PowerClass } from '../power/power';
import {
  Ambush,
  Armor,
  Aura,
  Blessing,
  Block,
  Card,
  CardId,
  Curse,
  Dispel,
  Enrage,
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Frost1,
  Frost2,
  Frost3,
  Heal1,
  Heal2,
  Heal3,
  Mutate,
  Petrify,
  Poison,
  Purify,
  Resurrect,
  Revenge,
  Sandstorm,
  Thunder1,
  Thunder2,
  Thunder3,
  Tide,
  Vision,
  Weaken,
  Wish1,
} from './cards';

const baseDeck: Card[] = [
  Fireball1,
  Fireball2,
  Fireball3,
  Frost1,
  Frost2,
  Frost3,
  Thunder1,
  Thunder2,
  Thunder3,
  Heal1,
  Heal2,
  Heal3,
  Blessing,
  Armor,
  Weaken,
  Curse,
  Purify,
  Dispel,
  Enrage,
  Block,
];

const levelDecks: Record<string, Card[]> = {
  1: [...baseDeck],

  2: [...baseDeck, Flame, Resurrect],

  3: [...baseDeck, Flame, Resurrect, Petrify, Aura],

  4: [...baseDeck, Flame, Resurrect, Petrify, Aura, Sandstorm, Wish1],

  5: [
    ...baseDeck,
    Flame,
    Resurrect,
    Petrify,
    Aura,
    Sandstorm,
    Wish1,
    Mutate,
    Ambush,
  ],

  6: [
    ...baseDeck,
    Flame,
    Resurrect,
    Petrify,
    Aura,
    Sandstorm,
    Wish1,
    Mutate,
    Ambush,
    Vision,
    Tide,
  ],

  7: [
    ...baseDeck,
    Flame,
    Resurrect,
    Petrify,
    Aura,
    Sandstorm,
    Wish1,
    Mutate,
    Ambush,
    Vision,
    Tide,
    Revenge,
    Poison,
  ],

  8: [
    ...baseDeck,
    Flame,
    Resurrect,
    Petrify,
    Aura,
    Sandstorm,
    Wish1,
    Mutate,
    Ambush,
    Vision,
    Tide,
    Revenge,
    Poison,
  ],
};

export const getDeckForLevel = (level = '1'): Card[] => {
  const levelDeck = levelDecks[level];
  if (!levelDeck || levelDeck.length < 10) {
    throw new Error(`Level ${level} deck has <10 cards.`); // Dev testing issue only
  }

  if (
    sessionStorage.getItem('power') === PowerClass.cryo &&
    sessionStorage.getItem('difficulty') === GameDifficulty.normal
  ) {
    return [...levelDeck, Frost1, Frost1, Frost2, Frost2, Frost3, Frost3]; // Cryo effect
  } else if (sessionStorage.getItem('power') === PowerClass.erebo) {
    return levelDeck.filter((card) => card.id !== CardId.Mutate); // Erebo effect
  }

  return [...levelDeck];
};
