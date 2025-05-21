import { act, renderHook } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';

describe('useAudioPlayer', () => {
  let playMock: jest.Mock;
  let pauseMock: jest.Mock;

  beforeEach(() => {
    playMock = jest.fn().mockResolvedValue(undefined);
    pauseMock = jest.fn();

    (global as any).Audio = jest.fn((src: string) => ({
      src,
      muted: false,
      play: playMock,
      pause: pauseMock,
    }));
  });

  it('initializes with default mute state from sessionStorage', () => {
    sessionStorage.setItem('isAudioMuted', JSON.stringify(true));
    const { result } = renderHook(() => useAudioPlayer());
    expect(result.current.isAudioMuted).toBe(true);
  });

  it('calls play on Audio instance with correct src and respects mute state', () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playAudio('test.mp3');
    });

    expect(Audio).toHaveBeenCalledWith('test.mp3');
    expect(playMock).toHaveBeenCalled();
  });

  it('updates audio source if audio already exists', () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playAudio('first.mp3');
    });

    act(() => {
      result.current.playAudio('second.mp3');
    });

    const audioInstance = (Audio as jest.Mock).mock.results[0].value;
    expect(audioInstance.src).toBe('second.mp3');
    expect(playMock).toHaveBeenCalledTimes(2);
  });

  it('toggles mute state and updates sessionStorage', () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.playAudio('test.mp3');
    });

    act(() => {
      result.current.toggleAudioMute();
    });

    const audioInstance = (Audio as jest.Mock).mock.results[0].value;
    expect(audioInstance.muted).toBe(true);
    expect(result.current.isAudioMuted).toBe(true);
    expect(sessionStorage.getItem('isAudioMuted')).toBe('true');
  });
});
