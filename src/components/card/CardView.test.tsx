import { fireEvent, render, screen } from '@testing-library/react';
import { CardId } from '../../model/cards';
import {
  CARD_HEIGHT,
  CARD_SMALL_SCALE,
  CARD_WIDTH,
  CardType,
  CardView,
} from './CardView';

jest.mock('../../utils/assetUtils', () => ({
  cardFront: jest.fn(),
  cardBack: jest.fn(),
  cardPlaceholder: jest.fn(),
}));

const height = `${CARD_HEIGHT * CARD_SMALL_SCALE}`;
const width = `${CARD_WIDTH * CARD_SMALL_SCALE}`;

describe('CardView', () => {
  const cardId = CardId.Fireball1;
  const cardIndex = 1;

  it('renders front card with default size and triggers click handler', () => {
    const handleClick = jest.fn();
    render(
      <CardView
        cardType={CardType.front}
        cardId={cardId}
        cardIndex={cardIndex}
        handleCardClick={handleClick}
      />
    );
    const frontCard = screen.getByTestId('card-front');

    expect(frontCard).toBeInTheDocument();
    expect(frontCard).toHaveAttribute('height', height);
    expect(frontCard).toHaveAttribute('width', width);

    fireEvent.click(frontCard);
    expect(handleClick).toHaveBeenCalledWith(cardIndex);
  });

  it('renders front card and does not throw when no handler is passed', () => {
    render(
      <CardView
        cardType={CardType.front}
        cardId={cardId}
        cardIndex={cardIndex}
      />
    );
    expect(() => {
      fireEvent.click(screen.getByTestId('card-front'));
    }).not.toThrow();
  });

  it('renders back card', () => {
    render(<CardView cardType={CardType.back} playerId={'1'} />);
    expect(screen.getByTestId('card-back')).toBeInTheDocument();
  });

  it('renders preview card', () => {
    render(<CardView cardType={CardType.preview} cardId={cardId} />);
    expect(screen.getByTestId('card-preview')).toBeInTheDocument();
  });

  it('renders placeholder card', () => {
    render(<CardView cardType={CardType.placeholder} playerId={'0'} />);
    expect(screen.getByTestId('card-placeholder')).toBeInTheDocument();
  });
});
