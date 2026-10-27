import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const targets = [
  { name: 'desktop-1440x900', preview: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  { name: 'tablet-834x1112', preview: 'tablet', viewport: { width: 834, height: 1112 }, deviceScaleFactor: 1, hasTouch: true },
  { name: 'iphone-15-393x852-3x', preview: 'mobile', viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
];

await mkdir('docs/images', { recursive: true });
const browser = await chromium.launch();
for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    deviceScaleFactor: target.deviceScaleFactor,
    isMobile: target.isMobile ?? false,
    hasTouch: target.hasTouch ?? false,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4173/?preview=${target.preview}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `docs/images/${target.name}.png`, fullPage: false });
  await context.close();
}
await browser.close();
