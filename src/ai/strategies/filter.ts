import { Ctx } from 'boardgame.io';
import { EffectGroupName } from '../../core/data/cardEffects';
import { Card, CardId, CardKeyword } from '../../core/data/cards';
import { getTarget, hasEffect, isUnique } from '../../core/effect/effectUtils';
import { WizardDuelState } from '../../core/game/game';
import { random } from './random';
import {
  REMOVE_BUFF_CARDS,
  REMOVE_DEBUFF_CARDS,
  USELESS_CARDS,
} from './strategyUtils';

type FilterRule = (card: Card, G: WizardDuelState, ctx: Ctx) => boolean;

interface Filter {
  readonly rule: FilterRule;
  readonly reason: string;
}

interface FilterResult {
  readonly result?: Card;
  readonly cardsAfter: Card[];
}

const filters: Filter[] = [
  {
    rule: (card, G, ctx) => !USELESS_CARDS.includes(card.id),
    reason: 'Filter useless cards',
  },
  {
    rule: (card, G, ctx) =>
      card.id !== CardId.Mutate || G.players[0].hp > G.players[1].hp,
    reason: 'Filter Mutate when AI has higher or equal HP',
  },
  {
    rule: (card, G, ctx) =>
      !REMOVE_DEBUFF_CARDS.includes(card.id) ||
      G.players[1].effects.some((e) => e.group === EffectGroupName.debuff),
    reason: 'Filter cards to remove debuff when AI has no debuff',
  },
  {
    rule: (card, G, ctx) =>
      !REMOVE_BUFF_CARDS.includes(card.id) ||
      G.players[0].effects.some((e) => e.group === EffectGroupName.buff),
    reason: 'Filter cards to remove buff when player has no buff',
  },
  {
    rule: (card, G, ctx) =>
      G.players[1].hp < Math.ceil(G.players[1].maxHp * 0.7) ||
      !card.keywords.includes(CardKeyword.sustain),
    reason: 'Filter healing cards when AI has high HP',
  },
  {
    rule: (card, G, ctx) => {
      return !card.effects.some((effect) => {
        const target = getTarget(ctx.currentPlayer, effect.target);
        return isUnique(effect) && hasEffect(G, target, effect.type);
      });
    },
    reason:
      'Filter unique effect cards when the same effect is already applied',
  },
];

const applyFilter = (
  cardsBefore: Card[],
  ruleFn: FilterRule,
  G: WizardDuelState,
  ctx: Ctx
): FilterResult => {
  const cardsAfter = cardsBefore.filter((card) => ruleFn(card, G, ctx));
  return onFilterEnd(cardsBefore, cardsAfter);
};

const onFilterEnd = (cardsBefore: Card[], cardsAfter: Card[]): FilterResult => {
  let result: Card | undefined; // Result after current filter

  if (cardsAfter.length === 1) {
    // Return the only action left and stop filtering
    result = cardsAfter[0];
  } else if (cardsAfter.length === 0) {
    // Fallback to Sandstorm || random(original cards) when no cards left
    result = cardsBefore.some((card) => card.id === CardId.Sandstorm)
      ? cardsBefore.find((card) => card.id === CardId.Sandstorm)!
      : random(cardsBefore);
  }
  // Result undefined means continue filtering

  return { result, cardsAfter };
};

/**
 * Filters unwanted card play from AI's hand based on a chain of rules.
 * The rules are ranked by priority, more prioritized rules get evaluated first.
 * This function should be invoked before resolveAction().
 *
 * @returns A list of filtered cards.
 */
export const filterActions = (
  cards: Card[],
  G: WizardDuelState,
  ctx: Ctx
): Card[] => {
  let cardsBefore = cards;
  for (const { rule } of filters) {
    const { result, cardsAfter }: FilterResult = applyFilter(
      cardsBefore,
      rule,
      G,
      ctx
    );
    if (result) {
      // console.log(`Exit from filter rule: ${reason}`);
      return [result];
    }
    cardsBefore = cardsAfter;
  }
  return cardsBefore;
};
