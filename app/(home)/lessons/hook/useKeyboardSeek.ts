import { useEffect } from "react";

const handleOptionKey = (
  audio: HTMLAudioElement,
  segmentStartTime: number,
  setIsPlaying: (val: boolean) => void,
) => {
  audio.currentTime = segmentStartTime;

  if (audio.paused || audio.ended || audio.readyState < 3) {
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Play error:", err);
      });
  }
};

export const useKeyboardSeek = (
  getAudio: () => HTMLAudioElement | null,
  getCurrentSegmentStart: () => number,
  setIsPlaying: (val: boolean) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const audio = getAudio();
      if (!audio) return;

      if (e.key === "Alt") {
        const startTime = getCurrentSegmentStart();
        handleOptionKey(audio, startTime, setIsPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getAudio, getCurrentSegmentStart]);
};
