import { useState, useEffect } from 'react';

/* Browser
*/
const useMusicPlayer = (src) => {
  const [music, setMusic] = useState(null);

  useEffect(() => {
    const musicInstance = new Audio(src);

    musicInstance.loop = true;
    musicInstance.muted = true;
    musicInstance.currentTime = 0;
    musicInstance.pause();

    setMusic(musicInstance);
  }, [src]);

  const playMusic = () => {
    if (music) {
      music.muted = false;
      music.play();
    }
  };

  const pauseMusic = () => {
    if (music) {
      music.pause();
      music.muted = true;
    }
  };

  const toggleMusic = () => {
    if (music) {
      if (music.muted) {
        playMusic();
      } else {
        pauseMusic();
      }
    }
  };

  return { toggleMusic, pauseMusic };
};

export default useMusicPlayer;
