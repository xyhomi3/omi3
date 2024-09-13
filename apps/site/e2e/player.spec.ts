import { expect, test } from '@playwright/test';

const TIMEOUT = 30000;

test.describe.parallel('Player page', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: TIMEOUT });

    const currentYear = new Date().getFullYear();

    const copyrightPresent = await page.evaluate((year) => {
      const footer = document.querySelector('footer');
      return (
        footer && footer.textContent && footer.textContent.includes(`© ${year}`) && footer.textContent.includes('Omi3')
      );
    }, currentYear);

    expect(copyrightPresent).toBe(true);
  });

  test('should have basic accessibility features', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Omi3 Player/ })).toBeVisible({ timeout: 10000 });

    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 10000 });

    const currentYear = new Date().getFullYear();
    const copyrightRegex = new RegExp(`© ${currentYear}[\\s\\S]*Omi3`);

    const copyrightElement = footer.filter({
      hasText: copyrightRegex,
    });

    await expect(copyrightElement).toBeVisible({ timeout: 10000 });

    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });

    expect(await page.$eval('html', (el) => el.lang)).toBe('en');
  });

  test('should have good performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);

    const performanceTiming = JSON.parse(await page.evaluate(() => JSON.stringify(performance.timing)));
    const dcl = performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart;
    const load = performanceTiming.loadEventEnd - performanceTiming.navigationStart;

    console.log(`DCL: ${dcl}ms`);
    console.log(`Load: ${load}ms`);

    expect(dcl).toBeLessThan(3000);
    expect(load).toBeLessThan(6000);
  });
});
