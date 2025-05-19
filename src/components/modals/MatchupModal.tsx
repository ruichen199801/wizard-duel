import { FINAL_LEVEL } from '../../core/level/level';
import { getAvatarForLevel } from '../../utils/assetUtils';
import {
  getBattleInstructions,
  getBattleStartCaption,
  getEnemyName,
  getRuleByPower,
} from '../../utils/scriptUtils';
import {
  AVATAR_HEIGHT,
  AVATAR_SMALL_SCALE,
  AVATAR_WIDTH,
} from '../ui/PlayerStatsPanel';
import { Modal } from './Modal';

interface MatchupModalProps {
  readonly showMatchupModal: boolean;
  readonly setShowMatchupModal: React.Dispatch<React.SetStateAction<boolean>>;
  readonly playMusic: () => void;
  readonly level: string;
  readonly scale?: number;
}

export const MatchupModal = ({
  showMatchupModal,
  setShowMatchupModal,
  playMusic,
  level,
  scale = AVATAR_SMALL_SCALE,
}: MatchupModalProps) => {
  const playerAvatar = getAvatarForLevel('0', level);
  const enemyAvatar = getAvatarForLevel('1', level);

  const handleMatchupClose = () => {
    setShowMatchupModal(false);
    playMusic();
  };

  const height = AVATAR_HEIGHT * scale;
  const width = AVATAR_WIDTH * scale;

  const instructions = getBattleInstructions(level);
  const finalLevelRule = getRuleByPower();

  return (
    <Modal
      title={getBattleStartCaption(level)}
      isOpen={showMatchupModal}
      onBackdropClick={handleMatchupClose} // Close modal when clicking anywhere
      footer={
        <button type='button' className='btn btn-dark'>
          Continue
        </button>
      }
    >
      {
        <>
          <div className='d-flex justify-content-evenly align-items-center'>
            <div className='text-center'>
              <img
                src={playerAvatar}
                alt='avatar'
                height={height}
                width={width}
              />
              <p className='mt-2 fw-bold'>You</p>
            </div>

            <h5 className='mb-5'>VS</h5>

            <div className='text-center'>
              <img
                src={enemyAvatar}
                alt='avatar'
                height={height}
                width={width}
              />
              <p className='mt-2 fw-bold'>{getEnemyName(level)}</p>
            </div>
          </div>

          <div className='w-80 mx-auto mt-2'>
            <p>
              {instructions?.intro}
              <b>{instructions?.rule}</b>
              {instructions?.outro}
            </p>
          </div>

          {level === FINAL_LEVEL && finalLevelRule?.rule && (
            <div className='w-80 mx-auto'>
              <p>
                {finalLevelRule.intro}
                <b>{finalLevelRule.rule}</b>
              </p>
            </div>
          )}

          {instructions?.tips && (
            <div className='w-80 mx-auto'>
              <p className='fst-italic text-muted'>{instructions.tips}</p>
            </div>
          )}
        </>
      }
    </Modal>
  );
};
