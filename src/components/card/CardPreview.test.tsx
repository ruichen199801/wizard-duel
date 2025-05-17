import { render, screen } from '@testing-library/react';
import { Fireball1 } from '../../model/cards';
import { CardPreview } from './CardPreview';

describe('CardPreview', () => {
  it('renders preview when a card is selected', () => {
    const selectedCard = Fireball1;
    render(<CardPreview selectedCard={selectedCard} />);
    expect(screen.getByTestId('card-preview')).toBeInTheDocument();
  });

  it('renders placeholder when no card is selected', () => {
    render(<CardPreview />);
    expect(screen.getByTestId('card-placeholder')).toBeInTheDocument();
  });
});
