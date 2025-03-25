const enemyNames = {
  1: 'Arden the Wise',
  2: 'G0B1N-X',
  3: 'Queen Shiro',
  4: 'Hassan Sarbah',
  5: 'Kai Stormbow',
  6: 'Mystfin',
  7: 'Zara Shadowbane',
};
const getEnemyName = (level = '1') => enemyNames[level];

const battleStartCaptions = {
  1: 'Level 1: The Citadel',
  2: 'Level 2: Kilaura Volcano',
  3: 'Level 3: Mount Everfrost',
  4: 'Level 4: Desert Xibalda',
  5: 'Level 5: Whisperwood',
  6: 'Level 6: Coral Bay',
  7: 'Level 7: Shadowland',
};
const getBattleStartCaption = (level = '1') => battleStartCaptions[level];

const battleStartInstrutions = {
  1: {
    intro: `You are a young wizard on a quest to challenge the greatest sorcerers. Your adventure begins at the Citadel to face Arden the Wise.`,
    levelRule: ``,
    outro: ``,
  },

  2: {
    intro: `G0B1N-X is a mischievous goblin mage who LOVES playing with fire. `,
    levelRule: `Both players get random copies of fire cards in their starting hand.`,
    outro: ``,
  },

  3: {
    intro: `Mount Everfrost is shrouded in an eternal winter caused by Queen Shiro's frost magic. `,
    levelRule: `Damage cards have a chance to freeze the target.`,
    outro: ``,
  },

  4: {
    intro: `In the heart of Xibalda, you meet Hassan Sarbah, master of ancient sand spells. Disrupted by the desert wind, `,
    levelRule: `attacks will miss on certain turns.`,
    outro: ``,
  },

  5: {
    intro: `Kai, a seasoned hunter, is one with the secrets of Whisperwood. `,
    levelRule: `Every turn, you’ll pick between two cards `,
    outro: `to find your way through the forest.`,
  },

  6: {
    intro: `Beneath the shimmering waves of Coral Bay, the tides shift in unpredictable ways. `,
    levelRule: `Every 11 turns, all buffs and debuffs are washed away.`,
    outro: ``,
  },

  7: {
    intro: `The cursed Shadowland drains the life of all who enter. `,
    levelRule: `Non-damage cards cost 5 HP to play. HP can’t drop below 1 in this way.`,
    outro: ``,
  },
};
const getBattleStartInstructions = (level = '1') =>
  battleStartInstrutions[level];

export { getEnemyName, getBattleStartCaption, getBattleStartInstructions };
