import { useEffect, useState } from 'react';

const useMusicPlayer = (src: string) => {
  const [music, setMusic] = useState<HTMLAudioElement | undefined>();
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    const stored = sessionStorage.getItem('isMusicMuted');
    return (stored ? JSON.parse(stored) : false) as boolean;
  });

  useEffect(() => {
    const musicInstance = new Audio(src);
    musicInstance.loop = true;
    musicInstance.pause();

    setMusic(musicInstance);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('isMusicMuted', JSON.stringify(isMusicMuted));
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

export default useMusicPlayer;
