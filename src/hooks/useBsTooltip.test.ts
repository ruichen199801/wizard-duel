import { renderHook } from '@testing-library/react';
import { useBsTooltip } from './useBsTooltip';

describe('useBsTooltip', () => {
  it('runs without throwing', () => {
    expect(() => renderHook(() => useBsTooltip())).not.toThrow();
  });
});
