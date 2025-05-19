import { getNextCardsForLevel } from '../../utils/assetUtils';
import { startLevel } from '../../utils/commonUtils';
import { CARD_HEIGHT, CARD_WIDTH } from '../card/CardView';
import { Modal } from './Modal';

interface NextLevelModalProps {
  readonly showNextLevelModal: boolean;
  readonly level: string;
}

export const NextLevelModal = ({
  showNextLevelModal,
  level,
}: NextLevelModalProps) => {
  const nextLevelCards = getNextCardsForLevel(level);

  return (
    <Modal
      title='New Cards Unlocked'
      isOpen={showNextLevelModal}
      footer={
        <>
          <button type='button' className='btn btn-dark' onClick={startLevel}>
            Next Level
          </button>
        </>
      }
    >
      <div className='d-flex justify-content-center gap-5 my-3'>
        {nextLevelCards.map((image, index) => (
          <img
            key={index}
            src={image}
            alt='card front'
            height={CARD_HEIGHT}
            width={CARD_WIDTH}
          />
        ))}
      </div>
    </Modal>
  );
};
