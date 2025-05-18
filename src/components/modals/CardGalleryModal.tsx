import { click } from '../../utils/assetUtils';
import { CARD_HEIGHT, CARD_SMALL_SCALE, CARD_WIDTH } from '../card/CardView';

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
  if (!showCardGallery) {
    return null;
  }

  const handleCardGalleryClose = () => {
    setShowCardGallery(false);
    playAudio(click);
  };

  return (
    <>
      <div
        className='modal modal-lg fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className='modal-content bg-modal h-100'>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-bold'>
                Card Gallery
              </h4>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={handleCardGalleryClose}
              ></button>
            </div>

            <div className='modal-body'>
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
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
