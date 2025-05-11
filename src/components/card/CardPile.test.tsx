import { render, screen } from '@testing-library/react';
import { CardPile } from './CardPile';
import { CARD_HEIGHT, CARD_SMALL_SCALE, CARD_WIDTH } from './CardView';

jest.mock('../../utils/assetUtils', () => ({
  cardPile: 'mock-card-pile.png',
}));

describe('CardPile component', () => {
  it('renders card pile image with default scale', () => {
    render(<CardPile />);

    const imgElement = screen.getByTestId('card-pile');
    const height = `${CARD_HEIGHT * CARD_SMALL_SCALE}`;
    const width = `${CARD_WIDTH * CARD_SMALL_SCALE}`;

    expect(imgElement).toHaveAttribute('src', 'mock-card-pile.png');
    expect(imgElement).toHaveAttribute('height', height);
    expect(imgElement).toHaveAttribute('width', width);
  });
});
