import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadRepeatCount } from "../utils/storage";
import { calculateProgress } from "@/app/(home)/lessons/utils/audioUtils";
import {
  finishPlayback,
  handleRepeatPlayback,
  shouldContinueRepeating,
} from "../utils/repeatLogic";
import { updateVolume } from "../service/volumeControl";
import { replayAudio, startPlayback } from "../service/playbackControl";
import {
  handleSliderChange,
  handleSliderCommit,
} from "@/app/(home)/lessons/service/sliderControl";
import { cycleRepeatCount } from "@/app/(home)/lessons/service/repeatCount";

type Segment = { id: number; start: number; end: number; text: string };

export const useAudioPlayer = (segments?: Segment[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [segmentRepeatPlayCount, setSegmentRepeatPlayCount] = useState(0);

  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [repeatCount, setRepeatCount] = useState(() => loadRepeatCount());
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isVolumeReady, setIsVolumeReady] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef(0);
  const isInitializedRef = useRef(false);

  const isTogglingRef = useRef(false);

  const THROTTLE_INTERVAL = 100;

  const memoizedSegments = useMemo(() => segments, [segments]);

  const clearSegmentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    setSegmentRepeatPlayCount(0);
  }, [currentSegmentIndex]);

  // Stable reference cho playCurrentSegment với error handling
  const playCurrentSegment = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !memoizedSegments || !memoizedSegments[currentSegmentIndex])
      return;

    const currentSegment = memoizedSegments[currentSegmentIndex];
    audio.currentTime = currentSegment.start;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.warn("Playback failed:", error);
        setIsPlaying(false);
      });
  }, [memoizedSegments, currentSegmentIndex]);

  // Previous segment function
  const previousSegment = useCallback(() => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex((prev) => prev - 1);
    }
  }, [currentSegmentIndex]);

  // Replay function
  const handleReplay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);

    setTimeout(() => {
      if (memoizedSegments) {
        const currentSegment = memoizedSegments[currentSegmentIndex];
        if (!currentSegment) return;

        audio.currentTime = currentSegment.start;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.warn("Replay failed:", error);
            setIsPlaying(false);
          });

        const timeout = setTimeout(
          () => {
            audio.pause();
            setIsPlaying(false);
          },
          (currentSegment.end - currentSegment.start) * 1000,
        );

        return () => clearTimeout(timeout);
      } else {
        replayAudio(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
      }
    }, 100);
  }, [memoizedSegments, currentSegmentIndex]);

  // Toggle play/pause
  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (memoizedSegments) {
        playCurrentSegment();
      } else {
        startPlayback(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
      }
    }
  }, [isPlaying, memoizedSegments, playCurrentSegment]);

  // Audio event handlers
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
    setIsLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.duration > 0) {
      setDuration(audio.duration);
      setIsLoading(false);
    }
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldThrottleUpdate()) return;

    const time = audio.currentTime;
    setCurrentTime(time);

    updateProgressBar(audio, time);
    checkSegmentEndAndRepeat(audio, time);
  }, [
    memoizedSegments,
    currentSegmentIndex,
    repeatCount,
    segmentRepeatPlayCount,
  ]);

  const updateProgressBar = (audio: HTMLAudioElement, currentTime: number) => {
    if (audio.duration) {
      setProgress(calculateProgress(currentTime, audio.duration));
    }
  };
  const checkSegmentEndAndRepeat = (
    audio: HTMLAudioElement,
    currentTime: number,
  ) => {
    const segment = memoizedSegments?.[currentSegmentIndex];
    if (!segment) return;

    const { start, end } = segment;

    if (currentTime >= end) {
      audio.pause();
      setIsPlaying(false);

      if (segmentRepeatPlayCount + 1 < repeatCount) {
        replaySegment(audio, start);
      } else {
        setSegmentRepeatPlayCount(0);
      }
    }
  };

  const replaySegment = (audio: HTMLAudioElement, start: number) => {
    setTimeout(() => {
      audio.currentTime = start;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setSegmentRepeatPlayCount((prev) => prev + 1);
        })
        .catch((err) => console.warn("Replay error:", err));
    }, 300);
  };

  const shouldThrottleUpdate = () => {
    const now = Date.now();
    if (now - lastUpdateTime.current < THROTTLE_INTERVAL) {
      return true;
    }
    lastUpdateTime.current = now;
    return false;
  };

  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);

    if (memoizedSegments && memoizedSegments[currentSegmentIndex]) {
      return;
    }

    if (shouldContinueRepeating(isRepeating, currentPlayCount, repeatCount)) {
      handleRepeatPlayback(audio, setCurrentPlayCount);
    } else {
      finishPlayback(setIsPlaying, setIsRepeating, setCurrentPlayCount);
    }
  }, [
    memoizedSegments,
    currentSegmentIndex,
    isRepeating,
    currentPlayCount,
    repeatCount,
  ]);

  // Progress handlers
  const handleProgressChange = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    handleSliderChange(value[0], audio, setProgress);
  }, []);

  const handleProgressCommit = useCallback(
    (value: number[]) => {
      const audio = audioRef.current;
      if (!audio) return;
      handleSliderCommit(value[0], audio, isPlaying, setProgress);
    },
    [isPlaying],
  );
  const handleToggleMute = useCallback(() => {
    if (isTogglingRef.current) return;

    isTogglingRef.current = true;

    setIsMuted((prev) => {
      return !prev;
    });

    setTimeout(() => {
      isTogglingRef.current = false;
    }, 100);
  }, []);

  const handleRepeatClick = useCallback(() => {
    cycleRepeatCount(repeatCount, setRepeatCount);
  }, [repeatCount]);

  // Setup audio event listeners - chỉ chạy 1 lần
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
  }, [
    handleLoadedMetadata,
    handleCanPlay,
    handleTimeUpdate,
    handleError,
    handleEnded,
  ]);

  // Volume initialization - chỉ chạy 1 lần
  useEffect(() => {
    const saved = localStorage.getItem("volume");
    if (saved) {
      setVolume(Number(saved));
    }
    setIsVolumeReady(true);
  }, []);

  // Volume persistence
  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      updateVolume(audioRef.current, volume, isMuted);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (
      memoizedSegments &&
      memoizedSegments.length > 0 &&
      !isInitializedRef.current
    ) {
      isInitializedRef.current = true;
      // Chỉ setup audio position, KHÔNG auto-play
      const audio = audioRef.current;
      if (audio && memoizedSegments[currentSegmentIndex]) {
        const currentSegment = memoizedSegments[currentSegmentIndex];
        audio.currentTime = currentSegment.start;
      }
    }

    return () => {
      clearSegmentTimeout();
    };
  }, [memoizedSegments]); // Chỉ depend vào memoizedSegments

  // Stable return object
  return useMemo(
    () => ({
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
      currentSegmentIndex,
      // Functions
      replay: handleReplay,
      togglePlay: handleTogglePlay,
      previousSegment,
      onProgressChange: handleProgressChange,
      onProgressCommit: handleProgressCommit,
      toggleMute: handleToggleMute,
      onRepeatClick: handleRepeatClick,
      setVolume,
      setIsPlaying,
      setCurrentSegmentIndex,
    }),
    [
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
      isVolumeReady,
      currentSegmentIndex,
      handleReplay,
      handleTogglePlay,
      previousSegment,
      handleProgressChange,
      handleProgressCommit,
      handleToggleMute,
      handleRepeatClick,
    ],
  );
};
