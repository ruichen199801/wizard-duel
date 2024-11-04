import { isSingleGame } from '../utils/utils';

const musicPrefix = 'music2';

const musicPaths = {
  0: `${musicPrefix}/wizard-duel.mp3`,
  1: `${musicPrefix}/royal-city.mp3`,
  2: `${musicPrefix}/lava-plains.mp3`,
  3: `${musicPrefix}/ice-crown.mp3`,
  4: `${musicPrefix}/lost-desert.mp3`,
  5: `${musicPrefix}/misty-forest.mp3`,
  6: `${musicPrefix}/coral-bay.mp3`,
  7: `${musicPrefix}/shadow-swamp.mp3`,
  8: `${musicPrefix}/black-castle.mp3`,
};

const BGM = (level = null) =>
  isSingleGame() ? musicPaths[1] : musicPaths[level];

const ED = musicPaths[0];

const _allMusic = Object.values(musicPaths);

export { BGM, ED, _allMusic };
