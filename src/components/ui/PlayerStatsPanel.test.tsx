import { fireEvent, render, screen } from '@testing-library/react';
import { freeze } from '../../model/cardEffects';
import { Player } from '../../model/player';
import { Animation, AnimationProps } from '../../utils/assetUtils';
import { PlayerStatsPanel } from './PlayerStatsPanel';

const mockPlayer: Player = {
  id: '0',
  name: 'Player',
  hp: 45,
  maxHp: 50,
  atk: 5,
  baseAtk: 3,
  def: -1,
  baseDef: 2,
  effects: [],
  hand: [],
};

describe('PlayerStatsPanel', () => {
  it('renders avatar and base stats', () => {
    render(<PlayerStatsPanel player={mockPlayer} showCardAnimation={false} />);

    expect(screen.getByAltText('avatar')).toBeInTheDocument();
    expect(screen.getByAltText('hp')).toBeInTheDocument();
    expect(screen.getByAltText('atk')).toBeInTheDocument();
    expect(screen.getByAltText('def')).toBeInTheDocument();

    expect(screen.getByText('45')).toBeInTheDocument(); // hp
    expect(screen.getByText('5')).toBeInTheDocument(); // atk
    expect(screen.getByText('-1')).toBeInTheDocument(); // def
  });

  it('renders max stats on hover', () => {
    render(<PlayerStatsPanel player={mockPlayer} showCardAnimation={false} />);

    const statsContainer = screen.getByTestId('stats-container');
    fireEvent.mouseEnter(statsContainer);

    expect(screen.getByText('45/50')).toBeInTheDocument(); // hp/maxHp
    expect(screen.getByText('5 (+2)')).toBeInTheDocument(); // atk/baseAtk
    expect(screen.getByText('-1 (-3)')).toBeInTheDocument(); // def/baseDef

    fireEvent.mouseLeave(statsContainer);

    expect(screen.queryByText('45/50')).not.toBeInTheDocument();
  });

  it('conditionally renders image overlay', () => {
    const playerWithFreezeEffect: Player = {
      ...mockPlayer,
      effects: [freeze],
    };

    render(
      <PlayerStatsPanel
        player={playerWithFreezeEffect}
        showCardAnimation={false}
      />
    );

    expect(screen.getByAltText('ice')).toBeInTheDocument();
  });

  it('conditionally renders animation overlay', () => {
    const mockAnimation: AnimationProps = {
      type: Animation.fireball,
      path: 'fireball.gif',
      timeout: 500,
    };

    render(
      <PlayerStatsPanel
        player={mockPlayer}
        showCardAnimation={true}
        cardAnimationData={mockAnimation}
      />
    );

    expect(screen.getByAltText('fireball')).toBeInTheDocument();
  });
});
