import { FINAL_LEVEL } from '../../core/level';
import {
  click,
  getBattleInstructions,
  getBattleStartCaption,
  getLocationForLevel,
  getRuleByPower,
} from '../../utils';

export interface LevelEffectModalProps {
  readonly showLevelEffectModal: boolean;
  readonly setShowLevelEffectModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly playAudio: (audio: string) => void;
  readonly level: string;
}

/**
 * @group Components
 */
export const LevelEffectModal = ({
  showLevelEffectModal,
  setShowLevelEffectModal,
  playAudio,
  level,
}: LevelEffectModalProps) => {
  if (!showLevelEffectModal) {
    return null;
  }

  const handleLevelEffectClose = () => {
    setShowLevelEffectModal(false);
    playAudio(click);
  };

  const instructions = getBattleInstructions(level);
  const finalLevelRule = getRuleByPower();

  return (
    <>
      <div
        className='modal fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className='modal-content bg-modal'>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-bold'>
                {getBattleStartCaption(level)}
              </h4>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={handleLevelEffectClose}
              ></button>
            </div>

            <div className='modal-body'>
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
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
