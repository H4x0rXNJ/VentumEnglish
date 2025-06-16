export const safeSeek = (video: HTMLAudioElement, time: number) => {
  video.currentTime = time;

  if (video.paused || video.ended || video.readyState < 3) {
    video.play().catch((err) => {
      console.warn("Play error:", err);
    });
  }
};

export const seekForward = (video: HTMLAudioElement, seconds: number = 2) => {
  const newTime = Math.min(video.duration, video.currentTime + seconds);
  safeSeek(video, newTime);
};

export const seekBackward = (video: HTMLAudioElement, seconds: number = 2) => {
  const newTime = Math.max(0, video.currentTime - seconds);
  safeSeek(video, newTime);
};
