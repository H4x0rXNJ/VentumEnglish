export const playAudio = async (audio: HTMLAudioElement): Promise<void> => {
  try {
    if (audio.paused) {
      await audio.play();
    }
  } catch (error) {
    console.error("Play error:", error);
  }
};

export const pauseAudio = (audio: HTMLAudioElement): void => {
  audio.pause();
};

export const setAudioTime = (audio: HTMLAudioElement, time: number): void => {
  audio.currentTime = time;
};

export const setAudioVolume = (
  audio: HTMLAudioElement,
  volume: number,
): void => {
  audio.volume = volume;
};

export const resetAudio = (audio: HTMLAudioElement): void => {
  audio.currentTime = 0;
};
