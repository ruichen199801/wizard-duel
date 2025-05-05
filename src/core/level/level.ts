import { Effect } from '../data/cardEffects';
import {
  Card,
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Resurrect,
} from '../data/cards';
import { PlayerStats } from '../data/player';
import { GlobalEffectProps } from '../game/game';
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

export const levelRules: Record<string, number[] | number> = {
  fireHandDistribution: [0.2, 0.3, 0.4, 0.09, 0.01], // Level 2
  freezeRate: 0.4, // Level 3
  missRate: 0.5, // Level 4
  clearEffectInterval: 11, // Level 6
  loseHpAmount: 5, // Level 7
};

export const globalEffectsDefault: GlobalEffectProps = {
  drawMode: DrawMode.draw,
  showEnemyHand: false,
};

export interface LevelProps {
  readonly playerStatsOverride?: Partial<PlayerStats>;
  readonly enemyStatsOverride?: Partial<PlayerStats>;
  readonly playerHandOverride?: Card[];
  readonly enemyHandOverride?: Card[];
  readonly playerEffectsOverride?: Effect[];
  readonly enemyEffectsOverride?: Effect[];
  readonly globalEffectsOverride?: GlobalEffectProps;
}

export const levelConfigs: Record<string, LevelProps> = {
  1: {},

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
      levelRules.fireHandDistribution as number[],
      5
    ),
    enemyHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      levelRules.fireHandDistribution as number[],
      5
    ),
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

    globalEffectsOverride: {
      shouldMiss: generateAttackOutcomes(
        maxTurn,
        levelRules.missRate as number
      ),
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

    globalEffectsOverride: {
      drawMode: DrawMode.select,
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

    globalEffectsOverride: {
      shouldClearEffects: getClearEffectSchedule(
        maxTurn,
        levelRules.clearEffectInterval as number
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

    globalEffectsOverride: {
      loseHpAmount: levelRules.loseHpAmount as number,
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
  },
};
