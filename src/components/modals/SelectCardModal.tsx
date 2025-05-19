import { CardId } from '../../model/cards';
import { cardFront } from '../../utils/assetUtils';
import { CARD_HEIGHT, CARD_WIDTH } from '../card/CardView';
import { Modal } from './Modal';

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
  return (
    <Modal title='Pick a Card' isOpen={showSelectCardModal}>
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
    </Modal>
  );
};
