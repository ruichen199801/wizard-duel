import { CacheKey } from '@utils';
import { useEffect, useState } from 'react';

export const useMusicPlayer = (src: string) => {
  const [music, setMusic] = useState<HTMLAudioElement | undefined>();
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    const stored = sessionStorage.getItem(CacheKey.isMusicMuted);
    return (stored ? JSON.parse(stored) : false) as boolean;
  });

  useEffect(() => {
    const musicInstance = new Audio(src);
    musicInstance.loop = true;
    musicInstance.pause();

    setMusic(musicInstance);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CacheKey.isMusicMuted, JSON.stringify(isMusicMuted));
  }, [isMusicMuted]);

  const playMusic = () => {
    if (music && !isMusicMuted) {
      music.play().catch((err) => {
        console.error('Playback error: ', err);
      });
    }
  };

  const pauseMusic = () => {
    if (music) {
      music.pause();
    }
  };

  const toggleMusic = () => {
    if (music) {
      if (music.paused) {
        music.play().catch((err) => {
          console.error('Playback error: ', err);
        });
      } else {
        music.pause();
      }
    }
    setIsMusicMuted(!isMusicMuted);
  };

  return { playMusic, pauseMusic, toggleMusic, isMusicMuted };
};
