import { Player } from '../../core/data/player';
import CardView, { CardType } from './CardView';

interface PlayerHandProps {
  readonly player: Player;
  readonly showEnemyHand: boolean;
  readonly handleCardClick?: (index: number) => void;
}

const PlayerHand = ({
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

export default PlayerHand;
