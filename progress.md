## 2026-07-15 - Task: 制作全国大学生数学竞赛网页版学习与刷题计划

### What was done

- 按非数学专业 A 类与 2026 年 11 月 14 日初赛目标，建立从 7 月 15 日到 11 月 13 日的六阶段、17 周备考路线。
- 将参考指南的非数学专业类考纲整理为 9 个高等数学专题，并按 2026 年新通知把线性代数从初赛主线移出。
- 完成无需安装、可直接双击打开的本地静态网页，包含今日任务、倒计时、专题掌握度、45 分钟专注计时、题库筛选、错题优先挑战、模拟计时、成绩记录、进度导出与重置。
- 编写 36 道原创同型例题及提示、完整解析、答案和易错点；配置 6 场阶段模拟与 18 条竞赛技巧。
- 将 KaTeX 0.16.22 及字体资源放入项目，保证数学公式可离线渲染，并保留 MIT 许可证。
- 补充使用说明、备考设计、资料来源与自动化测试脚本。

### Testing

- `node --check data.js`：通过，无 JavaScript 语法错误。
- `node --check app.js`：通过，无 JavaScript 语法错误。
- `node tests/content-test.cjs`：12 项全部通过，包括 9 个专题、权重合计 100%、36 道题、每专题 4 题、题号唯一、6 个阶段、6 套模拟与引用完整性。
- `node tests/smoke-test.cjs`（playwright-core 1.61.1 + Microsoft Edge）：15 项全部通过，包括页面加载、倒计时、KaTeX 无错误、36 道题、弹窗提示、状态持久化、六阶段计划、移动端菜单与桌面/移动端无横向溢出。

### Notes

改动文件清单：

- `index.html`：新增网页版入口、六个学习视图、题目与模拟弹窗、补充资料入口。
- `styles.css`：新增完整视觉样式、桌面与移动端响应式布局。
- `data.js`：新增计划阶段、9 个专题、36 道例题、18 条技巧与 6 套模拟数据。
- `app.js`：新增导航、筛选、计时、本地进度、错题挑战、模拟成绩和导出逻辑。
- `启动网页版.cmd`：新增双击打开网页的启动脚本。
- `README.md`：新增使用方法、功能范围、文件结构、验证方式与主要资料。
- `docs/备考设计与资料来源.md`：记录赛制判断、路线设计、训练闭环、内容原则与技术边界。
- `tests/content-test.cjs`：新增内容结构与引用完整性测试。
- `tests/smoke-test.cjs`：新增 Edge 浏览器交互、公式与响应式冒烟测试。
- `assets/vendor/katex/katex.min.css`、`katex.min.js`、`contrib/auto-render.min.js`、`fonts/*`、`LICENSE`：新增 KaTeX 0.16.22 离线公式渲染资源及许可证。
- `progress.md`：新增本轮实施、测试与回滚记录。

回滚方式：本轮开始时 `竞赛` 文件夹为空，没有旧版本需要恢复；如需完整回滚，先导出可能产生的浏览器学习进度，再删除以上本轮新增文件及 `assets`、`docs`、`tests` 目录即可恢复到空目录状态。

## 2026-07-15 - Task: 重做书籍式数竞学习站并部署 Cloudflare Pages 与 Render

### What was done

- 将第一版卡片式仪表盘重构为左侧全书目录、中间连续正文、右侧页边注的在线讲义，桌面与手机均以阅读和刷题为主。
- 建立 9 章高等数学正文，每章含 4 节知识点回顾、必背公式、标准流程、易错点、1 道章内例题和 3 道独立练习；保留 36 道题的提示、完整解析、答案与掌握状态。
- 加入 18 周训练安排、18 条竞赛方法、前十届非数学专业初赛试题/解答页码索引及 9 个外部资料站点。
- 将个人参考 PDF 置于 `private/reference`，本地由支持 Range 的 Node 服务按需读取；公开站点不上传原书，改为浏览器选择本机 PDF，并支持章节链接直达物理页码。
- 新增 Render Node API、Cloudflare Pages 配置、安全响应头、生产配置和部署文档；GitHub 仓库已推送，Render 与 Pages 已上线。
- Render API 地址为 `https://math-aihzcc-api.onrender.com`，Cloudflare Pages 地址为 `https://math-aihzcc.pages.dev`；`math.aihzcc.top` 已登记到 Pages，但仍等待 DNS CNAME。

### Testing

- `node --check public/content.js`、`public/book-data.js`、`public/app.js`、`server/index.cjs`：全部通过。
- `node tests/content-test.cjs`：20 项全部通过，覆盖 9 章、36 道题、4 节知识回顾、18 周计划、10 届真题、9 个资料链接、PDF 页码映射和无卡片式结构。
- `node tests/server-test.cjs`：4 项全部通过，覆盖健康接口、静态站点、PDF byte-range 和学习元数据接口。
- `node tests/smoke-test.cjs`（Microsoft Edge）：22 项全部通过，覆盖桌面/手机布局、章节阅读、KaTeX、解析折叠、状态持久化、PDF 第 26 页、计划、真题和资料页。
- Cloudflare Pages 线上浏览器冒烟：12 项全部通过，覆盖 HTTP 200、书籍封面、9 章目录、无卡片墙、Render 页边注、章节知识点、KaTeX、例题、练习和无页面错误。
- 线上接口验证：Pages 主站、最新部署地址、`config.js`、Render `/api/health`、`/api/meta`、`/api/plan/today` 均返回 HTTP 200；Render 部署 `dep-d9bqbcj7uimc73cgq9og` 状态为 `live`。
- 公共 DNS 验证：Cloudflare DoH、Google DoH 和 `1.1.1.1` 均确认 `math.aihzcc.top` 当前为 NXDOMAIN；Pages 域名接口返回 `pending / CNAME record not set`。

### Notes

改动文件清单：

- `.gitignore`：排除依赖、Wrangler 状态、本地环境、日志、PID 和个人 PDF。
- `README.md`：重写站点说明、本地使用、内容结构、验证命令和实际部署地址。
- `docs/书籍式学习站设计.md`：记录教材式信息架构、视觉原则、学习闭环和响应式设计。
- `docs/部署指南.md`：记录 Cloudflare Pages、Render、GitHub、PDF 隐私和自定义域名部署步骤及当前状态。
- `docs/备考设计与资料来源.md`：改写为本次章节体系、题目原则、页码映射和资料来源说明。
- `package.json`：新增 Node 启动、测试脚本和运行版本声明。
- `public/index.html`：重建书籍式页面骨架、全书目录、正文区、页边注、搜索和移动端目录。
- `public/styles.css`：重写纸张色在线教材视觉、排版、题解、PDF 阅读器及桌面/手机响应式样式。
- `public/app.js`：重写路由、章节渲染、搜索、题目状态、计划/真题/资料页、PDF.js 阅读和 Render API 页边注逻辑。
- `public/content.js`：从原 `data.js` 迁移 36 道原创题与专题数据，供新版章节引用。
- `public/book-data.js`：新增 9 章知识回顾、章节元数据、18 周计划、真题页码、资料链接和竞赛方法。
- `public/config.js`：写入 Render 生产 API 地址和本地参考书端点。
- `public/_headers`：新增 Cloudflare Pages 安全头与静态资源缓存规则。
- `public/assets/favicon.svg`：新增站点图标。
- `public/assets/vendor/katex/**`：迁移 KaTeX 离线公式资源及许可证到 Pages 发布目录。
- `public/assets/vendor/pdfjs/**`：新增 PDF.js 6.1.200、CMap、标准字体和许可证。
- `server/index.cjs`：新增零运行依赖的静态服务器、API、PDF Range 响应和生产监听。
- `tests/content-test.cjs`：改为验证书籍内容、知识回顾、计划、真题、资料和 PDF 映射。
- `tests/server-test.cjs`：新增 Node 服务、API 和 PDF Range 自动化验证。
- `tests/smoke-test.cjs`：改为验证书籍式布局、章节、题解、PDF 阅读和移动端交互。
- `render.yaml`：新增 Render Web Service Blueprint。
- `wrangler.toml`：新增 Cloudflare Pages 发布配置。
- `启动网页版.cmd`：改为启动 Node 本地服务器并打开书籍式网站。
- 根目录旧版 `index.html`、`styles.css`、`app.js`：已移除，前端正式入口迁入 `public`。
- `progress.md`：仅在末尾追加本轮实施、测试、部署状态和回滚记录。

外部状态：GitHub 仓库 `https://github.com/hhzz-svg/math-aihzcc` 当前为公开仓库，以便 Render 在未安装 GitHub App 的情况下拉取；仓库中不含 `private/reference/*.pdf`。自定义域名需在 Cloudflare DNS 手动添加代理 CNAME：`math` → `math-aihzcc.pages.dev`。

回滚方式：代码可执行 `git revert cc7d315 26cd1ce` 创建反向提交；如只需回到第一版卡片仪表盘，可在确认无需保留新版工作后执行 `git reset --hard 12091c3`。Cloudflare Pages 可在控制台回滚到此前部署，Render 可回滚到部署 `dep-d9bq9cd7vvec73c93hhg`；如需移除本轮线上资源，删除 Pages 项目 `math-aihzcc` 与 Render 服务 `srv-d9bq9bt7vvec73c93glg`。个人 PDF 始终位于 Git 忽略目录，回滚代码不会删除该文件。

## 2026-07-16 - Task: 修复 host error 并加深书籍式知识与刷题内容

### What was done

- 修正入口 HTML 的数据覆盖脚本加载，避免前端在加载阶段出现空白页或 host error 表象。
- 增加章节原书摘页内嵌、实时考试倒计时和当前周可执行计划；章节正文保持连续讲义布局，不引入卡片式仪表盘。
- 将 9 章内容扩展为每章 8 个知识回顾小节、1 道例题和 8 道练习，并补充提示、完整解析、答案、易错点与方法标签。
- 修正旧章节 ID 与覆盖数据的映射，确保向量、多元、重积分和曲线曲面积分题目都能正常渲染并归属到正确章节。
- 生成并纳入轻量 PDF 摘页图片，同时保持完整个人 PDF 不进入公开前端和 Git 历史。
- 更新内容测试与桌面/手机冒烟测试，覆盖摘页、倒计时、计划执行单和扩展后的题量。

### Testing

- `node --check public/data-override.js`：通过。
- `node --check public/app.js`、`node --check tests/content-test.cjs`、`node --check tests/smoke-test.cjs`：通过。
- `npm test`：全部通过；覆盖 9 章、81 道题、每章 8 节回顾、18 周执行计划、PDF 摘页、Render 健康接口、PDF Range、桌面与手机冒烟。
- 本地 Edge 复测：章节页无 page error，原书摘页图片可见，计划执行单含 7 天任务，倒计时格式为“天 HH:MM:SS”。

### Notes

改动文件清单：

- `.gitignore`：忽略竞赛目录根部个人 PDF，防止 90 MiB 原始资料进入版本库。
- `public/index.html`：修正 `data-override.js` 的合法脚本标签加载。
- `public/data-override.js`：新增扩展知识、题库、计划字段和旧章节 ID 映射。
- `public/app.js`：增加实时倒计时、章节原书摘页和当前周执行单。
- `public/styles.css`：增加摘页网格、图片说明和计划正文样式。
- `public/assets/reference/pages/*.jpg`：新增 6 张可公开部署的 PDF 摘页图片。
- `tests/content-test.cjs`：验证 81 道题、每章 9 道题、8 节回顾、摘页资产和周计划字段。
- `tests/smoke-test.cjs`：验证倒计时、摘页、计划执行单和移动端布局。
- `docs/部署指南.md`：补充摘页部署策略、数据覆盖层和 host error 分层排查。
- `progress.md`：追加本轮施工、测试和回滚记录。

回滚方式：执行 `git revert <本轮提交哈希>` 回滚本轮代码；仅回滚前端时恢复 `public/app.js`、`public/index.html`、`public/styles.css`、`public/data-override.js` 和 `public/assets/reference/pages/`。Cloudflare Pages 与 Render 均可回滚到本轮发布前的部署；本地浏览器 `localStorage` 学习进度需先导出后再清理。

## 2026-07-16 - Task: 验证扩展版学习站线上部署

### What was done
- 复核 Cloudflare Pages 最新部署、稳定 Pages 域名和自定义域名，确认三个前端入口均已恢复正常访问。
- 复核 Render 健康检查、站点元数据与今日计划接口，确认后端已完成部署且可正常响应。
- 使用真实 Edge 浏览器访问自定义域名，验证首页倒计时、章节知识回顾、原书摘页和计划执行单均能渲染。

### Testing
- `npm test`：通过，覆盖 9 章、81 道题、PDF Range、桌面端与移动端书籍式界面及 KaTeX 渲染。
- `https://a5bee9ec.math-aihzcc.pages.dev/`：HTTP 200。
- `https://math-aihzcc.pages.dev/`：HTTP 200。
- `https://math.aihzcc.top/`：HTTP 200，页面标题及主体内容正确。
- `https://math-aihzcc-api.onrender.com/api/health`、`/api/meta`、`/api/plan/today`：均为 HTTP 200。
- `https://math.aihzcc.top/#/chapter/limits`：8 个知识回顾小节与原书摘页均可见；摘页滚动进入视口后成功加载，图片宽度 884 px。
- `https://math.aihzcc.top/#/plan`：当前周 7 天执行单和 18 周计划表均可见。

### Notes
- 改动文件：`progress.md`——追加本次生产环境连通性和浏览器验证证据。
- Cloudflare Browser Insights 脚本会被站点 CSP 阻止，但不影响学习站功能；这是统计脚本而非业务脚本错误。
- 回滚方式：执行 `git revert <本次记录提交>`；本轮仅增加验证记录，不涉及页面与部署逻辑。
## 2026-07-16 - Task: 修复章节知识映射并完成目标级生产验收

### What was done
- 对照完整需求重新审计倒计时、PDF 摘页、知识正文、题库和 18 周计划，发现并修复第 5–8 章知识小节错误复用第一章内容的问题。
- 为九章知识正文增加主题区分回归测试，确保空间几何、多元微分、重积分和曲线曲面积分分别加载自己的知识回顾。
- 更新 README 与设计文档中的旧内容规模，统一为每章 8 节知识回顾、1 道例题、8 道练习，共 81 道题。
- 重新发布 Cloudflare Pages，并在自定义域名上完成逐章浏览器验收。

### Testing
- `npm test`：全部通过；覆盖 9 章、81 道题、九章主题区分、PDF Range、章节摘页、实时倒计时、18 周计划、KaTeX、桌面端和移动端。
- Cloudflare 部署：`https://b39226ac.math-aihzcc.pages.dev` 发布成功；稳定 Pages 域名和 `math.aihzcc.top` 均为 HTTP 200。
- 生产 `data-override.js` 与本地 SHA-256 均为 `049DA7A78BFD25DCCD09D912706BA671A19DCCD669F5F1473D97673E2DCC6DC1`。
- 真实 Edge：倒计时读数从 `121 天 07:18:17` 变化为 `121 天 07:18:14`；九章均显示 8 节回顾、1 道例题、8 道练习，内嵌 PDF 摘页全部成功加载。
- 第 5–8 章线上首节分别为“点积叉积混合积”“二元极限”“区域与换序”“第一类曲线积分”，不再复用极限内容。
- 计划页线上显示 18 周表、当前周 7 天任务、最低题量、本周交付、验收标准和未达标回滚。
- Render `/api/health` 与 `/api/meta`：HTTP 200；章节正文与摘页不依赖 Render 冷启动。

### Notes
- 改动文件：`public/data-override.js`——修复旧章节 ID 到扩展知识正文的映射，并补充重积分对称性示例。
- 改动文件：`tests/content-test.cjs`——增加九章知识主题不能重复的语义回归检查。
- 改动文件：`README.md`——同步 8 节/章、81 道题和数据覆盖层说明。
- 改动文件：`docs/书籍式学习站设计.md`——更新正式成功标准。
- 改动文件：`docs/备考设计与资料来源.md`——更新题库规模与每章题量说明。
- 改动文件：`progress.md`——追加本轮修复、测试与生产部署证据。
- 回滚方式：执行 `git revert <本次提交>`；Cloudflare 可回滚到部署 `a5bee9ec.math-aihzcc.pages.dev`，但该版本存在第 5–8 章知识正文映射错误。

## 2026-07-16 - Task: 更新项目 README 并同步 GitHub

### What was done

- 在 README 首页增加在线访问入口，集中展示主站、备用站、Render API 和 GitHub 仓库。
- 增加核心特点说明，突出书籍式排版、知识与刷题结合、参考书页内嵌、18 周计划和离线依赖。
- 更新部署状态，删除已经失效的 DNS 待办，并将部署地址与部署指南改为可点击链接。

### Testing

- `git diff --check`：通过。
- `https://math.aihzcc.top`：HTTP 200。
- `https://math-aihzcc.pages.dev`：HTTP 200。
- `https://math-aihzcc-api.onrender.com/api/health`：HTTP 200。
- `https://github.com/hhzz-svg/math-aihzcc`：HTTP 200。
- README 保持 UTF-8 BOM，四个访问地址均已写入，且不再包含“还需要在 Cloudflare DNS 添加”的过时说明。

### Notes

- 改动文件：`README.md`——增加在线访问与核心特点，更新已生效的部署状态。
- 改动文件：`progress.md`——追加本轮文档更新、验证和回滚记录。
- 回滚方式：执行 `git revert <本次提交>`，撤销本轮 README 与进度日志变更。

## 2026-07-16 - Task: 将 README 调整为学生导向

### What was done

- 将 README 从工程部署说明改为学生备赛说明，突出学习范围、每章学习顺序、刷题方法和参考书使用方式。
- 在线入口只保留正式学习网站，移除备用地址、接口地址、部署平台和工程验证等学生不需要的信息。
- 补充适合刚学完微积分 2 的使用说明，以及知识复习、限时刷题、错题复盘和真题冲刺建议。

### Testing

- `git diff --check`：通过。
- README 学生内容检查：包含正式学习网址、九章范围、81 道题、学习方法和参考书说明。
- README 技术内容检查：不再包含 API、备用站、Cloudflare、Render、后端接口、项目结构和部署章节。
- `https://math.aihzcc.top`：HTTP 200。
- README 保持 UTF-8 BOM。

### Notes

- 改动文件：`README.md`——重写为面向参赛学生的学习说明，只保留正式网站入口。
- 改动文件：`progress.md`——追加本轮文档调整、验证和回滚记录。
- 回滚方式：执行 `git revert <本次提交>`，恢复上一版 README。
