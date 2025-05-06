import { Player } from '../../core/data/player';
import Card, { CardType } from './Card';

interface PlayerHandProps {
  readonly player: Player;
  readonly showEnemyHand: boolean;
  readonly handleCardClick?: (index: number) => Promise<void>;
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
            <Card
              cardType={CardType.front}
              cardId={card.id}
              cardIndex={index}
              handleCardClick={handleCardClick}
            />
          ) : (
            <Card cardType={CardType.back} playerId='1' />
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
