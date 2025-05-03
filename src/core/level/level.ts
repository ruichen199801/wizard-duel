import {
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Resurrect,
} from '../../data/cards';
import { PowerClass, getPowerConfigs } from '../power/power';
import {
  generateAttackOutcomes,
  getClearEffectSchedule,
  randomPopulateHand,
} from './levelUtils';

export enum DrawMode {
  draw = 'draw',
  select = 'select',
}

export const FINAL_LEVEL = '8';
export const PRE_FINAL_LEVEL = '7';

export const maxTurn: number =
  sessionStorage.getItem('power') === PowerClass.pyro
    ? getPowerConfigs().pyroMaxTurn // Pyro debuff
    : 50;

export const levelRules: Record<string, any> = {
  fireHandDistribution: [0.2, 0.3, 0.4, 0.09, 0.01], // Level 2
  freezeRate: 0.4, // Level 3
  missRate: 0.5, // Level 4
  clearEffectInterval: 11, // Level 6
  loseHpAmount: 5, // Level 7
};

// TODO - Use default config to avoid boilerplate code and change any type
export const levelConfigs: Record<string, any> = {
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
      levelRules.fireHandDistribution,
      5
    ),
    enemyHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      levelRules.fireHandDistribution,
      5
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
      shouldMiss: generateAttackOutcomes(maxTurn, levelRules.missRate),
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
      shouldClearEffects: getClearEffectSchedule(
        maxTurn,
        levelRules.clearEffectInterval
      ),
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
      loseHpAmount: levelRules.loseHpAmount,
    },
  },

  8: {
    playerStatsOverride: {
      maxHp: 80,
      hp: 80,
    },
    enemyStatsOverride: {
      maxHp: 80,
      hp: 80,
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
};
