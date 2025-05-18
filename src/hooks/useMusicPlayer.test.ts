import { renderHook } from '@testing-library/react';
import { useMusicPlayer } from './useMusicPlayer';

describe('useMusicPlayer', () => {
  it('runs without throwing', () => {
    expect(() => renderHook(() => useMusicPlayer('test.mp3'))).not.toThrow();
  });
});
