import { resetAudio, playAudio } from "../service/audioControl";

export const shouldContinueRepeating = (
  isRepeating: boolean,
  currentCount: number,
  maxCount: number,
): boolean => {
  return isRepeating && currentCount < maxCount;
};

export const handleRepeatPlayback = (
  audio: HTMLAudioElement,
  setCurrentPlayCount: (fn: (prev: number) => number) => void,
) => {
  setCurrentPlayCount((prev) => prev + 1);
  resetAudio(audio);
  playAudio(audio);
};

export const finishPlayback = (
  setIsPlaying: (v: boolean) => void,
  setIsRepeating: (v: boolean) => void,
  setCurrentPlayCount: (v: number) => void,
) => {
  setIsPlaying(false);
  setIsRepeating(false);
  setCurrentPlayCount(0);
};
