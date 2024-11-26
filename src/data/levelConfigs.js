import { Fireball1, Fireball2, Fireball3 } from './cards';

const randomPopulateHand = (options = []) => {
  const hand = Array.from({ length: 5 }, () => {
    return options[Math.floor(Math.random() * options.length)];
  });
  return [...hand];
};

const levelConfigs = {
  1: {
    statsOverride: {},
    handOverride: [],
    effectsOverride: [],
  },

  2: {
    statsOverride: {
      maxHp: 45,
      hp: 45,
    },
    handOverride: randomPopulateHand([Fireball2, Fireball3]),
    effectsOverride: [],
  },
};

const finalLevel = '2';

export { levelConfigs, finalLevel };
