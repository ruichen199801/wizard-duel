import { cardPile } from '@utils';
import { CARD_HEIGHT, CARD_SMALL_SCALE, CARD_WIDTH } from './CardView';

export interface CardPileProps {
  readonly scale?: number;
}

/**
 * @group Components
 */
export const CardPile = ({ scale = CARD_SMALL_SCALE }: CardPileProps) => {
  const height = CARD_HEIGHT * scale;
  const width = CARD_WIDTH * scale;

  return (
    <div className='d-flex justify-content-end align-items-center h-100'>
      <img
        src={cardPile}
        alt='card pile'
        height={height}
        width={width}
        data-bs-toggle='tooltip'
        data-bs-placement='bottom'
        data-bs-title='Deck'
      />
    </div>
  );
};
