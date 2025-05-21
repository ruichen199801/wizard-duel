import { act, renderHook } from '@testing-library/react';
import { useMusicPlayer } from './useMusicPlayer';

describe('useMusicPlayer', () => {
  let playMock: jest.Mock;
  let pauseMock: jest.Mock;

  beforeEach(() => {
    playMock = jest.fn().mockResolvedValue(undefined);
    pauseMock = jest.fn();

    (global as any).Audio = jest.fn(() => ({
      loop: false,
      play: playMock,
      pause: pauseMock,
      paused: true,
    }));
  });

  it('initializes music element and isMusicMuted from sessionStorage', () => {
    sessionStorage.setItem('isMusicMuted', 'true');

    const { result } = renderHook(() => useMusicPlayer('music.mp3'));

    expect(result.current.isMusicMuted).toBe(true);
    expect(Audio).toHaveBeenCalledWith('music.mp3');
  });

  it('calls playMusic if not muted', async () => {
    const { result } = renderHook(() => useMusicPlayer('music.mp3'));

    await act(async () => {
      result.current.playMusic();
    });

    expect(playMock).toHaveBeenCalled();
  });

  it('does not call playMusic if muted', async () => {
    sessionStorage.setItem('isMusicMuted', 'true');
    const { result } = renderHook(() => useMusicPlayer('music.mp3'));

    await act(async () => {
      result.current.playMusic();
    });

    expect(playMock).not.toHaveBeenCalled();
  });

  it('calls pauseMusic', () => {
    const { result } = renderHook(() => useMusicPlayer('music.mp3'));

    act(() => {
      result.current.pauseMusic();
    });

    expect(pauseMock).toHaveBeenCalled();
  });

  it('toggles music and mute state', async () => {
    const { result } = renderHook(() => useMusicPlayer('music.mp3'));

    await act(async () => {
      result.current.toggleMusic();
    });

    expect(playMock).toHaveBeenCalled();
    expect(result.current.isMusicMuted).toBe(true);
    expect(sessionStorage.getItem('isMusicMuted')).toBe('true');
  });
});
