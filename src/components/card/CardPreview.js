import { CARD_MEDIUM_SCALE, CardType } from '../../utils/constants';
import Card from './Card';

const CardPreview = ({ selectedCard }) => {
  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      {selectedCard === null ? (
        <Card
          cardType={CardType.placeholder}
          playerId='0'
          scale={CARD_MEDIUM_SCALE}
        />
      ) : (
        <Card
          cardType={CardType.preview}
          cardId={selectedCard.id}
          scale={CARD_MEDIUM_SCALE}
        />
      )}
    </div>
  );
};

export default CardPreview;
