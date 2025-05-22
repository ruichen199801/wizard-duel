import { fireEvent, render, screen } from '@testing-library/react';
import { HelpModal } from './HelpModal';

jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
}));

describe('HelpModal', () => {
  const setShowHelpModal = jest.fn();
  const playAudio = jest.fn();

  it('renders the game rules when showHelpModal is true', () => {
    render(
      <HelpModal
        showHelpModal={true}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
    );

    expect(screen.getByText('Game Rules')).toBeInTheDocument();
    expect(
      screen.getByText(/Two players alternate turns/i)
    ).toBeInTheDocument();
  });

  it('does not render when showHelpModal is false', () => {
    render(
      <HelpModal
        showHelpModal={false}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
    );

    expect(screen.queryByText('Game Rules')).not.toBeInTheDocument();
  });

  it('calls setShowHelpModal(false) and playAudio when close button is clicked', () => {
    render(
      <HelpModal
        showHelpModal={true}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(setShowHelpModal).toHaveBeenCalledWith(false);
    expect(playAudio).toHaveBeenCalledWith('click.mp3');
  });
});
