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

export const PYRO_HAND_DISTRIBUTION = [0.3, 0.3, 0.3, 0.09, 0.01];

// GameDifficulty agnostic contants
const powerConfigs: Record<string, number> = {
  cryoFreezeRate: 0.3,
  psammoWishRate: 0.3,
  hydroBuffRate: 0.4,
  hydroPlayerStatBuffPoint: 3,
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
    psammoMissRate: 0.35,
    dentroEnemyHpBuffPoint: 70,
    hydroEnemyStatBuffPoint: 9,
    ereboPlayerInitialHp: 30,
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
