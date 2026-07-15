const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { spawn } = require("node:child_process");
const Module = require("node:module");

const runtimeModules = path.join(process.env.USERPROFILE || os.homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", ".pnpm", "node_modules");
process.env.NODE_PATH = process.env.CODEX_NODE_MODULES || runtimeModules;
Module._initPaths();
const { chromium } = require("playwright-core");

const root = path.resolve(__dirname, "..");
const artifactDir = path.join(os.tmpdir(), "math-aihzcc-smoke-artifacts");
fs.mkdirSync(artifactDir, { recursive: true });
const port = 4198;
const base = `http://127.0.0.1:${port}`;
const browserCandidates = [
  process.env.BROWSER_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error("No Edge/Chrome executable found");

const server = spawn(process.execPath, ["server/index.cjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port), NODE_ENV: "test" },
  stdio: ["ignore", "pipe", "pipe"]
});

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      if ((await fetch(`${base}/api/health`)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("server did not start");
}

(async () => {
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true, executablePath });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });

    await page.goto(base, { waitUntil: "networkidle" });
    const checks = [];
    checks.push(["book cover visible", await page.locator(".cover").isVisible()]);
    checks.push(["live exam countdown visible", await page.locator("#exam-countdown").isVisible() && /^\d+\D+\d{2}:\d{2}:\d{2}$/.test(await page.locator("#exam-countdown").textContent())]);
    checks.push(["nine chapter TOC", (await page.locator("#toc-list [data-chapter]").count()) === 9]);
    checks.push(["no card dashboard", (await page.locator(".problem-card, .topic-card, .metric-grid").count()) === 0]);
    checks.push(["desktop no horizontal overflow", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)]);

    await page.locator('[data-chapter="limits"]').click();
    await page.waitForTimeout(450);
    checks.push(["chapter route", page.url().includes("#/chapter/limits")]);
    checks.push(["eight review sections", (await page.locator('[id^="section-limits-"]').count()) === 8]);
    checks.push(["one worked example", (await page.locator("section.example").count()) === 1]);
    checks.push(["eight chapter exercises", (await page.locator("section.exercise").count()) === 8]);
    checks.push(["reference excerpt embedded", await page.locator(".reference-inset").isVisible() && (await page.locator(".reference-page img").count()) > 0]);
    checks.push(["KaTeX rendered", (await page.locator(".katex").count()) > 8]);
    checks.push(["no KaTeX error", (await page.locator(".katex-error").count()) === 0]);

    await page.locator('section.example details.solution-block').nth(1).locator("summary").click();
    checks.push(["full solution expands", await page.locator('section.example details.solution-block').nth(1).getAttribute("open") !== null]);
    await page.locator('[data-problem-id="L09"][data-problem-status="mastered"]').click();
    await page.waitForTimeout(250);
    checks.push(["problem status persists", (await page.locator('[data-problem-id="L09"][data-problem-status="mastered"]').getAttribute("class") || "").includes("is-active")]);

    await page.goto(`${base}/#/plan`, { waitUntil: "domcontentloaded" });
    checks.push(["executable current-week plan", await page.locator(".plan-detail").isVisible() && (await page.locator(".plan-detail li").count()) === 7]);

    await page.goto(`${base}/#/reference?page=26`, { waitUntil: "domcontentloaded" });
    await page.locator("#pdf-canvas").waitFor({ state: "visible", timeout: 45000 });
    checks.push(["PDF page renders", await page.locator("#pdf-canvas").isVisible()]);
    checks.push(["PDF jumped to physical page 26", (await page.locator("#pdf-page-input").inputValue()) === "26"]);
    await page.waitForFunction(() => document.getElementById("pdf-status")?.textContent.includes("26 / 382"), null, { timeout: 45000 });
    checks.push(["PDF range source shown", true]);

    await page.goto(`${base}/#/plan`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    checks.push(["18 week schedule", (await page.locator(".plan-table tbody tr").count()) === 18]);
    await page.goto(`${base}/#/papers`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    checks.push(["10 past papers", (await page.locator(".paper-table tbody tr").count()) === 10]);
    await page.goto(`${base}/#/resources`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    checks.push(["9 resource links", (await page.locator(".resource-entry").count()) === 9]);
    await page.screenshot({ path: path.join(artifactDir, "desktop.png"), fullPage: true });

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobile = await mobileContext.newPage();
    const mobileErrors = [];
    mobile.on("pageerror", (error) => mobileErrors.push(`mobile pageerror: ${error.message}`));
    await mobile.goto(base, { waitUntil: "networkidle" });
    checks.push(["mobile TOC button visible", await mobile.locator("#toc-toggle").isVisible()]);
    await mobile.locator("#toc-toggle").click();
    checks.push(["mobile book TOC opens", await mobile.locator("#book-toc.is-open").isVisible()]);
    await mobile.locator('[data-chapter="integral"]').click();
    await mobile.waitForTimeout(300);
    checks.push(["mobile chapter navigation", mobile.url().includes("#/chapter/integral")]);
    checks.push(["mobile no horizontal overflow", await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)]);
    await mobile.screenshot({ path: path.join(artifactDir, "mobile.png"), fullPage: true });

    const failed = checks.filter(([, ok]) => !ok);
    checks.forEach(([name, ok]) => console.log(`${ok ? "PASS" : "FAIL"} ${name}`));
    [...errors, ...mobileErrors].forEach((item) => console.error(item));
    await mobileContext.close();
    await context.close();
    if (failed.length || errors.length || mobileErrors.length) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
})().catch((error) => {
  console.error(error);
  server.kill("SIGTERM");
  process.exit(1);
});




