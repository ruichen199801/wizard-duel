import { CacheKey } from '@utils';
import { useEffect, useState } from 'react';

export const useAudioPlayer = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>();
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    const stored = sessionStorage.getItem(CacheKey.isAudioMuted);
    return (stored ? JSON.parse(stored) : false) as boolean;
  });

  useEffect(() => {
    sessionStorage.setItem(CacheKey.isAudioMuted, JSON.stringify(isAudioMuted));
  }, [isAudioMuted]);

  const playAudio = (src: string) => {
    let audioInstance = audio;
    if (!audioInstance) {
      audioInstance = new Audio(src);
      setAudio(audioInstance);
    } else {
      audioInstance.src = src;
    }

    audioInstance.muted = isAudioMuted;
    audioInstance.play().catch((err) => {
      console.error('Playback error: ', err);
    });
  };

  const toggleAudioMute = () => {
    if (audio) {
      audio.muted = !audio.muted;
    }
    setIsAudioMuted(!isAudioMuted);
  };

  return { playAudio, toggleAudioMute, isAudioMuted };
};
