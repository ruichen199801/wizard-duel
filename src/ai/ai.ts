import { Ctx } from 'boardgame.io';
import { Card } from '../model/cards';
import { WizardDuelState } from '../model/shared';
import { filterActions } from './strategies/filter';
import { random } from './strategies/random';
import { resolveAction } from './strategies/resolver';

export enum Strategy {
  // AI makes random moves.
  random = 'random',

  // AI filters bad moves, but is not able to make optimal moves.
  filter = 'filter',

  // AI makes optimal moves based on the board state but is unaware of level effects.
  optimal = 'optimal',
}

type StrategyHandler = () => Card;

/**
 * Encapsulates the decision-making logic for the AI to play a card.
 * Example usage: const selectedIndex = AI(Strategy.filter)(G, ctx);
 *
 * @returns The index of the card to play from the AI's hand.
 */
export const AI =
  (strategy: Strategy) =>
  (G: WizardDuelState, ctx: Ctx): number => {
    const cards = G.players[1].hand;

    const strategies: Record<Strategy, StrategyHandler> = {
      [Strategy.random]: () => random(cards),

      [Strategy.filter]: () => random(filterActions(cards, G, ctx)),

      [Strategy.optimal]: () => {
        const actions = filterActions(cards, G, ctx);
        return actions.length === 1 ? actions[0] : resolveAction(actions, G);
      },
    };
    return cardToIndex((strategies[strategy] || strategies.random)(), cards);
  };

const cardToIndex = (card: Card, hand: Card[]): number =>
  hand.findIndex((c) => c.id === card.id);
