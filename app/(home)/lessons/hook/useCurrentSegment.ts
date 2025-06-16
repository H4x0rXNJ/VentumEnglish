import React, { useEffect, useState } from "react";

interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export function useCurrentSegment(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  segments: Segment[],
) {
  const [currentSegmentId, setCurrentSegmentId] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;

      const currentSegment = segments.find(
        (seg) => current >= seg.start && current < seg.end,
      );

      if (currentSegment && currentSegment.id !== currentSegmentId) {
        setCurrentSegmentId(currentSegment.id);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [segments, currentSegmentId, audioRef]);

  const currentText =
    segments.find((s) => s.id === currentSegmentId)?.text ?? "";

  return { currentSegmentId, currentText };
}
