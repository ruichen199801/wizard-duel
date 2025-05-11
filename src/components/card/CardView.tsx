import { PlayerID } from 'boardgame.io';
import { JSX } from 'react';
import { CardId } from '../../model/cards';
import { cardBack, cardFront, cardPlaceholder } from '../../utils/assetUtils';

export const CARD_HEIGHT = 210;
export const CARD_WIDTH = 150;
export const CARD_SMALL_SCALE = 0.9;
export const CARD_MEDIUM_SCALE = 1.25;

export enum CardType {
  // Required props: cardType, cardId, cardIndex, handleCardClick
  front = 'front',

  // Required props: cardType, playerId
  back = 'back',

  // Required props: cardType, cardId, scale
  preview = 'preview',

  // Required props: cardType, playerId
  placeholder = 'placeholder',
}

interface CardViewProps {
  readonly cardType: CardType;
  readonly cardId?: CardId;
  readonly cardIndex?: number;
  readonly playerId?: PlayerID;
  readonly handleCardClick?: (index: number) => void;
  readonly scale?: number;
}

export const CardView = ({
  cardType,
  cardId,
  cardIndex,
  playerId,
  handleCardClick,
  scale = CARD_SMALL_SCALE,
}: CardViewProps) => {
  const frontImg = cardId && cardFront(cardId);
  const backImg = playerId && cardBack(playerId);
  const placeholderImg = playerId && cardPlaceholder(playerId);

  const height = CARD_HEIGHT * scale;
  const width = CARD_WIDTH * scale;

  const cardContent: Record<CardType, JSX.Element> = {
    [CardType.front]: (
      <img
        src={frontImg}
        alt='card front'
        data-testid='card-front'
        height={height}
        width={width}
        onClick={() =>
          handleCardClick &&
          cardIndex !== undefined &&
          handleCardClick(cardIndex)
        }
      />
    ),

    [CardType.back]: (
      <img
        src={backImg}
        alt='card back'
        data-testid='card-back'
        height={height}
        width={width}
      />
    ),

    [CardType.preview]: (
      <img
        src={frontImg}
        alt='card preview'
        data-testid='card-preview'
        height={height}
        width={width}
      />
    ),

    [CardType.placeholder]: (
      <img
        src={placeholderImg}
        alt='card placeholder'
        data-testid='card-placeholder'
        height={height}
        width={width}
      />
    ),
  };

  return <div>{cardContent[cardType]}</div>;
};
