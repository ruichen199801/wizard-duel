const imgPrefix = 'images';
const avatarPrefix = `${imgPrefix}/avatars`;
const cardPrefix = `${imgPrefix}/cards`;
const locationPrefix = `${imgPrefix}/locations`;
const audioPrefix = 'audio';
const musicPrefix = 'music';

// IMAGES FILES

const avatarPaths = {
  0: `${avatarPrefix}/player.svg`,
  1: `${avatarPrefix}/wise-scholar.svg`,
  2: `${avatarPrefix}/wild-firemancer.svg`,
};
const getAvatarForLevel = (playerId, level = '1') => {
  return playerId === '0' ? avatarPaths[0] : avatarPaths[level];
};

const locationPaths = {
  1: `${locationPrefix}/city.png`,
  2: `${locationPrefix}/volcano.png`,
};
const getLocationForLevel = (level = '1') => locationPaths[level];

const icon = {
  hp: `${imgPrefix}/icons/hp.svg`,
  atk: `${imgPrefix}/icons/atk.svg`,
  def: `${imgPrefix}/icons/def.svg`,
  log: `${imgPrefix}/icons/log.svg`,
  settings: `${imgPrefix}/icons/settings.svg`,
  help: `${imgPrefix}/icons/help.svg`,
  buff: `${imgPrefix}/icons/buff.svg`,
  debuff: `${imgPrefix}/icons/debuff.svg`,
};

const cardFront = (cardId) => `${cardPrefix}/front/${cardId}.svg`;
const cardBack = (playerId) => `${cardPrefix}/back/${playerId}.svg`;
const cardPlaceholder = (playerId) =>
  `${cardPrefix}/placeholder/${playerId}.svg`;
const cardPile = `${cardPrefix}/pile.svg`;

const cardCount = 22; // Increment this when new cards are added
const cardFronts = Array.from(
  { length: cardCount },
  (_, cardId) => `${cardPrefix}/front/${cardId}.svg`
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
  20: 'fireball',
  21: 'magic',
};
const cardAudio = (cardId) => `${audioPrefix}/${cardAudioType[cardId]}.mp3`;
const click = `${audioPrefix}/click.mp3`;
const victory = `${audioPrefix}/victory.mp3`;
const defeat = `${audioPrefix}/defeat.mp3`;

// MUSIC FILES

const musicPaths = {
  1: `${musicPrefix}/royal-city.mp3`,
  2: `${musicPrefix}/lava-plains.mp3`,
};
const getMusicForLevel = (level = '1') => musicPaths[level];

// ALL FILES FOR PRELOAD

const IMAGES = [
  ...Object.values(avatarPaths),
  ...Object.values(locationPaths),
  ...Object.values(icon),
  ...cardFronts,
  `${cardPrefix}/back/0.svg`,
  `${cardPrefix}/back/1.svg`,
  `${cardPrefix}/placeholder/0.svg`,
  `${cardPrefix}/placeholder/1.svg`,
  cardPile,
];
const AUDIO = [
  click,
  victory,
  defeat,
  `${audioPrefix}/fireball.mp3`,
  `${audioPrefix}/freeze.mp3`,
  `${audioPrefix}/thunder.mp3`,
  `${audioPrefix}/heal.mp3`,
  `${audioPrefix}/sword.mp3`,
  `${audioPrefix}/shield.mp3`,
  `${audioPrefix}/weaken.mp3`,
  `${audioPrefix}/magic.mp3`,
];
const MUSIC = [...Object.values(musicPaths)];

export {
  // IMAGES FILES
  getAvatarForLevel,
  getLocationForLevel,
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
  getMusicForLevel,

  // ALL FILES FOR PRELOAD
  IMAGES,
  AUDIO,
  MUSIC,
};
