import { renderHook } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';

describe('useAudioPlayer', () => {
  it('runs without throwing', () => {
    expect(() => renderHook(() => useAudioPlayer())).not.toThrow();
  });
});
