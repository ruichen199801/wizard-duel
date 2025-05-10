import { useState } from 'react';
import { Strategy } from '../../ai/ai';
import { PRE_FINAL_LEVEL } from '../../core/level/level';
import { click } from '../../utils/assetUtils';
import { exitToMenu, jumpToLevel, resetGame } from '../../utils/commonUtils';

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
}: SettingsModalProps) => {
  const [headerClickCount, setHeaderClickCount] = useState(0);
  const showJumpLevelOption = headerClickCount >= 6;

  if (!showSettingsModal) {
    return null;
  }

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

  return (
    <>
      <div
        className='modal modal-sm fade show d-block'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex={-1}
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content bg-modal'>
            <div className='modal-header border-0'>
              <h4
                className='modal-title w-100 text-center font-bold ms-3'
                onClick={handleHeaderClick}
              >
                Settings
              </h4>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={handleSettingsClose}
              ></button>
            </div>

            <div className='modal-body'>
              <div className='d-flex flex-column align-items-center'>
                <div className='btn-group-vertical btn-width mb-3'>
                  <button
                    type='button'
                    className='btn btn-dark mb-1'
                    onClick={handleAiDifficultyChange}
                  >
                    {aiStrategy === Strategy.filter
                      ? 'AI Difficulty: Normal'
                      : 'AI Difficulty: Hard'}
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
                    onClick={resetGame}
                  >
                    Reset Entire Run
                  </button>
                  <button
                    type='button'
                    className='btn btn-dark'
                    onClick={exitToMenu}
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
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  );
};
