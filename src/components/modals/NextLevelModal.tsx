import { getNextCardsForLevel } from '../../utils/assetUtils';
import { startLevel } from '../../utils/commonUtils';
import { CARD_HEIGHT, CARD_WIDTH } from '../card/CardView';

interface NextLevelModalProps {
  readonly showNextLevelModal: boolean;
  readonly level: string;
}

export const NextLevelModal = ({
  showNextLevelModal,
  level,
}: NextLevelModalProps) => {
  if (!showNextLevelModal) {
    return null;
  }

  const nextLevelCards = getNextCardsForLevel(level);

  return (
    <>
      <div
        className='modal fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content bg-modal'>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-bold'>
                New Cards Unlocked
              </h4>
            </div>

            <div className='modal-body my-3'>
              <div className='d-flex justify-content-center gap-5'>
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
            </div>

            <div className='modal-footer border-0 justify-content-end'>
              <button
                type='button'
                className='btn btn-dark'
                onClick={startLevel}
              >
                Next Level
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
