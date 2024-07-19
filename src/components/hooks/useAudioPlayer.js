import { useState, useEffect } from 'react';

const useAudioPlayer = () => {
  const [audio, setAudio] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted, audio]);

  const playAudio = (src) => {
    let audioInstance = audio;

    if (!audioInstance) {
      audioInstance = new Audio(src);
      audioInstance.muted = isMuted;
      setAudio(audioInstance);
    } else {
      audioInstance.src = src;
    }

    audioInstance.play();
  };

  const toggleAudioMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  return { playAudio, toggleAudioMute };
};

export default useAudioPlayer;
