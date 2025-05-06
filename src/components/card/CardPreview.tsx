import { Card as CardData } from '../../core/data/cards';
import Card, { CARD_MEDIUM_SCALE, CardType } from './Card';

interface CardPreviewProps {
  readonly selectedCard?: CardData;
  readonly scale?: number;
}

const CardPreview = ({
  selectedCard,
  scale = CARD_MEDIUM_SCALE,
}: CardPreviewProps) => {
  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      {selectedCard ? (
        <Card
          cardType={CardType.preview}
          cardId={selectedCard.id}
          scale={scale}
        />
      ) : (
        <Card cardType={CardType.placeholder} playerId='0' scale={scale} />
      )}
    </div>
  );
};

export default CardPreview;
