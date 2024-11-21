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
      maxHp: 40,
      hp: 40,
    },
    handOverride: randomPopulateHand([Fireball1, Fireball2, Fireball3]),
    effectsOverride: [],
  },
};

const finalLevel = '2';

export { levelConfigs, finalLevel };
