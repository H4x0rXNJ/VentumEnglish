import { useEffect } from "react";
import { seekBackward, seekForward } from "../utils/seekHelpers";

const handleCommandKey = (audio: HTMLAudioElement) => {
  audio.currentTime = 0;

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

export const useKeyboardSeek = (getVideo: () => HTMLAudioElement | null) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const audio = getVideo();
      if (!audio) return;

      if (e.key === "Alt") {
        handleCommandKey(audio);
      } else {
        handleArrowKeys(e, audio);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getVideo]);
};
