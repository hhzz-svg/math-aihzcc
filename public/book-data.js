const BOOK_META = {
  edition: "2026 秋季备考版",
  category: "非数学专业 A 类 · 初赛",
  examDate: "2026-11-14T09:00:00+08:00",
  examEnd: "2026-11-14T11:30:00+08:00",
  verifiedAt: "2026-07-15",
  officialNotice: "https://www.cms.org.cn/Home/comp/comp_details/cid/50/id/1355.html",
  referenceTitle: "《全国大学生数学竞赛参赛指南》",
  referencePages: 382
};

const BOOK_CHAPTERS = [
  {
    id: "limits", number: "第一章", title: "函数、极限与连续", subtitle: "先判断主阶，再选择工具",
    pdfPages: [26], examWeight: "约 12%–16%", exampleId: "L04", practiceIds: ["L01", "L02", "L03"],
    opening: "极限题真正考的是对数量级的判断。面对式子，先问第一个不消失的项在哪一阶，再决定用等价无穷小、Taylor、夹逼、单调有界还是 Stolz。",
    sections: [
      { title: "无穷小的阶与等价替换", body: "若 $f(x)/g(x)\\to 1$，则 $f\\sim g$。等价替换最安全的场景是乘除结构；在加减结构中，低阶项可能相消，必须先通分、因式分解或展开到首个非零项。常用主阶：$\\sin x\\sim x$，$1-\\cos x\\sim x^2/2$，$e^x-1\\sim x$，$\\ln(1+x)\\sim x$。", cue: "看到差值，先问会不会抵消。" },
      { title: "Taylor 展开只做到够用", body: "分母是 $x^k$ 时，分子至少展开到 $k$ 阶附近；一旦找到首个不消失项就停止。常用展开点通常是 $0$，但含 $x-a$ 的局部问题应在 $a$ 点展开。余项写成 $o((x-a)^n)$，能明确说明精度。", cue: "先写目标阶数，再动笔展开。" },
      { title: "数列极限的两段式证明", body: "递推数列通常先证明单调与有界，从而得到收敛；再把极限代入递推式求候选值。若要求收敛速度，令 $e_n=a_n-L$，对误差递推作一阶或二阶展开。分式型数列极限还可考虑 Stolz 定理。", cue: "候选极限不等于已经证明收敛。" },
      { title: "连续性负责把局部信息传到区间", body: "闭区间连续函数具备有界性、最值性和介值性。存在性证明常把目标改写成 $F(x)=0$，再寻找端点异号；唯一性则进一步证明 $F$ 单调。分段函数先检查左右极限与函数值。", cue: "存在看介值，唯一看单调。" }
    ]
  },
  {
    id: "derivative", number: "第二章", title: "一元函数微分学", subtitle: "把计算题升级为构造与证明",
    pdfPages: [27], examWeight: "约 14%–18%", exampleId: "D04", practiceIds: ["D01", "D02", "D03"],
    opening: "课内微分学强调求导，竞赛微分学更看重中值定理、Taylor、单调凸性与辅助函数构造。写证明前先说清楚：要制造零点、比较大小，还是估计余项。",
    sections: [
      { title: "导数、微分与局部线性化", body: "$f(a+h)=f(a)+f'(a)h+o(h)$ 是可微的核心表达。它既给出切线，也能把复杂复合式转成主项。隐函数和参数方程求导时，先写依赖关系，再做链式法则，避免漏乘。", cue: "可微就是存在可靠的一次近似。" },
      { title: "中值定理的构造逻辑", body: "要证明存在 $\\xi$ 使某个式子成立，先把结论改写为某个函数在 $\\xi$ 处导数为零，再设计端点等值以调用 Rolle。比较两个增量的比值时用 Cauchy 中值定理；只比较函数增量与区间长度时用 Lagrange。", cue: "先设计端点，再求导。" },
      { title: "Taylor 与不等式", body: "局部估计用 Taylor；全区间不等式通常构造 $F(x)=\\text{左}-\\text{右}$，通过 $F'$、$F''$ 的符号建立单调性或凸性。使用带余项的 Taylor 时，要说明展开点、阶数和余项符号。", cue: "局部看展开，全局看导数符号。" },
      { title: "最值、凸性与作图", body: "完整候选点包括驻点、不可导点、端点与渐近边界。$f''>0$ 表示严格凸，切线位于图像下方，弦位于图像上方；这能快速产生 Jensen 型估计。", cue: "驻点只是候选，不是结论。" }
    ]
  },
  {
    id: "integral", number: "第三章", title: "一元函数积分学", subtitle: "先扫结构，再做计算",
    pdfPages: [27], examWeight: "约 12%–16%", exampleId: "I04", practiceIds: ["I01", "I02", "I03"],
    opening: "积分题不应从凑微分开始。固定顺序是：看区间对称、看复合结构、看分部降阶、看参数化，最后才是硬算原函数。",
    sections: [
      { title: "换元与对称", body: "在 $[a,b]$ 上同时考察 $x$ 与 $a+b-x$，常能得到互补关系。$[-a,a]$ 先判奇偶；三角积分常用 $x\\mapsto \\pi/2-x$。换元必须同步改变上下限，定积分尽量不换回原变量。", cue: "区间本身就是提示。" },
      { title: "分部积分的目标是降阶", body: "多项式乘指数/三角函数通常让多项式求导；对数和反三角函数常令其为 $u$。若一次分部回到原积分，可移项求解。不要把分部积分当机械公式，应先判断哪一部分求导后更简单。", cue: "求导谁会变简单，就让谁做 $u$。" },
      { title: "广义积分先判敛再计算", body: "无穷区间与瑕点都要写成极限。正项积分可与 $1/x^p$ 比较；振荡积分可考虑分部积分或 Dirichlet 判别。只写原函数而不检查端点，是常见失分。", cue: "每个坏端点单独检查。" },
      { title: "参数积分把难度搬走", body: "构造 $F(\\alpha)=\\int f(x,\\alpha)dx$，使 $F'(\\alpha)$ 比原积分更简单，再由易算的初值恢复常数。竞赛中常见对数、指数和有理式的组合。", cue: "参数求导后必须真的降阶。" }
    ]
  },
  {
    id: "ode", number: "第四章", title: "常微分方程", subtitle: "前三分钟只做类型识别",
    pdfPages: [27], examWeight: "约 6%–10%", exampleId: "O04", practiceIds: ["O01", "O02", "O03"],
    opening: "常微分方程的主要风险不是算错，而是认错类型。每题先写一句分类与标准代换，再开始计算。",
    sections: [
      { title: "一阶方程分类", body: "可分离方程把 $y$ 与 $x$ 分到两边；齐次方程常令 $v=y/x$；线性方程 $y'+P(x)y=Q(x)$ 用积分因子；Bernoulli 方程令 $z=y^{1-n}$。除以含 $y$ 的式子时要补查被除掉的特殊解。", cue: "先分类，后积分。" },
      { title: "全微分方程", body: "$Mdx+Ndy=0$ 若满足 $M_y=N_x$，就在单连通区域内寻找势函数。先对一个变量积分，再把“积分常数”写成另一变量的函数，最后对势函数求偏导核对。若不恰当，可观察是否存在只依赖单个变量的积分因子。", cue: "积分常数不是常数，而是另一个变量的函数。" },
      { title: "常系数线性方程", body: "齐次部分由特征方程决定：不同实根、重根、共轭复根对应三种通解结构。非齐次特解按自由项试探；若与齐次解共振，试探式乘 $x^s$，$s$ 等于对应特征根的重数。", cue: "共振就乘 $x^s$。" },
      { title: "结果检查", body: "代回原方程是最快的自检。初值题还要核对初值、解的定义域和长期趋势；建模题要检查量纲。若求解过程中除过可能为零的因子，还要把对应特殊解补回并单独验证。", cue: "通解写完不算结束，代回才算。" }
    ]
  },
  {
    id: "geometry", number: "第五章", title: "向量与空间解析几何", subtitle: "把空间直觉翻译成向量运算",
    pdfPages: [27, 28], examWeight: "约 4%–8%", exampleId: "G04", practiceIds: ["G01", "G02", "G03"],
    opening: "空间题最稳的做法是向量化：平行看叉积，垂直看点积，距离看投影，交线方向看两个法向量的叉积。",
    sections: [
      { title: "直线与平面的语言", body: "直线由一点和方向向量决定；平面由一点和法向量决定。判断位置关系时只比较方向向量与法向量，不必先消元。两平面交线方向可取 $\\mathbf n_1\\times\\mathbf n_2$。", cue: "先找方向向量与法向量。" },
      { title: "距离与夹角", body: "点到平面的距离是法向投影；异面直线距离是连接向量在两方向向量叉积上的投影；平行直线则改投影到共同垂直方向。夹角公式要先判断题目要锐角、钝角还是有向角，并注意直线夹角通常取锐角。", cue: "距离就是某个方向上的投影长度。" },
      { title: "曲面与投影", body: "识别二次曲面时先看平方项符号与缺失变量。求空间曲线在坐标面上的投影，需要消去被投影掉的变量，并保留由原曲线带来的范围限制。写曲面草图时可先看与三个坐标面的截痕，再判断开口方向与对称轴。", cue: "消元之后别丢范围。" },
      { title: "切线与法平面", body: "参数曲线的切向量是 $\\mathbf r'(t_0)$；隐式曲面 $F=0$ 的法向量是 $\\nabla F$。交线切向量可由两个曲面法向量叉积得到。", cue: "梯度垂直于等值面。" }
    ]
  },
  {
    id: "multidiff", number: "第六章", title: "多元函数微分学", subtitle: "分清偏导、方向导数与可微",
    pdfPages: [28], examWeight: "约 8%–12%", exampleId: "M04", practiceIds: ["M01", "M02", "M03"],
    opening: "多元微分学最容易混淆概念层级：偏导存在不推出连续，所有方向导数存在也不推出可微。遇到可微性，最终要回到线性主部与余项。",
    sections: [
      { title: "极限、连续、偏导、可微", body: "可微 $\\Rightarrow$ 连续且偏导存在；反向一般不成立。证明不可连续常选不同路径；证明可微则写出候选线性主部，并验证余项除以 $\\sqrt{h^2+k^2}$ 趋于零。偏导在邻域连续是常用充分条件。", cue: "多路径只能否定极限，不能证明极限。" },
      { title: "链式法则与隐函数", body: "先画依赖图：每条路径贡献一个乘积，再把同一终点的贡献相加。隐函数求导前要确认相应偏导不为零；二阶导数要继续对一阶关系求导，不能把一阶结果当显函数随意处理。", cue: "链式法则先画依赖关系。" },
      { title: "梯度与方向导数", body: "可微时，单位方向 $\\mathbf u$ 上的方向导数为 $D_{\\mathbf u}f=\\nabla f\\cdot\\mathbf u$；梯度给出最速上升方向，最大方向导数为 $|\\nabla f|$。", cue: "方向向量先单位化。" },
      { title: "无约束与条件极值", body: "无约束极值先找驻点，再用 Hessian 判别；判别式为零时需要换方法。条件极值用 Lagrange 乘数法，同时检查约束的退化点与边界端点。", cue: "闭区域最值必须扫边界。" }
    ]
  },
  {
    id: "multiple", number: "第七章", title: "二重积分与三重积分", subtitle: "积分限必须能在图上解释",
    pdfPages: [28], examWeight: "约 10%–14%", exampleId: "R04", practiceIds: ["R01", "R02", "R03"],
    opening: "重积分的核心不是原函数，而是区域。每一个上下限都必须能在草图中指出来源；区域画不清，后面的计算越熟练越危险。",
    sections: [
      { title: "直角坐标与换序", body: "先标交点和边界，再决定竖切或横切。换序时重新描述区域，不要机械互换积分号。遇到 $e^{y^2}$、$\\sin(y^2)$ 等无初等原函数的内层积分，换序往往是命题入口。", cue: "先画区域，再写积分。" },
      { title: "极坐标与对称性", body: "圆、扇形、径向函数优先极坐标，面积元为 $rdrd\\theta$。角度范围由区域而非图形名称决定；若区域跨越不同边界，应分段。奇偶与旋转对称可在积分前消掉大量项。", cue: "别漏 Jacobian 的 $r$。" },
      { title: "一般变量代换", body: "当边界由 $x+y$、$x-y$、$xy$、$x/y$ 等组合给出时，选这些组合作新变量。写出反变换或直接计算 Jacobian，并确认映射范围与重数。", cue: "让新变量把边界变成常数。" },
      { title: "三重积分的坐标选择", body: "柱对称选柱坐标，球对称选球坐标。球坐标体积元为 $\\rho^2\\sin\\varphi\,d\\rho d\\varphi d\\theta$。复杂立体可先投影到某坐标面，再写上下表面。", cue: "坐标系应服从对称性。" }
    ]
  },
  {
    id: "vectorcalc", number: "第八章", title: "曲线、曲面积分与三大公式", subtitle: "先查定义域，再查方向",
    pdfPages: [28], examWeight: "约 10%–14%", exampleId: "C04", practiceIds: ["C01", "C02", "C03"],
    opening: "Green、Gauss、Stokes 不是看到闭曲线或闭曲面就套。先检查光滑性与奇点，再确认边界方向和法向约定。",
    sections: [
      { title: "两类曲线积分", body: "第一类对弧长积分，与路径方向无关；第二类对坐标微分积分，方向反转会变号。参数化后统一写成单变量积分。平面第二类曲线积分若 $P_y=Q_x$ 且区域单连通，则与路径无关。", cue: "先分清 $ds$ 还是 $dx,dy,dz$。" },
      { title: "Green 公式与挖洞", body: "正向边界通常指逆时针。若区域内部有奇点，不能直接对整个区域用 Green；应挖去小圆并处理新增内边界，或直接参数化。多连通区域的内边界方向与外边界相反，这是符号核对重点。", cue: "闭曲线内部是否处处光滑？" },
      { title: "曲面积分与 Gauss 公式", body: "第二类曲面积分要明确法向。闭曲面取外法向时，Gauss 公式把通量化为体积分；非闭曲面可补面，再减去补面通量。若场在内部有奇点，要挖去小球或改用直接参数化，不能跨过奇点套公式。", cue: "补面之前先写方向。" },
      { title: "Stokes 公式", body: "曲面法向与边界方向由右手规则匹配。曲面可替换为同边界、方向一致且更容易计算的曲面，例如把复杂曲面换成平面圆盘；但要保证旋度场在两曲面围成的相关区域内光滑。", cue: "边界不变时，选最简单的跨越曲面。" }
    ]
  },
  {
    id: "series", number: "第九章", title: "无穷级数", subtitle: "先分类，再选择判别法",
    pdfPages: [28, 29], examWeight: "约 6%–10%", exampleId: "S04", practiceIds: ["S01", "S02", "S03"],
    opening: "级数判别不是把所有方法轮流试一遍。先检查通项是否趋零，再按正项、交错、一般项、幂级数和 Fourier 分流。",
    sections: [
      { title: "数项级数判别流程", body: "正项级数优先比较、极限比较、比值、根值与积分判别；含阶乘或指数常适合比值/根值，含对数和幂常适合比较。交错级数先用 Leibniz，再检查绝对值级数。", cue: "通项不趋零，立即发散。" },
      { title: "绝对收敛与条件收敛", body: "$\\sum|a_n|$ 收敛则 $\\sum a_n$ 收敛；反之不一定。条件收敛级数不能随意重排。估计余项时，交错级数可用首个舍去项控制误差。", cue: "先判绝对值级数。" },
      { title: "幂级数", body: "先求收敛半径，再检查两个端点。收敛区间内部可逐项求导和积分，常从几何级数出发构造新和函数。求导后系数会乘 $n$，积分后会除以 $n+1$；端点必须回到数项级数单独判断。", cue: "半径算完，端点还没算。" },
      { title: "Fourier 级数", body: "先利用奇偶性消去一半系数，再计算 $a_n,b_n$。Dirichlet 条件下，连续点收敛到函数值，跳跃点收敛到左右极限平均。半区间展开要先决定奇延拓还是偶延拓。", cue: "先判奇偶，再做积分。" }
    ]
  }
];

const PAPER_INDEX = [
  { year: "首届", paperPage: 92, solutionPage: 105 },
  { year: "第二届", paperPage: 94, solutionPage: 110 },
  { year: "第三届", paperPage: 96, solutionPage: 115 },
  { year: "第四届", paperPage: 97, solutionPage: 119 },
  { year: "第五届", paperPage: 99, solutionPage: 124 },
  { year: "第六届", paperPage: 100, solutionPage: 128 },
  { year: "第七届", paperPage: 101, solutionPage: 132 },
  { year: "第八届", paperPage: 102, solutionPage: 136 },
  { year: "第九届", paperPage: 103, solutionPage: 141 },
  { year: "第十届", paperPage: 104, solutionPage: 144 }
];

const RESOURCE_LINKS = [
  { group: "竞赛官方", title: "第十八届全国大学生数学竞赛通知", description: "核对 2026 年初赛时间、分类和报名要求。", url: "https://www.cms.org.cn/Home/comp/comp_details/cid/50/id/1355.html" },
  { group: "课程补强", title: "MIT OCW · Single Variable Calculus", description: "一元微积分讲义、例题与习题，适合补证明与方法。", url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" },
  { group: "课程补强", title: "MIT OCW · Multivariable Calculus", description: "多元微分、重积分和向量分析的系统课程。", url: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/" },
  { group: "查漏补缺", title: "Paul's Online Math Notes", description: "按主题查公式、例题和练习，适合快速补洞。", url: "https://tutorial.math.lamar.edu/" },
  { group: "直观理解", title: "3Blue1Brown · Calculus", description: "用几何直观理解导数、积分与 Taylor。", url: "https://www.3blue1brown.com/topics/calculus" },
  { group: "开放教材", title: "OpenStax Calculus", description: "可免费阅读的微积分教材与章节练习。", url: "https://openstax.org/subjects/math" },
  { group: "作图验证", title: "GeoGebra Calculator Suite", description: "画区域、曲线、曲面并验证几何直觉。", url: "https://www.geogebra.org/calculator" },
  { group: "作图验证", title: "Desmos Graphing Calculator", description: "快速检查函数图像、参数变化和交点。", url: "https://www.desmos.com/calculator" },
  { group: "计算校验", title: "WolframAlpha", description: "只用于验算与观察结构，不代替手写推导。", url: "https://www.wolframalpha.com/" }
];

const STUDY_WEEKS = [
  { week: 1, dates: "07.15–07.19", focus: "起点诊断", work: "限时做 12 题；按极限、微分、积分、级数建立错误决策表。" },
  { week: 2, dates: "07.20–07.26", focus: "极限主阶", work: "等价无穷小、Taylor、夹逼；完成第一章例题与练习。" },
  { week: 3, dates: "07.27–08.02", focus: "中值定理", work: "每天 2 道存在性/不等式证明，强制写定理条件。" },
  { week: 4, dates: "08.03–08.09", focus: "Taylor 与最值", work: "局部展开、凸性、最值完整候选点。" },
  { week: 5, dates: "08.10–08.16", focus: "一元积分", work: "对称、分部、参数积分；做一次 120 分钟一元综合。" },
  { week: 6, dates: "08.17–08.23", focus: "常微分方程", work: "先分类后求解；补齐一阶与常系数二阶方程。" },
  { week: 7, dates: "08.24–08.30", focus: "空间解析几何", work: "向量化直线、平面、距离、切线与法平面。" },
  { week: 8, dates: "08.31–09.06", focus: "多元可微", work: "概念层级、链式法则、方向导数，每天 1 道可微性证明。" },
  { week: 9, dates: "09.07–09.13", focus: "多元极值", work: "Hessian、Lagrange、闭区域边界；做一次多元基础测验。" },
  { week: 10, dates: "09.14–09.20", focus: "二重积分", work: "每天先画区域，再写积分；专项换序。" },
  { week: 11, dates: "09.21–09.27", focus: "三重积分", work: "柱面/球面坐标与对称性，完成一套重积分专题。" },
  { week: 12, dates: "09.28–10.04", focus: "曲线积分与 Green", work: "路径无关、势函数、奇点挖洞和方向检查。" },
  { week: 13, dates: "10.05–10.11", focus: "曲面积分与 Gauss/Stokes", work: "补面、换面、右手规则；完成 150 分钟专题卷。" },
  { week: 14, dates: "10.12–10.18", focus: "级数", work: "判别流程、幂级数端点、Fourier；开始混合训练。" },
  { week: 15, dates: "10.19–10.25", focus: "真题第一轮", work: "选 3 届完整限时；只记录错误决策，不抄答案。" },
  { week: 16, dates: "10.26–11.01", focus: "真题第二轮", work: "再做 3 届；把卡题按知识缺口、入口误判、计算失误分类。" },
  { week: 17, dates: "11.02–11.08", focus: "全真定型", work: "两套 150 分钟模拟，固定三轮作答顺序与检查清单。" },
  { week: 18, dates: "11.09–11.13", focus: "轻量冲刺", work: "只回炉高价值错题、公式与方法触发器；不再追新难题。" }
];

