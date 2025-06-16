import { calculateVolume } from "../utils/audioUtils";
import { setAudioVolume } from "./audioControl";

export const toggleMute = (
  isMuted: boolean,
  setIsMuted: (v: boolean) => void,
) => {
  setIsMuted(!isMuted);
};

export const updateVolume = (
  audio: HTMLAudioElement,
  volume: number | null,
  isMuted: boolean,
) => {
  const actualVolume = calculateVolume(volume, isMuted);
  setAudioVolume(audio, actualVolume);
};
