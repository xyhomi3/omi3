import { expect, test } from '@playwright/test';

test.describe.parallel('Palyer page', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Player');

    const heading = page.locator('h3');
    await expect(heading).toContainText('Omi3 Player');
    await expect(heading.locator('span')).toHaveClass('text-main');

    const currentYear = new Date().getFullYear();
    await expect(page.getByText(`© ${currentYear} Omi3`)).toBeVisible();

    const mainElement = page.locator('main');
    await expect(mainElement).toBeVisible();
    await expect(mainElement).toHaveClass(/flex-grow flex items-center justify-center/);

    const audioPlayer = page.locator('div.rounded-base.border-2').first();
    await expect(audioPlayer).toBeVisible();

    await expect(audioPlayer.locator('h3')).toContainText('Omi3 Player');
    await expect(audioPlayer.locator('canvas')).toBeVisible();
    await expect(audioPlayer.locator('[role="progressbar"]')).toBeVisible();
    await expect(audioPlayer.locator('button')).toHaveText('Lecture');
  });

  test('should have basic accessibility features', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Omi3 Player/ })).toBeVisible();
    await expect(page.getByText(/© \d{4} Omi3/)).toBeVisible();

    expect(await page.title()).toBeTruthy();
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

    expect(dcl).toBeLessThan(2000);
    expect(load).toBeLessThan(5000);
  });
});
