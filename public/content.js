const m = String.raw;

const PLAN_META = {
  title: "2026 全国大学生数学竞赛 · 非数学专业 A 类",
  startDate: "2026-07-15",
  examDate: "2026-11-14",
  examMinutes: 150,
  defaultWeeklyHours: 12,
  version: "1.0.0"
};

const phases = [
  {
    id: "diagnosis", number: "00", start: "2026-07-15", end: "2026-07-19",
    title: "定位起点：从课内会做切换到竞赛表达",
    summary: "用一套 90 分钟诊断卷确认极限、导数、积分和级数的真实熟练度；建立错题标签，不急着追难题。",
    focus: ["极限与连续", "一元微分", "一元积分", "无穷级数"],
    target: "完成 24 道诊断题，找出 3 个最薄弱方法。"
  },
  {
    id: "single", number: "01", start: "2026-07-20", end: "2026-08-16",
    title: "一元核心：极限—中值—积分连成方法链",
    summary: "重练定义、Taylor 展开、中值定理、参数积分与积分变换。目标不是记题型，而是看到结构能选工具。",
    focus: ["极限与连续", "一元微分", "一元积分"],
    target: "基础题正确率 ≥ 85%，中档题 20 分钟内写出主线。"
  },
  {
    id: "multi-foundation", number: "02", start: "2026-08-17", end: "2026-09-13",
    title: "多元基础：空间图形、偏导、极值与微分方程",
    summary: "补齐空间解析几何与常微分方程，把梯度、方向导数、隐函数和条件极值练成固定流程。",
    focus: ["常微分方程", "空间解析几何", "多元微分"],
    target: "能独立画区域、列约束、判断驻点并完整分类。"
  },
  {
    id: "vector-calculus", number: "03", start: "2026-09-14", end: "2026-10-11",
    title: "积分主战场：重积分、线面积分与级数",
    summary: "把积分区域、坐标选择、方向和三大公式作为一个系统训练，同时完成常数项、幂级数与 Fourier 级数复盘。",
    focus: ["重积分", "曲线曲面积分", "无穷级数"],
    target: "看到区域先画图；看到线面积分先判路径无关或公式可用性。"
  },
  {
    id: "mixed", number: "04", start: "2026-10-12", end: "2026-11-01",
    title: "混合强化：专题不再分章，按整题入口训练",
    summary: "每周 2 次 75 分钟半套卷 + 1 次 150 分钟整卷；错题在 24 小时、3 天、7 天三次回炉。",
    focus: ["综合极限", "积分综合", "多元综合", "证明题表达"],
    target: "整卷完成度 ≥ 85%，空白题不超过 1 道。"
  },
  {
    id: "sprint", number: "05", start: "2026-11-02", end: "2026-11-13",
    title: "考前冲刺：稳得分、降失误、保持手感",
    summary: "只做高价值错题与 3 套模拟。最后 3 天停止追新难题，复盘公式、方法清单和常见符号错误。",
    focus: ["整卷模拟", "错题回炉", "公式口述", "作答节奏"],
    target: "连续 2 套模拟达到目标分，最后一周睡眠与考试时段同步。"
  }
];

const weeklyRhythm = [
  { day: "周一", title: "概念复位", text: "口述定义与定理条件；6 道基础题，要求零跳步。" },
  { day: "周二", title: "方法日", text: "学习 1 个核心技巧；8 道同型变式，记录触发信号。" },
  { day: "周三", title: "证明日", text: "4 道证明/估计题；强制写“构造什么函数、为何构造”。" },
  { day: "周四", title: "限时日", text: "45–75 分钟闭卷；到点停笔，按步骤分订正。" },
  { day: "周五", title: "错题回炉", text: "只看题干重做本周错题；整理一页方法卡。" },
  { day: "周六", title: "模拟日", text: "半套或整套计时；模拟正式书写与检查流程。" },
  { day: "周日", title: "轻复盘", text: "统计正确率、确定下周薄弱点；不硬啃新难题。" }
];

const topics = [
  {
    id: "limits", code: "lim", title: "函数、极限与连续", weight: 14,
    blurb: "竞赛的入口模块：等价、展开、夹逼、递推与含参极限。",
    diagnosis: "若只能依赖洛必达，或面对数列、积分型极限没有入口，这一章需要优先补。",
    formulas: [
      m`$\sin x\sim x,\quad 1-\cos x\sim \frac{x^2}{2},\quad \ln(1+x)\sim x$`,
      m`$e^x=1+x+\frac{x^2}{2!}+\cdots,\quad \ln(1+x)=x-\frac{x^2}{2}+\cdots$`,
      m`$\displaystyle \lim_{n\to\infty}\left(1+\frac{x}{n}\right)^n=e^x$`
    ],
    steps: ["先判型：代入、无穷小阶、递推还是积分集中。", "能等价就不展开；需要精确到高阶时再用 Taylor。", "含参数或积分型极限优先找一致界、夹逼或换序。", "递推数列先证单调有界，再研究误差的主阶。"],
    pitfalls: ["把等价无穷小用于加减法。", "洛必达前没有核对 $0/0$ 或 $\\infty/\\infty$。", "只算出候选极限，没有证明序列确实收敛。"],
    target: "12 分钟内完成常规极限；困难极限能写出主阶与剩余项。"
  },
  {
    id: "derivative", code: "f′", title: "一元函数微分学", weight: 16,
    blurb: "中值定理、Taylor、单调凸性与不等式证明是高频得分区。",
    diagnosis: "若会求导但不会构造辅助函数、不会解释中值定理条件，说明还停留在课内计算层。",
    formulas: [
      m`$f(b)-f(a)=f'(\xi)(b-a)$`,
      m`$f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)$`,
      m`$f''\ge 0\Rightarrow f\text{ 为凸函数}$`
    ],
    steps: ["证明等式：考虑 Rolle 定理并设计零点。", "证明不等式：移项构造函数，研究单调性/凸性。", "局部极限或估计：在最自然的点作 Taylor 展开。", "最值题：定义域—驻点—边界—比较，四步不可少。"],
    pitfalls: ["只写 $f'(x)=0$ 就宣布极值。", "使用 Taylor 却不说明展开点与余项阶。", "中值定理漏写连续、可导区间。"],
    target: "能把不等式证明压缩成“构造—求导—符号—结论”四行主干。"
  },
  {
    id: "integral", code: "∫", title: "一元函数积分学", weight: 14,
    blurb: "对称、换元、分部、参数积分与定积分估计。",
    diagnosis: "若每道积分只尝试凑微分，或遇到对数/反三角就无从下手，需要建立结构化扫描。",
    formulas: [
      m`$\int_a^b f(x)\,dx=\int_a^b f(a+b-x)\,dx$`,
      m`$\int u\,dv=uv-\int v\,du$`,
      m`$F(\alpha)=\int_a^b f(x,\alpha)\,dx\Rightarrow F'(\alpha)=\int_a^b f_\alpha(x,\alpha)\,dx$`
    ],
    steps: ["先看区间与被积函数的对称性。", "再看复合结构：换元后能否变成自身或简单函数。", "对数、反三角、幂指数混合时试参数法或分部积分。", "不会精确算时，先用单调性、凸性或积分中值定理估计。"],
    pitfalls: ["换元后忘记同步改变上下限。", "广义积分只算原函数，不检查端点收敛。", "参数积分换序/求导没有说明适用范围。"],
    target: "常规积分 10 分钟；综合积分能在 5 分钟内确定主要方法。"
  },
  {
    id: "ode", code: "y′", title: "常微分方程", weight: 8,
    blurb: "一阶典型方程、常系数线性方程与简单建模。",
    diagnosis: "若认不出可分离、线性、Bernoulli 或共振情形，先练“识别方程类型”而不是盲算。",
    formulas: [
      m`$y'+P(x)y=Q(x),\quad \mu(x)=e^{\int P(x)dx}$`,
      m`$y'+P(x)y=Q(x)y^n\Rightarrow z=y^{1-n}$`,
      m`$ay''+by'+cy=0\Rightarrow ar^2+br+c=0$`
    ],
    steps: ["先识别：可分离、齐次、一阶线性、Bernoulli、二阶常系数。", "写通解后再代初值，避免常数丢失。", "非齐次项与特征根共振时，试探式乘 $x^s$。", "建模题最后检查量纲、初值与长期趋势。"],
    pitfalls: ["除以 $y$ 时漏掉零解。", "只写特征根，不写对应通解结构。", "代初值时把通解中的常数提前合并错误。"],
    target: "3 分钟识别类型，12 分钟完成标准初值问题。"
  },
  {
    id: "geometry", code: "R³", title: "向量与空间解析几何", weight: 6,
    blurb: "向量积、平面直线、距离夹角、二次曲面与切线。",
    diagnosis: "若空间题完全依赖画图，或法向量/方向向量经常混淆，应先建立向量模板。",
    formulas: [
      m`$\cos\theta=\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$`,
      m`$d(\text{异面直线})=\frac{|(\mathbf r_2-\mathbf r_1)\cdot(\mathbf d_1\times\mathbf d_2)|}{|\mathbf d_1\times\mathbf d_2|}$`,
      m`$\mathbf t=\nabla F\times\nabla G$`
    ],
    steps: ["把几何条件翻译为点、方向向量、法向量。", "平行/垂直统一转化为叉积为零或点积为零。", "距离问题优先投影到共同法向量。", "交线切向量用两个曲面法向量的叉积。"],
    pitfalls: ["直线方向向量与平面法向量混用。", "夹角没有取锐角或绝对值。", "二次曲面配方后漏掉常数，导致半轴错误。"],
    target: "所有空间关系都能先写成一个向量等式。"
  },
  {
    id: "multidiff", code: "∇", title: "多元函数微分学", weight: 10,
    blurb: "可微性、复合/隐函数、方向导数、Taylor 与条件极值。",
    diagnosis: "若把“偏导存在”等同于“可微”，或 Lagrange 乘子只会列式不会筛选，需要重点训练。",
    formulas: [
      m`$df=\sum_i f_{x_i}\,dx_i,\quad D_{\mathbf u}f=\nabla f\cdot\mathbf u$`,
      m`$f(\mathbf x+\mathbf h)=f(\mathbf x)+\nabla f\cdot\mathbf h+o(|\mathbf h|)$`,
      m`$\nabla f=\lambda\nabla g$`
    ],
    steps: ["可微性题回到定义，检查余项是否为 $o(r)$。", "复合函数先画依赖树，再沿路径求导。", "极值题先找内部驻点，再查边界与约束。", "二元驻点用 Hessian 判别，但退化时需另找路径。"],
    pitfalls: ["方向向量没有单位化。", "混合偏导直接交换却未满足连续条件。", "条件极值只解乘子方程，不比较候选点。"],
    target: "能清楚区分连续、偏导存在、可微三者关系。"
  },
  {
    id: "multiple", code: "∬", title: "二重积分与三重积分", weight: 12,
    blurb: "区域作图、次序交换、坐标选择与对称性。",
    diagnosis: "若积分限靠猜、换坐标后漏 Jacobian，必须把“先画区域”变成硬规则。",
    formulas: [
      m`$dx\,dy=r\,dr\,d\theta$`,
      m`$dV=r\,dr\,d\theta\,dz\quad(\text{柱坐标})$`,
      m`$dV=\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta\quad(\text{球坐标})$`
    ],
    steps: ["先画投影区域并标关键交点。", "根据边界形状选择直角、极、柱或球坐标。", "写积分限时用“外层变量扫描，内层变量夹住”。", "利用区域和被积函数奇偶性先消项。"],
    pitfalls: ["极坐标忘记乘 $r$。", "换积分次序只交换符号，未重画区域。", "球坐标中 $\\varphi$ 与 $\\theta$ 范围混淆。"],
    target: "复杂重积分至少能正确画图、分区并列出积分。"
  },
  {
    id: "vectorcalc", code: "∮", title: "曲线、曲面积分与三大公式", weight: 12,
    blurb: "路径无关、Green、Gauss、Stokes、方向与奇点。",
    diagnosis: "若看到曲线积分就参数化、看到闭曲线就机械套 Green，需要补公式条件与奇点意识。",
    formulas: [
      m`$\oint_{\partial D}P\,dx+Q\,dy=\iint_D(Q_x-P_y)\,dA$`,
      m`$\iint_{\partial\Omega}\mathbf F\cdot\mathbf n\,dS=\iiint_\Omega \nabla\cdot\mathbf F\,dV$`,
      m`$\oint_{\partial S}\mathbf F\cdot d\mathbf r=\iint_S(\nabla\times\mathbf F)\cdot\mathbf n\,dS$`
    ],
    steps: ["先判第一型/第二型、是否闭合、方向是什么。", "检查偏导关系与定义域，决定能否用路径无关。", "套公式前确认区域内无奇点，边界方向与法向匹配。", "补面/挖洞时把新增边界的方向单独写清。"],
    pitfalls: ["区域含奇点仍直接套 Green/Gauss。", "曲面上下侧法向量方向写反。", "参数化后 $dt$、弧长因子或法向量模长遗漏。"],
    target: "用公式前能口述四个条件：光滑、闭合、方向、定义域。"
  },
  {
    id: "series", code: "Σ", title: "无穷级数", weight: 8,
    blurb: "敛散性、绝对/条件收敛、幂级数与 Fourier 级数。",
    diagnosis: "若判别法靠试运气，或收敛半径算对但端点不查，需要建立固定决策树。",
    formulas: [
      m`$\sum_{n=1}^{\infty}\frac1{n^p}\text{ 收敛}\iff p>1$`,
      m`$R^{-1}=\limsup_{n\to\infty}\sqrt[n]{|a_n|}$`,
      m`$f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}(a_n\cos nx+b_n\sin nx)$`
    ],
    steps: ["先看通项是否趋零。", "正项级数依次扫描：比较、极限比较、比值/根值、积分。", "交错或振荡项检查 Leibniz、Abel、Dirichlet。", "幂级数先求半径，再逐个检查端点。"],
    pitfalls: ["把通项趋零当成级数收敛。", "条件收敛级数随意重排。", "Fourier 级数在跳跃点忘记收敛到左右极限平均值。"],
    target: "2 分钟内选出首选判别法，并说明为什么比其他方法更直接。"
  }
];

const problems = [
  {
    id: "L01", topic: "limits", difficulty: 1, minutes: 6, title: "复合无穷小的两段拆分",
    skill: "等价无穷小", statement: m`计算 $\displaystyle\lim_{x\to0}\frac{e^{\sin x}-1}{x}$。`,
    hint: m`不要直接展开全部函数，把分式拆成两段标准极限。`,
    solution: m`写成 $$\frac{e^{\sin x}-1}{\sin x}\cdot\frac{\sin x}{x}.$$ 当 $x\to0$ 时，$\sin x\to0$，两段分别趋于 $1$ 与 $1$，故原极限为 $1$。`,
    answer: m`$1$`, trap: "复合结构中，先把内层变量视为一个整体。"
  },
  {
    id: "L02", topic: "limits", difficulty: 2, minutes: 10, title: "Taylor 精确到三阶",
    skill: "Taylor 展开", statement: m`计算 $\displaystyle\lim_{x\to0}\frac{\ln(1+x)-x+\frac{x^2}{2}}{x^3}$。`,
    hint: m`分母是三阶，分子至少展开到 $x^3$。`,
    solution: m`在 $x=0$ 处，$$\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}+o(x^3).$$ 代入后分子为 $\frac{x^3}{3}+o(x^3)$，除以 $x^3$ 得极限 $\frac13$。`,
    answer: m`$\frac13$`, trap: "展开阶数由消去后的最低非零阶决定。"
  },
  {
    id: "L03", topic: "limits", difficulty: 2, minutes: 14, title: "积分质量向端点集中",
    skill: "积分型极限", statement: m`求 $\displaystyle\lim_{n\to\infty}n\int_0^1\frac{x^n}{1+x}\,dx$。`,
    hint: m`把 $g(x)=\frac1{1+x}$ 看作在 $x=1$ 连续的权函数；$x^n$ 的质量集中到右端点。`,
    solution: m`一般地，若 $g$ 在 $[0,1]$ 连续，则 $n\int_0^1x^ng(x)dx\to g(1)$。证明可把区间分成 $[0,1-\delta]$ 与 $[1-\delta,1]$：前段由 $(1-\delta)^n$ 控制，后段利用 $g(x)$ 在 $1$ 附近与 $g(1)$ 的差小于任意 $\varepsilon$。此处 $g(1)=\frac12$，故极限为 $\frac12$。`,
    answer: m`$\frac12$`, trap: "遇到 $x^n$、$n x^n$，先想到端点集中而非硬求原函数。"
  },
  {
    id: "L04", topic: "limits", difficulty: 3, minutes: 22, title: "递推误差的主阶",
    skill: "Stolz 与渐近展开", statement: m`设 $a_1>0$，$a_{n+1}=\ln(1+a_n)$。求 $\displaystyle\lim_{n\to\infty}n a_n$。`,
    hint: m`先证 $a_n\downarrow0$，再研究 $\frac1{a_{n+1}}-\frac1{a_n}$。`,
    solution: m`因 $0<\ln(1+x)<x\ (x>0)$，故 $a_n$ 单调递减且极限只能为 $0$。又 $$\frac1{a_{n+1}}-\frac1{a_n}=\frac{a_n-\ln(1+a_n)}{a_n\ln(1+a_n)}\to\frac12,$$ 其中使用 $\ln(1+x)=x-\frac{x^2}{2}+o(x^2)$。由 Stolz 定理，$\frac{1/a_n}{n}\to\frac12$，因此 $n a_n\to2$。`,
    answer: m`$2$`, trap: "递推极限的难点常在收敛速度；倒数差能把 $1/n$ 级误差线性化。"
  },

  {
    id: "D01", topic: "derivative", difficulty: 1, minutes: 8, title: "中值定理直接给 Lipschitz 估计",
    skill: "Lagrange 中值定理", statement: m`证明对任意实数 $x,y$，有 $|\sin x-\sin y|\le |x-y|$。`,
    hint: m`对 $\sin t$ 在端点 $x,y$ 之间使用中值定理。`,
    solution: m`若 $x\ne y$，由 Lagrange 中值定理，存在 $\xi$ 位于 $x,y$ 之间，使 $$\sin x-\sin y=\cos\xi\,(x-y).$$ 因 $|\cos\xi|\le1$，取绝对值得结论。$x=y$ 时显然成立。`,
    answer: "证明见解析", trap: "写中值定理时交代函数在闭区间连续、开区间可导。"
  },
  {
    id: "D02", topic: "derivative", difficulty: 2, minutes: 13, title: "带指数因子的闭区间最值",
    skill: "最值与符号表", statement: m`求 $f(x)=x(1-x)e^x$ 在 $[0,1]$ 上的最大值。`,
    hint: m`求导后，指数因子恒正，只需研究一个二次式。`,
    solution: m`$$f'(x)=e^x(1-x-x^2).$$ 方程 $1-x-x^2=0$ 在 $[0,1]$ 内唯一根为 $r=\frac{\sqrt5-1}{2}$。导数在 $[0,r)$ 为正、$(r,1]$ 为负，且端点函数值均为 $0$，故最大值在 $r$ 取得。由 $1-r=r^2$，最大值为 $$r(1-r)e^r=r^3e^r.$$`,
    answer: m`$\left(\frac{\sqrt5-1}{2}\right)^3e^{(\sqrt5-1)/2}$`, trap: "闭区间最值必须比较端点与全部内部驻点。"
  },
  {
    id: "D03", topic: "derivative", difficulty: 2, minutes: 11, title: "凸函数位于弦线下方",
    skill: "凸性", statement: m`设 $f\in C^2[0,1]$，$f(0)=f(1)=0$ 且 $f''(x)>0$。证明 $f(x)<0$ 对所有 $x\in(0,1)$ 成立。`,
    hint: m`严格凸函数的图像位于任意两点连线的下方。也可使用 Rolle 定理反证。`,
    solution: m`由 $f''>0$，$f$ 严格凸。对 $x\in(0,1)$，写成 $x=(1-x)\cdot0+x\cdot1$。严格凸性给出 $$f(x)<(1-x)f(0)+xf(1)=0.$$`,
    answer: "证明见解析", trap: "凸函数与凹函数的弦线方向容易记反：凸函数图像在弦线下。"
  },
  {
    id: "D04", topic: "derivative", difficulty: 3, minutes: 18, title: "二阶导控制整段函数",
    skill: "插值余项", statement: m`设 $f\in C^2[0,1]$，$f(0)=f(1)=0$，且 $|f''(x)|\le M$。证明 $$|f(x)|\le\frac M2x(1-x),\qquad 0\le x\le1.$$`,
    hint: m`把 $f(x)$ 看作端点线性插值的误差；构造在 $0,x,1$ 三点为零的辅助函数。`,
    solution: m`固定 $x\in(0,1)$，令 $$\phi(t)=f(t)-\lambda t(t-1),\qquad \lambda=\frac{f(x)}{x(x-1)}.$$ 则 $\phi(0)=\phi(x)=\phi(1)=0$。两次使用 Rolle 定理，存在 $\xi\in(0,1)$ 使 $\phi''(\xi)=0$，即 $f''(\xi)-2\lambda=0$。故 $$f(x)=\frac{f''(\xi)}2x(x-1),$$ 取绝对值即得结论。`,
    answer: "证明见解析", trap: "三点信息通常对应二阶导；辅助函数应减去与零点结构一致的二次式。"
  },

  {
    id: "I01", topic: "integral", difficulty: 2, minutes: 14, title: "经典对称积分",
    skill: "区间对称", statement: m`计算 $\displaystyle I=\int_0^{\pi/2}\ln(\sin x)\,dx$。`,
    hint: m`作代换 $x\mapsto\frac\pi2-x$ 得到关于 $\ln\cos x$ 的同一个积分，再相加。`,
    solution: m`由代换得 $I=\int_0^{\pi/2}\ln(\cos x)dx$。于是 $$2I=\int_0^{\pi/2}\ln(\sin x\cos x)dx=\int_0^{\pi/2}\ln\left(\frac12\sin2x\right)dx.$$ 分离常数并令 $u=2x$：$$2I=-\frac\pi2\ln2+\frac12\int_0^\pi\ln(\sin u)du.$$ 后一积分由关于 $\pi/2$ 的对称性等于 $2I$，故 $2I=-\frac\pi2\ln2+I$，得到 $I=-\frac\pi2\ln2$。`,
    answer: m`$-\frac\pi2\ln2$`, trap: "对称代换的价值常在于把两个难积分相加后出现倍角。"
  },
  {
    id: "I02", topic: "integral", difficulty: 1, minutes: 7, title: "反三角函数就是现成变量",
    skill: "换元", statement: m`计算 $\displaystyle\int_0^1\frac{\arctan x}{1+x^2}\,dx$。`,
    hint: m`令 $u=\arctan x$。`,
    solution: m`令 $u=\arctan x$，则 $du=\frac{dx}{1+x^2}$，上下限由 $0,1$ 变为 $0,\pi/4$。因此 $$\int_0^{\pi/4}u\,du=\frac12\left(\frac\pi4\right)^2=\frac{\pi^2}{32}.$$`,
    answer: m`$\frac{\pi^2}{32}$`, trap: "看到函数与其导数同时出现，优先把函数整体设为新变量。"
  },
  {
    id: "I03", topic: "integral", difficulty: 2, minutes: 10, title: "积分展开成有限几何和",
    skill: "代数化简", statement: m`对正整数 $n$，计算 $\displaystyle\int_0^1\frac{1-x^n}{1-x}\,dx$。`,
    hint: m`先用有限几何级数，不要把 $x=1$ 当作真正奇点。`,
    solution: m`$$\frac{1-x^n}{1-x}=1+x+\cdots+x^{n-1}.$$ 因而 $$\int_0^1\frac{1-x^n}{1-x}dx=\sum_{k=0}^{n-1}\int_0^1x^kdx=\sum_{k=1}^n\frac1k=H_n.$$`,
    answer: m`$H_n=1+\frac12+\cdots+\frac1n$`, trap: "可去奇点应先代数消去，常能暴露求和结构。"
  },
  {
    id: "I04", topic: "integral", difficulty: 3, minutes: 20, title: "参数求导把难积分变常数",
    skill: "参数积分", statement: m`设 $a>-1$，计算 $\displaystyle F(a)=\int_0^1\frac{x^a-1}{\ln x}\,dx$。`,
    hint: m`直接积分很难；对参数 $a$ 求导。`,
    solution: m`对 $a>-1$，可在任意紧子区间上对参数求导：$$F'(a)=\int_0^1x^a\,dx=\frac1{a+1}.$$ 又 $F(0)=0$，故 $$F(a)=\int_0^a\frac{dt}{t+1}=\ln(a+1).$$`,
    answer: m`$\ln(a+1)$`, trap: "参数法的关键是选择让求导后明显简化的参数位置。"
  },

  {
    id: "O01", topic: "ode", difficulty: 1, minutes: 9, title: "一阶线性初值问题",
    skill: "积分因子", statement: m`求解 $y'+y=x$，$y(0)=1$。`,
    hint: m`积分因子为 $e^x$。`,
    solution: m`乘以 $e^x$ 得 $$(e^xy)'=xe^x.$$ 积分：$e^xy=e^x(x-1)+C$，故 $y=x-1+Ce^{-x}$。由 $y(0)=1$ 得 $C=2$。`,
    answer: m`$y=x-1+2e^{-x}$`, trap: "积分后先写通解，再代初值。"
  },
  {
    id: "O02", topic: "ode", difficulty: 2, minutes: 16, title: "非齐次项与特征根共振",
    skill: "常系数线性方程", statement: m`求解 $y''-3y'+2y=e^x$，$y(0)=0$，$y'(0)=0$。`,
    hint: m`$e^x$ 对应的指数 $1$ 正好是特征根，特解试为 $Axe^x$。`,
    solution: m`特征方程 $(r-1)(r-2)=0$，齐次解 $y_h=C_1e^x+C_2e^{2x}$。因共振，设 $y_p=Axe^x$，代入得 $A=-1$。故 $$y=C_1e^x+C_2e^{2x}-xe^x.$$ 初值给 $C_1+C_2=0$、$C_1+2C_2-1=0$，解得 $C_1=-1,C_2=1$。`,
    answer: m`$y=e^{2x}-(x+1)e^x$`, trap: "试探函数若与齐次解重复，要乘足够次数的 $x$。"
  },
  {
    id: "O03", topic: "ode", difficulty: 2, minutes: 12, title: "Bernoulli 方程倒数代换",
    skill: "Bernoulli 方程", statement: m`求解 $y'+y=xy^2$，$y(0)=1$。`,
    hint: m`令 $z=1/y$，方程会变成一阶线性方程。`,
    solution: m`令 $z=y^{-1}$，则 $z'=-y'/y^2$。原方程除以 $y^2$ 后得 $y'/y^2+1/y=x$，即 $$z'-z=-x.$$ 可验证 $z=x+1$ 满足方程与初值 $z(0)=1$；线性方程解唯一，故 $y=1/(x+1)$。`,
    answer: m`$y=\frac1{x+1}$`, trap: "变量代换后要同步转换初值。"
  },
  {
    id: "O04", topic: "ode", difficulty: 2, minutes: 13, title: "Logistic 模型与到达时间",
    skill: "可分离变量", statement: m`设 $y'=y(1-y)$，$y(0)=\frac12$。求解，并求首次达到 $y=\frac34$ 的时间。`,
    hint: m`分离变量后使用部分分式 $1/[y(1-y)]$。`,
    solution: m`分离变量：$$\int\left(\frac1y+\frac1{1-y}\right)dy=x+C,$$ 得 $\ln\frac{y}{1-y}=x+C$。由 $y(0)=1/2$ 得 $C=0$，故 $$y=\frac1{1+e^{-x}}.$$ 令 $y=3/4$，得 $e^{-x}=1/3$，所以 $x=\ln3$。`,
    answer: m`$y=\frac1{1+e^{-x}}$，到达时间 $\ln3$`, trap: "分离变量时不要漏掉平衡解；本题初值不在平衡解上。"
  },

  {
    id: "G01", topic: "geometry", difficulty: 1, minutes: 8, title: "三点定平面与点面距离",
    skill: "平面方程", statement: m`求过 $A(1,0,0),B(0,1,0),C(0,0,1)$ 的平面方程，并求原点到该平面的距离。`,
    hint: m`截距式可立即写出平面。`,
    solution: m`三个坐标轴截距均为 $1$，故平面为 $x+y+z=1$。原点到平面 $x+y+z-1=0$ 的距离为 $$\frac{|0+0+0-1|}{\sqrt{1^2+1^2+1^2}}=\frac1{\sqrt3}.$$`,
    answer: m`$x+y+z=1$，距离 $\frac1{\sqrt3}$`, trap: "距离公式分母是法向量长度。"
  },
  {
    id: "G02", topic: "geometry", difficulty: 2, minutes: 14, title: "异面直线距离的三重积",
    skill: "共同法向量投影", statement: m`直线 $L_1:\mathbf r=(1,0,0)+t(1,1,0)$，$L_2:\mathbf r=(0,1,1)+s(1,-1,1)$。求两直线距离。`,
    hint: m`距离是两线上定点连线在 $\mathbf d_1\times\mathbf d_2$ 方向上的投影长度。`,
    solution: m`方向向量为 $\mathbf d_1=(1,1,0)$、$\mathbf d_2=(1,-1,1)$，$$\mathbf d_1\times\mathbf d_2=(1,-1,-2),\quad |\mathbf d_1\times\mathbf d_2|=\sqrt6.$$ 取 $\mathbf r_2-\mathbf r_1=(-1,1,1)$，点积为 $-4$。故距离 $$d=\frac{|-4|}{\sqrt6}=\frac4{\sqrt6}.$$`,
    answer: m`$\frac4{\sqrt6}$`, trap: "使用三重积公式前应确认两方向向量不平行。"
  },
  {
    id: "G03", topic: "geometry", difficulty: 2, minutes: 12, title: "球面截平面的圆半径",
    skill: "配方与距离", statement: m`球面 $x^2+y^2+z^2-2x+4y-6z=2$ 被平面 $x+2y+2z=6$ 截得一圆，求圆心与半径。`,
    hint: m`先配方得到球心和球半径，再把球心投影到平面。`,
    solution: m`球面化为 $$(x-1)^2+(y+2)^2+(z-3)^2=16,$$ 球心 $C=(1,-2,3)$，半径 $R=4$。平面法向量 $\mathbf n=(1,2,2)$，且 $C$ 代入平面左减右为 $-3$，距离为 $1$。圆心是 $C$ 沿法向量投影到平面：$$C_0=C-\frac{-3}{9}\mathbf n=\left(\frac43,-\frac43,\frac{11}3\right).$$ 截圆半径 $\rho=\sqrt{R^2-d^2}=\sqrt{15}$。`,
    answer: m`圆心 $\left(\frac43,-\frac43,\frac{11}3\right)$，半径 $\sqrt{15}$`, trap: "投影公式中的符号由点代入平面方程的有符号值决定。"
  },
  {
    id: "G04", topic: "geometry", difficulty: 3, minutes: 15, title: "两曲面交线的切向量",
    skill: "梯度叉积", statement: m`求球面 $x^2+y^2+z^2=1$ 与平面 $x+y+z=1$ 的交线在点 $(1,0,0)$ 处的切线。`,
    hint: m`切向量同时垂直于两个曲面的法向量。`,
    solution: m`两曲面法向量分别为 $\nabla F=(2x,2y,2z)$ 与 $\nabla G=(1,1,1)$。在点 $(1,0,0)$，它们为 $(2,0,0)$ 与 $(1,1,1)$。叉积可取 $(0,-1,1)$，故切线为 $$\mathbf r=(1,0,0)+t(0,-1,1),$$ 即 $x=1,y=-t,z=t$。`,
    answer: m`$(x,y,z)=(1,-t,t)$`, trap: "交线切向量是两个法向量的叉积，不是梯度本身。"
  },

  {
    id: "M01", topic: "multidiff", difficulty: 2, minutes: 13, title: "偏导存在但不可微",
    skill: "可微定义", statement: m`定义 $f(0,0)=0$，当 $(x,y)\ne(0,0)$ 时 $$f(x,y)=\frac{x^3}{x^2+y^2}.$$ 判断 $f$ 在原点是否可微。`,
    hint: m`先求两个偏导，再沿一般方向检查线性主部是否存在。`,
    solution: m`沿坐标轴得 $f_x(0,0)=1$、$f_y(0,0)=0$。若可微，线性主部应为 $x$，需有 $$\frac{f(x,y)-x}{\sqrt{x^2+y^2}}\to0.$$ 取路径 $y=x$，则 $f(x,x)=x/2$，于是比值为 $\frac{-x/2}{\sqrt2|x|}$，其绝对值恒为 $1/(2\sqrt2)$，不趋于 $0$。故不可微。`,
    answer: "在原点不可微", trap: "偏导存在只给出候选线性主部，仍需验证余项是 $o(r)$。"
  },
  {
    id: "M02", topic: "multidiff", difficulty: 2, minutes: 12, title: "复合函数依赖树",
    skill: "多元链式法则", statement: m`设 $z=f(u,v)$，$u=x^2-y^2$，$v=2xy$。已知在 $(u,v)=(3,4)$ 处 $f_u=u+v$、$f_v=u-v$。求 $(x,y)=(2,1)$ 处的 $z_x,z_y$。`,
    hint: m`先算 $f_u,f_v$ 的数值，再沿 $u,v$ 两条路径求导。`,
    solution: m`在 $(2,1)$，$(u,v)=(3,4)$，故 $f_u=7,f_v=-1$。又 $u_x=2x=4,v_x=2y=2,u_y=-2y=-2,v_y=2x=4$。因此 $$z_x=f_uu_x+f_vv_x=7\cdot4-1\cdot2=26,$$ $$z_y=f_uu_y+f_vv_y=7(-2)+(-1)4=-18.$$`,
    answer: m`$z_x=26,\ z_y=-18$`, trap: "先画依赖树能避免漏掉链式法则路径。"
  },
  {
    id: "M03", topic: "multidiff", difficulty: 2, minutes: 14, title: "对称约束下的条件极值",
    skill: "Lagrange 乘数", statement: m`在 $x,y,z>0$ 且 $x+y+z=1$ 条件下，求 $xyz$ 的最大值。`,
    hint: m`列 Lagrange 方程后会得到三个变量相等；还可用 AM-GM 检验。`,
    solution: m`令 $L=xyz-\lambda(x+y+z-1)$。方程 $$yz=\lambda,\quad xz=\lambda,\quad xy=\lambda$$ 在正数范围内推出 $x=y=z$。由约束得 $x=y=z=1/3$，故最大值为 $1/27$。也可由 AM-GM：$xyz\le((x+y+z)/3)^3=1/27$，等号条件一致。`,
    answer: m`最大值 $\frac1{27}$，在 $x=y=z=\frac13$ 取得`, trap: "乘子法给候选点；全局最大值最好用不等式或边界行为补充确认。"
  },
  {
    id: "M04", topic: "multidiff", difficulty: 3, minutes: 18, title: "二元驻点的 Hessian 分类",
    skill: "二阶判别", statement: m`求 $f(x,y)=x^3+y^3-3xy$ 的全部驻点并分类。`,
    hint: m`由 $f_x=f_y=0$ 得 $y=x^2,x=y^2$。`,
    solution: m`$$f_x=3x^2-3y,\quad f_y=3y^2-3x.$$ 联立得 $(0,0)$ 与 $(1,1)$。Hessian 为 $$H=\begin{pmatrix}6x&-3\\-3&6y\end{pmatrix}.$$ 在 $(0,0)$，行列式 $-9<0$，为鞍点；在 $(1,1)$，行列式 $36-9=27>0$ 且 $f_{xx}=6>0$，为局部极小点，极小值 $f(1,1)=-1$。`,
    answer: "$(0,0)$ 为鞍点；$(1,1)$ 为局部极小点", trap: "Hessian 行列式为负即鞍点；为正时还要看 $f_{xx}$ 符号。"
  },

  {
    id: "R01", topic: "multiple", difficulty: 1, minutes: 8, title: "圆域上的径向函数",
    skill: "极坐标", statement: m`计算 $\displaystyle\iint_{x^2+y^2\le1}(x^2+y^2)\,dxdy$。`,
    hint: m`被积函数和区域都只依赖半径。`,
    solution: m`用极坐标，$x^2+y^2=r^2$，$dxdy=rdrd\theta$：$$\int_0^{2\pi}\int_0^1r^3\,drd\theta=2\pi\cdot\frac14=\frac\pi2.$$`,
    answer: m`$\frac\pi2$`, trap: "极坐标面积元必须乘 $r$。"
  },
  {
    id: "R02", topic: "multiple", difficulty: 2, minutes: 12, title: "截距型四面体体积",
    skill: "三重积分/几何体积", statement: m`求区域 $x,y,z\ge0$，$x+2y+3z\le1$ 的体积。`,
    hint: m`这是三个坐标轴截距分别为 $1,1/2,1/3$ 的四面体。`,
    solution: m`坐标面与平面围成四面体，三个互相垂直的棱长为 $1,1/2,1/3$。体积为 $$V=\frac16\cdot1\cdot\frac12\cdot\frac13=\frac1{36}.$$ 也可列三重积分得到同样结果。`,
    answer: m`$\frac1{36}$`, trap: "截距式区域可先用几何公式快速核对积分结果。"
  },
  {
    id: "R03", topic: "multiple", difficulty: 2, minutes: 13, title: "换序消掉不可积原函数",
    skill: "交换积分次序", statement: m`计算 $\displaystyle\int_0^1\int_x^1e^{y^2}\,dydx$。`,
    hint: m`内层关于 $y$ 没有初等原函数；画出 $0\le x\le y\le1$ 后换序。`,
    solution: m`区域为 $0\le x\le y\le1$。换序后 $$\int_0^1\int_0^y e^{y^2}\,dxdy=\int_0^1 y e^{y^2}\,dy=\frac{e-1}{2}.$$`,
    answer: m`$\frac{e-1}{2}$`, trap: "出现 $e^{y^2}$ 等无初等原函数时，换序常让另一变量提供导数因子。"
  },
  {
    id: "R04", topic: "multiple", difficulty: 2, minutes: 12, title: "球对称下的径向矩",
    skill: "球坐标", statement: m`计算单位球 $B:x^2+y^2+z^2\le1$ 上的 $\displaystyle\iiint_B(x^2+y^2+z^2)\,dV$。`,
    hint: m`球坐标中被积函数为 $\rho^2$，体积元为 $\rho^2\sin\varphi$。`,
    solution: m`$$\iiint_B\rho^2\,dV=\int_0^1\rho^4d\rho\int_0^\pi\sin\varphi d\varphi\int_0^{2\pi}d\theta=\frac15\cdot2\cdot2\pi=\frac{4\pi}{5}.$$`,
    answer: m`$\frac{4\pi}{5}$`, trap: "径向幂次要同时计入被积函数与 Jacobian。"
  },

  {
    id: "C01", topic: "vectorcalc", difficulty: 3, minutes: 15, title: "有奇点时不能直接套 Green",
    skill: "绕数与奇点", statement: m`设 $C:x^2+y^2=R^2$ 取逆时针方向，计算 $$\oint_C\frac{-y\,dx+x\,dy}{x^2+y^2}.$$`,
    hint: m`原点是奇点，不能在圆盘上直接用 Green。参数化最直接。`,
    solution: m`令 $x=R\cos t,y=R\sin t$，$0\le t\le2\pi$。则 $dx=-R\sin tdt,dy=R\cos tdt$，分子为 $R^2dt$，分母为 $R^2$。因此积分为 $$\int_0^{2\pi}dt=2\pi.$$`,
    answer: m`$2\pi$`, trap: "虽然旋度在非原点处为零，但定义域有洞，路径无关结论不成立。"
  },
  {
    id: "C02", topic: "vectorcalc", difficulty: 1, minutes: 8, title: "先判全微分再选路径",
    skill: "路径无关", statement: m`计算从 $(0,0)$ 到 $(1,2)$ 的曲线积分 $$\int_C(2xy+e^x)dx+(x^2+2y)dy,$$ 其中 $C$ 为任意光滑路径。`,
    hint: m`检查 $P_y$ 与 $Q_x$，再求势函数。`,
    solution: m`$P_y=2x=Q_x$，且定义域为全平面，故积分与路径无关。由 $F_x=2xy+e^x$ 得 $$F=x^2y+e^x+g(y).$$ 与 $F_y=x^2+g'(y)=x^2+2y$ 比较，得 $g=y^2$。因此积分为 $$F(1,2)-F(0,0)=(2+e+4)-1=e+5.$$`,
    answer: m`$e+5$`, trap: "求势函数时，积分常数应写成另一变量的函数。"
  },
  {
    id: "C03", topic: "vectorcalc", difficulty: 2, minutes: 10, title: "用 Green 公式求椭圆面积",
    skill: "面积公式", statement: m`椭圆 $C:\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$ 取逆时针方向。计算 $$\frac12\oint_C(x\,dy-y\,dx).$$`,
    hint: m`这是平面闭曲线面积公式；也可参数化核对。`,
    solution: m`令 $P=-y/2,Q=x/2$，则 $Q_x-P_y=1$。由 Green 公式，$$\frac12\oint_C(xdy-ydx)=\iint_D1\,dA=\operatorname{Area}(D)=\pi ab.$$`,
    answer: m`$\pi ab$`, trap: "逆时针对应正方向；若方向反转，积分符号改变。"
  },
  {
    id: "C04", topic: "vectorcalc", difficulty: 2, minutes: 10, title: "Gauss 公式一行算球面通量",
    skill: "散度定理", statement: m`设 $S$ 为半径 $R$ 的球面，取外法向，$\mathbf F=(x,y,z)$。计算 $\displaystyle\iint_S\mathbf F\cdot\mathbf n\,dS$。`,
    hint: m`散度为常数。`,
    solution: m`$\nabla\cdot\mathbf F=3$。由 Gauss 公式，$$\iint_S\mathbf F\cdot\mathbf n\,dS=\iiint_{B_R}3\,dV=3\cdot\frac{4\pi R^3}{3}=4\pi R^3.$$`,
    answer: m`$4\pi R^3$`, trap: "题目中的 $\\mathbf n$ 若表示单位法向，公式可直接使用；外法向决定正号。"
  },

  {
    id: "S01", topic: "series", difficulty: 1, minutes: 6, title: "裂项相消",
    skill: "望远镜级数", statement: m`求 $\displaystyle\sum_{n=1}^{\infty}\frac1{n(n+1)}$。`,
    hint: m`$\frac1{n(n+1)}=\frac1n-\frac1{n+1}$。`,
    solution: m`部分和 $$S_N=\sum_{n=1}^N\left(\frac1n-\frac1{n+1}\right)=1-\frac1{N+1}.$$ 令 $N\to\infty$ 得和为 $1$。`,
    answer: m`$1$`, trap: "求无穷级数先写有限部分和，再取极限。"
  },
  {
    id: "S02", topic: "series", difficulty: 2, minutes: 10, title: "绝对收敛与条件收敛分开判断",
    skill: "Leibniz 判别", statement: m`判断级数 $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{\sqrt n}$ 的收敛性。`,
    hint: m`先判交错级数，再检查绝对值级数。`,
    solution: m`$1/\sqrt n$ 单调递减且趋于 $0$，故由 Leibniz 判别法，原级数收敛。绝对值级数 $\sum1/\sqrt n$ 是 $p=1/2\le1$ 的 $p$ 级数，发散。因此原级数条件收敛而非绝对收敛。`,
    answer: "条件收敛", trap: "“交错级数收敛”不等于“绝对收敛”。"
  },
  {
    id: "S03", topic: "series", difficulty: 2, minutes: 10, title: "由几何级数逐项求导",
    skill: "幂级数求和", statement: m`求 $\displaystyle\sum_{n=1}^{\infty}n x^n$ 的和函数及收敛区间。`,
    hint: m`从 $\sum_{n=0}^{\infty}x^n=1/(1-x)$ 出发。`,
    solution: m`在 $|x|<1$ 内逐项求导：$$\sum_{n=1}^{\infty}n x^{n-1}=\frac1{(1-x)^2}.$$ 乘以 $x$ 得 $$\sum_{n=1}^{\infty}n x^n=\frac{x}{(1-x)^2},\quad |x|<1.$$ 端点 $x=\pm1$ 的通项均不趋于 $0$，故都发散，收敛区间为 $(-1,1)$。`,
    answer: m`$\frac{x}{(1-x)^2}$，$|x|<1$`, trap: "半径求出后仍需单独检查两个端点。"
  },
  {
    id: "S04", topic: "series", difficulty: 3, minutes: 20, title: "奇函数的 Fourier 展开",
    skill: "Fourier 级数", statement: m`求 $f(x)=x$ 在 $(-\pi,\pi)$ 上的 Fourier 级数，并由 $x=\pi/2$ 推出一个经典级数恒等式。`,
    hint: m`$f$ 为奇函数，只有正弦项；分部积分计算 $b_n$。`,
    solution: m`因 $f$ 为奇函数，$a_0=a_n=0$。$$b_n=\frac1\pi\int_{-\pi}^{\pi}x\sin(nx)dx=\frac2\pi\int_0^\pi x\sin(nx)dx=\frac{2(-1)^{n+1}}n.$$ 因此 $$x=2\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}n\sin(nx),\quad -\pi<x<\pi.$$ 取 $x=\pi/2$，偶数项消失，得到 $$\frac\pi4=1-\frac13+\frac15-\frac17+\cdots.$$`,
    answer: m`$x=2\sum_{n\ge1}\frac{(-1)^{n+1}}n\sin(nx)$；$\frac\pi4=1-\frac13+\frac15-\cdots$`, trap: "利用奇偶性可先消掉一半系数，减少计算与符号错误。"
  }
];

const tips = [
  { title: "极限先判“需要几阶”", text: "分母若是 $x^k$，先观察分子低阶项会消到哪里；只展开到第一个不消失的阶，避免无意义长算。", check: "我能否先写出分子的主阶？" },
  { title: "等价无穷小只安全替换乘除", text: "加减式中直接替换可能改变首个非零项。遇到差值，优先通分、因式分解或 Taylor。", check: "当前结构是乘除，还是会发生抵消的加减？" },
  { title: "证明题先写构造目的", text: "辅助函数不是猜出来的：要制造零点就用 Rolle；要比较大小就移项；要固定端点就减插值多项式。", check: "我希望新函数具有什么零点或导数符号？" },
  { title: "中值定理条件写全", text: "连续区间、可导区间、端点关系都是评分点。先写条件再写“存在 $\\xi$”。", check: "闭区间连续、开区间可导是否已交代？" },
  { title: "最值题必须扫边界", text: "驻点只负责内部候选。闭区域还要查端点、边界曲线、不可导点与约束退化点。", check: "候选点清单是否完整？" },
  { title: "积分先看对称与区间", text: "看到 $[0,a]$、$[-a,a]$、$[0,\\pi/2]$，先试 $x\\mapsto a-x$、奇偶性与三角互余。", check: "代换后能否得到原积分或互补积分？" },
  { title: "不会算原函数就换序", text: "二重积分中出现 $e^{y^2}$、$\\sin(y^2)$ 等，通常不是要硬积分，而是通过换序让另一变量产生导数因子。", check: "区域重画后，内层能否变简单？" },
  { title: "参数法要选对位置", text: "把最难处理的指数、对数或分母变成参数，使求导后降阶；最后用一个易算的参数值确定常数。", check: "对参数求导后真的更简单吗？" },
  { title: "微分方程先识别再计算", text: "前三分钟只做分类：可分离、线性、Bernoulli、可降阶或常系数。识别错了，后面计算越长损失越大。", check: "我能一句话说出方程类型与标准代换吗？" },
  { title: "空间题全部向量化", text: "平行用叉积，垂直用点积，距离用投影，交线切向用法向量叉积。避免仅凭空间想象。", check: "点、方向向量、法向量是否写出来了？" },
  { title: "可微性回到余项", text: "偏导存在、方向导数存在都不足以保证可微。写出候选线性主部，检查余项除以 $r$ 是否趋零。", check: "是否真正验证了 $o(r)$？" },
  { title: "重积分硬规则：先画图", text: "积分限不是代数题，而是区域扫描。标出交点、上下边界，再决定先 $x$ 后 $y$ 或换坐标。", check: "我的每个积分限能在图上指出来源吗？" },
  { title: "三大公式先查定义域", text: "闭曲线内部有奇点、闭曲面内部有源点时，不能直接套 Green/Gauss。先挖洞、补面或参数化。", check: "区域内部函数是否处处光滑？" },
  { title: "方向问题单独占一行", text: "逆时针、外法向、右手规则不要藏在心里。先写方向约定，再计算，最后用几何直觉核对正负。", check: "边界方向与法向是否匹配？" },
  { title: "级数判别从通项开始", text: "第一问永远是 $a_n\\to0$ 吗；随后再按正项、交错、振荡、幂级数分流，不要直接乱试比值法。", check: "这一级数属于哪一类？" },
  { title: "错题只记录“错误决策”", text: "不要抄整页答案。写三行：我当时选了什么入口、为什么错、下次看到什么信号要改用什么方法。", check: "我记录的是方法触发器，而不是答案吗？" },
  { title: "卡住 8 分钟就留痕跳题", text: "留下一句已知、一个关键公式或区域图，再进入下一题。整卷先保完成度，再回头攻坚。", check: "这 8 分钟是否产生了可评分步骤？" },
  { title: "检查优先级：域—号—界—结论", text: "最后 25 分钟依次检查定义域、正负号、上下限/边界、结论是否回答题目。计算细节放在后面。", check: "有没有算对但答非所问？" }
];

const mockExams = [
  { id: "mock-1", number: "MOCK 01", date: "2026-07-19", title: "起点诊断", description: "判断一元基础是否真正熟练，建议限时 90 分钟。", minutes: 90, total: 100, problems: ["L01","L02","D01","D02","I02","I03"] },
  { id: "mock-2", number: "MOCK 02", date: "2026-08-16", title: "一元核心结课", description: "覆盖 Taylor、中值定理、参数积分与一阶微分方程。", minutes: 120, total: 100, problems: ["L04","D03","D04","I01","I04","O01"] },
  { id: "mock-3", number: "MOCK 03", date: "2026-09-13", title: "空间与多元基础", description: "检查向量化、链式法则、条件极值和常系数方程。", minutes: 120, total: 100, problems: ["O02","O03","G02","G04","M02","M03"] },
  { id: "mock-4", number: "MOCK 04", date: "2026-10-11", title: "积分与级数主战场", description: "重积分、三大公式、幂级数与 Fourier 的组合训练。", minutes: 150, total: 100, problems: ["R03","R04","C01","C02","C04","S04"] },
  { id: "mock-5", number: "MOCK 05", date: "2026-10-25", title: "第一次全真混合", description: "不按章节提示，重点训练入口选择与三轮作答。", minutes: 150, total: 100, problems: ["L03","D04","I04","M04","R02","C03"] },
  { id: "mock-6", number: "MOCK 06", date: "2026-11-08", title: "考前定型", description: "最后一套高质量全真模拟；之后只回炉错题与方法卡。", minutes: 150, total: 100, problems: ["L04","D02","O04","G03","M01","S03"] }
];

const dailyRules = [
  "答案未写完前，不点开解析。",
  "每题先写“考什么、入口是什么”。",
  "积分题不画区域，不开始列式。",
  "证明题必须写出所用定理的条件。",
  "错题订正后，隔 10 分钟遮住答案重做一次。",
  "计算超过两页，停下来寻找对称或换元。",
  "今天的最后 5 分钟只写方法，不再做新题。"
];
