export const playtime = (seconds: number): string => {
  const positiveSeconds = Math.max(0, seconds);
  const minutes = Math.floor(positiveSeconds / 60);
  const remainingSeconds = Math.floor(positiveSeconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};