import { random } from './random';
import { filterActions } from './filter';
import { resolveAction } from './resolver';

export const Algorithm = {
  // AI makes random moves.
  random: 'random',

  // AI makes sensible moves based on the board state but is unaware of level effects,
  // which player can take advantage of.
  sanity: 'sanity',
};

export const AI = (algo) => (G, ctx) => {
  const cards = G.players[1].hand;

  const strategies = {
    random: () => random(cards),
    sanity: () => {
      const actions = filterActions(cards, G, ctx);
      return actions.length === 1 ? actions[0] : resolveAction(actions, G);
    },
  };
  return cardToIndex((strategies[algo] || strategies.random)(), cards);
};

const cardToIndex = (card, hand) => hand.findIndex((c) => c.id === card.id);
