import { isSingleGame } from '../utils/utils';

const levelNames = {
  1: 'Royal City',
  2: 'Lava Plains',
  3: 'Ice Crown',
  4: 'Lost Desert',
  5: 'Misty Woods',
  6: 'Coral Bay',
  7: 'Shadow Swamp',
  8: 'Black Castle',
};

const enemyNames = {
  0: 'Opponent',
  1: 'Wise Scholar',
  2: 'Wild Firemancer',
  3: 'Ice Queen',
  4: 'Traveling Merchant',
  5: 'Forest Ranger',
  6: 'Murloc Oracle',
  7: 'Crimson Witch',
  8: 'Dark Knight',
};

const captions = {
  0: 'Battle Start',
  1: 'Level 1: Royal City',
  2: 'Level 2: Lava Plains',
  3: 'Level 3: Ice Crown',
  4: 'Level 4: Lost Desert',
  5: 'Level 5: Misty Woods',
  6: 'Level 6: Coral Bay',
  7: 'Level 7: Shadow Swamp',
  8: 'Level 8: Black Castle',
};

const plotTexts = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
};

const specialRuleTexts = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
};

const levelName = (level) => levelNames[level];

const enemyName = (level = null) =>
  isSingleGame() ? enemyNames[0] : enemyNames[level];

const caption = (level = null) =>
  isSingleGame() ? captions[0] : captions[level];

const plotText = (level) => plotTexts[level];

const specialRuleText = (level) => specialRuleTexts[level];

export { levelName, enemyName, caption, plotText, specialRuleText };
