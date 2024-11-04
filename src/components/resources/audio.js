const audioPrefix = 'audio';

const cardAudioTypes = {
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

const cardAudio = (cardId) => `${audioPrefix}/${cardAudioTypes[cardId]}.mp3`;

const click = `${audioPrefix}/click.mp3`;

const victory = `${audioPrefix}/victory.mp3`;

const defeat = `${audioPrefix}/defeat.mp3`;

const _allAudio = [
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

export { cardAudio, click, victory, defeat, _allAudio };
