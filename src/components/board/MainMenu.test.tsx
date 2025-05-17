import { fireEvent, render, screen } from '@testing-library/react';
import { MainMenu } from './MainMenu';

jest.mock('../../hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    playAudio: jest.fn(),
  }),
}));

jest.mock('../../hooks/usePreloadAssets', () => ({
  usePreloadAssets: jest.fn(),
}));

jest.mock('../modals/HelpModal', () => ({
  HelpModal: ({ showHelpModal }: any) =>
    showHelpModal ? <div data-testid='help-modal' /> : null,
}));

jest.mock('../modals/CardGalleryModal', () => ({
  CardGalleryModal: ({ showCardGallery }: any) =>
    showCardGallery ? <div data-testid='card-gallery-modal' /> : null,
}));

describe('MainMenu', () => {
  let originalLocation: Location;

  beforeAll(() => {
    originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { href: '' };

    window.open = jest.fn();
  });

  afterAll(() => {
    (window as any).location = originalLocation;
  });

  it('renders all main buttons', () => {
    render(<MainMenu />);
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('navigates to /game when "Play" is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Play'));
    expect(window.location.href).toBe('/game');
  });

  it('opens Help modal when "Instructions" is clicked', () => {
    render(<MainMenu />);
    expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Instructions'));
    expect(screen.getByTestId('help-modal')).toBeInTheDocument();
  });

  it('opens Card Gallery modal when "Cards" is clicked', () => {
    render(<MainMenu />);
    expect(screen.queryByTestId('card-gallery-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Cards'));
    expect(screen.getByTestId('card-gallery-modal')).toBeInTheDocument();
  });

  it('opens GitHub link when "About" is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('About'));
    expect(window.open).toHaveBeenCalledWith(
      'https://github.com/ruichen199801/wizard-duel',
      '_blank'
    );
  });
});
