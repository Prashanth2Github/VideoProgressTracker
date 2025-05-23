export type Interval = [number, number];

export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length <= 1) return intervals;

  // Sort intervals by start time
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Interval[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      // Overlapping intervals, merge them
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // Non-overlapping interval
      merged.push(current);
    }
  }

  return merged;
}

export function calculateTotalWatched(intervals: Interval[]): number {
  return intervals.reduce((total, interval) => {
    return total + (interval[1] - interval[0]);
  }, 0);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeDetailed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isInInterval(time: number, intervals: Interval[]): boolean {
  return intervals.some(([start, end]) => time >= start && time <= end);
}

export function getProgressPercentage(totalWatched: number, duration: number): number {
  if (duration <= 0) return 0;
  return Math.min(100, Math.round((totalWatched / duration) * 100));
}
