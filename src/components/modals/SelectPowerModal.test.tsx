import { fireEvent, render, screen } from '@testing-library/react';
import { GameDifficulty } from '../../core/power/power';
import { startLevel } from '../../utils/commonUtils';
import { powers } from '../../utils/scriptUtils';
import { SelectPowerModal } from './SelectPowerModal';

jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
  getAvatarForLevel: () => 'avatar.png',
}));

jest.mock('../../utils/commonUtils', () => ({
  startLevel: jest.fn(),
}));

describe('SelectPowerModal', () => {
  const playAudio = jest.fn();

  it('does not render when showSelectPowerModal is false', () => {
    render(
      <SelectPowerModal showSelectPowerModal={false} playAudio={playAudio} />
    );
    expect(screen.queryByText('Pick Your Power')).not.toBeInTheDocument();
  });

  it('renders all power options when showSelectPowerModal is true', () => {
    render(
      <SelectPowerModal showSelectPowerModal={true} playAudio={playAudio} />
    );
    expect(screen.getByText('Pick Your Power')).toBeInTheDocument();

    powers.forEach((power) => {
      expect(screen.getByText(power.name)).toBeInTheDocument();
    });
  });

  it('disables next level buttons until a power is selected', () => {
    render(
      <SelectPowerModal showSelectPowerModal={true} playAudio={playAudio} />
    );

    const normalBtn = screen.getByRole('button', {
      name: /Next Level: Normal/i,
    });
    const hardBtn = screen.getByRole('button', { name: /Next Level: Hard/i });

    expect(normalBtn).toBeDisabled();
    expect(hardBtn).toBeDisabled();
  });

  it('selects a power on click and enables next level buttons', () => {
    render(
      <SelectPowerModal showSelectPowerModal={true} playAudio={playAudio} />
    );

    const power = powers[0];
    const powerElement = screen.getByTestId(`pwr-${power.class}`);
    fireEvent.click(powerElement);

    expect(playAudio).toHaveBeenCalledWith('click.mp3');

    const normalBtn = screen.getByRole('button', {
      name: /Next Level: Normal/i,
    });
    const hardBtn = screen.getByRole('button', { name: /Next Level: Hard/i });

    expect(normalBtn).toBeEnabled();
    expect(hardBtn).toBeEnabled();
  });

  it('saves selection and starts level when "Next Level" button is clicked', () => {
    render(
      <SelectPowerModal showSelectPowerModal={true} playAudio={playAudio} />
    );

    const power = powers[1];
    const powerElement = screen.getByTestId(`pwr-${power.class}`);
    fireEvent.click(powerElement);

    const hardButton = screen.getByRole('button', {
      name: /Next Level: Hard/i,
    });
    fireEvent.click(hardButton);

    expect(sessionStorage.getItem('power')).toBe(power.class);
    expect(sessionStorage.getItem('difficulty')).toBe(GameDifficulty.hard);
    expect(startLevel).toHaveBeenCalled();
  });
});
