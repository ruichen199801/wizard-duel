import { useState } from 'react';
import { Strategy } from '../../ai/ai';
import { FINAL_LEVEL, PRE_FINAL_LEVEL } from '../../core/level/level';
import { click } from '../../utils/assetUtils';
import { exitToMenu, jumpToLevel, resetGame } from '../../utils/commonUtils';
import { ConfirmModal } from './ConfirmModal';
import { Modal } from './Modal';

interface SettingsModalProps {
  readonly showSettingsModal: boolean;
  readonly setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  readonly playAudio: (audio: string) => void;
  readonly toggleAudioMute: () => void;
  readonly isAudioMuted: boolean;
  readonly toggleMusic: () => void;
  readonly isMusicMuted: boolean;
  readonly showGameStats: boolean;
  readonly setShowGameStats: React.Dispatch<React.SetStateAction<boolean>>;
  readonly showEffectStack: boolean;
  readonly setShowEffectStack: React.Dispatch<React.SetStateAction<boolean>>;
  readonly aiStrategy: Strategy;
  readonly setAiStrategy: React.Dispatch<React.SetStateAction<Strategy>>;
  readonly level: string;
}

export const SettingsModal = ({
  showSettingsModal,
  setShowSettingsModal,
  playAudio,
  toggleAudioMute,
  isAudioMuted,
  toggleMusic,
  isMusicMuted,
  showGameStats,
  setShowGameStats,
  showEffectStack,
  setShowEffectStack,
  aiStrategy,
  setAiStrategy,
  level,
}: SettingsModalProps) => {
  const [headerClickCount, setHeaderClickCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | undefined>();

  const showJumpLevelOption =
    headerClickCount >= 6 && level !== PRE_FINAL_LEVEL && level !== FINAL_LEVEL;

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
    playAudio(click);
  };

  const toggleGameStatsDisplay = () => {
    setShowGameStats((prevState) => !prevState);
  };

  const toggleEffectStackDisplay = () => {
    setShowEffectStack((prevState) => !prevState);
  };

  const handleAiDifficultyChange = () => {
    setAiStrategy((prevState) =>
      prevState === Strategy.filter ? Strategy.optimal : Strategy.filter
    );
  };

  const handleHeaderClick = () => {
    setHeaderClickCount((prev) => prev + 1);
  };

  const handleResetGame = () => {
    setConfirmAction('resetGame');
    setShowConfirmModal(true);
    setShowSettingsModal(false);
  };

  const handleExitToMenu = () => {
    setConfirmAction('exitToMenu');
    setShowConfirmModal(true);
    setShowSettingsModal(false);
  };

  const handleConfirm = () => {
    if (confirmAction === 'resetGame') {
      resetGame();
    } else if (confirmAction === 'exitToMenu') {
      exitToMenu();
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(undefined);
    setShowSettingsModal(true);
  };

  return (
    <>
      <Modal
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        modalSizeClass='modal-sm'
        customHeader={
          <h4
            className='modal-title w-100 text-center font-bold ms-3'
            onClick={handleHeaderClick}
          >
            Settings
          </h4>
        }
      >
        <div className='d-flex flex-column align-items-center'>
          <div className='btn-group-vertical btn-width mb-3'>
            <button
              type='button'
              className='btn btn-dark mb-1'
              onClick={handleAiDifficultyChange}
            >
              {aiStrategy === Strategy.filter
                ? 'AI Difficulty: Easy'
                : 'AI Difficulty: Normal'}
            </button>
          </div>

          <div className='btn-group-vertical btn-width mb-3'>
            <button
              type='button'
              className='btn btn-dark mb-1'
              onClick={toggleMusic}
            >
              {isMusicMuted ? 'Unmute Game Music' : 'Mute Game Music'}
            </button>
            <button
              type='button'
              className='btn btn-dark'
              onClick={toggleAudioMute}
            >
              {isAudioMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
            </button>
          </div>

          <div className='btn-group-vertical btn-width mb-3'>
            <button
              type='button'
              className='btn btn-dark mb-1'
              onClick={toggleEffectStackDisplay}
            >
              {showEffectStack
                ? 'Hide Buffs & Debuffs'
                : 'Show Buffs & Debuffs'}
            </button>
            <button
              type='button'
              className='btn btn-dark'
              onClick={toggleGameStatsDisplay}
            >
              {showGameStats
                ? 'Hide Turn & Deck Info'
                : 'Show Turn & Deck Info'}
            </button>
          </div>

          <div
            className={`btn-group-vertical btn-width ${
              showJumpLevelOption ? 'mb-3' : 'mb-2'
            }`}
          >
            <button
              type='button'
              className='btn btn-dark mb-1'
              onClick={handleResetGame}
            >
              Reset Entire Run
            </button>
            <button
              type='button'
              className='btn btn-dark'
              onClick={handleExitToMenu}
            >
              Exit to Title
            </button>
          </div>

          {showJumpLevelOption && (
            <div className='btn-group-vertical btn-width mb-2'>
              <button
                type='button'
                className='btn btn-dark'
                onClick={() => jumpToLevel(PRE_FINAL_LEVEL)}
              >
                Skip Levels!
              </button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={
          confirmAction === 'resetGame' ? 'Reset Entire Run?' : 'Exit to Title?'
        }
        message='This will reset your current run. Are you sure you want to continue?'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
