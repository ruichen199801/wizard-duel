import { fireEvent, render, screen, within } from '@testing-library/react';
import { LogEntry } from '../../hooks/useLog';
import { LogModal } from './LogModal';

jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
}));

describe('LogModal', () => {
  const setShowLogModal = jest.fn();
  const playAudio = jest.fn();

  const logEntries: LogEntry[] = [
    {
      turn: 1,
      playerName: 'Player',
      cardName: 'Fireball',
      cardText: 'Damage 3',
    },
    {
      turn: 2,
      playerName: 'Opponent',
      cardName: 'Block',
      cardText: 'Prevent Next Damage',
    },
  ];

  const defaultProps = {
    showLogModal: true,
    setShowLogModal,
    logEntries,
    playAudio,
  };

  it('does not render when showLogModal is false', () => {
    render(<LogModal {...defaultProps} showLogModal={false} />);

    expect(screen.queryByText(/Battle Log/i)).not.toBeInTheDocument();
  });

  it('renders log when showLogModal is true', () => {
    render(<LogModal {...defaultProps} />);
    const entries = screen.getAllByTestId('log-entry');

    expect(entries).toHaveLength(2);

    expect(within(entries[0]).getByText(/Turn 1:/)).toBeInTheDocument();
    expect(within(entries[0]).getByText('Player')).toBeInTheDocument();
    expect(within(entries[0]).getByText('Fireball')).toBeInTheDocument();
    expect(within(entries[0]).getByText(/Damage 3/)).toBeInTheDocument();

    expect(within(entries[1]).getByText(/Turn 2:/)).toBeInTheDocument();
    expect(within(entries[1]).getByText('Opponent')).toBeInTheDocument();
    expect(within(entries[1]).getByText('Block')).toBeInTheDocument();
    expect(
      within(entries[1]).getByText(/Prevent Next Damage/)
    ).toBeInTheDocument();
  });

  it('calls setShowLogModal and playAudio when close button is clicked', () => {
    render(<LogModal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });

    fireEvent.click(closeButton);

    expect(setShowLogModal).toHaveBeenCalledWith(false);
    expect(playAudio).toHaveBeenCalledWith('click.mp3');
  });
});
