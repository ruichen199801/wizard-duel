import { Card } from '../model/cards';

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm.
 */

export const shuffle = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
};

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
const clearSession = () => {
  sessionStorage.removeItem('level');
  sessionStorage.removeItem('power');
  sessionStorage.removeItem('difficulty');
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
    sessionStorage.setItem('level', level);
  } catch (e) {
    console.error('Error saving to sessionStorage:', e);
  }
};
