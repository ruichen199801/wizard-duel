import { Player } from '@core/models';
import { CardType, CardView } from './CardView';

export interface PlayerHandProps {
  readonly player: Player;
  readonly showEnemyHand: boolean;
  readonly handleCardClick?: (index: number) => void;
}

/**
 * @group Components
 */
export const PlayerHand = ({
  player,
  showEnemyHand,
  handleCardClick,
}: PlayerHandProps) => {
  return (
    <div className='d-flex justify-content-center'>
      {player.hand.map((card, index) => (
        <div key={index} className='me-2'>
          {showEnemyHand || player.id === '0' ? (
            <CardView
              cardType={CardType.front}
              cardId={card.id}
              cardIndex={index}
              handleCardClick={handleCardClick}
            />
          ) : (
            <CardView cardType={CardType.back} playerId='1' />
          )}
        </div>
      ))}
    </div>
  );
};
