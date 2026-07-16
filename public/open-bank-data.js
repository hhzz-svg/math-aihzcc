const OPEN_SOURCE_LIBRARY = [
  {
    id: "oatutor-content",
    title: "OATutor-Content",
    creator: "OATutor Project / CAHLR",
    url: "https://github.com/CAHLR/OATutor-Content",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    description: "结构化微积分题目、分步提示与知识标签；用于极限和积分拓展题的翻译改编。"
  },
  {
    id: "mw-derivatives",
    title: "Calculus-Derivatives",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Calculus-Derivatives",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "导数定义、求导法则、Taylor 多项式及交互练习；用于微分学知识与题型设计。"
  },
  {
    id: "mw-integrals",
    title: "Calculus-Integrals",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Calculus-Integrals",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "原函数、微积分基本定理、换元和分部积分；用于一元积分拓展。"
  },
  {
    id: "mw-odes",
    title: "Applied-ODEs",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Applied-ODEs",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "常微分方程分类、变量分离、积分因子、特征方程和待定系数法。"
  },
  {
    id: "mw-vectors",
    title: "Vector-Arithmetic",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Vector-Arithmetic",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "向量的模、点积、叉积及几何意义；用于空间解析几何拓展。"
  },
  {
    id: "mw-multivariable",
    title: "Multivariable-Space-and-Functions",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Multivariable-Space-and-Functions",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "多元空间、坐标系和多元函数；用于多元微分知识补强。"
  },
  {
    id: "mw-multiple-integrals",
    title: "Multivariable-Integrals",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Multivariable-Integrals",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "重积分、线积分、曲面积分和 Green/Gauss 等主题的交互课件。"
  },
  {
    id: "mw-fourier",
    title: "Fourier-Analysis",
    creator: "MathWorks Teaching Resources",
    url: "https://github.com/MathWorks-Teaching-Resources/Fourier-Analysis",
    license: "BSD-3-Clause",
    licenseUrl: "https://opensource.org/license/bsd-3-clause",
    description: "Fourier 级数、频域和系数的可视化材料；用于级数拓展。"
  }
];

const OPEN_CHAPTER_CONFIG = {
  limits: { bookId: "limits", prefix: "L", sourceId: "oatutor-content" },
  derivative: { bookId: "derivative", prefix: "D", sourceId: "mw-derivatives" },
  integral: { bookId: "integral", prefix: "I", sourceId: "mw-integrals" },
  ode: { bookId: "ode", prefix: "O", sourceId: "mw-odes" },
  vector: { bookId: "geometry", prefix: "V", sourceId: "mw-vectors" },
  multivariable: { bookId: "multidiff", prefix: "M", sourceId: "mw-multivariable" },
  "multiple-integral": { bookId: "multiple", prefix: "G", sourceId: "mw-multiple-integrals" },
  "line-surface": { bookId: "vectorcalc", prefix: "C", sourceId: "mw-multiple-integrals" },
  series: { bookId: "series", prefix: "S", sourceId: "mw-fourier" }
};

const OPEN_KNOWLEDGE_ADDITIONS = {
  limits: [
    {
      title: "单侧极限与无穷极限",
      body: "双侧极限存在等价于左右极限存在且相等；无穷极限描述函数值的发散方向，不是一个实数值。处理分母趋零时，先判断分子符号、分母奇偶次和左右邻域符号，再决定是正无穷、负无穷还是双侧极限不存在。",
      cue: "分母趋零先画符号表，左右两侧必须分别判断。"
    },
    {
      title: "连续延拓与参数匹配",
      body: "分段函数在拼接点连续，需要函数值、左极限和右极限三者相等。含参数题先计算去心极限，再用参数补上函数值；如果极限本身不存在，则任何参数都不能完成连续延拓。竞赛题常把连续、可导和高阶可导逐层叠加，必须按层检查。",
      cue: "先求去心极限，再谈参数能否补点。"
    }
  ],
  derivative: [
    {
      title: "导数定义与不可导点",
      body: "在尖点、绝对值、分段连接和振荡点，优先回到差商定义。连续只是可导的必要条件；左右导数都存在且相等才可导。若题目继续追问二阶导数，还要检查一阶导函数在该点的差商，不能由原函数看起来光滑就直接判断。",
      cue: "看到绝对值或分段点，立即写左右差商。"
    },
    {
      title: "Taylor 多项式与余项符号",
      body: "Taylor 展开不仅用于算极限，也可把不等式转化为余项符号。先选展开点和阶数，再决定用 Peano 余项处理局部极限，还是用 Lagrange 余项控制区间误差；若需要全区间结论，构造差函数并研究导数通常比只写局部展开更可靠。",
      cue: "局部看首项，全区间看余项或差函数单调性。"
    }
  ],
  integral: [
    {
      title: "Riemann 和与定积分定义",
      body: "遇到含求和号和极限的题，先把步长识别为 $1/n$ 或区间长度除以分点数，再把求和项整理成 $f(k/n)\\Delta x$。端点取左、右或中点通常不改变连续函数的极限，但区间、缩放因子和被积函数必须同时匹配。",
      cue: "先圈出步长，再识别采样点和积分区间。"
    },
    {
      title: "微积分基本定理的变上限形式",
      body: "若 $F(x)=\\int_{a}^{g(x)}f(t)dt$，则在连续条件下 $F'(x)=f(g(x))g'(x)$。上下限都含变量时分别求导并相减；积分变量只是哑变量。复杂题常把变上限积分嵌入方程或极限，先求导降维，再利用初值恢复常数。",
      cue: "变上限积分先看外层链式法则和上下限符号。"
    }
  ],
  ode: [
    {
      title: "方程分类与解的区间",
      body: "求解前先判断阶数、线性、齐次和是否可分离；分类决定工具。分离变量时除去的因子可能对应常值解，必须单独补回；含对数、分母或根式的通解还要结合初值确定最大存在区间，不能只写一个形式公式。",
      cue: "第一行写分类，除去任何因子都检查是否丢解。"
    },
    {
      title: "非齐次共振与试探式",
      body: "常系数线性方程的特解试探式由右端类型决定；若试探式与齐次解重复，就乘足够次数的 $x$。指数、正弦余弦和多项式组合要保留完整同类项，求出特解后再叠加齐次通解并代入初值。",
      cue: "先把右端对应的特征根与齐次根表对照。"
    }
  ],
  vector: [
    {
      title: "点积、叉积与混合积的量纲",
      body: "点积给投影和夹角，结果是标量；叉积给有向面积和法向量，结果是向量；混合积给有向体积，结果又是标量。做题前先根据目标量的类型选择运算，最后用是否应带绝对值检查距离、面积和体积。",
      cue: "先问答案应是标量还是向量，再选积。"
    },
    {
      title: "平面束与公共交线",
      body: "两个不平行平面 $F_1=0,F_2=0$ 的公共交线所在平面可写成 $F_1+\\lambda F_2=0$。再代入额外点或方向条件确定参数；若额外条件与整条交线矛盾，则不存在目标平面。使用前要确认两个原平面确实相交而非平行。",
      cue: "过两平面交线就写平面束，再用附加条件定参数。"
    }
  ],
  multivariable: [
    {
      title: "连续、偏导与可微的层级",
      body: "多元函数中，偏导存在不推出连续，连续也不推出可微。判断可微应先由坐标轴求出候选线性主部，再检查余项除以距离是否趋零；反例常沿 $y=kx$ 或更贴合分母阶数的曲线路径暴露方向依赖。",
      cue: "先求候选梯度，再统一估计余项，不能只看几条路径。"
    },
    {
      title: "Jacobian 与复合映射",
      body: "多元链式法则可写成 Jacobian 矩阵相乘，先标清每个变量依赖谁，再按维度检查矩阵次序。标量函数的梯度是 Jacobian 的转置表示；隐函数求导本质上也是把全微分中的目标微分项解出来。",
      cue: "画变量依赖箭头，并用矩阵尺寸检查链式次序。"
    }
  ],
  "multiple-integral": [
    {
      title: "一般变量替换与 Jacobian",
      body: "二重积分换元不仅有极坐标。若 $u=u(x,y),v=v(x,y)$ 把斜边界变成矩形，应先在新坐标中描述区域，再使用绝对 Jacobian $|\\partial(x,y)/\\partial(u,v)|$。映射非一一时还要分区，否则会重复计数。",
      cue: "先变区域，再算绝对 Jacobian，最后检查是否一一覆盖。"
    },
    {
      title: "重积分的截面与质心",
      body: "三重积分可看成截面积随高度的积分，也可按投影区域先积一个变量。对均匀单纯形等标准区域，质心能快速校验一阶矩；但正式解答仍要写清区域和微元。计算后用体积乘平均坐标检查数量级。",
      cue: "复杂体先找截面，算一阶矩后用质心做反向验算。"
    }
  ],
  "line-surface": [
    {
      title: "恰当微分与势函数",
      body: "第二类线积分若满足 $P_y=Q_x$ 且定义域单连通，可寻找势函数 $\\phi$ 使 $d\\phi=Pdx+Qdy$，积分只看端点。含奇点时即使交叉偏导相等也不能直接判路径无关，要检查闭路是否绕过定义域的洞。",
      cue: "先查定义域是否有洞，再查偏导相等。"
    },
    {
      title: "定理降维的边界匹配",
      body: "Green、Gauss、Stokes 的核心都是把区域内部的导数积分与边界积分对应起来。选公式时不仅看维数，还要核对边界是否闭合、方向是否匹配以及场在区域内是否光滑；有奇点就挖去小邻域并补上新边界。",
      cue: "公式前写四项：闭合、方向、光滑、边界一致。"
    }
  ],
  series: [
    {
      title: "母级数生成与闭式求和",
      body: "从几何级数 $\\sum x^n=1/(1-x)$ 出发，逐项求导可生成 $n,n^2$ 等系数，逐项积分可生成 $1/n$。每次操作都要先写 $|x|<1$，再通过乘 $x$ 或换元对齐幂次，端点仍需单独判断。",
      cue: "看到多项式型系数，就从几何级数求导或积分。"
    },
    {
      title: "Fourier 系数与 Parseval 检查",
      body: "先利用奇偶性删去一半系数，再分部积分计算剩余项。分段光滑函数在跳点收敛到左右极限平均值；把特殊点代入展开式可得到经典数项级数。若题目允许，Parseval 等式还能用能量关系校验系数平方和。",
      cue: "先判奇偶，再算系数，最后用特殊点或能量验算。"
    }
  ]
};

const OPEN_PROBLEM_BANKS = {
  limits: [
    ["开放拓展：单侧无穷极限", "分别求 $\\lim_{x\\to-3^-}\\frac1{(x+3)^4}$ 与 $\\lim_{x\\to-3^+}\\frac1{(x+3)^4}$，并指出竖直渐近线。", "四次幂在两侧都为正，且趋于 $0^+$。", "当 $x\\to-3^-$ 或 $x\\to-3^+$ 时，$(x+3)^4\\to0^+$，所以两个单侧极限都为 $+\\infty$。因此双侧无穷极限为 $+\\infty$，竖直渐近线是 $x=-3$。", "左右极限均为 $+\\infty$，渐近线 $x=-3$", "偶次幂不会因从左侧接近而变成负数。", "单侧极限", 1, 8, "oatutor-content", "翻译并合并 OATutor 条目 a342e92limit11 与 a342e92limit13"],
    ["开放拓展：连续延拓", "设 $f(x)=\\frac{e^x-1}{x}$（$x\\ne0$），且 $f(0)=a$。求使 $f$ 在 $0$ 处连续的 $a$。", "连续要求 $a$ 等于去心极限。", "$e^x-1=x+O(x^2)$，故 $\\lim_{x\\to0}(e^x-1)/x=1$。取 $a=1$ 时函数值等于极限，得到连续延拓。", "$a=1$", "只算极限而没有把它与函数值匹配。", "连续延拓", 1, 8, "oatutor-content", "依据开放题库的极限与连续知识标签重新编写"],
    ["开放拓展：对数主阶", "求 $\\lim_{x\\to0}\\frac{\\ln(1+x)-x+x^2/2}{x^3}$。", "把 $\\ln(1+x)$ 展开到三阶。", "$\\ln(1+x)=x-x^2/2+x^3/3+o(x^3)$，代入后分子为 $x^3/3+o(x^3)$，所以极限为 $1/3$。", "$1/3$", "展开只到二阶看不到第一个非零项。", "Taylor 主阶", 2, 10, "oatutor-content", "依据开放题库的极限学习目标重新编写" ]
  ],
  derivative: [
    ["开放拓展：一阶可导二阶不可导", "设 $f(x)=x|x|$。判断 $f$ 在 $0$ 处是否可导、是否二阶可导。", "先用差商求 $f'(0)$，再写出 $x\\ne0$ 时的一阶导数。", "$f'(0)=\\lim_{h\\to0}h|h|/h=\\lim|h|=0$。当 $x\\ne0$ 时 $f'(x)=2|x|$，故 $f''(0)=\\lim_{h\\to0}2|h|/h$ 的左右极限分别为 $-2,2$，不存在。", "在 $0$ 处可导，$f'(0)=0$；二阶不可导", "原函数可导不代表导函数也可导。", "导数定义", 2, 12, "mw-derivatives", "依据导数定义与高阶导数学习目标重新编写"],
    ["开放拓展：指数幂最值", "求 $f(x)=x^x$（$x>0$）的最小值。", "先对数求导：$\\ln f=x\\ln x$。", "$f'=x^x(\\ln x+1)$，唯一驻点为 $x=e^{-1}$。导数在其左侧为负、右侧为正，所以取得全局最小值 $f(e^{-1})=e^{-1/e}$。", "$e^{-1/e}$", "最小点是 $1/e$，最小值不是 $1/e$。", "对数求导与最值", 2, 12, "mw-derivatives", "依据求导法则和应用题学习目标重新编写"],
    ["开放拓展：Taylor 不等式", "证明对 $x>0$，有 $\\ln(1+x)<x-\\frac{x^2}{2}+\\frac{x^3}{3}$。", "构造右端减左端的差函数并求导。", "令 $F=x-x^2/2+x^3/3-\\ln(1+x)$，则 $F(0)=0$，且 $F'=1-x+x^2-1/(1+x)=x^3/(1+x)>0$。故 $x>0$ 时 $F(x)>0$。", "不等式严格成立", "局部 Taylor 展开本身不能直接证明整个正半轴。", "Taylor 与单调性", 2, 14, "mw-derivatives", "依据 Taylor 多项式学习目标重新编写" ]
  ],
  integral: [
    ["开放拓展：指数反常积分", "先求 $\\int e^{-x}dx$，再计算 $\\int_0^{+\\infty}e^{-x}dx$。", "令 $u=-x$，并把反常积分写成上限极限。", "原函数为 $-e^{-x}+C$。因此 $\\int_0^R e^{-x}dx=1-e^{-R}$，令 $R\\to+\\infty$ 得积分值为 $1$。", "$-e^{-x}+C$；反常积分为 $1$", "反常积分不能把 $+\\infty$ 直接代入，必须写极限。", "换元与反常积分", 1, 8, "oatutor-content", "由 OATutor 条目 a046eedintegrals1 翻译并增加反常积分追问"],
    ["开放拓展：有理式拆分", "计算 $\\int_0^1\\frac{x^2}{1+x}dx$。", "先做多项式除法。", "$x^2/(1+x)=x-1+1/(1+x)$，所以积分为 $1/2-1+\\ln2=\\ln2-1/2$。", "$\\ln2-1/2$", "拆分后的常数项是 $-1$。", "代数化简", 1, 8, "mw-integrals", "依据积分计算熟练度目标重新编写"],
    ["开放拓展：参数与分部积分", "设 $a>0$，计算 $F(a)=\\int_0^{+\\infty}e^{-ax}\\sin x\\,dx$。", "连续分部积分两次，建立关于 $F(a)$ 的方程。", "记 $G=\\int_0^\\infty e^{-ax}\\cos xdx$。分部积分得 $F=G/a$；再对 $G$ 分部积分得 $G=1/a-F/a$。因此 $F=1/a^2-F/a^2$，整理为 $F=1/(a^2+1)$。", "$1/(a^2+1)$", "两次分部积分的边界项和负号容易遗漏。", "参数反常积分", 3, 18, "mw-integrals", "依据分部积分与应用目标重新编写" ]
  ],
  ode: [
    ["开放拓展：Logistic 方程", "求初值问题 $y'=y(1-y),\\ y(0)=1/2$。", "变量分离，并将 $1/[y(1-y)]$ 部分分式分解。", "$\\ln|y/(1-y)|=x+C$。由初值得 $C=0$，因此 $y/(1-y)=e^x$，解得 $y=1/(1+e^{-x})$。", "$y=1/(1+e^{-x})$", "分离时还要注意常值解 $y=0,1$，但它们不满足本题初值。", "变量分离模型", 2, 14, "mw-odes", "依据变量分离与人口模型学习目标重新编写"],
    ["开放拓展：一阶共振", "求 $y'-2y=e^{2x},\\ y(0)=0$。", "积分因子为 $e^{-2x}$。", "乘以 $e^{-2x}$ 得 $(e^{-2x}y)'=1$，积分得 $e^{-2x}y=x+C$。由 $y(0)=0$ 得 $C=0$，故 $y=xe^{2x}$。", "$y=xe^{2x}$", "右端与齐次解同指数，直接猜 $Ae^{2x}$ 会失败。", "积分因子", 1, 10, "mw-odes", "依据积分因子学习目标重新编写"],
    ["开放拓展：二阶共振", "求 $y''+4y=\\cos2x,\\ y(0)=0,\\ y'(0)=0$。", "右端频率对应齐次根，特解要乘 $x$。", "齐次解为 $C_1\\cos2x+C_2\\sin2x$。取 $y_p=Ax\\sin2x$，代入得 $4A\\cos2x=\\cos2x$，故 $A=1/4$。初值给 $C_1=C_2=0$，所以 $y=x\\sin2x/4$。", "$y=x\\sin2x/4$", "共振时不能仍试 $A\\cos2x+B\\sin2x$。", "待定系数与共振", 2, 14, "mw-odes", "依据特征方程和待定系数法学习目标重新编写" ]
  ],
  vector: [
    ["开放拓展：夹角与面积", "设 $a=(1,1,0),b=(1,0,1)$，求两向量夹角及它们张成的平行四边形面积。", "夹角用点积，面积用叉积的模。", "$a\\cdot b=1$，$|a|=|b|=\\sqrt2$，故 $\\cos\\theta=1/2$，$\\theta=\\pi/3$。又 $a\\times b=(1,-1,-1)$，面积为 $\\sqrt3$。", "$\\theta=\\pi/3$，面积 $\\sqrt3$", "夹角答案用点积，面积不能也用点积。", "点积与叉积", 1, 10, "mw-vectors", "依据向量运算学习目标重新编写"],
    ["开放拓展：平面束", "求经过两平面 $x+y+z-1=0$、$x-y=0$ 的交线，并经过点 $(1,0,1)$ 的平面。", "写平面束 $F_1+\\lambda F_2=0$。", "平面束为 $x+y+z-1+\\lambda(x-y)=0$。代入 $(1,0,1)$ 得 $1+\\lambda=0$，故 $\\lambda=-1$，目标平面为 $2y+z-1=0$。", "$2y+z-1=0$", "额外点不必在两个原平面上，但必须能确定平面束参数。", "平面束", 2, 12, "mw-vectors", "依据向量与空间关系学习目标重新编写"],
    ["开放拓展：异面线距离", "求直线 $L_1:s(1,0,1)$ 与 $L_2:(0,1,0)+t(0,1,1)$ 的距离。", "使用两方向向量叉积与连线向量的混合积。", "$d_1\\times d_2=(-1,-1,1)$，取两线上点之差 $r=(0,1,0)$，故距离为 $|r\\cdot(d_1\\times d_2)|/|d_1\\times d_2|=1/\\sqrt3$。", "$1/\\sqrt3$", "混合积必须除以叉积的模。", "混合积与距离", 2, 12, "mw-vectors", "依据叉积几何意义学习目标重新编写" ]
  ],
  multivariable: [
    ["开放拓展：偏导存在但不可微", "设 $f(0,0)=0$，$f(x,y)=\\frac{x^3}{x^2+y^2}$（$(x,y)\\ne(0,0)$）。判断其在原点的连续性、偏导与可微性。", "先用 $|f|\\le|x|$ 判断连续，再减去候选线性主部。", "$|f|\\le|x|\\to0$，故连续；$f_x(0,0)=1,f_y(0,0)=0$。候选主部为 $x$，但沿 $y=x$，$(f-x)/\\sqrt{x^2+y^2}=-x/(2\\sqrt2|x|)$ 不趋于 $0$，故不可微。", "连续，偏导为 $(1,0)$，但不可微", "找到两偏导并不能结束可微性判断。", "可微性", 3, 18, "mw-multivariable", "依据多元函数与坐标路径学习目标重新编写"],
    ["开放拓展：隐函数方向导数", "由 $x^2+y^2+z^2=3$ 在 $(1,1,1)$ 附近确定 $z=z(x,y)$。求沿 $u=(1,-1)/\\sqrt2$ 的方向导数。", "先由隐函数公式求 $z_x,z_y$，再点乘单位方向。", "$z_x=-x/z=-1,z_y=-y/z=-1$。因此 $D_uz=(-1,-1)\\cdot(1,-1)/\\sqrt2=0$。", "$0$", "方向向量必须单位化，且隐函数公式先检查 $F_z\\ne0$。", "隐函数与方向导数", 2, 12, "mw-multivariable", "依据多元函数和方向变化学习目标重新编写"],
    ["开放拓展：球面约束积", "求 $x^2+y^2+z^2=3$ 上 $xyz$ 的最大值与最小值。", "对绝对值使用均方不小于几何平均，或用 Lagrange 乘数。", "$|xyz|^{2/3}\\le(x^2+y^2+z^2)/3=1$，故 $|xyz|\\le1$。当 $|x|=|y|=|z|=1$ 时取等号；符号乘积为正得最大值 $1$，为负得最小值 $-1$。", "最大值 $1$，最小值 $-1$", "等号条件不仅要求绝对值相等，还要处理符号。", "约束极值", 2, 14, "mw-multivariable", "依据多元曲面与函数学习目标重新编写" ]
  ],
  "multiple-integral": [
    ["开放拓展：线性换元", "区域 $D$ 由 $|x+y|\\le1,|x-y|\\le1$ 给出，求其面积。", "令 $u=x+y,v=x-y$，新区域是正方形。", "反解 $x=(u+v)/2,y=(u-v)/2$，故 $|\\partial(x,y)/\\partial(u,v)|=1/2$。在 $[-1,1]^2$ 上积分得面积 $4\\times1/2=2$。", "$2$", "面积元使用逆变换 Jacobian 的绝对值。", "二重积分换元", 2, 12, "mw-multiple-integrals", "依据变量替换学习目标重新编写"],
    ["开放拓展：径向指数积分", "计算 $\\iint_{x^2+y^2\\le1}e^{x^2+y^2}dA$。", "极坐标下令 $u=r^2$。", "积分化为 $2\\pi\\int_0^1e^{r^2}rdr=\\pi\\int_0^1e^udu=\\pi(e-1)$。", "$\\pi(e-1)$", "极坐标面积元中的 $r$ 正好用于二次换元。", "极坐标", 1, 10, "mw-multiple-integrals", "依据重积分计算目标重新编写"],
    ["开放拓展：单纯形一阶矩", "计算 $\\iiint_E z\\,dV$，其中 $E=\\{x,y,z\\ge0,\\ x+y+z\\le1\\}$。", "可直接分层积分，也可用四面体体积与质心校验。", "写成 $\\int_0^1\\int_0^{1-z}\\int_0^{1-y-z}z\\,dx\\,dy\\,dz$，先积 $x,y$ 得 $\\frac12\\int_0^1z(1-z)^2dz=1/24$。也可用体积 $1/6$ 乘质心坐标 $1/4$ 校验。", "$1/24$", "质心坐标是 $1/4$，不是三角形的 $1/3$。", "三重积分与质心", 2, 15, "mw-multiple-integrals", "依据三重积分学习目标重新编写" ]
  ],
  "line-surface": [
    ["开放拓展：Green 定理", "设 $C$ 为单位圆的正向边界，计算 $\\oint_C(x-y)dx+(x+y)dy$。", "取 $P=x-y,Q=x+y$，计算 $Q_x-P_y$。", "$Q_x-P_y=1-(-1)=2$。由 Green 定理，积分为 $\\iint_D2dA=2\\pi$。", "$2\\pi$", "正向是逆时针；若方向反向答案变号。", "Green 定理", 1, 10, "mw-multiple-integrals", "依据线积分与 Green 定理学习目标重新编写"],
    ["开放拓展：立方体通量", "求 $F=(x^2,y^2,z^2)$ 通过单位立方体 $[0,1]^3$ 边界外侧的通量。", "闭曲面优先用 Gauss 定理。", "$\\nabla\\cdot F=2x+2y+2z$，故通量为 $\\iiint_{[0,1]^3}2(x+y+z)dV=2(1/2+1/2+1/2)=3$。", "$3$", "散度是三个偏导之和，不是 $x^2+y^2+z^2$。", "Gauss 定理", 1, 10, "mw-multiple-integrals", "依据曲面积分与散度学习目标重新编写"],
    ["开放拓展：换面用 Stokes", "设 $C:x^2+y^2=1,z=1$，从 $+z$ 方向看为逆时针。对 $F=(-y,x,z)$，求 $\\oint_CF\\cdot dr$。", "用以 $C$ 为边界的水平圆盘代替原曲面。", "$\\nabla\\times F=(0,0,2)$。取法向 $n=(0,0,1)$ 的单位圆盘，由 Stokes 定理，环量为 $\\iint_D2dA=2\\pi$。", "$2\\pi$", "边界方向决定法向；从上方逆时针对应 $+z$。", "Stokes 定理", 2, 12, "mw-multiple-integrals", "依据线积分和曲面积分学习目标重新编写" ]
  ],
  series: [
    ["开放拓展：几何级数求导", "判断并求和 $\\sum_{n=1}^{\\infty}\\frac{n}{2^n}$。", "从 $\\sum_{n\\ge0}x^n=1/(1-x)$ 求导后乘 $x$。", "当 $|x|<1$ 时，$\\sum_{n\\ge1}nx^n=x/(1-x)^2$。取 $x=1/2$ 得和为 $2$，且由幂级数收敛域可知绝对收敛。", "$2$", "求导后是 $nx^{n-1}$，需要再乘一个 $x$。", "母级数求和", 1, 10, "mw-fourier", "依据级数模式生成方法重新编写"],
    ["开放拓展：幂级数闭式", "求 $\\sum_{n=1}^{\\infty}\\frac{n(x-1)^n}{3^n}$ 的收敛区间与和函数。", "令 $r=(x-1)/3$，使用 $\\sum nr^n$。", "收敛条件为 $|r|<1$，即 $-2<x<4$；两端通项都不趋零，故均不收敛。和函数为 $r/(1-r)^2=3(x-1)/(4-x)^2$。", "$(-2,4)$；$3(x-1)/(4-x)^2$", "半径确定后，两个端点仍要逐个代入。", "幂级数", 2, 14, "mw-fourier", "依据级数系数与模式学习目标重新编写"],
    ["开放拓展：偶函数 Fourier 级数", "在 $(-\\pi,\\pi)$ 展开 $f(x)=|x|$，并由 $x=0$ 求 $\\sum_{k=0}^{\\infty}1/(2k+1)^2$。", "偶函数只含余弦项；对 $a_n$ 分部积分。", "$a_0=\\pi$，$a_n=2(((-1)^n-1)/(\\pi n^2))$，故 $|x|=\\pi/2-(4/\\pi)\\sum_{k\\ge0}\\cos((2k+1)x)/(2k+1)^2$。令 $x=0$ 得奇数平方倒数和为 $\\pi^2/8$。", "$|x|=\\pi/2-\\frac4\\pi\\sum_{k\\ge0}\\frac{\\cos((2k+1)x)}{(2k+1)^2}$；和为 $\\pi^2/8$", "常数项是 $a_0/2$，不能写成 $a_0$。", "Fourier 级数", 3, 20, "mw-fourier", "依据 Fourier 级数可视化与系数学习目标重新编写" ]
  ]
};

for (const [topic, additions] of Object.entries(OPEN_KNOWLEDGE_ADDITIONS)) {
  const config = OPEN_CHAPTER_CONFIG[topic];
  const chapter = BOOK_CHAPTERS.find((item) => item.id === config.bookId);
  chapter.sections.push(...additions.map((section) => ({ ...section, sourceId: config.sourceId })));
}

for (const [topic, rows] of Object.entries(OPEN_PROBLEM_BANKS)) {
  const config = OPEN_CHAPTER_CONFIG[topic];
  const chapter = BOOK_CHAPTERS.find((item) => item.id === config.bookId);
  rows.forEach((row, index) => {
    const [title, statement, hint, solution, answer, trap, skill, difficulty, minutes, sourceId, sourceNote] = row;
    const id = `${config.prefix}${String(index + 10).padStart(2, "0")}`;
    problems.push({
      id,
      topic: config.bookId,
      title,
      statement,
      hint,
      solution,
      answer,
      trap,
      skill,
      difficulty,
      minutes,
      collection: "开放拓展题",
      sourceId,
      sourceNote
    });
    chapter.practiceIds.push(id);
  });
}

RESOURCE_LINKS.push(...OPEN_SOURCE_LIBRARY.map((source) => ({
  group: "开源题库与课件",
  title: source.title,
  description: `${source.description} 许可证：${source.license}。`,
  url: source.url
})));
