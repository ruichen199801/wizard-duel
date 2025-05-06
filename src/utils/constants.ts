// -- Client enums and constants --
// TODO: Colocate constants with their respective components and remove this file.

export enum VisibleTurnPhase {
  // The player has drawn a card but hasn't clicked to preview any yet.
  // The end-turn button shows "End Turn" and is disabled.
  endTurnDisabled = 'end turn disabled',

  // The player has previewed a card and can end their turn.
  // The end-turn button shows "End Turn" and is enabled.
  endTurnEnabled = 'end turn enabled',

  // The AI is taking its turn. Player cannot interact.
  // The end-turn button shows "Enemy Turn" and is disabled.
  aiTurn = 'ai turn',
}

export const PAUSE_INTERVAL = 1200;

export const AVATAR_HEIGHT = 125;
export const AVATAR_WIDTH = 125;
export const AVATAR_SMALL_SCALE = 0.9;
export const AVATAR_MEDIUM_SCALE = 1.1;
