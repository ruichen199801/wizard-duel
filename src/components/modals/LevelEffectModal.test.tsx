import { fireEvent, render, screen } from '@testing-library/react';
import { FINAL_LEVEL } from '../../core/level/level';
import { LevelEffectModal } from './LevelEffectModal';

// Mock data
const battleInstructions = {
  intro:
    'In the heart of Xibalda, you meet Hassan Sarbah, master of ancient sand spells. Disrupted by the desert wind, ',
  rule: 'attacks will miss on certain turns.',
  tips: 'Red turn number means your attack will miss!',
};
const battleStartCaption = 'Level 4: Desert Xibalda';
const powerRules = {
  intro: 'Embraced by the Hydro power, ',
  rule: 'you may gain a random buff at the end of your turns, but enemy has +3 Attack/+3 Shield permanently.',
};

// Mock utils
jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
  getLocationForLevel: () => 'location.png',
}));
jest.mock('../../utils/scriptUtils', () => ({
  getBattleInstructions: () => battleInstructions,
  getBattleStartCaption: () => battleStartCaption,
  getRuleByPower: () => powerRules,
}));

describe('LevelEffectModal', () => {
  const playAudio = jest.fn();
  const setShowLevelEffectModal = jest.fn();

  const defaultProps = {
    showLevelEffectModal: true,
    setShowLevelEffectModal,
    playAudio,
    level: '4',
  };

  it('renders modal with level instructions', () => {
    render(<LevelEffectModal {...defaultProps} />);

    expect(screen.getByText(battleStartCaption)).toBeInTheDocument();
    expect(screen.getByAltText('location')).toHaveAttribute(
      'src',
      'location.png'
    );

    expect(screen.getByText(/In the heart of Xibalda/i)).toBeInTheDocument();
    expect(
      screen.getByText(/attacks will miss on certain turns/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Red turn number means your attack will miss/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Embraced by the Hydro power/i)
    ).not.toBeInTheDocument();
  });

  it('calls playAudio and closes modal on close', () => {
    render(<LevelEffectModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(setShowLevelEffectModal).toHaveBeenCalledWith(false);
    expect(playAudio).toHaveBeenCalledWith('click.mp3');
  });

  it('shows power rules when level is FINAL_LEVEL', () => {
    render(<LevelEffectModal {...defaultProps} level={FINAL_LEVEL} />);

    expect(
      screen.getByText(/Embraced by the Hydro power/i)
    ).toBeInTheDocument();
  });
});
