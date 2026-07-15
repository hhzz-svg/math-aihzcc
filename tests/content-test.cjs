const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contentPath = path.join(root, "public", "content.js");
const bookPath = path.join(root, "public", "book-data.js");
const overridePath = path.join(root, "public", "data-override.js");
const source = `${fs.readFileSync(contentPath, "utf8")}\n${fs.readFileSync(bookPath, "utf8")}\n${fs.readFileSync(overridePath, "utf8")}\nthis.__data={PLAN_META,phases,weeklyRhythm,topics,problems,tips,mockExams,dailyRules,BOOK_META,BOOK_CHAPTERS,PAPER_INDEX,RESOURCE_LINKS,STUDY_WEEKS};`;
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "combined-content.js" });
const data = sandbox.__data;
const unique = (items) => new Set(items).size === items.length;
const checks = [];

checks.push(["9 knowledge chapters", data.BOOK_CHAPTERS.length === 9]);
checks.push(["9 topic records", data.topics.length === 9]);
checks.push(["topic weights sum to 100", data.topics.reduce((sum, item) => sum + item.weight, 0) === 100]);
checks.push(["81 original problems", data.problems.length === 81]);
checks.push(["9 problems per chapter", data.BOOK_CHAPTERS.every((chapter) => [chapter.exampleId, ...chapter.practiceIds].length === 9)]);
checks.push(["all chapter problem references valid", data.BOOK_CHAPTERS.every((chapter) => [chapter.exampleId, ...chapter.practiceIds].every((id) => data.problems.some((problem) => problem.id === id && problem.topic === chapter.id)))]);
checks.push(["unique problem ids", unique(data.problems.map((item) => item.id))]);
checks.push(["eight rich review sections", data.BOOK_CHAPTERS.every((chapter) => chapter.sections.length >= 8 && chapter.sections.every((section) => section.body.length > 70 && section.cue))]);
checks.push(["chapter review subjects are distinct", unique(data.BOOK_CHAPTERS.map((chapter) => chapter.sections[0]?.title))]);
checks.push(["all chapters map to PDF pages", data.BOOK_CHAPTERS.every((chapter) => chapter.pdfPages.length && chapter.pdfPages.every((page) => page >= 26 && page <= 29) && chapter.pdfAssets.length === chapter.pdfPages.length)]);
checks.push(["10 past paper entries", data.PAPER_INDEX.length === 10]);
checks.push(["paper pages ordered", data.PAPER_INDEX.every((item, index) => index === 0 || item.paperPage >= data.PAPER_INDEX[index - 1].paperPage)]);
checks.push(["18 week executable schedule", data.STUDY_WEEKS.length === 18 && data.STUDY_WEEKS.every((item) => item.daily.length === 7 && item.quota && item.output && item.check && item.fallback)]);
checks.push(["9 curated external resources", data.RESOURCE_LINKS.length === 9 && data.RESOURCE_LINKS.every((item) => item.url.startsWith("https://"))]);
checks.push(["18 competition techniques", data.tips.length === 18]);
checks.push(["official 2026 exam date", data.BOOK_META.examDate.startsWith("2026-11-14T09:00")]);
checks.push(["all problem solutions complete", data.problems.every((problem) => problem.statement && problem.hint && problem.solution && problem.answer && problem.trap)]);

const html = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "public", "styles.css"), "utf8");
checks.push(["book layout present", html.includes("book-layout") && html.includes("book-toc") && html.includes("margin-column")]);
checks.push(["no dashboard card markup", !html.includes("metric-grid") && !html.includes("problem-card") && !css.includes(".topic-card")]);
checks.push(["PDF.js bundled", fs.existsSync(path.join(root, "public", "assets", "vendor", "pdfjs", "build", "pdf.min.mjs"))]);
checks.push(["PDF excerpt images deployed", data.BOOK_CHAPTERS.every((chapter) => chapter.pdfAssets.every((asset) => fs.existsSync(path.join(root, "public", "assets", "reference", "pages", asset))))]);
checks.push(["private PDF available locally", fs.readdirSync(path.join(root, "private", "reference")).some((name) => name.toLowerCase().endsWith(".pdf"))]);

checks.forEach(([name, ok]) => console.log(`${ok ? "PASS" : "FAIL"} ${name}`));
if (checks.some(([, ok]) => !ok)) process.exit(1);
