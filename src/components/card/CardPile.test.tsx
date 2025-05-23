import { render, screen } from '@testing-library/react';
import { CardPile } from './CardPile';
import { CARD_HEIGHT, CARD_SMALL_SCALE, CARD_WIDTH } from './CardView';

jest.mock('../../utils/assetUtils', () => ({
  cardPile: 'card-pile.png',
}));

describe('CardPile', () => {
  it('renders card pile with default size', () => {
    render(<CardPile />);

    const cardPile = screen.getByTestId('card-pile');
    const height = `${CARD_HEIGHT * CARD_SMALL_SCALE}`;
    const width = `${CARD_WIDTH * CARD_SMALL_SCALE}`;

    expect(cardPile).toHaveAttribute('src', 'card-pile.png');
    expect(cardPile).toHaveAttribute('height', height);
    expect(cardPile).toHaveAttribute('width', width);
  });
});
