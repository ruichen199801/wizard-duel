import { Card } from '../../model/cards';
import { CARD_MEDIUM_SCALE, CardType, CardView } from './CardView';

interface CardPreviewProps {
  readonly selectedCard?: Card;
  readonly scale?: number;
}

export const CardPreview = ({
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
