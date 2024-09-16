import { expect } from '@playwright/test';

export const PERFORMANCE_THRESHOLDS = {
  TTFB: 200,
  FCP: 1000,
  DOM_CONTENT_LOADED: 1500,
  LOAD_COMPLETE: 3000,
};

export const TOLERANCE_FACTOR = 1.2; // 20% de marge

export function assertPerformanceMetric(metric: number | null, threshold: number, metricName: string) {
  expect(metric).not.toBeNull();
  if (metric !== null) {
    const maxAllowedValue = threshold * TOLERANCE_FACTOR;
    console.log(`${metricName}: ${metric}ms (threshold: ${maxAllowedValue}ms)`);
    expect(metric).toBeLessThanOrEqual(maxAllowedValue);
  }
}
