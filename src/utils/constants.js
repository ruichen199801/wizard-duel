export const VisibleTurnPhase = {
  // The player has drawn a card but hasn't clicked to preview any yet.
  // The end-turn button shows "End Turn" and is disabled.
  endTurnDisabled: 'end turn disabled',

  // The player has previewed a card and can end their turn.
  // The end-turn button shows "End Turn" and is enabled.
  endTurnEnabled: 'end turn enabled',

  // The AI is taking its turn. Player cannot interact.
  // The end-turn button shows "Enemy Turn" and is disabled.
  aiTurn: 'ai turn',
};

export const CardType = {
  // Required props: cardType, cardId, cardIndex, handleCardClick
  front: 'front',

  // Required props: cardType, playerId
  back: 'back',

  // Required props: cardType, cardId, scale
  preview: 'preview',

  // Required props: cardType, playerId
  // Optional props: scale
  placeholder: 'placeholder',
};

// Animation target is separated from effect target, as animation is applied per card but a card can have multiple effects.
// This enum can also be reused for level or game animations.
export const AnimationTarget = {
  enemy: 'enemy',
  self: 'self',
  both: 'both',
  none: 'none',
};

export const pauseInterval = 1200;

export const cardHeight = 210;
export const cardWidth = 150;
export const cardSmallScale = 0.9;
export const cardMediumScale = 1.25;

export const avatarHeight = 125;
export const avatarWidth = 125;
export const avatarSmallScale = 0.9;
export const avatarMediumScale = 1.1;
