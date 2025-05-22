import { fireEvent, render, screen } from '@testing-library/react';
import {
  Effect,
  EffectDuration,
  EffectGroupName,
  EffectTarget,
  EffectType,
} from '../../model/cardEffects';
import { EffectStack } from './EffectStack';

const playerEffect: Effect = {
  type: EffectType.buffAtk,
  duration: EffectDuration.enduring,
  target: EffectTarget.self,
  value: 3,
  group: EffectGroupName.buff,
  text: '+3 Attack',
  abbrevText: '+3 Atk',
};

const opponentEffect: Effect = {
  type: EffectType.buffDef,
  duration: EffectDuration.enduring,
  target: EffectTarget.self,
  value: 3,
  group: EffectGroupName.buff,
  text: '+3 Shield',
  abbrevText: '+3 Def',
};

const getManyEffects = (e: Effect, times: number): Effect[] =>
  Array(times).fill({ ...e });

describe('EffectStack', () => {
  it('does not render when showEffectStack is false', () => {
    render(
      <EffectStack
        opponentEffects={[opponentEffect]}
        playerEffects={[playerEffect]}
        showEffectStack={false}
      />
    );
    expect(screen.queryByTestId('fxstack-container')).not.toBeInTheDocument();
  });

  it('renders full effects when total effects <= 11', () => {
    render(
      <EffectStack
        opponentEffects={[opponentEffect]}
        playerEffects={[playerEffect]}
        showEffectStack={true}
      />
    );
    expect(screen.getAllByText('+3 Attack')).toHaveLength(1);
    expect(screen.getAllByText('+3 Shield')).toHaveLength(1);
  });

  it('renders compact effects when total effects > 11', () => {
    render(
      <EffectStack
        opponentEffects={getManyEffects(opponentEffect, 6)}
        playerEffects={getManyEffects(playerEffect, 6)}
        showEffectStack={true}
      />
    );
    expect(screen.getByText('+3 Atk + 5 More')).toBeInTheDocument();
    expect(screen.getByText('+3 Def + 5 More')).toBeInTheDocument();
  });

  it('expands compact effects on hover', () => {
    render(
      <EffectStack
        opponentEffects={getManyEffects(opponentEffect, 6)}
        playerEffects={getManyEffects(playerEffect, 6)}
        showEffectStack={true}
      />
    );

    const opponentSection = screen.getAllByRole('list')[0];
    fireEvent.mouseEnter(opponentSection);

    expect(screen.getAllByText('+3 Shield')).toHaveLength(6);

    fireEvent.mouseLeave(opponentSection);
    expect(screen.getByText('+3 Def + 5 More')).toBeInTheDocument();
  });
});
