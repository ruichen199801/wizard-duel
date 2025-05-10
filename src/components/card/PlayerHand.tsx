import { Player } from '../../model/player';
import { CardType, CardView } from './CardView';

interface PlayerHandProps {
  readonly player: Player;
  readonly showEnemyHand: boolean;
  readonly handleCardClick?: (index: number) => void;
}

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
