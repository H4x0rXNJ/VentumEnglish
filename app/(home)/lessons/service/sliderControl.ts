import { calculateTimeFromProgress } from "../utils/audioUtils";
import { pauseAudio, setAudioTime, playAudio } from "./audioControl";

export const handleSliderChange = (
  value: number,
  audio: HTMLAudioElement,
  setProgress: (v: number) => void,
) => {
  if (!audio.duration) return;

  const newTime = calculateTimeFromProgress(value, audio.duration);
  pauseAudio(audio);
  setAudioTime(audio, newTime);
  setProgress(value);
};

export const handleSliderCommit = (
  value: number,
  audio: HTMLAudioElement,
  isPlaying: boolean,
  setProgress: (v: number) => void,
) => {
  if (!audio.duration) return;

  const newTime = calculateTimeFromProgress(value, audio.duration);
  setAudioTime(audio, newTime);
  setProgress(value);

  if (isPlaying) {
    playAudio(audio);
  }
};
