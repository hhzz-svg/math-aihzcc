# 数竞研习录

面向 **2026 年全国大学生数学竞赛非数学专业 A 类初赛**的书籍式学习与刷题网站。目标不是展示进度数据，而是让知识回顾、例题、练习、解析和参考书页码形成连续阅读体验。

## 当前内容

- 9 章高等数学主线，每章包含 8 节知识点回顾、公式、标准流程和易错点。
- 81 道原创同型题：9 道章内例题、72 道独立练习，均含提示、完整解析、答案和易错点。
- 18 周训练安排、18 条竞赛方法、前十届非数学专业初赛试题与解答页码索引。
- 参考指南网页阅读器：本地自动加载项目内 PDF；公开站点可选择电脑上的 PDF，按物理页码直达。
- 练习状态、本章完成状态和进度导出均保存在浏览器 `localStorage`。
- Cloudflare Pages 前端配置与 Render Node 后端配置。

## 本地使用

双击：

```text
D:\课程资料\数学\竞赛\启动网页版.cmd
```

或在项目目录运行：

```powershell
npm start
```

然后访问 `http://localhost:4173`。

本地参考书放在：

```text
private/reference/全国大学生数学竞赛参赛指南.pdf
```

本地服务器支持 PDF byte-range 请求，PDF.js 会按需读取页面，不必一次载入整本文件。

## 页面结构

```text
卷首
├─ 第一章 函数、极限与连续
├─ 第二章 一元函数微分学
├─ 第三章 一元函数积分学
├─ 第四章 常微分方程
├─ 第五章 向量与空间解析几何
├─ 第六章 多元函数微分学
├─ 第七章 二重积分与三重积分
├─ 第八章 曲线、曲面积分与三大公式
├─ 第九章 无穷级数
└─ 附录：18 周计划 / 真题索引 / 原书阅读器 / 资料站 / 方法手册
```

桌面端采用左目录、中正文、右边注的讲义结构；手机端目录变为抽屉，正文保持单栏阅读。

## 项目结构

```text
竞赛/
├─ public/                 Cloudflare Pages 静态站点
│  ├─ index.html
│  ├─ styles.css
│  ├─ app.js
│  ├─ content.js           基础专题数据
│  ├─ book-data.js         书籍章节、计划、真题索引与资料链接
│  ├─ data-override.js      8 节/章知识回顾、81 道题与可执行周计划
│  └─ assets/vendor/       KaTeX 与 PDF.js 离线依赖
├─ server/index.cjs        本地服务器与 Render API
├─ private/reference/      个人参考书副本，不提交、不公开部署
├─ tests/                  内容、服务器、浏览器冒烟测试
├─ docs/                   设计、资料和部署文档
├─ render.yaml             Render Blueprint
├─ wrangler.toml           Cloudflare Pages 配置
└─ 启动网页版.cmd
```

## 后端接口

- `GET /api/health`：服务健康、环境和本地参考书可用性。
- `GET /api/meta`：考试日期、时长和当前训练周。
- `GET /api/plan/today`：当天训练节奏。
- `GET /local-reference/guide.pdf`：仅在本地或私有服务器配置了 PDF 时提供，支持 Range。

主站内容不依赖后端；Render 冷启动或暂时不可用时，知识学习和刷题仍能正常工作。

## 验证

```powershell
node --check public/content.js
node --check public/book-data.js
node --check public/app.js
node --check server/index.cjs
node tests/content-test.cjs
node tests/server-test.cjs
node tests/smoke-test.cjs
```

浏览器测试覆盖书籍式布局、九章目录、知识回顾、KaTeX、题目状态、PDF 第 26 页跳转、18 周计划、10 届真题、资料链接和手机目录。

## 部署

- Cloudflare Pages：`https://math-aihzcc.pages.dev`
- Render API：`https://math-aihzcc-api.onrender.com`
- GitHub：`https://github.com/hhzz-svg/math-aihzcc`
- 目标域名：`math.aihzcc.top`

目标域名已经绑定到 Pages 项目；还需要在 Cloudflare DNS 添加 `math` → `math-aihzcc.pages.dev` 的代理 CNAME 才会生效。完整步骤见 `docs/部署指南.md`。
