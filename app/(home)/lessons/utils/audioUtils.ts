export const calculateProgress = (
  currentTime: number,
  duration: number,
): number => {
  return duration > 0 ? (currentTime / duration) * 100 : 0;
};

export const calculateTimeFromProgress = (
  progress: number,
  duration: number,
): number => {
  return (progress / 100) * duration;
};

export const calculateVolume = (
  volume: number | null,
  isMuted: boolean,
): number => {
  if (isMuted || volume === null) return 0;
  return volume / 100;
};
