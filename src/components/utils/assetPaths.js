// IMAGES FILES

const avatar = (playerId) => `images/avatars/${playerId}.svg`;
const icon = {
  hp: 'images/icons/hp.svg',
  atk: 'images/icons/atk.svg',
  def: 'images/icons/def.svg',
  log: 'images/icons/log.svg',
  settings: 'images/icons/settings.svg',
  help: 'images/icons/help.svg',
  buff: 'images/icons/buff.svg',
  debuff: 'images/icons/debuff.svg',
};

const cardFront = (cardId) => `images/cards/front/${cardId}.svg`;
const cardBack = (playerId) => `images/cards/back/${playerId}.svg`;
const cardPlaceholder = (playerId) =>
  `images/cards/placeholder/${playerId}.svg`;
const cardPile = 'images/cards/pile.svg';

const cardCount = 22; // TODO: Update total count here when new cards are added
const cardFronts = Array.from(
  { length: cardCount },
  (_, cardId) => `images/cards/front/${cardId}.svg`
);

// AUDIO FILES

const cardAudioType = {
  0: 'fireball',
  1: 'fireball',
  2: 'fireball',
  3: 'freeze',
  4: 'freeze',
  5: 'freeze',
  6: 'thunder',
  7: 'thunder',
  8: 'thunder',
  9: 'heal',
  10: 'heal',
  11: 'heal',
  12: 'sword',
  13: 'shield',
  14: 'weaken',
  15: 'weaken',
  16: 'magic',
  17: 'magic',
  18: 'sword',
  19: 'shield',
  // TODO: Add new cards here
};
const cardAudio = (cardId) => `audio/${cardAudioType[cardId]}.mp3`;
const click = 'audio/click.mp3';
const victory = 'audio/victory.mp3';
const defeat = 'audio/defeat.mp3';

// MUSIC FILES

const classic = 'music/classic.mp3';

// ALL FILES FOR PRELOAD

const IMAGES = [
  'images/avatars/0.svg',
  'images/avatars/1.svg',
  ...Object.values(icon),
  ...cardFronts,
  'images/cards/back/0.svg',
  'images/cards/back/1.svg',
  'images/cards/placeholder/0.svg',
  'images/cards/placeholder/1.svg',
  cardPile,
];
const AUDIO = [
  click,
  victory,
  defeat,
  'audio/fireball.mp3',
  'audio/freeze.mp3',
  'audio/thunder.mp3',
  'audio/heal.mp3',
  'audio/sword.mp3',
  'audio/shield.mp3',
  'audio/weaken.mp3',
  'audio/magic.mp3',
];
const MUSIC = [classic];

export {
  // IMAGES FILES
  avatar,
  icon,
  cardFront,
  cardBack,
  cardPlaceholder,
  cardPile,
  cardFronts,

  // AUDIO FILES
  cardAudio,
  click,
  victory,
  defeat,

  // MUSIC FILES
  classic,

  // ALL FILES FOR PRELOAD
  IMAGES,
  AUDIO,
  MUSIC,
};
