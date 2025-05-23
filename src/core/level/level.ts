import { Effect } from '../../model/cardEffects';
import {
  Card,
  Fireball1,
  Fireball2,
  Fireball3,
  Flame,
  Resurrect,
} from '../../model/cards';
import { PlayerStats } from '../../model/player';
import { DrawMode, GlobalEffectProps } from '../../model/shared';
import { PowerClass, getPowerConfigs } from '../power/power';
import {
  generateAttackOutcomes,
  getClearEffectSchedule,
  randomPopulateHand,
} from './levelUtils';

export const FINAL_LEVEL = '8';
export const PRE_FINAL_LEVEL = '7';

export const maxTurn: number =
  sessionStorage.getItem('power') === PowerClass.pyro
    ? getPowerConfigs().pyroMaxTurn // Pyro debuff
    : 50;

const FIRE_HAND_DISTRIBUTION = [0.3, 0.3, 0.35, 0.04, 0.01]; // Level 2

export const levelRules: Record<string, number> = {
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
  readonly playerStatsOverride?: PlayerStats;
  readonly enemyStatsOverride?: PlayerStats;
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
      maxHp: 35,
      hp: 35,
    },
    enemyStatsOverride: {
      maxHp: 35,
      hp: 35,
    },

    playerHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      FIRE_HAND_DISTRIBUTION,
      5
    ),
    enemyHandOverride: randomPopulateHand(
      [Fireball1, Fireball2, Fireball3, Flame, Resurrect],
      FIRE_HAND_DISTRIBUTION,
      5
    ),
  },

  3: {
    playerStatsOverride: {
      maxHp: 40,
      hp: 40,
    },
    enemyStatsOverride: {
      maxHp: 40,
      hp: 40,
    },
  },

  4: {
    playerStatsOverride: {
      maxHp: 45,
      hp: 45,
    },
    enemyStatsOverride: {
      maxHp: 45,
      hp: 45,
    },

    globalEffectsOverride: {
      shouldMiss: generateAttackOutcomes(maxTurn, levelRules.missRate),
    },
  },

  5: {
    playerStatsOverride: {
      maxHp: 50,
      hp: 50,
    },
    enemyStatsOverride: {
      maxHp: 50,
      hp: 50,
    },

    globalEffectsOverride: {
      drawMode: DrawMode.select,
    },
  },

  6: {
    playerStatsOverride: {
      maxHp: 55,
      hp: 55,
    },
    enemyStatsOverride: {
      maxHp: 55,
      hp: 55,
    },

    globalEffectsOverride: {
      shouldClearEffects: getClearEffectSchedule(
        maxTurn,
        levelRules.clearEffectInterval
      ),
    },
  },

  7: {
    playerStatsOverride: {
      maxHp: 60,
      hp: 60,
    },
    enemyStatsOverride: {
      maxHp: 60,
      hp: 60,
    },

    globalEffectsOverride: {
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
  },
};
