import { act, renderHook } from '@testing-library/react';
import { useImageLoader } from './useImageLoader';

jest.useFakeTimers();

describe('useImageLoader', () => {
  it('starts with isLoading = true', () => {
    const { result } = renderHook(() => useImageLoader(['img1', 'img2'], 500));
    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to false after the delay', () => {
    const delay = 1000;
    const { result } = renderHook(() => useImageLoader(['img1'], delay));

    expect(result.current.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(result.current.isLoading).toBe(false);
  });
});
