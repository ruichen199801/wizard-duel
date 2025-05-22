import { fireEvent, render, screen } from '@testing-library/react';
import { CardId } from '../../model/cards';
import { SelectCardModal } from './SelectCardModal';

describe('SelectCardModal', () => {
  const cardIdList = [CardId.Fireball1, CardId.Frost1];
  const handleSelectCard = jest.fn();

  it('does not render when showSelectCardModal is false', () => {
    render(
      <SelectCardModal
        cardIdList={cardIdList}
        handleSelectCard={handleSelectCard}
        showSelectCardModal={false}
      />
    );

    expect(screen.queryByText('Pick a Card')).not.toBeInTheDocument();
  });

  it('renders card images when showSelectCardModal is true', () => {
    render(
      <SelectCardModal
        cardIdList={cardIdList}
        handleSelectCard={handleSelectCard}
        showSelectCardModal={true}
      />
    );

    expect(screen.getByText('Pick a Card')).toBeInTheDocument();

    const images = screen.getAllByAltText('card front');
    expect(images).toHaveLength(cardIdList.length);
  });

  it('calls handleSelectCard when a card is clicked', () => {
    render(
      <SelectCardModal
        cardIdList={cardIdList}
        handleSelectCard={handleSelectCard}
        showSelectCardModal={true}
      />
    );

    const images = screen.getAllByAltText('card front');
    fireEvent.click(images[1]);

    expect(handleSelectCard).toHaveBeenCalledWith(CardId.Frost1);
  });
});
