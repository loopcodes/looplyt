// services/pageSpeed.ts

export interface PerformanceMetrics {
  lcp: number | null;
  speedIndex: number | null;
  tbt: number | null;
}

/**
 * Calculates a representative page speed in seconds.
 *
 * Inputs:
 * - LCP (ms)
 * - Speed Index (ms)
 * - TBT (ms)
 *
 * Output:
 * - Seconds (e.g. 2.43)
 */
export function calculatePageSpeed(
  metrics: PerformanceMetrics
): number | null {
  const { lcp, speedIndex, tbt } = metrics;

  if (
    lcp == null ||
    speedIndex == null ||
    tbt == null
  ) {
    return null;
  }

  // Convert metrics to seconds
  const lcpSeconds = lcp / 1000;
  const speedIndexSeconds = speedIndex / 1000;
  const tbtSeconds = tbt / 1000;

  // Weighted average
  const pageSpeed =
  lcpSeconds * 0.6 +
  speedIndexSeconds * 0.35 +
  tbtSeconds * 0.05;

  return Number(pageSpeed.toFixed(2));
}