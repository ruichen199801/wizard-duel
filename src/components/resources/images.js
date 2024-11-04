import { isSingleGame } from '../utils/utils';

// AVATARS

const avatarPrefix = 'images/avatars2';
const avatarPaths = {
  0: `${avatarPrefix}/player.svg`,
  1: `${avatarPrefix}/wise-scholar.svg`,
  2: `${avatarPrefix}/wild-firemancer.svg`,
  3: `${avatarPrefix}/ice-queen.svg`,
  4: `${avatarPrefix}/traveling-merchant.svg`,
  5: `${avatarPrefix}/forest-ranger.svg`,
  6: `${avatarPrefix}/murloc-oracle.svg`,
  7: `${avatarPrefix}/crimson-witch.svg`,
  8: `${avatarPrefix}/dark-knight.svg`,
};
const avatar = (playerId, level = null) => {
  if (playerId === '0') {
    return avatarPaths[0];
  }
  return isSingleGame() ? avatarPaths[1] : avatarPaths[level];
};

// ICONS

const iconPrefix = 'images/icons';
const icon = {
  hp: `${iconPrefix}/hp.svg`,
  atk: `${iconPrefix}/atk.svg`,
  def: `${iconPrefix}/def.svg`,
  log: `${iconPrefix}/log.svg`,
  settings: `${iconPrefix}/settings.svg`,
  help: `${iconPrefix}/help.svg`,
  buff: `${iconPrefix}/buff.svg`,
  debuff: `${iconPrefix}/debuff.svg`,
};

// CARDS

const cardPrefix = 'images/cards';
const cardFront = (cardId) => `${cardPrefix}/front/${cardId}.svg`;
const cardBack = (playerId) => `${cardPrefix}/back/${playerId}.svg`;
const cardPlaceholder = (playerId) =>
  `${cardPrefix}/placeholder/${playerId}.svg`;
const cardPile = `${cardPrefix}/pile.svg`;

const cardCount = 22; // TODO: Update total count here when new cards are added
const cardFronts = Array.from(
  { length: cardCount },
  (_, cardId) => `${cardPrefix}/front/${cardId}.svg`
);

const _allImages = [
  ...Object.values(avatarPaths),
  ...Object.values(icon),
  ...cardFronts,
  `${cardPrefix}/back/0.svg`,
  `${cardPrefix}/back/1.svg`,
  `${cardPrefix}/placeholder/0.svg`,
  `${cardPrefix}/placeholder/1.svg`,
  cardPile,
];

export {
  avatar,
  icon,
  cardFront,
  cardBack,
  cardPlaceholder,
  cardPile,
  cardFronts,
  _allImages,
};
