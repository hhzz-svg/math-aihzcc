const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const Module = require('module');

process.env.NODE_PATH = process.env.CODEX_NODE_MODULES || process.env.NODE_PATH;
Module._initPaths();
const { chromium } = require('playwright-core');

(async () => {
  const root = path.resolve(__dirname, '..');
  const artifactDir = path.join(os.tmpdir(), 'cmath-sprint-smoke-artifacts');
  fs.mkdirSync(artifactDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_PATH });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const checks = [];
  checks.push(['title', (await page.title()).length > 8]);
  checks.push(['overview visible', await page.locator('#view-overview.is-active').isVisible()]);
  checks.push(['countdown number', /^\d+$/.test(await page.locator('#days-left').innerText())]);
  checks.push(['katex rendered', (await page.locator('.katex').count()) > 0]);
  checks.push(['no katex errors', (await page.locator('.katex-error').count()) === 0]);
  checks.push(['desktop no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)]);

  await page.locator('[data-view="practice"]').click();
  await page.waitForTimeout(300);
  checks.push(['36 problems', (await page.locator('.problem-card').count()) === 36]);

  await page.locator('.problem-card').first().click();
  checks.push(['problem modal', await page.locator('#problem-modal').isVisible()]);
  await page.locator('[data-reveal="hint"]').click();
  checks.push(['hint revealed', await page.locator('[data-reveal-content="hint"]').isVisible()]);
  await page.locator('[data-mark="correct"]').click();
  checks.push(['status persisted in UI', (await page.locator('.problem-card.is-correct').count()) >= 1]);

  await page.locator('[data-view="plan"]').click();
  checks.push(['six phases', (await page.locator('.phase-card').count()) === 6]);
  checks.push(['seven day rhythm', (await page.locator('.rhythm-day').count()) === 7]);
  await page.screenshot({ path: path.join(artifactDir, 'desktop.png'), fullPage: true });

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
  await mobile.waitForTimeout(500);
  checks.push(['mobile menu visible', await mobile.locator('#mobile-menu').isVisible()]);
  await mobile.locator('#mobile-menu').click();
  checks.push(['mobile sidebar opens', await mobile.locator('#sidebar.is-open').isVisible()]);
  await mobile.locator('[data-view="overview"]').click();
  checks.push(['mobile no horizontal overflow', await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)]);
  await mobile.screenshot({ path: path.join(artifactDir, 'mobile.png'), fullPage: true });

  const failed = checks.filter(([, ok]) => !ok);
  checks.forEach(([name, ok]) => console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`));
  if (errors.length) console.error(errors.join('\n'));

  await context.close();
  await mobileContext.close();
  await browser.close();
  if (failed.length || errors.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
