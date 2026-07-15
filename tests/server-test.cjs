const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = 4197;
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["server/index.cjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port), NODE_ENV: "test" },
  stdio: ["ignore", "pipe", "pipe"]
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("server did not start");
}

(async () => {
  try {
    await waitForServer();
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.ok, true);
    assert.equal(health.referenceAvailable, true);
    console.log("PASS health endpoint");

    const home = await fetch(`${base}/`);
    assert.equal(home.status, 200);
    assert.match(home.headers.get("content-type"), /text\/html/);
    console.log("PASS static site");

    const range = await fetch(`${base}/local-reference/guide.pdf`, { headers: { Range: "bytes=0-1023" } });
    assert.equal(range.status, 206);
    assert.equal((await range.arrayBuffer()).byteLength, 1024);
    assert.match(range.headers.get("content-range"), /^bytes 0-1023\//);
    console.log("PASS PDF byte ranges");

    const meta = await (await fetch(`${base}/api/meta`)).json();
    assert.equal(meta.durationMinutes, 150);
    assert.match(meta.examDate, /^2026-11-14/);
    console.log("PASS study metadata API");
  } finally {
    child.kill("SIGTERM");
  }
})().catch((error) => {
  console.error(error);
  child.kill("SIGTERM");
  process.exit(1);
});
