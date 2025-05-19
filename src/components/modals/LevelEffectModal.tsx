import { FINAL_LEVEL } from '../../core/level/level';
import { click, getLocationForLevel } from '../../utils/assetUtils';
import {
  getBattleInstructions,
  getBattleStartCaption,
  getRuleByPower,
} from '../../utils/scriptUtils';
import { Modal } from './Modal';

interface LevelEffectModalProps {
  readonly showLevelEffectModal: boolean;
  readonly setShowLevelEffectModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly playAudio: (audio: string) => void;
  readonly level: string;
}

export const LevelEffectModal = ({
  showLevelEffectModal,
  setShowLevelEffectModal,
  playAudio,
  level,
}: LevelEffectModalProps) => {
  const handleLevelEffectClose = () => {
    setShowLevelEffectModal(false);
    playAudio(click);
  };

  const instructions = getBattleInstructions(level);
  const finalLevelRule = getRuleByPower();

  return (
    <Modal
      title={getBattleStartCaption(level)}
      isOpen={showLevelEffectModal}
      onClose={handleLevelEffectClose}
      scrollable={true}
    >
      <div className='text-center mb-4'>
        <img
          src={getLocationForLevel(level)}
          alt='location'
          className='w-80 levelfx-img'
        />
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
    </Modal>
  );
};
