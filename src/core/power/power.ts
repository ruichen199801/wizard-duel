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
  cryoFreezeRate: 0.3,
  psammoWishRate: 0.3,
  hydroBuffRate: 0.3,
  hydroPlayerStatBuffPoint: 3,
};

// GameDifficulty dependent contants
const powerConfigsByDifficulty: Record<
  GameDifficulty,
  Record<string, number>
> = {
  [GameDifficulty.normal]: {
    pyroMaxTurn: 40,
    psammoMissRate: 0.2,
    dentroEnemyHpBuffPoint: 20,
    hydroEnemyStatBuffPoint: 3,
    ereboPlayerInitialHp: 45,
  },
  [GameDifficulty.hard]: {
    pyroMaxTurn: 30,
    psammoMissRate: 0.4,
    dentroEnemyHpBuffPoint: 70,
    hydroEnemyStatBuffPoint: 6,
    ereboPlayerInitialHp: 35,
  },
};

export const getPowerConfigs = (): Record<string, number> => {
  const difficulty =
    (sessionStorage.getItem('difficulty') as GameDifficulty) ||
    GameDifficulty.normal;

  return {
    ...powerConfigs,
    ...powerConfigsByDifficulty[difficulty],
  };
};
