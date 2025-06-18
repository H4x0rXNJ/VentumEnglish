import { useEffect } from "react";
import { seekBackward, seekForward } from "../utils/seekHelpers";

const handleOptionKey = (audio: HTMLAudioElement, segmentStartTime: number) => {
  audio.currentTime = segmentStartTime;

  if (audio.paused || audio.ended || audio.readyState < 3) {
    audio.play().catch((err) => {
      console.warn("Play error:", err);
    });
  }
};

const handleArrowKeys = (e: KeyboardEvent, audio: HTMLAudioElement) => {
  if (e.key === "ArrowRight") {
    seekForward(audio);
  } else if (e.key === "ArrowLeft") {
    seekBackward(audio);
  }
};

export const useKeyboardSeek = (
  getAudio: () => HTMLAudioElement | null,
  getCurrentSegmentStart: () => number,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const audio = getAudio();
      if (!audio) return;

      if (e.key === "Alt") {
        const startTime = getCurrentSegmentStart();
        handleOptionKey(audio, startTime);
      } else {
        handleArrowKeys(e, audio);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getAudio, getCurrentSegmentStart]);
};
