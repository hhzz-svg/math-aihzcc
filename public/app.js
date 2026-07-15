(() => {
  "use strict";

  const STORAGE_KEY = "math-competition-book-v2";
  const pageEl = document.getElementById("book-page");
  const marginEl = document.getElementById("margin-column");
  const tocEl = document.getElementById("book-toc");
  const tocListEl = document.getElementById("toc-list");
  const scrimEl = document.getElementById("toc-scrim");
  const searchInput = document.getElementById("book-search");
  const searchResults = document.getElementById("search-results");
  const toastEl = document.getElementById("toast");
  const config = window.MATH_SITE_CONFIG || {};

  let state = loadState();
  let toastTimer = null;
  let pdfState = { document: null, page: 1, scale: 1.2, rendering: false, pending: null, sourceName: "" };

  function loadState() {
    const fallback = { problems: {}, chapters: {}, startedAt: new Date().toISOString() };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved === "object" ? { ...fallback, ...saved } : fallback;
    } catch {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateGlobalProgress();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  }

  async function hydrateBackendNote() {
    const note = document.getElementById("backend-note");
    if (!note) return;
    const base = String(config.apiBase || "").replace(/\/$/, "");
    try {
      const response = await fetch(`${base}/api/plan/today`, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) return;
      const data = await response.json();
      note.hidden = false;
      note.innerHTML = `<h2>今日节奏 · Render API</h2><p>第 ${data.week} 周 · ${data.rhythm}</p><p>主站内容离线可用，后端只提供日期与部署状态。</p>`;
    } catch {}
  }
  function renderMath(root = pageEl) {
    const run = () => {
      if (typeof window.renderMathInElement !== "function") return false;
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false,
        strict: false
      });
      return true;
    };
    if (!run()) setTimeout(() => run(), 120);
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "") || "home";
    const [path, queryString = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean);
    return { section: parts[0] || "home", id: parts[1] || "", query: new URLSearchParams(queryString) };
  }

  function topicForChapter(chapter) {
    return topics.find((topic) => topic.id === chapter.id);
  }

  function problemById(id) {
    return problems.find((problem) => problem.id === id);
  }

  function chapterByProblem(id) {
    const problem = problemById(id);
    return problem ? BOOK_CHAPTERS.find((chapter) => chapter.id === problem.topic) : null;
  }

  function daysUntilExam() {
    const now = new Date();
    const exam = new Date(BOOK_META.examDate);
    return Math.max(0, Math.ceil((exam - now) / 86400000));
  }

  function currentStudyWeek() {
    const now = new Date();
    const start = new Date("2026-07-15T00:00:00+08:00");
    const diff = Math.floor((now - start) / 86400000);
    if (diff <= 4) return STUDY_WEEKS[0];
    const index = Math.min(STUDY_WEEKS.length - 1, Math.max(1, 1 + Math.floor((diff - 5) / 7)));
    return STUDY_WEEKS[index];
  }

  function totalMastered() {
    return problems.filter((problem) => state.problems[problem.id] === "mastered").length;
  }

  function chapterMastery(chapter) {
    const ids = [chapter.exampleId, ...chapter.practiceIds];
    const mastered = ids.filter((id) => state.problems[id] === "mastered").length;
    return { mastered, total: ids.length, percent: Math.round((mastered / ids.length) * 100) };
  }

  function updateGlobalProgress() {
    const mastered = totalMastered();
    const chapterDone = BOOK_CHAPTERS.filter((chapter) => state.chapters[chapter.id]).length;
    const score = Math.round(((mastered + chapterDone * 2) / (problems.length + BOOK_CHAPTERS.length * 2)) * 100);
    document.getElementById("toc-progress-text").textContent = `${mastered}/${problems.length} 题掌握 · ${chapterDone}/${BOOK_CHAPTERS.length} 章完成`;
    document.getElementById("reading-progress-bar").style.width = `${score}%`;
  }

  function buildToc() {
    const chapterItems = BOOK_CHAPTERS.map((chapter) => `
      <li>
        <a href="#/chapter/${chapter.id}" data-route="chapter" data-chapter="${chapter.id}">
          <span>${chapter.number}</span><strong>${chapter.title}</strong>
        </a>
      </li>`).join("");
    tocListEl.insertAdjacentHTML("beforeend", chapterItems);
  }

  function setActiveToc(route) {
    document.querySelectorAll("[data-route]").forEach((link) => link.classList.remove("is-active"));
    if (route.section === "chapter") {
      document.querySelector(`[data-chapter="${CSS.escape(route.id)}"]`)?.classList.add("is-active");
    } else {
      document.querySelector(`[data-route="${CSS.escape(route.section)}"]`)?.classList.add("is-active");
    }
  }

  function pageHeading(kicker, title, subtitle) {
    return `
      <header>
        <p class="page-kicker">${kicker}</p>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${subtitle}</p>
        <div class="title-rule"><span>∫</span><span></span><span>CMC 2026</span></div>
      </header>`;
  }

  function renderHome() {
    const week = currentStudyWeek();
    const chapterRows = BOOK_CHAPTERS.map((chapter) => {
      const progress = chapterMastery(chapter);
      return `
        <li>
          <span>${chapter.number}</span>
          <a href="#/chapter/${chapter.id}">${chapter.title}</a>
          <small>${progress.mastered}/${progress.total} 题掌握</small>
        </li>`;
    }).join("");

    pageEl.innerHTML = `
      <section class="cover">
        <div class="cover-mark">∫</div>
        <h1>数竞研习录<span>全国大学生数学竞赛 · 非数学专业 A 类</span></h1>
        <p class="cover-intro">这不是进度仪表盘，而是一册可以从头读、按章练、随时回查原书页码的个人竞赛讲义。知识回顾在前，例题与练习随后，计划只负责安排节奏。</p>
        <div class="cover-meta">
          <div><span>考试日期</span><strong>2026 年 11 月 14 日</strong></div>
          <div><span>剩余时间</span><strong>${daysUntilExam()} 天</strong></div>
          <div><span>当前安排</span><strong>第 ${week.week} 周 · ${week.focus}</strong></div>
        </div>
        <a class="start-reading" href="#/chapter/limits">从第一章开始阅读 →</a>
      </section>

      <section class="chapter-section" id="how-to-use">
        <span class="section-number">卷首说明</span>
        <h2>怎样使用这本讲义</h2>
        <p class="dropcap">每章先读知识回顾，把定理条件和方法触发器口述一遍；再遮住解析完成例题与练习。做错时只记录“我选错了什么入口”，而不是抄整页答案。章节末尾可直接跳到参考指南的对应考纲页，或进入历届真题索引。</p>
        <ol class="step-list">
          <li>知识回顾：每次只读一小节，并用自己的话复述。</li>
          <li>章内例题：先独立写出主线，再展开参考解。</li>
          <li>练习：按“掌握 / 待回炉”标记，待回炉题优先复做。</li>
          <li>真题：从 10 月开始整卷限时，前期只按专题抽题。</li>
        </ol>
      </section>

      <section class="chapter-section" id="chapter-index">
        <span class="section-number">正文目录</span>
        <h2>九章高等数学主线</h2>
        <ul class="exercise-index">${chapterRows}</ul>
      </section>

      <section class="chapter-section" id="this-week">
        <span class="section-number">本周书签</span>
        <h2>第 ${week.week} 周 · ${week.focus}</h2>
        <p>${week.work}</p>
        <p class="method-cue">固定周节奏：周一概念复位，周二方法专项，周三证明，周四限时，周五错题，周六模拟，周日轻复盘。</p>
      </section>`;

    marginEl.innerHTML = `
      <section class="margin-note">
        <h2>考试信息</h2>
        <p>2026.11.14<br>09:00–11:30</p>
        <p>非数学专业 A 类初赛主线：高等数学。</p>
        <a href="${BOOK_META.officialNotice}" target="_blank" rel="noopener">查看中国数学会通知</a>
      </section>
      <section class="margin-note">
        <h2>学习进度</h2>
        <p>${totalMastered()} / ${problems.length} 道题已掌握</p>
        <div class="margin-progress"><span style="width:${Math.round(totalMastered() / problems.length * 100)}%"></span></div>
        <p>${BOOK_CHAPTERS.filter((c) => state.chapters[c.id]).length} / ${BOOK_CHAPTERS.length} 章已完成</p>
      </section>
      <section class="margin-note" id="backend-note" hidden></section>
      <section class="margin-note">
        <h2>原书入口</h2>
        <p>考纲从物理第 26 页开始；非数学专业历届初赛从第 92 页开始。</p>
        <a href="#/reference?page=26">打开原书阅读器</a>
      </section>`;
    hydrateBackendNote();
  }

  function renderProblem(problem, kind = "exercise") {
    const status = state.problems[problem.id] || "";
    const difficulty = "●".repeat(problem.difficulty) + "○".repeat(3 - problem.difficulty);
    const label = kind === "example" ? "章内例题" : "练习";
    return `
      <section class="${kind}" id="exercise-${problem.id}">
        <div class="${kind}-label"><span>${label} · ${problem.id}</span><small>${difficulty} · 建议 ${problem.minutes} 分钟 · ${problem.skill}</small></div>
        <h3>${problem.title}</h3>
        <div class="problem-statement">${problem.statement}</div>
        <div class="problem-actions" aria-label="题目状态">
          <button class="status-button ${status === "mastered" ? "is-active" : ""}" data-problem-status="mastered" data-problem-id="${problem.id}" type="button">✓ 已掌握</button>
          <button class="status-button ${status === "review" ? "is-active" : ""}" data-problem-status="review" data-problem-id="${problem.id}" type="button">↺ 待回炉</button>
        </div>
        <details class="solution-block">
          <summary>查看提示</summary>
          <div class="solution-copy">${problem.hint}</div>
        </details>
        <details class="solution-block">
          <summary>展开完整解析</summary>
          <div class="solution-copy"><strong>解：</strong>${problem.solution}<p><strong>答案：</strong>${problem.answer}</p><p class="trap-note"><strong>易错点：</strong>${problem.trap}</p></div>
        </details>
      </section>`;
  }

  function renderChapter(chapter, route) {
    const topic = topicForChapter(chapter);
    const progress = chapterMastery(chapter);
    const currentIndex = BOOK_CHAPTERS.findIndex((item) => item.id === chapter.id);
    const previous = BOOK_CHAPTERS[currentIndex - 1];
    const next = BOOK_CHAPTERS[currentIndex + 1];
    const sectionHtml = chapter.sections.map((section, index) => `
      <section class="chapter-section" id="section-${chapter.id}-${index + 1}">
        <span class="section-number">${chapter.number} · ${index + 1}</span>
        <h2>${section.title}</h2>
        <p>${section.body}</p>
        <p class="method-cue">方法触发器：${section.cue}</p>
      </section>`).join("");
    const formulas = topic.formulas.map((item) => `<li>${item}</li>`).join("");
    const steps = topic.steps.map((item) => `<li>${item}</li>`).join("");
    const pitfalls = topic.pitfalls.map((item) => `<li>${item}</li>`).join("");
    const pageLinks = chapter.pdfPages.map((page) => `<a href="#/reference?page=${page}">原书物理第 ${page} 页</a>`).join(" · ");
    const practiceHtml = chapter.practiceIds.map((id) => renderProblem(problemById(id))).join("");

    pageEl.innerHTML = `
      ${pageHeading(chapter.number, chapter.title, chapter.subtitle)}
      <p class="lede dropcap">${chapter.opening}</p>
      <div class="reference-line"><span>参考指南考纲定位</span>${pageLinks}<span>· 预计占比 ${chapter.examWeight}</span></div>
      ${sectionHtml}

      <section class="chapter-section" id="chapter-methods">
        <span class="section-number">本章方法页</span>
        <h2>公式、流程与易错点</h2>
        <h3>必须能口述的公式</h3>
        <ul class="formula-list">${formulas}</ul>
        <h3>标准解题流程</h3>
        <ol class="step-list">${steps}</ol>
        <h3>高频失分点</h3>
        <ul class="pitfall-list">${pitfalls}</ul>
      </section>

      <section class="chapter-section" id="worked-example">
        <span class="section-number">先做后看</span>
        <h2>章内例题</h2>
        ${renderProblem(problemById(chapter.exampleId), "example")}
      </section>

      <section class="chapter-section" id="practice-set">
        <span class="section-number">独立完成</span>
        <h2>本章练习</h2>
        ${practiceHtml}
      </section>

      <nav class="chapter-nav" aria-label="章节翻页">
        <a href="${previous ? `#/chapter/${previous.id}` : "#/home"}"><span>上一页</span><strong>${previous ? previous.title : "卷首"}</strong></a>
        <a href="${next ? `#/chapter/${next.id}` : "#/papers"}"><span>下一页</span><strong>${next ? next.title : "历届真题索引"}</strong></a>
      </nav>`;

    marginEl.innerHTML = `
      <section class="margin-note">
        <h2>本章进度</h2>
        <p>${progress.mastered} / ${progress.total} 题已掌握</p>
        <div class="margin-progress"><span style="width:${progress.percent}%"></span></div>
        <label class="margin-check"><input id="chapter-complete" type="checkbox" ${state.chapters[chapter.id] ? "checked" : ""}> <span>我能口述方法并独立完成章内例题</span></label>
      </section>
      <section class="margin-note">
        <h2>本章目标</h2>
        <p>${topic.target}</p>
      </section>
      <section class="margin-note">
        <h2>页内目录</h2>
        <ul>
          ${chapter.sections.map((section, index) => `<li><a href="#/chapter/${chapter.id}?anchor=section-${chapter.id}-${index + 1}">${section.title}</a></li>`).join("")}
          <li><a href="#/chapter/${chapter.id}?anchor=chapter-methods">方法页</a></li>
          <li><a href="#/chapter/${chapter.id}?anchor=worked-example">章内例题</a></li>
          <li><a href="#/chapter/${chapter.id}?anchor=practice-set">本章练习</a></li>
        </ul>
      </section>
      <section class="margin-note">
        <h2>原书页码</h2>
        <p>${chapter.pdfPages.map((page) => `物理第 ${page} 页`).join("、")}</p>
        ${pageLinks}
      </section>`;

    document.getElementById("chapter-complete")?.addEventListener("change", (event) => {
      state.chapters[chapter.id] = event.target.checked;
      saveState();
      showToast(event.target.checked ? "本章已标记完成" : "已取消本章完成标记");
    });

    bindProblemButtons();
    renderMath();

    const exerciseId = route.query.get("exercise");
    if (exerciseId) {
      requestAnimationFrame(() => document.getElementById(`exercise-${exerciseId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  function bindProblemButtons() {
    document.querySelectorAll("[data-problem-status]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.problemId;
        const nextStatus = button.dataset.problemStatus;
        state.problems[id] = state.problems[id] === nextStatus ? "" : nextStatus;
        saveState();
        const problem = problemById(id);
        const route = parseRoute();
        const chapter = BOOK_CHAPTERS.find((item) => item.id === problem.topic);
        if (route.section === "chapter" && chapter) renderChapter(chapter, { ...route, query: new URLSearchParams(`exercise=${id}`) });
        showToast(state.problems[id] === "mastered" ? "已记为掌握" : state.problems[id] === "review" ? "已加入待回炉" : "已清除题目标记");
      });
    });
  }

  function renderPlan() {
    const current = currentStudyWeek();
    const rows = STUDY_WEEKS.map((item) => `
      <tr${item.week === current.week ? ' aria-current="true"' : ""}>
        <td>${item.week === current.week ? "→ " : ""}${item.week}</td>
        <td>${item.dates}</td>
        <td><strong>${item.focus}</strong></td>
        <td>${item.work}</td>
      </tr>`).join("");
    pageEl.innerHTML = `
      ${pageHeading("附录一", "十八周训练安排", "计划为知识学习服务：每周只设一个主主题，并保留固定的错题与限时训练节奏。")}
      <p class="lede">你刚学完微积分 2，前半程不需要重新听完整课程，而要用诊断题找出真正薄弱的概念；9 月前补齐多元与线面积分，10 月开始转向整卷和错误决策复盘。</p>
      <table class="plan-table">
        <thead><tr><th>周</th><th>日期</th><th>主题</th><th>最低交付</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <section class="chapter-section" style="margin-top:52px">
        <span class="section-number">固定节奏</span>
        <h2>每周七天怎么分</h2>
        <ol class="step-list">${weeklyRhythm.map((item) => `<li><strong>${item.day} · ${item.title}</strong>：${item.text}</li>`).join("")}</ol>
      </section>`;
    marginEl.innerHTML = `
      <section class="margin-note"><h2>本周</h2><p>第 ${current.week} 周 · ${current.dates}</p><p><strong>${current.focus}</strong></p><p>${current.work}</p></section>
      <section class="margin-note"><h2>训练底线</h2><ul><li>每周至少一次限时闭卷</li><li>错题 24 小时内订正</li><li>每周日只复盘，不追新难题</li></ul></section>
      <section class="margin-note"><h2>完整计划来源</h2><p>按 2026 年 7 月 15 日至 11 月 13 日倒排，考试为 11 月 14 日。</p></section>`;
  }

  function renderPapers() {
    const rows = PAPER_INDEX.map((item) => `
      <tr>
        <td>${item.year}</td>
        <td><a href="#/reference?page=${item.paperPage}">试题 · 第 ${item.paperPage} 页</a></td>
        <td><a href="#/reference?page=${item.solutionPage}">解答 · 第 ${item.solutionPage} 页</a></td>
      </tr>`).join("");
    pageEl.innerHTML = `
      ${pageHeading("附录二", "历届真题索引", "参考指南收录的前十届非数学专业初赛试题与参考解答，全部按物理 PDF 页码直达。")}
      <p class="lede">7—9 月按章节抽题，10 月后按整卷限时。做整卷时先完成度、再攻难题、最后检查“域—号—界—结论”。不要在打开参考解答前只在脑中想，必须留下可评分的书写。</p>
      <table class="paper-table">
        <thead><tr><th>届次</th><th>初赛试题</th><th>参考解答</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <section class="chapter-section" style="margin-top:52px">
        <span class="section-number">整卷训练法</span>
        <h2>三轮作答</h2>
        <ol class="step-list">
          <li><strong>第一轮 70–80 分钟：</strong>只做入口明确、计算可控的题，建立完成度。</li>
          <li><strong>第二轮 45–55 分钟：</strong>处理需要构造、换序或三大公式的中高档题。</li>
          <li><strong>第三轮 15–25 分钟：</strong>检查定义域、正负号、积分边界与最终结论。</li>
        </ol>
      </section>`;
    marginEl.innerHTML = `
      <section class="margin-note"><h2>原书总入口</h2><p>非数学专业初赛试题从物理第 92 页开始，参考解答从第 105 页开始。</p><a href="#/reference?page=92">跳到试题总入口</a></section>
      <section class="margin-note"><h2>建议顺序</h2><p>先做较早届次熟悉风格，再留第八至第十届作为后期整卷。</p></section>
      <section class="margin-note"><h2>计时</h2><p>正式初赛 150 分钟。10 月前可先做 75 分钟半套训练。</p></section>`;
  }

  function renderResources() {
    const groups = [...new Set(RESOURCE_LINKS.map((item) => item.group))];
    const content = groups.map((group) => `
      <h2 class="resource-group">${group}</h2>
      ${RESOURCE_LINKS.filter((item) => item.group === group).map((item, index) => `
        <article class="resource-entry">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div><a href="${item.url}" target="_blank" rel="noopener"><h2>${item.title} ↗</h2><p>${item.description}</p></a></div>
        </article>`).join("")}`).join("");
    pageEl.innerHTML = `
      ${pageHeading("附录四", "补充资料站点", "把外部站点当作查漏、直观和验算工具，不把浏览资料误当作完成训练。")}
      <p class="lede">同一个知识点只保留一个主讲义和一个补充解释来源。看完视频或网页后，必须立刻做一道题；否则“看懂了”很难转化为竞赛中的独立书写。</p>
      ${content}`;
    marginEl.innerHTML = `
      <section class="margin-note"><h2>使用规则</h2><ul><li>课程站点用于补概念</li><li>作图站点用于建立直观</li><li>计算站点只用于最后验算</li></ul></section>
      <section class="margin-note"><h2>官方信息</h2><p>考试日期、分类和报名只以中国数学会及所在赛区通知为准。</p><a href="${BOOK_META.officialNotice}" target="_blank" rel="noopener">第十八届通知</a></section>`;
  }

  function renderMethods() {
    const entries = tips.map((tip, index) => `
      <article class="method-entry">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div><h2>${tip.title}</h2><p>${tip.text}</p><em>自检：${tip.check}</em></div>
      </article>`).join("");
    pageEl.innerHTML = `
      ${pageHeading("附录五", "竞赛方法手册", "18 条可以直接写进草稿纸顶部的解题规则。")}
      <p class="lede">技巧不是捷径，而是把高频正确决策固定下来。每做完一套题，只挑一条最影响得分的规则执行一周，不要同时改十件事。</p>
      ${entries}`;
    marginEl.innerHTML = `
      <section class="margin-note"><h2>今天只选一条</h2><p>${dailyRules[new Date().getDay() % dailyRules.length]}</p></section>
      <section class="margin-note"><h2>错题三行</h2><ol><li>我选了什么入口</li><li>为什么这个入口错</li><li>下次看到什么信号要换方法</li></ol></section>`;
    renderMath();
  }

  function pdfPlaceholder(message = "尚未载入参考书") {
    const stage = document.getElementById("pdf-stage");
    if (!stage) return;
    stage.innerHTML = `
      <div class="pdf-placeholder">
        <h2>${message}</h2>
        <p>本地启动脚本会自动读取 <code>private/reference</code> 中的个人副本；公开部署版本不附带整本参考书。</p>
        <ol><li>点击上方“选择本机 PDF”；</li><li>选择《全国大学生数学竞赛参赛指南》；</li><li>页面会立即跳到当前知识点对应的物理页码。</li></ol>
      </div>`;
  }

  async function getPdfLibrary() {
    if (window.__pdfjsLibrary) return window.__pdfjsLibrary;
    const moduleUrl = new URL("assets/vendor/pdfjs/build/pdf.min.mjs", document.baseURI).href;
    const pdfjs = await import(moduleUrl);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("assets/vendor/pdfjs/build/pdf.worker.min.mjs", document.baseURI).href;
    window.__pdfjsLibrary = pdfjs;
    return pdfjs;
  }

  function pdfOptions(extra = {}) {
    return {
      cMapUrl: new URL("assets/vendor/pdfjs/cmaps/", document.baseURI).href,
      cMapPacked: true,
      standardFontDataUrl: new URL("assets/vendor/pdfjs/standard_fonts/", document.baseURI).href,
      ...extra
    };
  }

  async function loadPdfFromUrl(url, targetPage) {
    const status = document.getElementById("pdf-status");
    try {
      if (status) status.textContent = "正在连接本地参考书…";
      const head = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (!head.ok || !String(head.headers.get("content-type") || "").includes("pdf")) throw new Error("reference unavailable");
      const pdfjs = await getPdfLibrary();
      const task = pdfjs.getDocument(pdfOptions({ url }));
      pdfState.document = await task.promise;
      pdfState.sourceName = "本地参考书";
      pdfState.page = Math.min(Math.max(1, targetPage), pdfState.document.numPages);
      await renderPdfPage();
    } catch {
      if (status) status.textContent = "请选择本机 PDF";
      pdfPlaceholder("公开站点未附带原书文件");
    }
  }

  async function loadPdfFromFile(file, targetPage) {
    const status = document.getElementById("pdf-status");
    if (status) status.textContent = "正在读取 PDF…";
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const pdfjs = await getPdfLibrary();
      const task = pdfjs.getDocument(pdfOptions({ data }));
      pdfState.document = await task.promise;
      pdfState.sourceName = file.name;
      pdfState.page = Math.min(Math.max(1, targetPage), pdfState.document.numPages);
      await renderPdfPage();
      showToast("参考书已载入，可使用章节页码跳转");
    } catch (error) {
      if (status) status.textContent = "PDF 读取失败";
      pdfPlaceholder("无法读取这个 PDF");
      console.error(error);
    }
  }

  async function renderPdfPage() {
    if (!pdfState.document) return;
    if (pdfState.rendering) {
      pdfState.pending = pdfState.page;
      return;
    }
    pdfState.rendering = true;
    const stage = document.getElementById("pdf-stage");
    const status = document.getElementById("pdf-status");
    const pageInput = document.getElementById("pdf-page-input");
    try {
      const page = await pdfState.document.getPage(pdfState.page);
      const viewport = page.getViewport({ scale: pdfState.scale });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      let canvas = document.getElementById("pdf-canvas");
      if (!canvas) {
        stage.innerHTML = '<canvas id="pdf-canvas" aria-label="PDF 页面"></canvas>';
        canvas = document.getElementById("pdf-canvas");
      }
      const context = canvas.getContext("2d", { alpha: false });
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      await page.render({ canvasContext: context, viewport, transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0] }).promise;
      if (pageInput) pageInput.value = String(pdfState.page);
      if (status) status.textContent = `${pdfState.sourceName} · ${pdfState.page} / ${pdfState.document.numPages} 页 · ${Math.round(pdfState.scale * 100)}%`;
      const route = parseRoute();
      if (route.section === "reference" && Number(route.query.get("page")) !== pdfState.page) {
        history.replaceState(null, "", `#/reference?page=${pdfState.page}`);
      }
    } finally {
      pdfState.rendering = false;
      if (pdfState.pending && pdfState.pending !== pdfState.page) {
        pdfState.page = pdfState.pending;
        pdfState.pending = null;
        renderPdfPage();
      } else {
        pdfState.pending = null;
      }
    }
  }

  function bindPdfControls(targetPage) {
    document.getElementById("pdf-file")?.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) loadPdfFromFile(file, targetPage);
    });
    document.getElementById("pdf-prev")?.addEventListener("click", () => {
      if (!pdfState.document || pdfState.page <= 1) return;
      pdfState.page -= 1;
      renderPdfPage();
    });
    document.getElementById("pdf-next")?.addEventListener("click", () => {
      if (!pdfState.document || pdfState.page >= pdfState.document.numPages) return;
      pdfState.page += 1;
      renderPdfPage();
    });
    document.getElementById("pdf-go")?.addEventListener("click", () => {
      if (!pdfState.document) return;
      const value = Number(document.getElementById("pdf-page-input").value);
      pdfState.page = Math.min(Math.max(1, value || 1), pdfState.document.numPages);
      renderPdfPage();
    });
    document.getElementById("pdf-page-input")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") document.getElementById("pdf-go")?.click();
    });
    document.getElementById("pdf-zoom-out")?.addEventListener("click", () => {
      pdfState.scale = Math.max(.6, pdfState.scale - .15);
      renderPdfPage();
    });
    document.getElementById("pdf-zoom-in")?.addEventListener("click", () => {
      pdfState.scale = Math.min(2.5, pdfState.scale + .15);
      renderPdfPage();
    });
  }

  function renderReference(route) {
    const targetPage = Math.min(BOOK_META.referencePages, Math.max(1, Number(route.query.get("page")) || 26));
    pageEl.innerHTML = `
      <div class="pdf-shell">
        ${pageHeading("附录三", "原书阅读器", `当前定位：参考指南物理第 ${targetPage} 页。章节中的“原书页码”链接都会进入这里。`)}
        <p class="pdf-intro">本地模式自动读取项目内的个人 PDF 副本；部署到公开域名时，点击“选择本机 PDF”即可在浏览器内阅读，文件不会上传。</p>
        <div class="pdf-toolbar" aria-label="PDF 工具栏">
          <button id="pdf-prev" type="button">← 上一页</button>
          <label>第 <input id="pdf-page-input" type="number" min="1" max="${BOOK_META.referencePages}" value="${targetPage}"> 页</label>
          <button id="pdf-go" type="button">跳转</button>
          <button id="pdf-next" type="button">下一页 →</button>
          <button id="pdf-zoom-out" type="button" aria-label="缩小">−</button>
          <button id="pdf-zoom-in" type="button" aria-label="放大">＋</button>
          <label class="file-label">选择本机 PDF<input id="pdf-file" type="file" accept="application/pdf"></label>
          <span class="pdf-status" id="pdf-status">准备载入…</span>
        </div>
        <div class="pdf-stage" id="pdf-stage"><div class="pdf-placeholder"><h2>正在寻找本地参考书…</h2></div></div>
      </div>`;
    marginEl.innerHTML = `
      <section class="margin-note"><h2>常用页码</h2><ul><li><a href="#/reference?page=26">非数学专业考纲 · 26</a></li><li><a href="#/reference?page=92">历届初赛入口 · 92</a></li><li><a href="#/reference?page=105">历届解答入口 · 105</a></li></ul></section>
      <section class="margin-note"><h2>页码说明</h2><p>网页统一使用 PDF 物理页码，不使用书页底部印刷页码。</p></section>
      <section class="margin-note"><h2>隐私</h2><p>通过“选择本机 PDF”打开时，文件只在你的浏览器内处理，不会上传到服务器。</p></section>`;
    pdfState.page = targetPage;
    bindPdfControls(targetPage);
    if (pdfState.document) renderPdfPage();
    else loadPdfFromUrl(config.referenceEndpoint || "/local-reference/guide.pdf", targetPage);
  }

  function searchIndex() {
    const entries = [];
    BOOK_CHAPTERS.forEach((chapter) => {
      entries.push({ type: chapter.number, title: chapter.title, desc: chapter.subtitle, href: `#/chapter/${chapter.id}`, text: `${chapter.title} ${chapter.subtitle} ${chapter.opening}` });
      chapter.sections.forEach((section, index) => entries.push({ type: chapter.title, title: section.title, desc: section.cue, href: `#/chapter/${chapter.id}?anchor=section-${chapter.id}-${index + 1}`, text: `${section.title} ${section.body} ${section.cue}` }));
    });
    problems.forEach((problem) => entries.push({ type: `题目 ${problem.id}`, title: problem.title, desc: problem.skill, href: `#/chapter/${problem.topic}?exercise=${problem.id}`, text: `${problem.title} ${problem.skill} ${problem.statement}` }));
    tips.forEach((tip) => entries.push({ type: "方法手册", title: tip.title, desc: tip.check, href: "#/methods", text: `${tip.title} ${tip.text} ${tip.check}` }));
    RESOURCE_LINKS.forEach((item) => entries.push({ type: item.group, title: item.title, desc: item.description, href: item.url, external: true, text: `${item.title} ${item.description}` }));
    return entries;
  }

  const SEARCH_INDEX = searchIndex();

  function runSearch(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      searchResults.hidden = true;
      return;
    }
    const results = SEARCH_INDEX.filter((entry) => entry.text.toLowerCase().includes(normalized)).slice(0, 12);
    searchResults.innerHTML = results.length ? results.map((entry) => `
      <a class="search-result" href="${entry.href}" ${entry.external ? 'target="_blank" rel="noopener"' : ""}>
        <span>${escapeHtml(entry.type)}</span><strong>${escapeHtml(entry.title)}</strong><small>${escapeHtml(entry.desc)}</small>
      </a>`).join("") : '<p class="search-empty">没有找到。试试“Taylor”“换序”“Green”或题号。</p>';
    searchResults.hidden = false;
  }

  function closeToc() {
    tocEl.classList.remove("is-open");
    scrimEl.hidden = true;
    document.getElementById("toc-toggle").setAttribute("aria-expanded", "false");
  }

  function openToc() {
    tocEl.classList.add("is-open");
    scrimEl.hidden = false;
    document.getElementById("toc-toggle").setAttribute("aria-expanded", "true");
  }

  function exportProgress() {
    const payload = { exportedAt: new Date().toISOString(), site: BOOK_META, progress: state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `数竞研习录-学习进度-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("学习进度已导出");
  }

  function updateScrollProgress() {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maximum > 0 ? Math.min(100, Math.max(0, window.scrollY / maximum * 100)) : 100;
    document.getElementById("reading-progress-bar").style.width = `${percent}%`;
  }

  function renderRoute() {
    const route = parseRoute();
    closeToc();
    searchResults.hidden = true;
    searchInput.value = "";
    window.scrollTo({ top: 0, behavior: "auto" });
    setActiveToc(route);

    if (route.section === "chapter") {
      const chapter = BOOK_CHAPTERS.find((item) => item.id === route.id) || BOOK_CHAPTERS[0];
      renderChapter(chapter, route);
      document.title = `${chapter.title}｜数竞研习录`;
    } else if (route.section === "plan") {
      renderPlan();
      document.title = "十八周训练安排｜数竞研习录";
    } else if (route.section === "papers") {
      renderPapers();
      document.title = "历届真题索引｜数竞研习录";
    } else if (route.section === "reference") {
      renderReference(route);
      document.title = "原书阅读器｜数竞研习录";
    } else if (route.section === "resources") {
      renderResources();
      document.title = "补充资料站点｜数竞研习录";
    } else if (route.section === "methods") {
      renderMethods();
      document.title = "竞赛方法手册｜数竞研习录";
    } else {
      renderHome();
      renderMath();
      document.title = "数竞研习录｜2026 全国大学生数学竞赛";
    }

    renderMath();
    const anchor = route.query.get("anchor");
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    updateGlobalProgress();
    requestAnimationFrame(updateScrollProgress);
    document.getElementById("reading-pane").focus({ preventScroll: true });
  }

  buildToc();
  updateGlobalProgress();
  renderRoute();

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  document.getElementById("toc-toggle").addEventListener("click", () => tocEl.classList.contains("is-open") ? closeToc() : openToc());
  document.getElementById("toc-close").addEventListener("click", closeToc);
  scrimEl.addEventListener("click", closeToc);
  document.getElementById("export-progress").addEventListener("click", exportProgress);
  tocEl.addEventListener("click", (event) => { if (event.target.closest("a")) closeToc(); });
  searchInput.addEventListener("input", (event) => runSearch(event.target.value));
  searchInput.addEventListener("keydown", (event) => { if (event.key === "Escape") { searchResults.hidden = true; searchInput.blur(); } });
  searchResults.addEventListener("click", () => { searchResults.hidden = true; });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-field") && !event.target.closest(".search-results")) searchResults.hidden = true;
  });
})();





