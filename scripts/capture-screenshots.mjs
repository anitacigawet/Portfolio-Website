import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

try {
  await mkdir('docs/screenshots', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/screenshots/portfolio-entrance.png', fullPage: false });
  await page.locator('.section-intro').evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 60 });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'docs/screenshots/zspan-focus.png', fullPage: false });
  await page.locator('.released-heading').evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 60 });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'docs/screenshots/selected-work.png', fullPage: false });
  const images = page.locator('img');
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(900);
  const missingImages = await page.locator('img').evaluateAll((images) =>
    images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')),
  );
  if (missingImages.length > 0) throw new Error(`Images failed to load: ${missingImages.join(', ')}`);
  await page.locator('#about').evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: document.documentElement.scrollHeight });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'docs/screenshots/about.png', fullPage: false });
  if (pageErrors.length > 0) throw new Error(`Browser errors: ${pageErrors.join(' | ')}`);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await mobile.locator('.released-heading').evaluate((element) => {
    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 24 });
  });
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: 'docs/screenshots/mobile-work.png', fullPage: false });
} finally {
  await browser.close();
}
