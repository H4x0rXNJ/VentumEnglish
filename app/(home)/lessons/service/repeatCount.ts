import { saveRepeatCount } from "../utils/storage";

export const getNextRepeatCount = (current: number): number => {
  return current >= 3 ? 1 : current + 1;
};

export const cycleRepeatCount = (
  currentCount: number,
  setRepeatCount: (v: number) => void,
) => {
  const newCount = getNextRepeatCount(currentCount);
  setRepeatCount(newCount);
  saveRepeatCount(newCount);
};
