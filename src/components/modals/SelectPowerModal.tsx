import { useState } from 'react';
import { GameDifficulty, PowerClass } from '../../core/power/power';
import { click, getAvatarForLevel } from '../../utils/assetUtils';
import { startLevel } from '../../utils/commonUtils';
import { powers, PowerSelectionProps } from '../../utils/scriptUtils';
import {
  AVATAR_HEIGHT,
  AVATAR_SMALL_SCALE,
  AVATAR_WIDTH,
} from '../ui/PlayerStatsPanel';
import { Modal } from './Modal';

interface SelectPowerModalProps {
  readonly showSelectPowerModal: boolean;
  readonly playAudio: (audio: string) => void;
}

export const SelectPowerModal = ({
  showSelectPowerModal,
  playAudio,
}: SelectPowerModalProps) => {
  const [selectedPowerClass, setSelectedPowerClass] = useState<
    PowerClass | undefined
  >();

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
    <Modal
      title='Pick Your Power'
      isOpen={showSelectPowerModal}
      modalSizeClass='modal-lg'
      footer={
        <>
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
        </>
      }
    >
      {
        <>
          <p className='pwr-text pb-3'>
            Take a power from a past opponent to use in the upcoming boss fight,{' '}
            <b>but at a cost!</b>
          </p>

          <div className='d-flex justify-content-center'>
            {powers.map((power) => (
              <div
                key={power.class}
                data-testid={`pwr-${power.class}`}
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
      }
    </Modal>
  );
};
