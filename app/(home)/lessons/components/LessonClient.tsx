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
import React, { useCallback, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FiCheck } from "react-icons/fi";
import { PiSealWarningFill } from "react-icons/pi";
import { LuVolumeOff } from "react-icons/lu";
import { cn } from "@/lib/utils";

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
  const [correctSegments, setCorrectSegments] = useState<Set<number>>(
    new Set(),
  );

  const [isSkipped, setIsSkipped] = useState(false);

  const realSegments = useMemo(() => segments.segments, [segments.segments]);

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
    previousSegment,
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
  );

  // Memoize current segment text
  const currentSegmentText = useMemo(
    () => realSegments[currentSegmentIndex]?.text || "",
    [realSegments, currentSegmentIndex],
  );

  const isCurrentSegmentCorrect = correctSegments.has(currentSegmentIndex);

  const normalizeText = useCallback(
    (text: string) => text.trim().toLowerCase(),
    [],
  );

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

  const handleSkipSegment = () => {
    if (currentSegmentIndex < realSegments.length && audioRef.current) {
      // Pause audio
      audioRef.current.pause();
      setIsPlaying(false);

      // Show current segment text
      const currentSegment = realSegments[currentSegmentIndex];
      setUseInput(currentSegment?.text || "");

      setCheckResult("");
      setIsSkipped(true);
      setShowFullAnswer(false);
      setShowMaskedAnswer(false);
      setRevealedWords(1);
    }
  };

  const nextSegment = useCallback(() => {
    if (currentSegmentIndex < realSegments.length - 1) {
      setCurrentSegmentIndex((prev) => prev + 1);

      // Reset UI state
      setUseInput("");
      setCheckResult("");
      setShowFullAnswer(false);
      setShowMaskedAnswer(false);
      setRevealedWords(1);
      setIsSkipped(false);

      setTimeout(() => {
        const audio = audioRef.current;
        if (audio && realSegments[currentSegmentIndex + 1]) {
          audio.currentTime = realSegments[currentSegmentIndex + 1].start;
          audio.play().then(() => setIsPlaying(true));
        }
      }, 100);
    }
  }, [currentSegmentIndex, realSegments, setIsPlaying]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!isCurrentSegmentCorrect) {
          handleCheckAnswer();
        }
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

  const handleShowMaskedChange = useCallback((checked: boolean) => {
    setShowMaskedAnswer(checked);
    if (checked) {
      setShowFullAnswer(false);
    }
    setRevealedWords(1);
  }, []);

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

  const checkMaskedProgress = useCallback(() => {
    const words = currentSegmentText.split(" ");
    const revealedPortion = words.slice(0, revealedWords).join(" ");
    const normalizedInput = normalizeText(useInput);
    const normalizedRevealed = normalizeText(revealedPortion);

    if (
      normalizedInput === normalizedRevealed &&
      revealedWords < words.length
    ) {
      setRevealedWords((prev) => prev + 1);
    }
  }, [useInput, currentSegmentText, revealedWords, normalizeText]);

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
    setShowFullAnswer(false);
    setShowMaskedAnswer(false);
    setRevealedWords(1);
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

        <CardContent className="pt-4 sm:pt-6 min-h-[400px] sm:h-[400px] overflow-hidden relative p-4 sm:p-6">
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
                      className="h-3 flex-1 max-w-[120px] sm:max-w-[160px] [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-black dark:[&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-0.5"
                    />
                  ) : (
                    <Skeleton className="h-0.5 w-20 sm:w-30 rounded-md flex-1 max-w-[120px] sm:max-w-[160px]" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                {!isSkipped ? (
                  <Button
                    onClick={handleSkipSegment}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center"
                    size="lg"
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                ) : (
                  <Button
                    onClick={nextSegment}
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center"
                    size="lg"
                    disabled={isLoading}
                  >
                    Next
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
                      disabled={checkResult !== "wrong"}
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
                      disabled={checkResult !== "wrong"}
                    />
                    <Label htmlFor="showFull" className="text-sm">
                      Show full answer
                    </Label>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                  <Badge variant="outline" className="text-xs">
                    Creator
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Room: XXXX
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
                    "w-full h-20 sm:h-25 font-semibold p-3 sm:p-4 text-sm sm:text-base",
                    "rounded-lg border shadow-sm transition-all duration-200",
                    "whitespace-pre-wrap resize-none",
                    isCurrentSegmentCorrect || isSkipped
                      ? "bg-white/60 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black",
                  )}
                  value={useInput.trimStart().toLowerCase()}
                  onChange={handleInputChange}
                  readOnly={isCurrentSegmentCorrect || isSkipped}
                  onKeyDown={handleKeyDown}
                />

                {checkResult && (
                  <p
                    className={`flex items-center gap-2 font-medium text-sm sm:text-base ${
                      checkResult === "correct"
                        ? "text-blue-400"
                        : "text-pink-600"
                    }`}
                  >
                    {checkResult === "correct" ? (
                      <>
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        Great job!
                      </>
                    ) : (
                      <>
                        <PiSealWarningFill className="w-4 h-4 sm:w-5 sm:h-5" />
                        That&#39;s not correct.
                      </>
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
                  <div className="flex gap-2">
                    {checkResult !== "wrong" && (
                      <Button
                        onClick={handleCheckAnswer}
                        variant="default"
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        Check
                      </Button>
                    )}
                    {/*{checkResult !== "correct" && (*/}
                    {/*  <Button*/}
                    {/*    onClick={previousSegment}*/}
                    {/*    variant="default"*/}
                    {/*    className="flex items-center gap-2"*/}
                    {/*    size="lg"*/}
                    {/*    disabled={currentSegmentIndex === 0}*/}
                    {/*  >*/}
                    {/*    Previous*/}
                    {/*  </Button>*/}
                    {/*)}*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
