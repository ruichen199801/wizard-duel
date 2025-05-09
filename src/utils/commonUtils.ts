/**
 * Enum to keep sessionStorage operations safe.
 * This should only be used when there is need to persist data across multiple games.
 */
export enum CacheKey {
  // Game related
  level = 'level',
  power = 'power', // Final level only
  difficulty = 'difficulty', // Final level only

  // User settings related
  isAudioMuted = 'isAudioMuted',
  isMusicMuted = 'isMusicMuted',
}

/**
 * Pauses execution for a specified time.
 * Example: await sleep(2000);
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Returns to the menu.
 */
export const exitToMenu = () => {
  clearSession();
  window.location.href = '/'; // Use full page rerender to keep the game state clean
};

/**
 * Restarts the whole game from level 1.
 */
export const resetGame = () => {
  clearSession();
  window.location.reload();
  // The alternative is to call reset() and clean up manual states on the client side
};

/**
 * Triggers a reload to start a particular level.
 * The level number is set on game end in `gameUtils`.
 */
export const startLevel = () => {
  window.location.reload();
};

/**
 * Clear game configs (AI and display settings will still persist).
 */
export const clearSession = () => {
  sessionStorage.removeItem(CacheKey.level);
  sessionStorage.removeItem(CacheKey.power);
  sessionStorage.removeItem(CacheKey.difficulty);
};

/**
 * Set game to a specific level - FOR TESTING PURPOSE ONLY.
 */
export const jumpToLevel = (level = '1') => {
  setLevelTo(level);
  window.location.reload();
};

const setLevelTo = (level: string) => {
  try {
    sessionStorage.setItem(CacheKey.level, level);
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
};
