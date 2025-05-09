import { Card } from '../../core/models';

/**
 * Selects a random card.
 * This function should be used independently or embedded as fallback logic.
 *
 * @returns The selected card object.
 */
export const random = (cards: Card[]): Card =>
  cards[Math.floor(Math.random() * cards.length)];
