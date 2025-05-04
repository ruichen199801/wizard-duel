import { GameDifficulty, PowerClass } from '../core/power/power';

const enemyNames: Record<string, string> = {
  1: 'Arden the Wise',
  2: 'G0B1N-X',
  3: 'Queen Shiro',
  4: 'Hassan Sarbah',
  5: 'Kai Stormbow',
  6: 'Mystfin',
  7: 'Zara Shadowbane',
  8: 'Nedra the Fallen',
};
const getEnemyName = (level = '1') => enemyNames[level];

const battleStartCaptions: Record<string, string> = {
  1: 'Level 1: Golden Citadel',
  2: 'Level 2: Kilaura Volcano',
  3: 'Level 3: Mount Everfrost',
  4: 'Level 4: Desert Xibalda',
  5: 'Level 5: Whisperwood',
  6: 'Level 6: Coral Bay',
  7: 'Level 7: Shadowland',
  8: 'Level 8: Bloodmoon Castle',
};
const getBattleStartCaption = (level = '1') => battleStartCaptions[level];

interface BattleInstrutionProps {
  readonly intro?: string;
  readonly rule?: string;
  readonly outro?: string;
  readonly tips?: string;
}

const battleInstrutions: Record<string, BattleInstrutionProps> = {
  1: {
    intro: `You are a young wizard on a quest to challenge the greatest sorcerers. Your adventure begins at the Citadel to face Arden the Wise.`,
  },

  2: {
    intro: `G0B1N-X is a goblin mage who LOVES playing with fire. `,
    rule: `Both players get random copies of fire cards in their starting hand.`,
  },

  3: {
    intro: `Mount Everfrost is shrouded in an eternal winter caused by Queen Shiro's frost magic. `,
    rule: `Damage cards may freeze the target (invalidate their next card).`,
  },

  4: {
    intro: `In the heart of Xibalda, you meet Hassan Sarbah, master of ancient sand spells. Disrupted by the desert wind, `,
    rule: `attacks will miss on certain turns.`,
    tips: `Red turn number means your attack will miss!`,
  },

  5: {
    intro: `Kai, a seasoned hunter, is one with the secrets of Whisperwood. `,
    rule: `Every turn, you’ll pick between two cards `,
    outro: `to find your way through the forest.`,
  },

  6: {
    intro: `Beneath the shimmering waves of Coral Bay, the tides shift in unpredictable ways. `,
    rule: `Every 11 turns, all buffs and debuffs are washed away.`,
    tips: `Red turn number means effects will clear this turn!`,
  },

  7: {
    intro: `Zara Shadowbane rules the cursed Shadowland, draining the life of all who enter. `,
    rule: `Non-damage cards cost 5 HP to play. HP can't drop below 1 in this way.`,
  },

  8: {
    intro: `Nedra plots to corrupt the world with dark magic. Defeat him in the final duel to save the world! `,
  },
};
const getBattleInstructions = (level = '1') => battleInstrutions[level];

interface PowerProps {
  readonly level: string;
  readonly name: string;
  readonly class: PowerClass;
  readonly ruleText: Record<GameDifficulty, string>;
}

const powers: PowerProps[] = [
  {
    level: '2',
    name: 'Pyro',
    class: PowerClass.pyro,
    ruleText: {
      [GameDifficulty.normal]:
        'you get a new fire hand at the end of your turns, but you lose after 40 turns.',
      [GameDifficulty.hard]:
        'you get a new fire hand at the end of your turns, but you lose after 30 turns.',
    },
  },

  {
    level: '3',
    name: 'Cryo',
    class: PowerClass.cryo,
    ruleText: {
      [GameDifficulty.normal]:
        "your attacks may freeze enemy, but you can't heal. Extra damage cards are added to the deck.",
      [GameDifficulty.hard]:
        "your attacks may freeze enemy, but you can't heal.",
    },
  },

  {
    level: '4',
    name: 'Psammo',
    class: PowerClass.psammo,
    ruleText: {
      [GameDifficulty.normal]:
        'your cards may turn into wishes at the start of your turns, but your attacks occasionally miss.',
      [GameDifficulty.hard]:
        'your cards may turn into wishes at the start of your turns, but your attacks have a moderate chance to miss.',
    },
  },

  {
    level: '5',
    name: 'Dentro',
    class: PowerClass.dentro,
    ruleText: {
      [GameDifficulty.normal]:
        'you pick a card instead of drawing, but enemy starts with 20 more HP.',
      [GameDifficulty.hard]:
        'you pick a card instead of drawing, but enemy starts with 40 more HP.',
    },
  },

  {
    level: '6',
    name: 'Hydro',
    class: PowerClass.hydro,
    ruleText: {
      [GameDifficulty.normal]:
        'you may gain a random buff at the end of your turns, but enemy has +3 Attack/+3 Shield permanently.',
      [GameDifficulty.hard]:
        'you may gain a random buff at the end of your turns, but enemy has +6 Attack/+6 Shield permanently.',
    },
  },

  {
    level: '7',
    name: 'Erebo',
    class: PowerClass.erebo,
    ruleText: {
      [GameDifficulty.normal]:
        'your damage cards reduce Max HP, but you start with 45 HP. HP swap is disabled.',
      [GameDifficulty.hard]:
        'your damage cards reduce Max HP, but you start with 35 HP. HP swap is disabled.',
    },
  },
];

const getRuleByPower = (): BattleInstrutionProps => {
  const power = powers.find(
    (power) => power.class === sessionStorage.getItem('power')
  );
  const difficulty =
    (sessionStorage.getItem('difficulty') as GameDifficulty) ||
    GameDifficulty.normal;
  return power
    ? {
        intro: `Embraced by the ${power.name} power, `,
        rule: `${power.ruleText[difficulty]}`,
      }
    : {};
};

export {
  getBattleInstructions,
  getBattleStartCaption,
  getEnemyName,
  getRuleByPower,
  powers,
};
