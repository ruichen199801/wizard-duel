import { render, screen } from '@testing-library/react';
import { Fireball1 } from '../../model/cards';
import { p0, p1 } from '../../model/player';
import { PlayerHand } from './PlayerHand';

describe('PlayerHand', () => {
  const mockP0 = {
    ...p0,
    hand: [Fireball1, Fireball1],
  };

  const mockP1 = {
    ...p1,
    hand: [Fireball1, Fireball1],
  };

  it('renders front cards for own player', () => {
    render(<PlayerHand player={mockP0} showEnemyHand={false} />);
    expect(screen.getAllByTestId('card-front')).toHaveLength(2);
  });

  it('renders back cards for enemy player when showEnemyHand is false', () => {
    render(<PlayerHand player={mockP1} showEnemyHand={false} />);
    expect(screen.getAllByTestId('card-back')).toHaveLength(2);
  });

  it('renders front cards for enemy player when showEnemyHand is true', () => {
    render(<PlayerHand player={mockP1} showEnemyHand={true} />);
    expect(screen.getAllByTestId('card-front')).toHaveLength(2);
  });
});
