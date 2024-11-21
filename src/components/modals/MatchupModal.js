import { smallScale, avatarHeight, avatarWidth } from '../utils/constants';
import { getAvatarForLevel } from '../utils/assetPaths';
import { getEnemyName, getBattleStartCaption } from '../utils/scripts';

const MatchupModal = ({
  showMatchupModal,
  setShowMatchupModal,
  playMusic,
  level,
  scale = smallScale,
}) => {
  if (!showMatchupModal) {
    return null;
  }

  const handleMatchupClose = () => {
    setShowMatchupModal(false);
    playMusic();
  };

  const height = avatarHeight * scale;
  const width = avatarWidth * scale;

  return (
    <>
      <div
        className='modal fade show d-block'
        data-bs-keyboard='false'
        tabIndex='-1'
        onClick={handleMatchupClose} // Close modal when clicking anywhere
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content bg-modal'>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-lora-bold'>
                {getBattleStartCaption(level)}
              </h4>
            </div>

            <div className='modal-body'>
              <div className='d-flex justify-content-evenly align-items-center'>
                <div className='text-center'>
                  <img
                    src={getAvatarForLevel('0', level)}
                    alt='avatar'
                    height={height}
                    width={width}
                  />
                  <p className='mt-2'>You</p>
                </div>

                <h5 className='mb-5'>VS</h5>

                <div className='text-center'>
                  <img
                    src={getAvatarForLevel('1', level)}
                    alt='avatar'
                    height={height}
                    width={width}
                  />
                  <p className='mt-2'>{getEnemyName(level)}</p>
                </div>
              </div>
            </div>

            <div className='modal-footer border-0 justify-content-end'>
              <button type='button' className='btn btn-dark'>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};

export default MatchupModal;
