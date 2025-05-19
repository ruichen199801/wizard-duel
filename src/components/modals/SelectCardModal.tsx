import { CardId } from '../../model/cards';
import { cardFront } from '../../utils/assetUtils';
import { CARD_HEIGHT, CARD_WIDTH } from '../card/CardView';

interface SelectCardModalProps {
  readonly cardIdList: CardId[];
  readonly handleSelectCard: (cardId: CardId) => void;
  readonly showSelectCardModal: boolean;
}

export const SelectCardModal = ({
  cardIdList,
  handleSelectCard,
  showSelectCardModal,
}: SelectCardModalProps) => {
  if (!showSelectCardModal) {
    return null;
  }

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
                Pick a Card
              </h4>
            </div>

            <div className='modal-body'>
              <div className='d-flex justify-content-center gap-5 my-3'>
                {cardIdList.map((cardId, index) => (
                  <img
                    key={index}
                    src={cardFront(cardId)}
                    alt='card front'
                    height={CARD_HEIGHT}
                    width={CARD_WIDTH}
                    onClick={() => handleSelectCard(cardId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
