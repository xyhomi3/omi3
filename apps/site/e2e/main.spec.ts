import { PERFORMANCE_THRESHOLDS, assertPerformanceMetric } from './helpers';
import { expect, test } from '@playwright/test';

test.describe('Main page', () => {
  test('serves correct robots.txt and sitemap.xml', async ({ page }) => {
    const robotsTxt = await page.goto('/robots.txt');
    expect(await robotsTxt?.text()).toBe(
      'User-Agent: *\nAllow: /\n\nHost: https://omi3.dev\nSitemap: https://omi3.dev/sitemap.xml\n',
    );

    const sitemapXml = await page.goto('/sitemap.xml');
    expect(await sitemapXml?.text()).toMatch(
      /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\s*<url>\s*<loc>https:\/\/omi3\.dev\/en<\/loc>/,
    );
  });

  test('performance is within acceptable range', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const fcp = performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint');

      return {
        ttfb: navigation.responseStart - navigation.requestStart,
        fcp: fcp ? fcp.startTime : null,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
        loadComplete: navigation.loadEventEnd - navigation.startTime,
      };
    });

    console.log('Performance metrics:', performanceMetrics);

    assertPerformanceMetric(performanceMetrics.ttfb, PERFORMANCE_THRESHOLDS.TTFB, 'TTFB');
    assertPerformanceMetric(performanceMetrics.fcp, PERFORMANCE_THRESHOLDS.FCP, 'FCP');
    assertPerformanceMetric(
      performanceMetrics.domContentLoaded,
      PERFORMANCE_THRESHOLDS.DOM_CONTENT_LOADED,
      'DOMContentLoaded',
    );
    assertPerformanceMetric(performanceMetrics.loadComplete, PERFORMANCE_THRESHOLDS.LOAD_COMPLETE, 'Load Complete');
  });
});
