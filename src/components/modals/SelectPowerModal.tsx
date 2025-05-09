import { useState } from 'react';

import {
  AVATAR_HEIGHT,
  AVATAR_SMALL_SCALE,
  AVATAR_WIDTH,
} from '@components/ui';
import { GameDifficulty, PowerClass } from '@core/power';
import { useImageLoader } from '@hooks';
import {
  click,
  getAvatarForLevel,
  powers,
  PowerSelectionProps,
  startLevel,
} from '@utils';

export interface SelectPowerModalProps {
  readonly showSelectPowerModal: boolean;
  readonly playAudio: (audio: string) => void;
}

/**
 * @group Components
 */
export const SelectPowerModal = ({
  showSelectPowerModal,
  playAudio,
}: SelectPowerModalProps) => {
  const [selectedPowerClass, setSelectedPowerClass] = useState<
    PowerClass | undefined
  >();

  const avatars: string[] = powers.map((power) =>
    getAvatarForLevel('1', power.level)
  );
  const { isLoading } = useImageLoader(avatars, 300);

  if (!showSelectPowerModal) {
    return null;
  }

  const handleSelectPower = (power: PowerSelectionProps) => {
    setSelectedPowerClass(power.class);
    playAudio(click);
  };

  const handleNextLevel = (difficulty: GameDifficulty) => {
    if (selectedPowerClass) {
      sessionStorage.setItem('power', selectedPowerClass);
      sessionStorage.setItem('difficulty', difficulty);
      startLevel();
    }
  };

  return (
    <>
      <div
        className='modal modal-lg fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content bg-modal'>
            <div className='modal-header border-0'>
              <h4 className='modal-title w-100 text-center font-bold'>
                Pick Your Power
              </h4>
            </div>

            <div className='modal-body'>
              {isLoading ? (
                <div className='d-flex justify-content-center align-items-center'>
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className='pwr-text pb-3'>
                    Take a power from a past opponent to use in the upcoming
                    boss fight, <b>but at a cost!</b>
                  </p>

                  <div className='d-flex justify-content-center'>
                    {powers.map((power) => (
                      <div
                        key={power.class}
                        className={`pwr-li text-center p-2 rounded ${
                          selectedPowerClass === power.class
                            ? `border pwr-border-${power.class} shadow`
                            : ''
                        }`}
                        onClick={() => handleSelectPower(power)}
                      >
                        <img
                          src={getAvatarForLevel('1', power.level)}
                          alt={power.name}
                          height={AVATAR_HEIGHT * AVATAR_SMALL_SCALE}
                          width={AVATAR_WIDTH * AVATAR_SMALL_SCALE}
                        />
                        <p className='mt-2 fw-bold'>{power.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className='modal-footer border-0 justify-content-end'>
              <button
                type='button'
                className='btn btn-dark'
                onClick={() => handleNextLevel(GameDifficulty.normal)}
                disabled={!selectedPowerClass}
              >
                Next Level: Normal
              </button>

              <button
                type='button'
                className='btn btn-dark'
                onClick={() => handleNextLevel(GameDifficulty.hard)}
                disabled={!selectedPowerClass}
              >
                Next Level: Hard
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
