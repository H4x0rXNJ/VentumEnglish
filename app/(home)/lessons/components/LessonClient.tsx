"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share2, Volume2, VolumeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { SiCountingworkspro } from "react-icons/si";
import { RepeatIcon } from "@/app/components/icons/Icon";
import { formatTime } from "@/app/(home)/lessons/utils/formatTime";
import { useAudioPlayer } from "../hook/useAudioPlayer";
import { useKeyboardSeek } from "../hook/useKeyboardSeek";
import { useCurrentSegment } from "@/app/(home)/lessons/hook/useCurrentSegment";

type LessonProps = {
  title: string;
  audioSrc: string | null;
  segments: {
    text: string;
    language: string;
    segments: { id: number; start: number; end: number; text: string }[];
  };
};

export default function LessonClient({
  title,
  audioSrc,
  segments,
}: LessonProps) {
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
    togglePlay,
    replay,
    onProgressChange,
    onProgressCommit,
    toggleMute,
    onRepeatClick,
    setVolume,
  } = useAudioPlayer();

  useKeyboardSeek(() => audioRef.current);

  const realSegments = segments.segments;
  const { currentText } = useCurrentSegment(audioRef, realSegments);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader className="bg-primary/5 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SiCountingworkspro />
            {title}
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Room
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="rounded-lg border p-4 w-full max-w-md bg-dark shadow-sm space-y-4">
                <div className="flex items-center space-x-4">
                  {audioSrc && (
                    <audio ref={audioRef} src={audioSrc} preload="metadata" />
                  )}
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full cursor-pointer bg-black hover:bg-zinc-800 transition-colors duration-200 ease-in-out"
                  >
                    {isPlaying ? (
                      <TbPlayerPause className="text-white" />
                    ) : (
                      <TbPlayerPlay className="text-white" />
                    )}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(currentTime)}
                  </span>

                  <Slider
                    value={[progress]}
                    onValueChange={onProgressChange}
                    onValueCommit={onProgressCommit}
                    max={100}
                    step={1}
                    className="h-3 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-black dark:[&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {duration > 0 ? (
                      formatTime(duration)
                    ) : (
                      <Skeleton className="h-5 w-10 rounded-md" />
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full max-w-[160px]">
                  <RepeatIcon count={repeatCount} onClick={onRepeatClick} />
                  <button onClick={toggleMute} className="p-1">
                    {isMuted ? (
                      <VolumeOff className="w-3.5 h-3.5 text-black dark:text-white" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-black dark:text-white" />
                    )}
                  </button>
                  {isVolumeReady ? (
                    <Slider
                      value={[volume]}
                      max={100}
                      min={0}
                      step={1}
                      onValueChange={(val) => setVolume(val[0])}
                      className="h-3 [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:bg-black dark:[&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-0.5"
                    />
                  ) : (
                    <Skeleton className="h-0.5 w-30 rounded-md" />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Check</Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Recognized Text</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Creator
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Room: XXXX
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Type what you hear..."
                  className="h-32"
                />

                <p className="font-medium text-pink-400">{currentText}</p>

                <div className="flex items-center justify-between">
                  <Button
                    onClick={replay}
                    variant="default"
                    className="cursor-pointer flex items-center gap-2"
                    size="lg"
                    disabled={isLoading}
                  >
                    Replay
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      Next
                    </Button>
                    <Button
                      variant="default"
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-sm mb-1">
                Tips for best accuracy:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use Chrome or Edge browser for best results</li>
                <li>Click the repeat icon to set loop count (1-3 times)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
