import { renderHook } from '@testing-library/react';
import { usePreloadAssets } from './usePreloadAssets';

describe('usePreloadAssets', () => {
  let originalImage: any;
  let originalAudio: any;
  let mockImageInstances: any[] = [];
  let mockAudioInstances: any[] = [];

  beforeEach(() => {
    mockImageInstances = [];
    mockAudioInstances = [];

    originalImage = global.Image;
    global.Image = class {
      src = '';
      constructor() {
        mockImageInstances.push(this);
      }
    } as any;

    originalAudio = global.Audio;
    global.Audio = class {
      src = '';
      preload = '';
      constructor() {
        mockAudioInstances.push(this);
      }
    } as any;
  });

  afterEach(() => {
    global.Image = originalImage;
    global.Audio = originalAudio;
  });

  it('preloads images, animations, audio, and music', () => {
    const images = ['img1.png', 'img2.jpg'];
    const animations = ['anim1.gif'];
    const audios = ['audio1.mp3'];
    const musics = ['music1.mp3', 'music2.mp3'];

    renderHook(() => usePreloadAssets(images, animations, audios, musics));

    expect(mockImageInstances.length).toBe(images.length + animations.length);
    expect(mockImageInstances[0].src).toBe(images[0]);
    expect(mockImageInstances[1].src).toBe(images[1]);
    expect(mockImageInstances[2].src).toBe(animations[0]);

    expect(mockAudioInstances.length).toBe(audios.length + musics.length);
    expect(mockAudioInstances[0].src).toBe(audios[0]);
    expect(mockAudioInstances[0].preload).toBe('auto');
    expect(mockAudioInstances[1].src).toBe(musics[0]);
    expect(mockAudioInstances[1].preload).toBe('auto');
    expect(mockAudioInstances[2].src).toBe(musics[1]);
    expect(mockAudioInstances[2].preload).toBe('auto');
  });
});
