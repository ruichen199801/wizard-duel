import { render, screen } from '@testing-library/react';
import { Fireball1 } from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { WizardDuelState } from '../../model/shared';
import { GameStatsPanel } from './GameStatsPanel';

const mockLevel = '1';
const mockTurn = 2;
const mockG: WizardDuelState = {
  players: {
    0: { ...p0 },
    1: { ...p1 },
  },
  deck: [Fireball1, Fireball1, Fireball1],
  level: mockLevel,
  globalEffects: {},
};

describe('GameStatsPanel', () => {
  it('always renders CardPile', () => {
    render(
      <GameStatsPanel G={mockG} visibleTurn={mockTurn} showGameStats={false} />
    );
    expect(screen.getByTestId('card-pile')).toBeInTheDocument();
  });

  it('does not render stats when showGameStats is false', () => {
    render(
      <GameStatsPanel G={mockG} visibleTurn={mockTurn} showGameStats={false} />
    );
    expect(screen.queryByAltText('level')).not.toBeInTheDocument();
    expect(screen.queryByAltText('turn')).not.toBeInTheDocument();
    expect(screen.queryByAltText('deck')).not.toBeInTheDocument();
  });

  it('renders stats when showGameStats is true', () => {
    render(
      <GameStatsPanel G={mockG} visibleTurn={mockTurn} showGameStats={true} />
    );

    expect(screen.getByAltText('level')).toBeInTheDocument();
    expect(screen.getByText(mockLevel)).toBeInTheDocument();

    expect(screen.getByAltText('turn')).toBeInTheDocument();
    expect(screen.getByText(mockTurn)).toBeInTheDocument();

    expect(screen.getByAltText('deck')).toBeInTheDocument();
    expect(screen.getByText(mockG.deck.length)).toBeInTheDocument();
  });

  it('applies text-danger class when shouldMiss is true', () => {
    const G: WizardDuelState = {
      ...mockG,
      globalEffects: {
        shouldMiss: [false, true],
      },
    };

    render(
      <GameStatsPanel G={G} visibleTurn={mockTurn} showGameStats={true} />
    );
    const turnText = screen.getByText(mockTurn);
    expect(turnText).toHaveClass('text-danger');
  });

  it('applies text-danger class when shouldClearEffects is true', () => {
    const G: WizardDuelState = {
      ...mockG,
      globalEffects: {
        shouldClearEffects: [false, true],
      },
    };

    render(
      <GameStatsPanel G={G} visibleTurn={mockTurn} showGameStats={true} />
    );
    const turnText = screen.getByText(mockTurn);
    expect(turnText).toHaveClass('text-danger');
  });
});
