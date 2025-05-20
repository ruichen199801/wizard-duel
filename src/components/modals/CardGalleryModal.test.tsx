import { fireEvent, render, screen } from '@testing-library/react';
import { CardGalleryModal } from './CardGalleryModal';

jest.mock('../../utils/assetUtils', () => ({
  click: 'click.mp3',
}));

describe('CardGalleryModal', () => {
  const setShowCardGallery = jest.fn();
  const playAudio = jest.fn();
  const cardImages = ['img1.png', 'img2.png', 'img3.png'];

  const defaultProps = {
    showCardGallery: true,
    setShowCardGallery,
    cardImages,
    playAudio,
  };

  it('does not render when showCardGallery is false', () => {
    render(<CardGalleryModal {...defaultProps} showCardGallery={false} />);
    expect(screen.queryByText('Card Gallery')).not.toBeInTheDocument();
  });

  it('renders all card images when showCardGallery is true', () => {
    render(<CardGalleryModal {...defaultProps} />);
    expect(screen.getByText('Card Gallery')).toBeInTheDocument();

    const images = screen.getAllByAltText('card front');
    expect(images).toHaveLength(cardImages.length);
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', cardImages[index]);
    });
  });

  it('calls setShowCardGallery and playAudio on close', () => {
    render(<CardGalleryModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(setShowCardGallery).toHaveBeenCalledWith(false);
    expect(playAudio).toHaveBeenCalledWith('click.mp3');
  });
});
