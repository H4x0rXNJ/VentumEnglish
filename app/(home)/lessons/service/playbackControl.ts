import { playAudio, pauseAudio, resetAudio } from "./audioControl";

export const startPlayback = (
  audio: HTMLAudioElement,
  setIsPlaying: (v: boolean) => void,
  setIsRepeating: (v: boolean) => void,
  setCurrentPlayCount: (v: number) => void,
) => {
  setIsRepeating(true);
  setCurrentPlayCount(1);
  setIsPlaying(true);
  playAudio(audio);
};

export const stopPlayback = (
  audio: HTMLAudioElement,
  setIsPlaying: (v: boolean) => void,
  setIsRepeating: (v: boolean) => void,
  setCurrentPlayCount: (v: number) => void,
) => {
  pauseAudio(audio);
  setIsPlaying(false);
  setIsRepeating(false);
  setCurrentPlayCount(0);
};

export const replayAudio = (
  audio: HTMLAudioElement,
  setIsPlaying: (v: boolean) => void,
  setIsRepeating: (v: boolean) => void,
  setCurrentPlayCount: (v: number) => void,
) => {
  resetAudio(audio);
  startPlayback(audio, setIsPlaying, setIsRepeating, setCurrentPlayCount);
};
