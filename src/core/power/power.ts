import { CacheKey } from '@utils';

export enum PowerClass {
  pyro = 'pyro',
  cryo = 'cryo',
  psammo = 'psammo',
  dentro = 'dentro',
  hydro = 'hydro',
  erebo = 'erebo',
}

// Difficulty of the boss level
export enum GameDifficulty {
  normal = 'normal',
  hard = 'hard',
}

export const PYRO_HAND_DISTRIBUTION = [0.4, 0.4, 0.15, 0.04, 0.01];

// GameDifficulty agnostic contants
const powerConfigs: Record<string, number> = {
  cryoFreezeRate: 0.4,
  psammoWishRate: 0.4,
  hydroBuffRate: 0.5,
  hydroPlayerStatBuffPoint: 4,
};

// GameDifficulty dependent contants
const powerConfigsByDifficulty: Record<
  GameDifficulty,
  Record<string, number>
> = {
  [GameDifficulty.normal]: {
    pyroMaxTurn: 40,
    psammoMissRate: 0.15,
    dentroEnemyHpBuffPoint: 20,
    hydroEnemyStatBuffPoint: 3,
    ereboPlayerInitialHp: 45,
  },
  [GameDifficulty.hard]: {
    pyroMaxTurn: 30,
    psammoMissRate: 0.3,
    dentroEnemyHpBuffPoint: 40,
    hydroEnemyStatBuffPoint: 6,
    ereboPlayerInitialHp: 35,
  },
};

export const getPowerConfigs = (): Record<string, number> => {
  const difficulty =
    (sessionStorage.getItem(CacheKey.difficulty) as GameDifficulty) ||
    GameDifficulty.normal;

  return {
    ...powerConfigs,
    ...powerConfigsByDifficulty[difficulty],
  };
};
