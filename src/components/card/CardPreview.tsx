import { Card } from '../../core/data/cards';
import CardView, { CARD_MEDIUM_SCALE, CardType } from './CardView';

interface CardPreviewProps {
  readonly selectedCard?: Card;
  readonly scale?: number;
}

const CardPreview = ({
  selectedCard,
  scale = CARD_MEDIUM_SCALE,
}: CardPreviewProps) => {
  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      {selectedCard ? (
        <CardView
          cardType={CardType.preview}
          cardId={selectedCard.id}
          scale={scale}
        />
      ) : (
        <CardView cardType={CardType.placeholder} playerId='0' scale={scale} />
      )}
    </div>
  );
};

export default CardPreview;
