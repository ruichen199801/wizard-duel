import { deck } from './deck';

// TODO - optimize override impl

export const singleGameConfigs = {
  deck: deck,
  statsOverride: {},
  effectsOverride: [],
  globalEffects: [],
};

export const levelConfigs = {
  1: {
    deck: deck,
    statsOverride: {},
    effectsOverride: [],
    globalEffects: [],
  },

  2: {
    deck: deck,
    statsOverride: {
      maxHp: 40,
      hp: 40,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  3: {
    deck: deck,
    statsOverride: {
      maxHp: 50,
      hp: 50,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  4: {
    deck: deck,
    statsOverride: {
      maxHp: 60,
      hp: 60,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  5: {
    deck: deck,
    statsOverride: {
      maxHp: 70,
      hp: 70,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  6: {
    deck: deck,
    statsOverride: {
      maxHp: 80,
      hp: 80,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  7: {
    deck: deck,
    statsOverride: {
      maxHp: 90,
      hp: 90,
    },
    effectsOverride: [],
    globalEffects: [],
  },

  8: {
    deck: deck,
    statsOverride: {
      maxHp: 100,
      hp: 100,
    },
    effectsOverride: [],
    globalEffects: [],
  },
};
