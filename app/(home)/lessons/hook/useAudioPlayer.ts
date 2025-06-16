import { useEffect, useRef, useState } from "react";
import { loadRepeatCount } from "../utils/storage";
import { calculateProgress } from "@/app/(home)/lessons/utils/audioUtils";
import {
  finishPlayback,
  handleRepeatPlayback,
  shouldContinueRepeating,
} from "../utils/repeatLogic";
import { toggleMute, updateVolume } from "../service/volumeControl";
import {
  replayAudio,
  startPlayback,
  stopPlayback,
} from "../service/playbackControl";
import {
  handleSliderChange,
  handleSliderCommit,
} from "@/app/(home)/lessons/service/sliderControl";
import { cycleRepeatCount } from "@/app/(home)/lessons/service/repeatCount";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [repeatCount, setRepeatCount] = useState(() => loadRepeatCount());
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isVolumeReady, setIsVolumeReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log("[AUDIO] loadedmetadata:", audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      console.log("[AUDIO] canplay:", audio.duration);
      if (audio.duration > 0) {
        setDuration(audio.duration);
        setIsLoading(false);
      }
    };

    const handleError = () => {
      console.error("[AUDIO] error");
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      console.log("[AUDIO] timeupdate:", audio.currentTime);
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress(calculateProgress(audio.currentTime, audio.duration));
      }
    };

    const handleEnded = () => {
      console.log("[AUDIO] ended");
      if (shouldContinueRepeating(isRepeating, currentPlayCount, repeatCount)) {
        handleRepeatPlayback(audio, setCurrentPlayCount);
      } else {
        finishPlayback(setIsPlaying, setIsRepeating, setCurrentPlayCount);
      }
    };

    const events = [
      ["loadedmetadata", handleLoadedMetadata],
      ["canplay", handleCanPlay],
      ["timeupdate", handleTimeUpdate],
      ["error", handleError],
      ["ended", handleEnded],
    ] as const;

    events.forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
    });

    if (audio.readyState >= 1 && audio.duration > 0) {
      setDuration(audio.duration);
    } else {
      audio.load();
    }

    return () => {
      events.forEach(([event, handler]) => {
        audio.removeEventListener(event, handler);
      });
    };
  }, [isRepeating, currentPlayCount, repeatCount]);

  // Mute audio automatically when slider is pulled to 0
  useEffect(() => {
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume]);

  useEffect(() => {
    const saved = localStorage.getItem("volume");
    if (saved) {
      setVolume(Number(saved));
    }
    setIsVolumeReady(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      updateVolume(audioRef.current, volume, isMuted);
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      stopPlayback(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
    } else {
      startPlayback(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    replayAudio(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    handleSliderChange(value[0], audio, setProgress);
  };

  const handleProgressCommit = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    handleSliderCommit(value[0], audio, isPlaying, setProgress);
  };

  const handleToggleMute = () => {
    toggleMute(isMuted, setIsMuted);
  };

  const handleRepeatClick = () => {
    cycleRepeatCount(repeatCount, setRepeatCount);
  };

  return {
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    isMuted,
    isLoading,
    repeatCount,
    currentPlayCount,
    isRepeating,
    audioRef,
    isVolumeReady,
    togglePlay: handleTogglePlay,
    replay: handleReplay,
    onProgressChange: handleProgressChange,
    onProgressCommit: handleProgressCommit,
    toggleMute: handleToggleMute,
    onRepeatClick: handleRepeatClick,
    setVolume,
  };
};
