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

const battleStartInstrutions = {
  1: {
    intro: `Your journey as a budding wizard begins in the grand Royal City, where
      the Wise Scholar awaits to test your skill.`,
    levelRule: ``,
    outro: ``,
  },

  2: {
    intro: `You step into the blazing Lava Plains, where you will face the 
      Wild Firemancer's fiery wrath. `,
    levelRule: `You'll begin with random fireballs in your hand. `,
    outro: `Burn or be burned!`,
  },
};
const getBattleStartInstructions = (level = '1') =>
  battleStartInstrutions[level];

export {
  getLevelName,
  getEnemyName,
  getBattleStartCaption,
  getBattleStartInstructions,
};
