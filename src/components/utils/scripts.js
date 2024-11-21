const levelNames = {
  1: 'Royal City',
  2: 'Lava Plains',
};
const getLevelName = (level = '1') => levelNames[level];

const enemyNames = {
  1: 'Wise Scholar',
  2: 'Wild Firemancer',
};
const getEnemyName = (level = '1') => enemyNames[level];

const battleStartCaptions = {
  1: 'Level 1: Royal City',
  2: 'Level 2: Lava Plains',
};
const getBattleStartCaption = (level = '1') => battleStartCaptions[level];

export { getLevelName, getEnemyName, getBattleStartCaption };
