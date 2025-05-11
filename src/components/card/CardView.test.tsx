import { fireEvent, render, screen } from '@testing-library/react';
import { PlayerID } from 'boardgame.io';
import { CardId } from '../../model/cards';
import { CardType, CardView } from './CardView';

jest.mock('../../utils/assetUtils', () => ({
  cardFront: jest.fn((id: CardId) => `/mock/front/${id}`),
  cardBack: jest.fn((playerId: PlayerID) => `/mock/back/${playerId}`),
  cardPlaceholder: jest.fn(
    (playerId: PlayerID) => `/mock/placeholder/${playerId}`
  ),
}));

describe('CardView component', () => {
  const cardId = CardId.Fireball1;

  it('renders front card and triggers click handler', () => {
    const handleClick = jest.fn();
    render(
      <CardView
        cardType={CardType.front}
        cardId={cardId}
        cardIndex={1}
        handleCardClick={handleClick}
      />
    );
    fireEvent.click(screen.getByTestId('card-front'));
    expect(handleClick).toHaveBeenCalledWith(1);
  });

  it('renders front card and does not throw when no handler is passed', () => {
    render(
      <CardView cardType={CardType.front} cardId={cardId} cardIndex={1} />
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
