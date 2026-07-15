const STORAGE_KEY = "cmath-sprint-2026-state";
const difficultyLabels = { 1: "基础", 2: "进阶", 3: "挑战" };
const viewTitles = {
  overview: "今日总览",
  plan: "17 周计划",
  knowledge: "知识地图",
  practice: "题库训练",
  mock: "模拟战场",
  tips: "技巧手册"
};

let state = loadState();
let currentView = "overview";
let selectedTopicId = state.selectedTopic || topics[0].id;
let weakOnly = false;
let activeChallenge = null;
let focusSeconds = 45 * 60;
let focusTimer = null;
let focusRunning = false;
let mockTimer = null;
let mockSeconds = 0;
let activeMockId = null;
let toastTimer = null;

function defaultState() {
  return {
    weeklyTarget: PLAN_META.defaultWeeklyHours,
    problemStatus: {},
    taskDone: {},
    weakTopics: [],
    activityDates: [],
    mockScores: {},
    selectedTopic: topics[0].id
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch (error) {
    console.warn("无法读取本地进度，已使用默认状态。", error);
    return defaultState();
  }
}

function saveState() {
  state.selectedTopic = selectedTopicId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function parseDate(iso) {
  const [y, mth, d] = iso.split("-").map(Number);
  return new Date(y, mth - 1, d);
}

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toISO(date) {
  const y = date.getFullYear();
  const mth = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${mth}-${d}`;
}

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getCurrentPhase() {
  const today = todayStart();
  return phases.find((phase) => today >= parseDate(phase.start) && today <= parseDate(phase.end))
    || (today < parseDate(phases[0].start) ? phases[0] : phases[phases.length - 1]);
}

function getTopic(id) {
  return topics.find((topic) => topic.id === id);
}

function getProblem(id) {
  return problems.find((problem) => problem.id === id);
}

function formatShortDate(iso) {
  const date = parseDate(iso);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

function formatDateRange(start, end) {
  return `${formatShortDate(start)} — ${formatShortDate(end)}`;
}

function renderMath(root = document.body) {
  if (window.renderMathInElement && root) {
    try {
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    } catch (error) {
      console.warn("公式渲染跳过：", error);
    }
  }
}

function addActivity() {
  const today = toISO(todayStart());
  if (!state.activityDates.includes(today)) {
    state.activityDates.push(today);
    state.activityDates.sort();
    saveState();
  }
}

function getStreak() {
  if (!state.activityDates.length) return 0;
  const set = new Set(state.activityDates);
  let cursor = todayStart();
  if (!set.has(toISO(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(toISO(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function getTopicMastery(topicId) {
  const list = problems.filter((p) => p.topic === topicId);
  if (!list.length) return 0;
  const points = list.reduce((sum, p) => {
    const status = state.problemStatus[p.id];
    return sum + (status === "correct" ? 1 : status === "wrong" ? 0.2 : 0);
  }, 0);
  return Math.round((points / list.length) * 100);
}

function getStudyProgress() {
  const correct = Object.values(state.problemStatus).filter((s) => s === "correct").length;
  return Math.round((correct / problems.length) * 100);
}

function init() {
  bindNavigation();
  bindGlobalActions();
  document.getElementById("weekly-target").value = String(state.weeklyTarget);
  populateTopicFilter();
  updateDateLabels();
  renderAll();
  renderMath(document.body);
}

function bindNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.jump));
  });
  document.getElementById("mobile-menu").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("is-open");
  });
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".app-view").forEach((section) => section.classList.remove("is-active"));
  document.getElementById(`view-${view}`).classList.add("is-active");
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  document.getElementById("view-title").textContent = viewTitles[view];
  document.getElementById("sidebar").classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "knowledge") renderKnowledge();
  if (view === "practice") renderProblems();
  if (view === "mock") renderMocks();
  renderMath(document.getElementById(`view-${view}`));
}

function bindGlobalActions() {
  document.getElementById("weekly-target").addEventListener("change", (event) => {
    state.weeklyTarget = Number(event.target.value);
    saveState();
    renderMetrics();
    showToast(`每周目标已调整为 ${state.weeklyTarget} 小时。`);
  });

  document.getElementById("start-daily-challenge").addEventListener("click", createChallenge);
  document.getElementById("random-six").addEventListener("click", createChallenge);
  document.getElementById("focus-toggle").addEventListener("click", toggleFocusTimer);
  document.getElementById("focus-reset").addEventListener("click", resetFocusTimer);
  document.getElementById("review-weak").addEventListener("click", () => {
    weakOnly = !weakOnly;
    document.getElementById("review-weak").textContent = weakOnly ? "显示全部专题" : "只看薄弱项";
    renderKnowledge();
  });

  ["problem-search", "topic-filter", "difficulty-filter", "status-filter"].forEach((id) => {
    document.getElementById(id).addEventListener(id === "problem-search" ? "input" : "change", renderProblems);
  });

  document.getElementById("problem-modal").addEventListener("click", (event) => {
    if (event.target.id === "problem-modal" || event.target.matches("[data-close-modal]")) closeProblemModal();
  });
  document.getElementById("mock-modal").addEventListener("click", (event) => {
    if (event.target.id === "mock-modal" || event.target.matches("[data-close-mock]")) closeMockModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProblemModal();
      closeMockModal();
    }
  });

  document.getElementById("export-progress").addEventListener("click", exportProgress);
  document.getElementById("reset-progress").addEventListener("click", resetProgress);
}

function updateDateLabels() {
  const now = new Date();
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  document.getElementById("today-label").textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${weekdays[now.getDay()]}`;

  const exam = parseDate(PLAN_META.examDate);
  const today = todayStart();
  const left = Math.max(0, daysBetween(today, exam));
  document.getElementById("days-left").textContent = left;

  const start = parseDate(PLAN_META.startDate);
  const full = daysBetween(start, exam);
  const elapsed = clamp(daysBetween(start, today), 0, full);
  document.getElementById("sidebar-progress").style.width = `${Math.round((elapsed / full) * 100)}%`;
}

function renderAll() {
  renderOverview();
  renderPlan();
  renderKnowledge();
  renderProblems();
  renderMocks();
  renderTips();
}

function renderOverview() {
  const phase = getCurrentPhase();
  document.getElementById("phase-summary").textContent = `${phase.title}。${phase.summary}`;
  document.getElementById("phase-pill").textContent = `阶段 ${phase.number}`;
  document.getElementById("daily-rule").textContent = dailyRules[(todayStart().getDate() - 1) % dailyRules.length];
  renderMetrics();
  renderTodayTasks();
  renderMasteryBars();
}

function renderMetrics() {
  const today = todayStart();
  const start = parseDate(PLAN_META.startDate);
  const elapsed = Math.max(0, daysBetween(start, today));
  const week = clamp(Math.floor(elapsed / 7) + 1, 1, 18);
  const correct = Object.values(state.problemStatus).filter((s) => s === "correct").length;
  const wrong = Object.values(state.problemStatus).filter((s) => s === "wrong").length;
  const cards = [
    { label: "计划周次", value: `W${String(week).padStart(2, "0")}`, unit: "/ 18", note: getCurrentPhase().title, icon: "⌁", tone: "teal" },
    { label: "已掌握例题", value: correct, unit: `/ ${problems.length}`, note: `${getStudyProgress()}% 题库掌握度`, icon: "✓", tone: "blue" },
    { label: "待回炉错题", value: wrong, unit: "题", note: wrong ? "优先进入今日挑战" : "目前没有挂起错题", icon: "↺", tone: "coral" },
    { label: "连续学习", value: getStreak(), unit: "天", note: `本周目标 ${state.weeklyTarget} 小时`, icon: "✦", tone: "gold" }
  ];
  document.getElementById("metric-grid").innerHTML = cards.map((card) => `
    <article class="metric-card">
      <div class="metric-top"><span>${card.label}</span><i class="metric-icon ${card.tone}">${card.icon}</i></div>
      <div class="metric-value"><strong>${card.value}</strong><span>${card.unit}</span></div>
      <div class="metric-note">${card.note}</div>
    </article>
  `).join("");
}

function getTodayTasks() {
  const phase = getCurrentPhase();
  const day = todayStart().getDay();
  const focusA = phase.focus[day % phase.focus.length];
  const focusB = phase.focus[(day + 1) % phase.focus.length];
  const weekdaySets = {
    0: [
      ["周复盘", `统计 ${focusA} 的正确率与错误入口`, 30],
      ["轻回忆", "遮住笔记口述 8 条公式与定理条件", 20],
      ["错题回炉", "重做本周最典型的 3 道错题", 45],
      ["下周预热", `浏览 ${focusB} 的知识地图，不做难题`, 25]
    ],
    6: [
      ["限时模拟", "按当前阶段完成一场半套卷或整套卷", phase.id === "mixed" || phase.id === "sprint" ? 150 : 90],
      ["步骤评分", "按入口、公式、计算、结论四项给分", 25],
      ["错因归档", "只记录错误决策与下次触发信号", 25],
      ["公式口述", `复述 ${focusA} 的核心条件`, 15]
    ]
  };
  const standard = [
    ["闭卷回忆", `写出 ${focusA} 的 5 个核心公式/条件`, 15],
    ["方法学习", `精读 ${focusA} 的解题顺序与易错点`, 30],
    ["专题刷题", `完成 ${focusA} 4 题 + ${focusB} 2 题`, 50],
    ["错题回炉", "重做 1 天前与 3 天前的错题", 20],
    ["一句话方法", "为今天最难的一题写不超过 30 字的方法", 5]
  ];
  const set = weekdaySets[day] || standard;
  const todayKey = toISO(todayStart());
  return set.map((item, index) => ({ id: `${todayKey}-${index}`, title: item[0], detail: item[1], minutes: item[2] }));
}

function renderTodayTasks() {
  const tasks = getTodayTasks();
  const container = document.getElementById("today-tasks");
  container.innerHTML = tasks.map((task) => {
    const done = Boolean(state.taskDone[task.id]);
    return `
      <label class="task-row ${done ? "is-done" : ""}">
        <input type="checkbox" data-task-id="${task.id}" ${done ? "checked" : ""}>
        <span><strong>${task.title}</strong><p>${task.detail}</p></span>
        <time>${task.minutes} min</time>
      </label>
    `;
  }).join("");
  container.querySelectorAll("[data-task-id]").forEach((box) => {
    box.addEventListener("change", () => {
      state.taskDone[box.dataset.taskId] = box.checked;
      if (box.checked) addActivity();
      saveState();
      renderTodayTasks();
      renderMetrics();
    });
  });
  const doneCount = tasks.filter((task) => state.taskDone[task.id]).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  document.getElementById("task-progress-text").textContent = `完成 ${doneCount} / ${tasks.length}`;
  document.getElementById("task-progress-bar").style.width = `${percent}%`;
}

function renderMasteryBars() {
  const sorted = [...topics].sort((a, b) => getTopicMastery(a.id) - getTopicMastery(b.id));
  document.getElementById("mastery-bars").innerHTML = sorted.map((topic) => {
    const mastery = getTopicMastery(topic.id);
    return `
      <div class="mastery-item">
        <strong>${topic.title}</strong><span>${mastery}%</span>
        <div class="mastery-track"><i style="width:${mastery}%"></i></div>
      </div>
    `;
  }).join("");
}

function renderPlan() {
  const today = todayStart();
  document.getElementById("phase-timeline").innerHTML = phases.map((phase) => {
    const start = parseDate(phase.start);
    const end = parseDate(phase.end);
    const status = today > end ? "is-done" : today >= start && today <= end ? "is-current" : "";
    return `
      <article class="phase-card ${status}">
        <div class="phase-date"><span>PHASE ${phase.number}</span><strong>${formatDateRange(phase.start, phase.end)}</strong></div>
        <div class="phase-main">
          <h3>${phase.title}</h3><p>${phase.summary}</p>
          <div class="phase-tags">${phase.focus.map((item) => `<span>${item}</span>`).join("")}</div>
        </div>
        <div class="phase-goal"><span>阶段验收</span><strong>${phase.target}</strong></div>
      </article>
    `;
  }).join("");
  document.getElementById("rhythm-grid").innerHTML = weeklyRhythm.map((item) => `
    <div class="rhythm-day"><b>${item.day}</b><strong>${item.title}</strong><p>${item.text}</p></div>
  `).join("");
}

function populateTopicFilter() {
  const select = document.getElementById("topic-filter");
  select.innerHTML = `<option value="all">全部专题</option>${topics.map((topic) => `<option value="${topic.id}">${topic.title}</option>`).join("")}`;
}

function renderKnowledge() {
  let visibleTopics = topics;
  if (weakOnly) {
    visibleTopics = topics.filter((topic) => getTopicMastery(topic.id) < 60 || state.weakTopics.includes(topic.id));
  }
  if (!visibleTopics.length) visibleTopics = topics;
  if (!visibleTopics.some((topic) => topic.id === selectedTopicId)) selectedTopicId = visibleTopics[0].id;

  const map = document.getElementById("topic-map");
  map.innerHTML = visibleTopics.map((topic) => {
    const mastery = getTopicMastery(topic.id);
    const attempted = problems.filter((p) => p.topic === topic.id && state.problemStatus[p.id]).length;
    return `
      <button class="topic-card ${topic.id === selectedTopicId ? "is-selected" : ""}" data-topic-id="${topic.id}">
        <div class="topic-card-top"><span class="topic-code">${topic.code}</span><span class="topic-weight">建议训练 ${topic.weight}%</span></div>
        <h3>${topic.title}</h3><p>${topic.blurb}</p>
        <div class="topic-progress"><span style="width:${mastery}%"></span></div>
        <div class="topic-card-foot"><span>已做 ${attempted}/${problems.filter((p) => p.topic === topic.id).length}</span><span>掌握 ${mastery}%</span></div>
      </button>
    `;
  }).join("");
  map.querySelectorAll("[data-topic-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTopicId = button.dataset.topicId;
      saveState();
      renderKnowledge();
    });
  });
  renderKnowledgeDetail();
  renderMath(document.getElementById("view-knowledge"));
}

function renderKnowledgeDetail() {
  const topic = getTopic(selectedTopicId);
  const weak = state.weakTopics.includes(topic.id);
  const detail = document.getElementById("knowledge-detail");
  detail.innerHTML = `
    <article class="detail-panel">
      <div class="detail-head">
        <div><span class="eyebrow">${topic.code} · ${topic.weight}% TRAINING SHARE</span><h3>${topic.title}</h3><p>${topic.diagnosis}</p></div>
        <span class="phase-pill">掌握 ${getTopicMastery(topic.id)}%</span>
      </div>
      <div class="detail-columns">
        <div class="detail-box"><h4>解题扫描顺序</h4><ol>${topic.steps.map((item) => `<li>${item}</li>`).join("")}</ol></div>
        <div class="detail-box"><h4>核心公式</h4><div class="formula-list">${topic.formulas.map((formula) => `<div class="formula-chip">${formula}</div>`).join("")}</div></div>
        <div class="detail-box"><h4>高频失分点</h4><ul>${topic.pitfalls.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </div>
      <div class="focus-rule"><strong>阶段达标：</strong><span>${topic.target}</span></div>
      <div class="detail-actions">
        <button class="primary-button compact" id="train-topic">开始本专题训练</button>
        <button class="ghost-button compact" id="toggle-weak">${weak ? "移出薄弱清单" : "标记为需要复习"}</button>
      </div>
    </article>
  `;
  document.getElementById("train-topic").addEventListener("click", () => {
    document.getElementById("topic-filter").value = topic.id;
    activeChallenge = null;
    switchView("practice");
  });
  document.getElementById("toggle-weak").addEventListener("click", () => {
    state.weakTopics = weak ? state.weakTopics.filter((id) => id !== topic.id) : [...state.weakTopics, topic.id];
    saveState();
    renderKnowledge();
    showToast(weak ? "已移出薄弱清单。" : "已加入薄弱清单，今日挑战会优先抽取。 ");
  });
}

function getFilteredProblems() {
  if (activeChallenge) return problems.filter((p) => activeChallenge.includes(p.id));
  const query = document.getElementById("problem-search").value.trim().toLowerCase();
  const topic = document.getElementById("topic-filter").value;
  const difficulty = document.getElementById("difficulty-filter").value;
  const status = document.getElementById("status-filter").value;
  return problems.filter((problem) => {
    const problemStatus = state.problemStatus[problem.id] || "new";
    const text = `${problem.id} ${problem.title} ${problem.skill} ${problem.statement}`.toLowerCase();
    return (!query || text.includes(query))
      && (topic === "all" || problem.topic === topic)
      && (difficulty === "all" || String(problem.difficulty) === difficulty)
      && (status === "all" || problemStatus === status);
  });
}

function renderProblems() {
  const list = getFilteredProblems();
  const grid = document.getElementById("problem-grid");
  const empty = document.getElementById("problem-empty");
  const correct = list.filter((p) => state.problemStatus[p.id] === "correct").length;
  const wrong = list.filter((p) => state.problemStatus[p.id] === "wrong").length;
  document.getElementById("problem-summary").innerHTML = activeChallenge
    ? `当前为 6 题挑战模式 · 已掌握 ${correct} · 做错 ${wrong} <button class="text-button" id="clear-challenge">退出挑战，查看全部题库</button>`
    : `显示 ${list.length} / ${problems.length} 题 · 已掌握 ${correct} · 错题 ${wrong}`;
  const clear = document.getElementById("clear-challenge");
  if (clear) clear.addEventListener("click", () => { activeChallenge = null; renderProblems(); });

  grid.innerHTML = list.map((problem) => {
    const topic = getTopic(problem.topic);
    const status = state.problemStatus[problem.id] || "new";
    const statusLabel = status === "correct" ? "已掌握 ✓" : status === "wrong" ? "待回炉 ↺" : "未作答";
    return `
      <article class="problem-card is-${status}" data-problem-id="${problem.id}" tabindex="0">
        <div class="problem-meta">
          <span class="tag topic">${topic.title}</span>
          <span class="tag level-${problem.difficulty}">${difficultyLabels[problem.difficulty]}</span>
          <span class="status-mark">${statusLabel}</span>
        </div>
        <h3>${problem.id} · ${problem.title}</h3>
        <div class="problem-preview">${problem.statement}</div>
        <div class="problem-card-footer"><span>${problem.minutes} min · ${problem.skill}</span><span class="problem-open">打开题目 →</span></div>
      </article>
    `;
  }).join("");
  grid.querySelectorAll("[data-problem-id]").forEach((card) => {
    card.addEventListener("click", () => openProblemModal(card.dataset.problemId));
    card.addEventListener("keydown", (event) => { if (event.key === "Enter") openProblemModal(card.dataset.problemId); });
  });
  empty.hidden = list.length > 0;
  renderMath(grid);
}

function createChallenge() {
  const wrong = shuffle(problems.filter((p) => state.problemStatus[p.id] === "wrong"));
  const weak = shuffle(problems.filter((p) => state.weakTopics.includes(p.topic) && state.problemStatus[p.id] !== "wrong"));
  const fresh = shuffle(problems.filter((p) => !state.problemStatus[p.id]));
  const other = shuffle(problems.filter((p) => state.problemStatus[p.id] === "correct"));
  const ids = [];
  [...wrong, ...weak, ...fresh, ...other].forEach((problem) => {
    if (ids.length < 6 && !ids.includes(problem.id)) ids.push(problem.id);
  });
  activeChallenge = ids;
  switchView("practice");
  renderProblems();
  showToast("已生成 6 题混合挑战：错题与薄弱专题优先。 ");
}

function shuffle(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function openProblemModal(problemId) {
  const problem = getProblem(problemId);
  const topic = getTopic(problem.topic);
  const status = state.problemStatus[problem.id] || "new";
  const content = document.getElementById("problem-modal-content");
  content.innerHTML = `
    <div class="modal-head">
      <div class="modal-subline"><span class="tag topic">${topic.title}</span><span class="tag level-${problem.difficulty}">${difficultyLabels[problem.difficulty]}</span><span class="tag">建议 ${problem.minutes} 分钟</span></div>
      <h2 id="modal-title">${problem.id} · ${problem.title}</h2>
      <p class="subtle">训练目标：${problem.skill}</p>
    </div>
    <div class="problem-statement">${problem.statement}</div>
    <div class="modal-section">
      <button class="reveal-button" data-reveal="hint">需要提示时再点开</button>
      <div data-reveal-content="hint" hidden><h4>提示</h4><p>${problem.hint}</p></div>
    </div>
    <div class="modal-section">
      <button class="reveal-button" data-reveal="solution">完成书写后查看完整解析</button>
      <div data-reveal-content="solution" hidden><h4>完整解析</h4><p>${problem.solution}</p><h4 style="margin-top:14px">答案</h4><p>${problem.answer}</p></div>
    </div>
    <div class="modal-section"><h4>一句话方法 / 易错点</h4><p>${problem.trap}</p></div>
    <div class="answer-actions">
      <button class="wrong-button" data-mark="wrong">${status === "wrong" ? "已标记错题" : "做错 / 不会"}</button>
      <button class="correct-button" data-mark="correct">${status === "correct" ? "已掌握" : "独立做对"}</button>
    </div>
  `;
  content.querySelectorAll("[data-reveal]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = content.querySelector(`[data-reveal-content="${button.dataset.reveal}"]`);
      target.hidden = false;
      button.hidden = true;
      renderMath(target);
    });
  });
  content.querySelectorAll("[data-mark]").forEach((button) => {
    button.addEventListener("click", () => markProblem(problem.id, button.dataset.mark));
  });
  document.getElementById("problem-modal").hidden = false;
  document.body.style.overflow = "hidden";
  renderMath(content);
}

function markProblem(problemId, status) {
  state.problemStatus[problemId] = status;
  addActivity();
  saveState();
  closeProblemModal();
  renderOverview();
  renderKnowledge();
  renderProblems();
  showToast(status === "correct" ? "已记为独立做对。7 天后仍建议再抽查一次。" : "已加入错题队列，将优先进入下一次挑战。 ");
}

function closeProblemModal() {
  document.getElementById("problem-modal").hidden = true;
  if (document.getElementById("mock-modal").hidden) document.body.style.overflow = "";
}

function renderMocks() {
  document.getElementById("mock-grid").innerHTML = mockExams.map((mock) => {
    const record = state.mockScores[mock.id];
    return `
      <article class="mock-card">
        <div class="mock-card-top"><span class="mock-number">${mock.number}</span><span class="mock-date">建议 ${formatShortDate(mock.date)}</span></div>
        <h3>${mock.title}</h3><p>${mock.description}</p>
        <div class="mock-stats"><span>时长<strong>${mock.minutes} min</strong></span><span>题量<strong>${mock.problems.length} 题</strong></span><span>记录<strong>${record ? `${record.score} 分` : "—"}</strong></span></div>
        <button class="primary-button" data-start-mock="${mock.id}">开始模拟</button>
      </article>
    `;
  }).join("");
  document.querySelectorAll("[data-start-mock]").forEach((button) => button.addEventListener("click", () => openMockModal(button.dataset.startMock)));

  const records = Object.values(state.mockScores).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  document.getElementById("latest-mock-score").textContent = records.length ? `${records[0].score} / 100` : "尚未记录";
}

function openMockModal(mockId) {
  const mock = mockExams.find((item) => item.id === mockId);
  activeMockId = mockId;
  mockSeconds = mock.minutes * 60;
  clearInterval(mockTimer);
  const content = document.getElementById("mock-modal-content");
  content.innerHTML = `
    <div class="modal-head"><span class="eyebrow">${mock.number}</span><h2 id="mock-modal-title">${mock.title}</h2><p class="subtle">${mock.description}</p></div>
    <div class="mock-timer"><div><span class="eyebrow">EXAM CLOCK</span><strong id="mock-clock">${formatClock(mockSeconds)}</strong></div><button class="secondary-button compact" id="mock-timer-toggle">暂停</button></div>
    <div class="mock-question-list">
      ${mock.problems.map((id) => {
        const problem = getProblem(id);
        return `<div class="mock-question"><strong>${problem.title}</strong><div>${problem.statement}</div></div>`;
      }).join("")}
    </div>
    <div class="mock-score-entry">
      <label>完成后记录得分（0–100）</label>
      <input id="mock-score-input" type="number" min="0" max="100" placeholder="例如 78" value="${state.mockScores[mockId]?.score ?? ""}">
      <button class="primary-button compact" id="save-mock-score">保存成绩</button>
      <button class="ghost-button compact" id="review-mock">交卷并进入订正</button>
    </div>
  `;
  document.getElementById("mock-modal").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("mock-timer-toggle").addEventListener("click", toggleMockTimer);
  document.getElementById("save-mock-score").addEventListener("click", () => saveMockScore(mockId));
  document.getElementById("review-mock").addEventListener("click", () => {
    activeChallenge = [...mock.problems];
    closeMockModal();
    switchView("practice");
    renderProblems();
  });
  startMockTimer();
  renderMath(content);
}

function startMockTimer() {
  clearInterval(mockTimer);
  mockTimer = setInterval(() => {
    mockSeconds = Math.max(0, mockSeconds - 1);
    const clock = document.getElementById("mock-clock");
    if (clock) clock.textContent = formatClock(mockSeconds);
    if (mockSeconds === 0) {
      clearInterval(mockTimer);
      showToast("模拟时间到，请停笔并按步骤评分。 ");
    }
  }, 1000);
}

function toggleMockTimer() {
  const button = document.getElementById("mock-timer-toggle");
  if (mockTimer) {
    clearInterval(mockTimer);
    mockTimer = null;
    button.textContent = "继续";
  } else {
    startMockTimer();
    button.textContent = "暂停";
  }
}

function saveMockScore(mockId) {
  const input = document.getElementById("mock-score-input");
  const score = Number(input.value);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    showToast("请输入 0 到 100 之间的分数。 ");
    return;
  }
  state.mockScores[mockId] = { score, savedAt: new Date().toISOString() };
  addActivity();
  saveState();
  renderMocks();
  renderMetrics();
  showToast("模拟成绩已保存。下一步按丢分步骤订正。 ");
}

function closeMockModal() {
  clearInterval(mockTimer);
  mockTimer = null;
  activeMockId = null;
  document.getElementById("mock-modal").hidden = true;
  if (document.getElementById("problem-modal").hidden) document.body.style.overflow = "";
}

function renderTips() {
  document.getElementById("tips-grid").innerHTML = tips.map((tip, index) => `
    <article class="tip-card">
      <div class="tip-card-head"><span class="tip-number">${String(index + 1).padStart(2, "0")}</span><h3>${tip.title}</h3></div>
      <p>${tip.text}</p><div class="tip-check"><strong>自检：</strong>${tip.check}</div>
    </article>
  `).join("");
}

function toggleFocusTimer() {
  const button = document.getElementById("focus-toggle");
  const status = document.getElementById("focus-status");
  if (focusRunning) {
    clearInterval(focusTimer);
    focusTimer = null;
    focusRunning = false;
    button.textContent = "继续计时";
    status.textContent = "已暂停";
    return;
  }
  focusRunning = true;
  button.textContent = "暂停";
  status.textContent = "专注中";
  focusTimer = setInterval(() => {
    focusSeconds = Math.max(0, focusSeconds - 1);
    document.getElementById("focus-clock").textContent = formatClock(focusSeconds);
    if (focusSeconds === 0) {
      clearInterval(focusTimer);
      focusTimer = null;
      focusRunning = false;
      button.textContent = "再来一轮";
      status.textContent = "完成";
      addActivity();
      renderMetrics();
      showToast("45 分钟专注完成。现在用 5 分钟写一句话方法。 ");
    }
  }, 1000);
}

function resetFocusTimer() {
  clearInterval(focusTimer);
  focusTimer = null;
  focusRunning = false;
  focusSeconds = 45 * 60;
  document.getElementById("focus-clock").textContent = "45:00";
  document.getElementById("focus-toggle").textContent = "开始计时";
  document.getElementById("focus-status").textContent = "准备";
}

function formatClock(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function exportProgress() {
  const payload = {
    exportedAt: new Date().toISOString(),
    plan: PLAN_META.title,
    examDate: PLAN_META.examDate,
    progress: state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `数学竞赛学习进度-${toISO(todayStart())}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("学习进度已导出为 JSON 文件。 ");
}

function resetProgress() {
  if (!window.confirm("确定清空所有题目状态、今日任务、模拟成绩与连续学习记录吗？")) return;
  state = defaultState();
  selectedTopicId = topics[0].id;
  activeChallenge = null;
  saveState();
  document.getElementById("weekly-target").value = String(state.weeklyTarget);
  renderAll();
  showToast("本地学习进度已重置。 ");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

window.addEventListener("DOMContentLoaded", init);
