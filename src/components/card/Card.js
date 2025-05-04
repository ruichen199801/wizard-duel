import { cardBack, cardFront, cardPlaceholder } from '../../utils/assets';
import {
  CARD_HEIGHT,
  CARD_SMALL_SCALE,
  CARD_WIDTH,
  CardType,
} from '../../utils/constants';

const Card = ({
  cardType = CardType.placeholder,
  cardId,
  cardIndex,
  playerId = '0',
  handleCardClick = () => {},
  scale = CARD_SMALL_SCALE,
}) => {
  const frontImg = cardFront(cardId);
  const backImg = cardBack(playerId);
  const placeholderImg = cardPlaceholder(playerId);

  const height = CARD_HEIGHT * scale;
  const width = CARD_WIDTH * scale;

  const cardContent = {
    [CardType.front]: (
      <img
        src={frontImg}
        alt='card front'
        height={height}
        width={width}
        onClick={() => handleCardClick(cardIndex)}
      />
    ),

    [CardType.back]: (
      <img src={backImg} alt='card back' height={height} width={width} />
    ),

    [CardType.preview]: (
      <img src={frontImg} alt='card preview' height={height} width={width} />
    ),

    [CardType.placeholder]: (
      <img
        src={placeholderImg}
        alt='card placeholder'
        height={height}
        width={width}
      />
    ),
  };

  return <div>{cardContent[cardType]}</div>;
};

export default Card;
