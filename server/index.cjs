const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const privateReferenceDir = path.join(root, "private", "reference");
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === "production";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf"
};

function sendJson(response, status, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(body);
}

function findReferencePdf() {
  if (process.env.REFERENCE_PDF_PATH) {
    const configured = path.resolve(process.env.REFERENCE_PDF_PATH);
    return fs.existsSync(configured) ? configured : null;
  }
  if (!fs.existsSync(privateReferenceDir)) return null;
  const name = fs.readdirSync(privateReferenceDir).find((entry) => entry.toLowerCase().endsWith(".pdf"));
  return name ? path.join(privateReferenceDir, name) : null;
}

function servePdf(request, response, filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Reference PDF is not configured on this server.");
    return;
  }
  const stat = fs.statSync(filePath);
  const range = request.headers.range;
  const common = {
    "Content-Type": "application/pdf",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=0, must-revalidate",
    "Content-Disposition": "inline; filename=reference-guide.pdf"
  };

  if (!range) {
    response.writeHead(200, { ...common, "Content-Length": stat.size });
    if (request.method === "HEAD") return response.end();
    fs.createReadStream(filePath).pipe(response);
    return;
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) {
    response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
    response.end();
    return;
  }
  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
  if (start > end || start >= stat.size) {
    response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
    response.end();
    return;
  }
  response.writeHead(206, {
    ...common,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Content-Length": end - start + 1
  });
  if (request.method === "HEAD") return response.end();
  fs.createReadStream(filePath, { start, end }).pipe(response);
}

function safePublicPath(pathname) {
  const decoded = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  const resolved = path.resolve(publicDir, `.${decoded}`);
  return resolved === publicDir || resolved.startsWith(`${publicDir}${path.sep}`) ? resolved : null;
}

function serveStatic(request, response, pathname) {
  const filePath = safePublicPath(pathname);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  const stat = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Content-Length": stat.size,
    "Cache-Control": pathname.startsWith("/assets/vendor/") ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });
  if (request.method === "HEAD") return response.end();
  fs.createReadStream(filePath).pipe(response);
}

function studyWeekFor(date = new Date()) {
  const start = new Date("2026-07-15T00:00:00+08:00");
  const diff = Math.floor((date - start) / 86400000);
  if (diff <= 4) return 1;
  return Math.min(18, Math.max(2, 2 + Math.floor((diff - 5) / 7)));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD, OPTIONS" });
    return response.end();
  }
  if (request.method === "OPTIONS") {
    response.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS" });
    return response.end();
  }
  if (url.pathname === "/api/health") {
    return sendJson(response, 200, {
      ok: true,
      service: "math-aihzcc-api",
      referenceAvailable: Boolean(findReferencePdf()),
      environment: isProduction ? "production" : "development",
      time: new Date().toISOString()
    });
  }
  if (url.pathname === "/api/meta") {
    return sendJson(response, 200, {
      category: "非数学专业 A 类 · 初赛",
      examDate: "2026-11-14T09:00:00+08:00",
      durationMinutes: 150,
      currentWeek: studyWeekFor()
    });
  }
  if (url.pathname === "/api/plan/today") {
    const day = new Date().getDay();
    const rhythm = ["轻复盘", "概念复位", "方法专项", "证明训练", "限时训练", "错题回炉", "模拟训练"];
    return sendJson(response, 200, { week: studyWeekFor(), rhythm: rhythm[day], date: new Date().toISOString().slice(0, 10) });
  }
  if (url.pathname === "/local-reference/guide.pdf") {
    return servePdf(request, response, findReferencePdf());
  }
  return serveStatic(request, response, url.pathname);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Math study site: http://localhost:${port}`);
  console.log(`Reference PDF: ${findReferencePdf() ? "available" : "not configured"}`);
});
