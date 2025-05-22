import { PlayerID } from 'boardgame.io';
import { CardId, getCardCount } from '../model/cards';

const imgPrefix = 'images';
const avatarPrefix = `${imgPrefix}/avatars`;
const cardPrefix = `${imgPrefix}/cards`;
const locationPrefix = `${imgPrefix}/locations`;
const animationPrefix = 'animations';
const audioPrefix = 'audio';
const musicPrefix = 'music';

// IMAGES FILES

const avatarPaths: Record<string, string> = {
  0: `${avatarPrefix}/player.png`,
  1: `${avatarPrefix}/wise-scholar.png`,
  2: `${avatarPrefix}/wild-firemancer.png`,
  3: `${avatarPrefix}/ice-queen.png`,
  4: `${avatarPrefix}/traveling-merchant.png`,
  5: `${avatarPrefix}/forest-ranger.png`,
  6: `${avatarPrefix}/murloc-oracle.png`,
  7: `${avatarPrefix}/crimson-witch.png`,
  8: `${avatarPrefix}/dark-knight.png`,
};
const getAvatarForLevel = (playerId: PlayerID, level = '1') => {
  return playerId === '0' ? avatarPaths[0] : avatarPaths[level];
};

const locationPaths: Record<string, string> = {
  1: `${locationPrefix}/city.png`,
  2: `${locationPrefix}/volcano.png`,
  3: `${locationPrefix}/snow-mountain.png`,
  4: `${locationPrefix}/desert.png`,
  5: `${locationPrefix}/forest.png`,
  6: `${locationPrefix}/ocean.png`,
  7: `${locationPrefix}/marsh.png`,
  8: `${locationPrefix}/castle.png`,
};
const getLocationForLevel = (level = '1') => locationPaths[level];

const icon: Record<string, string> = {
  hp: `${imgPrefix}/icons/hp.svg`,
  atk: `${imgPrefix}/icons/atk.svg`,
  def: `${imgPrefix}/icons/def.svg`,
  effect: `${imgPrefix}/icons/effect.svg`,
  log: `${imgPrefix}/icons/log.svg`,
  settings: `${imgPrefix}/icons/settings.svg`,
  help: `${imgPrefix}/icons/help.svg`,
  buff: `${imgPrefix}/icons/buff.svg`,
  debuff: `${imgPrefix}/icons/debuff.svg`,
  ice: `${imgPrefix}/icons/ice.svg`,
  level: `${imgPrefix}/icons/level.svg`,
  turn: `${imgPrefix}/icons/turn.svg`,
  deck: `${imgPrefix}/icons/deck.svg`,
};

const cardFront = (cardId: CardId) => `${cardPrefix}/front/${cardId}.png`;
const cardBack = (playerId: PlayerID) => `${cardPrefix}/back/${playerId}.png`;
const cardPlaceholder = (playerId: PlayerID) =>
  `${cardPrefix}/placeholder/${playerId}.png`;
const cardPile = `${cardPrefix}/pile.png`;

const cardFronts = Array.from(
  { length: getCardCount() },
  (_, cardId) => `${cardPrefix}/front/${cardId}.png`
);

const nextLevelCards: Record<string, string[]> = {
  1: [cardFront(CardId.Flame), cardFront(CardId.Resurrect)],
  2: [cardFront(CardId.Petrify), cardFront(CardId.Aura)],
  3: [cardFront(CardId.Sandstorm), cardFront(CardId.Wish1)],
  4: [cardFront(CardId.Mutate), cardFront(CardId.Ambush)],
  5: [cardFront(CardId.Vision), cardFront(CardId.Tide)],
  6: [cardFront(CardId.Revenge), cardFront(CardId.Poison)],
  7: [],
  8: [],
};
const getNextCardsForLevel = (level = '1') => nextLevelCards[level];

// ANIMATION FILES

export enum Animation {
  fireball = 'fireball',
  freeze = 'freeze',
  thunder = 'thunder',
  heal = 'heal',
  sword = 'sword',
  shield = 'shield',
  ghostBounce = 'ghost-bounce',
  skull = 'skull',
  hammer = 'hammer',
  bloodStrike = 'blood-strike',
  bloodBurst = 'blood-burst',
  starBounce = 'star-bounce',
  starStrike = 'star-strike',
  starImpact = 'star-impact',
  slimeSwirl = 'slime-swirl',
  slimeStrike = 'slime-strike',
  waterExplode = 'water-explode',
  bloodCrossStrike = 'blood-cross-strike',
  slimeSplash = 'slime-splash',
}

export interface AnimationProps {
  readonly type: Animation;
  readonly path: string;
  readonly timeout: number;
}

const getAnimationPath = (type: string) => `${animationPrefix}/${type}.gif`;
const createAnimationProps = (
  type: Animation,
  timeout: number
): AnimationProps => ({
  type,
  path: getAnimationPath(type),
  timeout,
});

const animationData: Record<Animation, AnimationProps> = {
  [Animation.fireball]: createAnimationProps(Animation.fireball, 500),
  [Animation.freeze]: createAnimationProps(Animation.freeze, 1000),
  [Animation.thunder]: createAnimationProps(Animation.thunder, 1000),
  [Animation.heal]: createAnimationProps(Animation.heal, 500),
  [Animation.sword]: createAnimationProps(Animation.sword, 1000),
  [Animation.shield]: createAnimationProps(Animation.shield, 1200),
  [Animation.ghostBounce]: createAnimationProps(Animation.ghostBounce, 1200),
  [Animation.skull]: createAnimationProps(Animation.skull, 1800),
  [Animation.hammer]: createAnimationProps(Animation.hammer, 1000),
  [Animation.bloodStrike]: createAnimationProps(Animation.bloodStrike, 1000),
  [Animation.bloodBurst]: createAnimationProps(Animation.bloodBurst, 1000),
  [Animation.starBounce]: createAnimationProps(Animation.starBounce, 1200),
  [Animation.starStrike]: createAnimationProps(Animation.starStrike, 1000),
  [Animation.starImpact]: createAnimationProps(Animation.starImpact, 600),
  [Animation.slimeSwirl]: createAnimationProps(Animation.slimeSwirl, 1000),
  [Animation.slimeStrike]: createAnimationProps(Animation.slimeStrike, 600),
  [Animation.waterExplode]: createAnimationProps(Animation.waterExplode, 800),
  [Animation.bloodCrossStrike]: createAnimationProps(
    Animation.bloodCrossStrike,
    800
  ),
  [Animation.slimeSplash]: createAnimationProps(Animation.slimeSplash, 500),
};

// Animation target is separated from effect target, as animation is applied per card but a card can have multiple effects.
// This enum can also be reused for level or game animations.
export enum AnimationTarget {
  enemy = 'enemy',
  self = 'self',
  both = 'both',
  none = 'none',
}

interface CardAnimationProps {
  readonly type: Animation;
  readonly target: AnimationTarget;
}

const cardAnimation: Record<CardId, CardAnimationProps | undefined> = {
  [CardId.Fireball1]: {
    type: Animation.fireball,
    target: AnimationTarget.enemy,
  },
  [CardId.Fireball2]: {
    type: Animation.fireball,
    target: AnimationTarget.enemy,
  },
  [CardId.Fireball3]: {
    type: Animation.fireball,
    target: AnimationTarget.enemy,
  },
  [CardId.Frost1]: {
    type: Animation.freeze,
    target: AnimationTarget.enemy,
  },
  [CardId.Frost2]: {
    type: Animation.freeze,
    target: AnimationTarget.enemy,
  },
  [CardId.Frost3]: {
    type: Animation.freeze,
    target: AnimationTarget.enemy,
  },
  [CardId.Thunder1]: {
    type: Animation.thunder,
    target: AnimationTarget.enemy,
  },
  [CardId.Thunder2]: {
    type: Animation.thunder,
    target: AnimationTarget.enemy,
  },
  [CardId.Thunder3]: {
    type: Animation.thunder,
    target: AnimationTarget.enemy,
  },
  [CardId.Heal1]: {
    type: Animation.heal,
    target: AnimationTarget.self,
  },
  [CardId.Heal2]: {
    type: Animation.heal,
    target: AnimationTarget.self,
  },
  [CardId.Heal3]: {
    type: Animation.heal,
    target: AnimationTarget.self,
  },
  [CardId.Blessing]: {
    type: Animation.sword,
    target: AnimationTarget.self,
  },
  [CardId.Armor]: {
    type: Animation.shield,
    target: AnimationTarget.self,
  },
  [CardId.Weaken]: {
    type: Animation.ghostBounce,
    target: AnimationTarget.enemy,
  },
  [CardId.Curse]: {
    type: Animation.skull,
    target: AnimationTarget.enemy,
  },
  [CardId.Purify]: {
    type: Animation.hammer,
    target: AnimationTarget.self,
  },
  [CardId.Dispel]: {
    type: Animation.bloodStrike,
    target: AnimationTarget.enemy,
  },
  [CardId.Enrage]: {
    type: Animation.sword,
    target: AnimationTarget.self,
  },
  [CardId.Block]: {
    type: Animation.shield,
    target: AnimationTarget.self,
  },
  [CardId.Flame]: {
    type: Animation.fireball,
    target: AnimationTarget.enemy,
  },
  [CardId.Resurrect]: {
    type: Animation.bloodBurst,
    target: AnimationTarget.self,
  },
  [CardId.Petrify]: {
    type: Animation.freeze,
    target: AnimationTarget.enemy,
  },
  [CardId.Aura]: {
    type: Animation.heal,
    target: AnimationTarget.self,
  },
  [CardId.Sandstorm]: undefined,
  [CardId.Wish1]: undefined,
  [CardId.Wish2]: {
    type: Animation.starBounce,
    target: AnimationTarget.enemy,
  },
  [CardId.Wish3]: {
    type: Animation.starStrike,
    target: AnimationTarget.self,
  },
  [CardId.Wish4]: {
    type: Animation.starBounce,
    target: AnimationTarget.self,
  },
  [CardId.Wish5]: {
    type: Animation.starImpact,
    target: AnimationTarget.enemy,
  },
  [CardId.Mutate]: {
    type: Animation.slimeSwirl,
    target: AnimationTarget.both,
  },
  [CardId.Ambush]: {
    type: Animation.slimeStrike,
    target: AnimationTarget.enemy,
  },
  [CardId.Vision]: undefined,
  [CardId.Tide]: {
    type: Animation.waterExplode,
    target: AnimationTarget.enemy,
  },
  [CardId.Revenge]: {
    type: Animation.bloodCrossStrike,
    target: AnimationTarget.self,
  },
  [CardId.Poison]: {
    type: Animation.slimeSplash,
    target: AnimationTarget.enemy,
  },
};

const getAnimationDataForCard = (cardId: CardId): AnimationProps | undefined =>
  animationData[cardAnimation[cardId]?.type as Animation];

// Same animation can be reused to different targets, hence separating it from animationData object
const getAnimationTargetForCard = (
  cardId: CardId
): AnimationTarget | undefined =>
  cardAnimation[cardId]?.target as AnimationTarget;

// AUDIO FILES

const cardAudioType: Record<CardId, string> = {
  [CardId.Fireball1]: 'fireball',
  [CardId.Fireball2]: 'fireball',
  [CardId.Fireball3]: 'fireball',
  [CardId.Frost1]: 'freeze',
  [CardId.Frost2]: 'freeze',
  [CardId.Frost3]: 'freeze',
  [CardId.Thunder1]: 'thunder',
  [CardId.Thunder2]: 'thunder',
  [CardId.Thunder3]: 'thunder',
  [CardId.Heal1]: 'heal',
  [CardId.Heal2]: 'heal',
  [CardId.Heal3]: 'heal',
  [CardId.Blessing]: 'sword',
  [CardId.Armor]: 'shield',
  [CardId.Weaken]: 'weaken',
  [CardId.Curse]: 'weaken',
  [CardId.Purify]: 'magic',
  [CardId.Dispel]: 'magic',
  [CardId.Enrage]: 'sword',
  [CardId.Block]: 'shield',
  [CardId.Flame]: 'fireball',
  [CardId.Resurrect]: 'magic',
  [CardId.Petrify]: 'freeze',
  [CardId.Aura]: 'heal',
  [CardId.Sandstorm]: 'wind',
  [CardId.Wish1]: 'magic',
  [CardId.Wish2]: 'freeze',
  [CardId.Wish3]: 'sword',
  [CardId.Wish4]: 'heal',
  [CardId.Wish5]: 'fireball',
  [CardId.Mutate]: 'heal',
  [CardId.Ambush]: 'arrow',
  [CardId.Vision]: 'waves',
  [CardId.Tide]: 'waves',
  [CardId.Revenge]: 'roar',
  [CardId.Poison]: 'potion',
};
const cardAudio = (cardId: CardId) =>
  `${audioPrefix}/${cardAudioType[cardId]}.mp3`;

const click = `${audioPrefix}/click.mp3`;
const victory = `${audioPrefix}/victory.mp3`;
const defeat = `${audioPrefix}/defeat.mp3`;
const miss = `${audioPrefix}/wind.mp3`; // reuse the wind sound effect
const defrost = `${audioPrefix}/freeze.mp3`; // reuse the freeze sound effect
const cleanse = `${audioPrefix}/waves.mp3`; // reuse the waves sound effect
const potion = `${audioPrefix}/potion.mp3`; // reuse the potion sound effect

// MUSIC FILES

const musicPaths: Record<string, string> = {
  1: `${musicPrefix}/royal-city.mp3`,
  2: `${musicPrefix}/lava-plains.mp3`,
  3: `${musicPrefix}/ice-crown.mp3`,
  4: `${musicPrefix}/lost-desert.mp3`,
  5: `${musicPrefix}/misty-woods.mp3`,
  6: `${musicPrefix}/coral-bay.mp3`,
  7: `${musicPrefix}/shadow-swamp.mp3`,
  8: `${musicPrefix}/black-castle.mp3`,
};
const getMusicForLevel = (level = '1') => musicPaths[level];

// ALL FILES FOR PRELOAD

const IMAGES = [
  ...Object.values(avatarPaths),
  ...Object.values(locationPaths),
  ...Object.values(icon),
  ...cardFronts,
  `${cardPrefix}/back/0.png`,
  `${cardPrefix}/back/1.png`,
  `${cardPrefix}/placeholder/0.png`,
  `${cardPrefix}/placeholder/1.png`,
  cardPile,
];
const ANIMATION = Object.values(animationData).map((data) => data.path);
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
  `${audioPrefix}/wind.mp3`,
  `${audioPrefix}/arrow.mp3`,
  `${audioPrefix}/waves.mp3`,
  `${audioPrefix}/roar.mp3`,
  `${audioPrefix}/potion.mp3`,
];
const MUSIC = [...Object.values(musicPaths)];

export {
  // IMAGES FILES
  getAvatarForLevel,
  getLocationForLevel,
  getNextCardsForLevel,
  icon,
  cardFront,
  cardBack,
  cardPlaceholder,
  cardPile,
  cardFronts,

  // ANIMATION FILES
  getAnimationDataForCard,
  getAnimationTargetForCard,

  // AUDIO FILES
  cardAudio,
  click,
  victory,
  defeat,
  miss,
  defrost,
  cleanse,
  potion,

  // MUSIC FILES
  getMusicForLevel,

  // ALL FILES FOR PRELOAD
  IMAGES,
  ANIMATION,
  AUDIO,
  MUSIC,
};
