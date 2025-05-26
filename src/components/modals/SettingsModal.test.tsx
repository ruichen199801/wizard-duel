import { fireEvent, render, screen } from '@testing-library/react';
import { Strategy } from '../../ai/ai';
import { PRE_FINAL_LEVEL } from '../../core/level/level';
import { exitToMenu, resetGame } from '../../utils/commonUtils';
import { SettingsModal } from './SettingsModal';

jest.mock('../../utils/commonUtils', () => ({
  exitToMenu: jest.fn(),
  jumpToLevel: jest.fn(),
  resetGame: jest.fn(),
}));

describe('SettingsModal', () => {
  const playAudio = jest.fn();
  const toggleAudioMute = jest.fn();
  const toggleMusic = jest.fn();
  const setShowSettingsModal = jest.fn();
  const setShowGameStats = jest.fn();
  const setShowEffectStack = jest.fn();
  const setAiStrategy = jest.fn();

  const defaultProps = {
    showSettingsModal: true,
    setShowSettingsModal,
    playAudio,
    toggleAudioMute,
    isAudioMuted: false,
    toggleMusic,
    isMusicMuted: true,
    showGameStats: false,
    setShowGameStats,
    showEffectStack: false,
    setShowEffectStack,
    aiStrategy: Strategy.filter,
    setAiStrategy,
    level: '2',
  };

  it('toggles AI difficulty', () => {
    render(<SettingsModal {...defaultProps} />);
    const aiButton = screen.getByRole('button', { name: /AI Difficulty/i });
    expect(aiButton).toHaveTextContent('AI Difficulty: Normal');
    fireEvent.click(aiButton);
    expect(setAiStrategy).toHaveBeenCalled();
  });

  it('toggles audio and music mute states', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Unmute Game Music/i }));
    expect(toggleMusic).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Mute Game Sounds/i }));
    expect(toggleAudioMute).toHaveBeenCalled();
  });

  it('toggles game stats and effect stack visibility', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(
      screen.getByRole('button', { name: /Show Buffs & Debuffs/i })
    );
    expect(setShowEffectStack).toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole('button', { name: /Show Turn & Deck Info/i })
    );
    expect(setShowGameStats).toHaveBeenCalled();
  });

  it('shows skip level button after clicking header 6 times', () => {
    render(<SettingsModal {...defaultProps} />);

    const header = screen.getByText('Settings');
    for (let i = 0; i < 6; i++) fireEvent.click(header);

    expect(
      screen.getByRole('button', { name: /Skip Levels/i })
    ).toBeInTheDocument();
  });

  it('does not show skip level button for PRE_FINAL_LEVEL or FINAL_LEVEL', () => {
    render(<SettingsModal {...defaultProps} level={PRE_FINAL_LEVEL} />);

    const header = screen.getByText('Settings');
    for (let i = 0; i < 6; i++) fireEvent.click(header);

    expect(
      screen.queryByRole('button', { name: /Skip Levels/i })
    ).not.toBeInTheDocument();
  });

  it('confirms and resets the game on "Reset Entire Run"', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Reset Entire Run/i }));

    expect(screen.getByText('Reset Entire Run?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(resetGame).toHaveBeenCalled();
  });

  it('confirms and exits to title screen on "Exit to Title"', () => {
    render(<SettingsModal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Exit to Title/i }));

    expect(screen.getByText('Exit to Title?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(exitToMenu).toHaveBeenCalled();
  });
});
