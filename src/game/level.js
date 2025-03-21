import {
  randomPopulateHand,
  generateAttackOutcomes,
  getClearEffectSchedule,
} from './levelUtils';
import {
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Resurrect,
} from '../data/cards';

export const DrawMode = {
  draw: 'draw',
  select: 'select',
};

export const finalLevel = '7';

export const devTestLevel = '7'; // Update this when new level is developed

export const maxTurn = 50;

export const levelConfigs = {
  1: {
    playerStatsOverride: {},
    enemyStatsOverride: {},

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
    },
  },

  2: {
    playerStatsOverride: {
      maxHp: 50,
      hp: 50,
    },
    enemyStatsOverride: {
      maxHp: 50,
      hp: 50,
    },

    playerHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      [0.3, 0.3, 0.3, 0.05, 0.05]
    ),
    enemyHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      [0.3, 0.3, 0.3, 0.05, 0.05]
    ),

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
    },
  },

  3: {
    playerStatsOverride: {
      maxHp: 55,
      hp: 55,
    },
    enemyStatsOverride: {
      maxHp: 55,
      hp: 55,
    },

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
    },
  },

  4: {
    playerStatsOverride: {
      maxHp: 60,
      hp: 60,
    },
    enemyStatsOverride: {
      maxHp: 60,
      hp: 60,
    },

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
      shouldMiss: generateAttackOutcomes(maxTurn, 0.15),
    },
  },

  5: {
    playerStatsOverride: {
      maxHp: 65,
      hp: 65,
    },
    enemyStatsOverride: {
      maxHp: 65,
      hp: 65,
    },

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.select,
      showEnemyHand: false,
    },
  },

  6: {
    playerStatsOverride: {
      maxHp: 70,
      hp: 70,
    },
    enemyStatsOverride: {
      maxHp: 70,
      hp: 70,
    },

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
      shouldClearEffects: getClearEffectSchedule(maxTurn, 10),
    },
  },

  7: {
    playerStatsOverride: {
      maxHp: 75,
      hp: 75,
    },
    enemyStatsOverride: {
      maxHp: 75,
      hp: 75,
    },

    playerHandOverride: [],
    enemyHandOverride: [],

    playerEffectsOverride: [],
    enemyEffectsOverride: [],

    globalEffects: {
      drawMode: DrawMode.draw,
      showEnemyHand: false,
      loseHpAmount: 3,
    },
  },
};
