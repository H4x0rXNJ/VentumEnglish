export const loadRepeatCount = (): number => {
  if (typeof window === "undefined") return 1;
  const saved = localStorage.getItem("repeatCount");
  return saved ? parseInt(saved) : 1;
};

export const saveRepeatCount = (count: number): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("repeatCount", count.toString());
  }
};
