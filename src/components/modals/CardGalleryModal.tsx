import { click } from '../../utils/assetUtils';
import { CARD_HEIGHT, CARD_SMALL_SCALE, CARD_WIDTH } from '../card/CardView';
import { BaseModal } from './BaseModal';

interface CardGalleryModalProps {
  readonly showCardGallery: boolean;
  readonly setShowCardGallery: React.Dispatch<React.SetStateAction<boolean>>;
  readonly cardImages: string[];
  readonly playAudio: (audio: string) => void;
}

export const CardGalleryModal = ({
  showCardGallery,
  setShowCardGallery,
  cardImages,
  playAudio,
}: CardGalleryModalProps) => {
  const handleCardGalleryClose = () => {
    setShowCardGallery(false);
    playAudio(click);
  };

  return (
    <BaseModal
      title='Card Gallery'
      isOpen={showCardGallery}
      onClose={handleCardGalleryClose}
      modalSizeClass='modal-lg'
      heightClass='h-100'
    >
      {
        <div className='container'>
          <div className='row row-cols-5 g-3'>
            {cardImages.map((image, index) => (
              <div className='col' key={index}>
                <img
                  src={image}
                  alt='card front'
                  height={CARD_HEIGHT * CARD_SMALL_SCALE}
                  width={CARD_WIDTH * CARD_SMALL_SCALE}
                />
              </div>
            ))}
          </div>
        </div>
      }
    </BaseModal>
  );
};
