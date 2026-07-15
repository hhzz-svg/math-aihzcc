# 数竞冲刺台（2026 全国大学生数学竞赛）

面向 **非数学专业 A 类初赛** 的本地网页版学习与刷题计划。目标考试日期为 **2026 年 11 月 14 日**。

## 直接使用

1. 双击 `启动网页版.cmd`；或直接用 Edge / Chrome 打开 `index.html`。
2. 不需要安装 Node.js、Python 或其他软件。
3. 题目状态、每日任务、薄弱专题、模拟成绩和连续学习天数保存在当前浏览器的 `localStorage` 中。
4. 右上角下载按钮可导出 JSON 格式的学习进度；左侧底部可重置全部本地记录。
5. 数学公式使用本地 KaTeX 0.16.22 渲染，MIT 许可证位于 `assets/vendor/katex/LICENSE`。

## 页面内容

- **今日总览**：考试倒计时、当前阶段、每日训练清单、45 分钟专注计时、专题掌握度。
- **17 周计划**：从 2026-07-15 到 2026-11-13 的六阶段路线，以及固定周训练节奏。
- **知识地图**：9 个高等数学专题的公式、解题扫描顺序、易错点和达标标准。
- **题库训练**：36 道原创同型例题，每个专题 4 题，包含提示、完整解析、答案与方法总结。
- **模拟战场**：6 场阶段模拟，支持 90/120/150 分钟计时、成绩记录与交卷订正。
- **技巧手册**：18 条可直接执行的做题、订正和考场检查规则。

## 备考范围

本项目默认用户参加 **非数学专业 A 类**。第十八届竞赛通知明确：

- 2026 年初赛时间：2026-11-14 09:00–11:30；
- 非数学专业 A 类和 B 类初赛考试内容均为高等数学；
- 非数学专业类决赛增加线性代数内容。

因此当前网页把初赛高等数学作为唯一主线，暂不把线性代数挤入 11 月前的核心计划。

## 文件结构

```text
竞赛/
├─ index.html                  网页入口
├─ styles.css                 页面样式与响应式布局
├─ data.js                    计划、知识点、36 道例题、技巧与模拟卷数据
├─ app.js                     导航、筛选、计时、进度与本地存储逻辑
├─ 启动网页版.cmd              一键打开网页
├─ assets/vendor/katex/       本地数学公式渲染依赖
├─ docs/备考设计与资料来源.md   范围、设计依据与资料来源
├─ tests/content-test.cjs     内容完整性检查
├─ tests/smoke-test.cjs       Edge 浏览器交互与响应式冒烟测试
└─ progress.md                实施与验证日志
```

## 验证

语法与内容检查可直接使用 Node.js 执行：

```powershell
node --check data.js
node --check app.js
node tests/content-test.cjs
```

`tests/smoke-test.cjs` 使用 `playwright-core` 驱动本机 Edge，主要检查页面加载、KaTeX 公式、36 道题、弹窗交互、进度写入、计划卡片和移动端无横向溢出。

## 主要资料

- 用户提供：《全国大学生数学竞赛参赛指南》（余志坤主编，全国大学生数学竞赛命题组编，科学出版社，2022）。
- 中国数学会，第十八届全国大学生数学竞赛通知：<https://www.cms.org.cn/Home/notices/notices_details/id/1439.html>
- 全国大学生数学竞赛网站，第十八届通知文字版：<https://www.cmathc.org.cn/tzgg/545.html>
- Khan Academy Mastery System：<https://support.khanacademy.org/hc/en-us/articles/360037054451>
- LeetCode Study Plan：<https://leetcode.com/studyplan/>

更完整的范围判断、内容设计和使用建议见 `docs/备考设计与资料来源.md`。


