import { renderHook } from '@testing-library/react';
import { usePreloadAssets } from './usePreloadAssets';

describe('usePreloadAssets', () => {
  it('runs without throwing', () => {
    expect(() => {
      renderHook(() =>
        usePreloadAssets(
          ['img.png'],
          ['anim.gif'],
          ['audio.mp3'],
          ['music.mp3']
        )
      );
    }).not.toThrow();
  });
});
