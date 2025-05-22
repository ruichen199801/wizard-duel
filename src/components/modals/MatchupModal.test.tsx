import { fireEvent, render, screen } from '@testing-library/react';
import { FINAL_LEVEL } from '../../core/level/level';
import { MatchupModal } from './MatchupModal';

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
  getAvatarForLevel: () => 'avatar.png',
}));
jest.mock('../../utils/scriptUtils', () => ({
  getBattleInstructions: () => battleInstructions,
  getBattleStartCaption: () => battleStartCaption,
  getEnemyName: () => 'Enemy',
  getRuleByPower: () => powerRules,
}));

describe('MatchupModal', () => {
  const playMusic = jest.fn();
  const setShowMatchupModal = jest.fn();

  const defaultProps = {
    showMatchupModal: true,
    setShowMatchupModal,
    playMusic,
    level: '4',
  };

  it('renders avatars, names, and battle instructions', () => {
    render(<MatchupModal {...defaultProps} />);

    expect(screen.getByText(battleStartCaption)).toBeInTheDocument();

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
    expect(screen.getByText('Enemy')).toBeInTheDocument();

    expect(screen.getByAltText('player-avatar')).toHaveAttribute(
      'src',
      'avatar.png'
    );
    expect(screen.getByAltText('enemy-avatar')).toHaveAttribute(
      'src',
      'avatar.png'
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

  it('renders final level rule if level is FINAL_LEVEL', () => {
    render(<MatchupModal {...defaultProps} level={FINAL_LEVEL} />);

    expect(
      screen.getByText(/Embraced by the Hydro power/i)
    ).toBeInTheDocument();
  });

  it('calls playMusic and closes modal on close', () => {
    render(<MatchupModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Continue'));

    expect(
      screen.getByRole('button', { name: 'Continue' })
    ).toBeInTheDocument();

    expect(setShowMatchupModal).toHaveBeenCalledWith(false);
    expect(playMusic).toHaveBeenCalled();
  });
});
