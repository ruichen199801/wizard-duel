import { fireEvent, render, screen } from '@testing-library/react';
import { getNextCardsForLevel } from '../../utils/assetUtils';
import { startLevel } from '../../utils/commonUtils';
import { NextLevelModal } from './NextLevelModal';

jest.mock('../../utils/assetUtils', () => ({
  getNextCardsForLevel: jest.fn(),
}));

jest.mock('../../utils/commonUtils', () => ({
  startLevel: jest.fn(),
}));

describe('NextLevelModal', () => {
  const mockImages = ['img1.png', 'img2.png', 'img3.png'];

  beforeEach(() => {
    (getNextCardsForLevel as jest.Mock).mockReturnValue(mockImages);
  });

  it('does not render when showNextLevelModal is false', () => {
    render(<NextLevelModal showNextLevelModal={false} level='1' />);
    expect(screen.queryByText(/New Cards Unlocked/i)).not.toBeInTheDocument();
  });

  it('renders new level cards when showNextLevelModal is true', () => {
    render(<NextLevelModal showNextLevelModal={true} level='1' />);

    expect(screen.getByText(/New Cards Unlocked/i)).toBeInTheDocument();
    const cardImages = screen.getAllByAltText('card front');
    expect(cardImages).toHaveLength(mockImages.length);
    mockImages.forEach((imgSrc, index) => {
      expect(cardImages[index]).toHaveAttribute('src', imgSrc);
    });
  });

  it('calls startLevel when "Next Level" button is clicked', () => {
    render(<NextLevelModal showNextLevelModal={true} level='1' />);
    const button = screen.getByRole('button', { name: /Next Level/i });
    fireEvent.click(button);
    expect(startLevel).toHaveBeenCalled();
  });
});
