import { renderHook } from '@testing-library/react';
import { usePersistentState } from './usePersistentState';

describe('usePersistentState', () => {
  it('runs without throwing', () => {
    expect(() =>
      renderHook(() => usePersistentState('testKey', 'defaultValue'))
    ).not.toThrow();
  });
});
