import { renderHook } from '@testing-library/react';
import { Ctx } from 'boardgame.io';
import { WizardDuelState } from '../model/shared';
import { useCardAnimation } from './useCardAnimation';

describe('useCardAnimation', () => {
  it('runs without throwing', () => {
    expect(() =>
      renderHook(() => useCardAnimation({} as WizardDuelState, {} as Ctx))
    ).not.toThrow();
  });
});
