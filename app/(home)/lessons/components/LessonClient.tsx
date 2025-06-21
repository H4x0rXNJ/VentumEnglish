"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share2, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbHeadphones, TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { RepeatIcon } from "@/app/components/icons/Icon";
import { formatTime } from "@/app/(home)/lessons/utils/formatTime";
import { useAudioPlayer } from "../hook/useAudioPlayer";
import { useKeyboardSeek } from "../hook/useKeyboardSeek";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FiCheck } from "react-icons/fi";
import { LuVolumeOff } from "react-icons/lu";
import { cn } from "@/lib/utils";
import {
  cleanText,
  handlePasteEvent,
} from "@/app/(home)/lessons/utils/handlePaste";
import { normalizeText } from "@/app/(home)/lessons/utils/contractionsMap";

type SegmentsProps = {
  title: string;
  audioSrc: string | null;
  segments: {
    text: string;
    segments: { id: number; start: number; end: number; text: string }[];
  };
};

export default function LessonClient({
  title,
  audioSrc,
  segments,
}: SegmentsProps) {
  const [useInput, setUseInput] = useState("");
  const [showFullAnswer, setShowFullAnswer] = useState(false);
  const [showMaskedAnswer, setShowMaskedAnswer] = useState(false);
  const [revealedWords, setRevealedWords] = useState(1);
  const [checkResult, setCheckResult] = useState<"" | "correct" | "wrong">("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [actualCurrentSegment, setActualCurrentSegment] = useState(0);
  const [correctSegments, setCorrectSegments] = useState<Set<number>>(
    new Set(),
  );
  const [skippedSegments, setSkippedSegments] = useState<Set<number>>(
    new Set(),
  );

  const realSegments = useMemo(() => segments.segments, [segments.segments]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    isMuted,
    isLoading,
    repeatCount,
    audioRef,
    isVolumeReady,
    currentSegmentIndex,
    togglePlay,
    setIsPlaying,
    onProgressChange,
    onProgressCommit,
    toggleMute,
    onRepeatClick,
    setVolume,
    setCurrentSegmentIndex,
  } = useAudioPlayer(realSegments);

  useKeyboardSeek(
    () => audioRef.current,
    () => realSegments[currentSegmentIndex]?.start ?? 0,
    setIsPlaying,
  );

  const currentSegmentText = useMemo(
    () => realSegments[currentSegmentIndex]?.text || "",
    [realSegments, currentSegmentIndex],
  );
  const [pendingCursor, setPendingCursor] = useState<number | null>(null);

  const isCurrentSegmentCorrect = correctSegments.has(currentSegmentIndex);
  const isLastSegment = currentSegmentIndex >= realSegments.length - 1;
  const handleCheckAnswer = useCallback(() => {
    const normalizedInput = normalizeText(useInput);
    const normalizedExpected = normalizeText(currentSegmentText);

    if (normalizedInput === normalizedExpected) {
      setCheckResult("correct");
      setCorrectSegments((prev) => new Set([...prev, currentSegmentIndex]));
    } else {
      setCheckResult("wrong");
    }
  }, [useInput, currentSegmentText, normalizeText, currentSegmentIndex]);

  useEffect(() => {
    if (pendingCursor !== null && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(pendingCursor, pendingCursor);
        inputRef.current?.focus();
        setPendingCursor(null);
      });
    }
  }, [pendingCursor]);

  const handleSkipSegment = () => {
    if (currentSegmentIndex < realSegments.length && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);

      const currentSegment = realSegments[currentSegmentIndex];
      setUseInput(currentSegment?.text || "");

      setSkippedSegments((prev) => new Set([...prev, currentSegmentIndex]));
      setActualCurrentSegment(
        Math.max(actualCurrentSegment, currentSegmentIndex),
      );

      setCheckResult("");
      setIsSkipped(true);
      setRevealedWords(1);
    }
  };

  const previousSegment = () => {
    if (currentSegmentIndex > 0 && audioRef.current) {
      const newSegment = currentSegmentIndex - 1;
      setCurrentSegmentIndex(newSegment);
      setCheckResult("");
      setIsSkipped(true);
      setRevealedWords(1);
      audioRef.current.pause();
      audioRef.current.currentTime = realSegments[newSegment].start;
      setTimeout(() => {
        const segment = realSegments[newSegment];
        setUseInput(segment?.text || "");
      }, 0);
    }
  };

  const nextSegment = useCallback(() => {
    if (currentSegmentIndex < realSegments.length - 1) {
      const newSegmentIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(newSegmentIndex);

      const segment = realSegments[newSegmentIndex];

      const isSegmentSkipped =
        skippedSegments.has(newSegmentIndex) ||
        correctSegments.has(newSegmentIndex);

      if (isSegmentSkipped) {
        setCheckResult(correctSegments.has(newSegmentIndex) ? "correct" : "");
        setRevealedWords(segment?.text?.split(" ").length || 1);
        setIsSkipped(skippedSegments.has(newSegmentIndex));

        setTimeout(() => {
          const audio = audioRef.current;
          if (audio && segment) {
            audio.currentTime = segment.start;
            audio.pause();
            setIsPlaying(false);
          }
        }, 100);
        setTimeout(() => {
          const segment = realSegments[newSegmentIndex];
          setUseInput(segment?.text || "");
        }, 0);
      } else {
        setUseInput("");
        setCheckResult("");
        setRevealedWords(1);
        setIsSkipped(false);

        setTimeout(() => {
          const audio = audioRef.current;
          if (audio && segment) {
            audio.currentTime = segment.start;
            audio.play().then(() => setIsPlaying(true));
          }
        }, 100);
      }
    }
  }, [
    currentSegmentIndex,
    skippedSegments,
    correctSegments,
    realSegments,
    setIsPlaying,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (isCurrentSegmentCorrect || isSkipped) {
          nextSegment();
          return;
        }
        handleCheckAnswer();
      }
    },
    [handleCheckAnswer, isCurrentSegmentCorrect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isCurrentSegmentCorrect) {
        setUseInput(e.target.value);
        setCheckResult("");
      }
    },
    [isCurrentSegmentCorrect],
  );

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    handlePasteEvent(event, useInput, setUseInput);
  };

  const handleShowMaskedChange = useCallback((checked: boolean) => {
    setShowMaskedAnswer(checked);
    if (checked) {
      setShowFullAnswer(false);
      setRevealedWords(1);
    }
  }, []);

  const checkMaskedProgress = useCallback(() => {
    if (!showMaskedAnswer) return;

    const words = currentSegmentText.split(" ");
    const normalizedInput = normalizeText(useInput.trim());

    let matchedWords = 0;
    for (let i = 0; i < words.length; i++) {
      const partialText = words.slice(0, i + 1).join(" ");
      const normalizedPartial = normalizeText(partialText);

      if (normalizedInput === normalizedPartial) {
        matchedWords = i + 1;
      }
    }

    if (matchedWords > 0) {
      setRevealedWords(Math.min(matchedWords + 1, words.length));
    } else {
      let partialMatched = 0;

      for (let i = words.length - 1; i >= 1; i--) {
        const partial = words.slice(0, i).join(" ");
        if (normalizeText(useInput).startsWith(normalizeText(partial))) {
          partialMatched = i;
          break;
        }
      }
      if (partialMatched > 0) {
        setRevealedWords(Math.min(partialMatched + 1, words.length));
      } else {
        setRevealedWords(2);
      }
    }
  }, [useInput, currentSegmentText, showMaskedAnswer, normalizeText]);

  const handleShowFullChange = useCallback((checked: boolean) => {
    setShowFullAnswer(checked);
    if (checked) {
      setShowMaskedAnswer(false);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (val: number[]) => {
      setVolume(val[0]);
    },
    [setVolume],
  );

  const getMaskedText = useCallback(() => {
    const words = currentSegmentText.split(" ");
    return words
      .map((word, index) => {
        if (index < revealedWords) {
          return word;
        }
        return "*".repeat(word.length);
      })
      .join(" ");
  }, [currentSegmentText, revealedWords]);

  React.useEffect(() => {
    if (showMaskedAnswer && checkResult === "wrong") {
      checkMaskedProgress();
    }
  }, [useInput, showMaskedAnswer, checkResult, checkMaskedProgress]);

  React.useEffect(() => {
    const newCheckResult = correctSegments.has(currentSegmentIndex)
      ? "correct"
      : "";
    setCheckResult(newCheckResult);

    if (newCheckResult === "correct") {
      setUseInput(currentSegmentText);
    } else {
      setUseInput("");
    }
  }, [currentSegmentIndex, correctSegments, currentSegmentText]);

  return (
    <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <Card className="w-full">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TbHeadphones className="w-5 h-5 sm:w-6 sm:h-6" />
            {title}
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Share2 className="h-4 w-4" />
            Share Room
          </Button>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6 min-h-[520px] sm:h-[400px] overflow-hidden relative p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="rounded-lg border p-3 sm:p-4 w-full lg:max-w-md bg-dark shadow-sm space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {audioSrc && (
                    <audio ref={audioRef} src={audioSrc} preload="metadata" />
                  )}
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full cursor-pointer bg-black hover:bg-zinc-800 transition-colors duration-200 ease-in-out flex-shrink-0"
                  >
                    {isPlaying ? (
                      <TbPlayerPause className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <TbPlayerPlay className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {formatTime(currentTime)}
                  </span>

                  <Slider
                    value={[progress]}
                    onValueChange={onProgressChange}
                    onValueCommit={onProgressCommit}
                    max={100}
                    step={1}
                    className="h-3 flex-1 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-black dark:[&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-1"
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {duration > 0 ? (
                      formatTime(duration)
                    ) : (
                      <Skeleton className="h-4 sm:h-5 w-8 sm:w-10 rounded-md" />
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <RepeatIcon count={repeatCount} onClick={onRepeatClick} />
                  <button onClick={toggleMute} className="p-1 flex-shrink-0">
                    {isMuted || volume === 0 ? (
                      <LuVolumeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black dark:text-white" />
                    ) : (
                      <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black dark:text-white" />
                    )}
                  </button>

                  {isVolumeReady ? (
                    <Slider
                      value={[volume]}
                      max={100}
                      min={0}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="h-3 flex-1 sm:max-w-[80px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-black dark:[&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-0.5"
                    />
                  ) : (
                    <Skeleton className="h-0.5 w-20 sm:w-30 rounded-md flex-1 max-w-[120px] sm:max-w-[160px]" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                {isSkipped || checkResult === "correct" ? (
                  <Button
                    onClick={previousSegment}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center min-w-[100px]"
                    size="lg"
                    disabled={currentSegmentIndex === 0}
                  >
                    Preview
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckAnswer}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center min-w-[100px]"
                    size="lg"
                  >
                    Check
                  </Button>
                )}

                {isSkipped || checkResult === "correct" ? (
                  <Button
                    onClick={nextSegment}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center min-w-[100px]"
                    size="lg"
                    disabled={isLoading || isLastSegment}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSkipSegment}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center min-w-[100px]"
                    size="lg"
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 flex-1 sm:flex-none justify-center"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-2">
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="showMasked"
                      checked={showMaskedAnswer}
                      onCheckedChange={handleShowMaskedChange}
                      disabled={isSkipped || checkResult === "correct"}
                    />
                    <Label htmlFor="showMasked" className="text-sm">
                      Show masked answer
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showFull"
                      checked={showFullAnswer}
                      onCheckedChange={handleShowFullChange}
                      disabled={isSkipped || checkResult === "correct"}
                    />
                    <Label htmlFor="showFull" className="text-sm">
                      Show full answer
                    </Label>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                  <Badge variant="secondary" className="text-xs">
                    Level: C1
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    Total Lesson: {currentSegmentIndex + 1}/
                    {realSegments.length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4 mt-5">
                <Textarea
                  placeholder="Type what you hear..."
                  className={cn(
                    "w-full h-20 sm:h-25 font-semibold p-3 sm:p-4 dark:text-white text-sm sm:text-base",
                    "rounded-lg border shadow-sm transition-all duration-200",
                    "whitespace-pre-wrap resize-none",
                    isCurrentSegmentCorrect || isSkipped
                      ? "bg-white/60 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black",
                  )}
                  ref={inputRef}
                  value={useInput}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  readOnly={isCurrentSegmentCorrect || isSkipped}
                  onKeyDown={handleKeyDown}
                />

                {checkResult && (
                  <p
                    className={`flex items-center gap-2 font-medium text-sm sm:text-base ${
                      checkResult === "correct"
                        ? "text-green-600"
                        : "text-pink-600"
                    }`}
                  >
                    {checkResult === "correct" ? (
                      <>
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        You nailed it!
                      </>
                    ) : (
                      <>🤔 Hmm, that&#39;s not correct!</>
                    )}
                  </p>
                )}

                {showFullAnswer && checkResult === "wrong" && (
                  <p className="mt-2 dark:text-white text-black font-medium text-sm sm:text-base break-words">
                    {currentSegmentText}
                  </p>
                )}

                {showMaskedAnswer && checkResult === "wrong" && (
                  <p className="mt-2 dark:text-white text-black font-medium text-sm sm:text-base break-words">
                    {getMaskedText()}
                  </p>
                )}

                <div className="flex items-center justify-between min-h-[60px] sm:min-h-[72px] transition-all duration-300">
                  <div className="flex gap-2"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
