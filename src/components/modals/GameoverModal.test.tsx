import { fireEvent, render, screen } from '@testing-library/react';
import { FINAL_LEVEL } from '../../core/level/level';
import { GameoverModal } from './GameoverModal';

describe('GameoverModal', () => {
  const setShowGameoverModal = jest.fn();
  const setShowNextLevelModal = jest.fn();
  const setShowSelectPowerModal = jest.fn();
  const playAudio = jest.fn();

  const baseProps = {
    showGameoverModal: true,
    setShowGameoverModal,
    setShowNextLevelModal,
    setShowSelectPowerModal,
    playAudio,
  };

  it('shows correct UI when player wins a mid-level', () => {
    render(<GameoverModal {...baseProps} winner='0' level='2' />);

    expect(screen.getByText('Congratulations')).toBeInTheDocument();
    expect(
      screen.getByText(/You have advanced to the next level/i)
    ).toBeInTheDocument();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(setShowGameoverModal).toHaveBeenCalled();
    expect(setShowNextLevelModal).toHaveBeenCalled();
    expect(playAudio).toHaveBeenCalled();
  });

  it('shows correct UI when player wins the final level', () => {
    render(<GameoverModal {...baseProps} winner='0' level={FINAL_LEVEL} />);

    expect(screen.getByText('Congratulations')).toBeInTheDocument();
    expect(
      screen.getByText(/You defeated every opponent/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Cheat code/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reset Game' })
    ).toBeInTheDocument();
  });

  it('shows correct UI when player wins the level before the final', () => {
    const beforeFinal = (parseInt(FINAL_LEVEL) - 1).toString();
    render(<GameoverModal {...baseProps} winner='0' level={beforeFinal} />);

    expect(screen.getByText('Congratulations')).toBeInTheDocument();
    expect(
      screen.getByText(/You have advanced to the final level/i)
    ).toBeInTheDocument();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    fireEvent.click(continueButton);

    expect(setShowSelectPowerModal).toHaveBeenCalled();
    expect(playAudio).toHaveBeenCalled();
  });

  it('shows correct UI when player loses', () => {
    render(<GameoverModal {...baseProps} winner='1' level='2' />);

    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText(/Defeated/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Prev Level' })
    ).toBeInTheDocument();
  });

  it('shows "Restart Level" when player loses on level 1', () => {
    render(<GameoverModal {...baseProps} winner='1' level='1' />);

    expect(
      screen.getByRole('button', { name: 'Restart Level' })
    ).toBeInTheDocument();
  });

  it('shows fallback message when no winner is provided', () => {
    render(<GameoverModal {...baseProps} level='2' winner={undefined} />);

    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(
      screen.getByText('Time runs out, the duel ends in a draw.')
    ).toBeInTheDocument();
  });
});
