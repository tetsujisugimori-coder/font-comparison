const katexFontGroups = [
  {
    name: 'KaTeX_Main',
    role: '数式の土台',
    examples: '0–9、+、−、=、ローマン体の文字',
    usage: '数字、通常の演算記号、関数名など、数式の基本部分に広く使われます。'
  },
  {
    name: 'KaTeX_Math',
    role: '数式らしい斜体文字',
    examples: 'x、y、α、β、θ',
    usage: '変数を表す斜体の英字や、小文字のギリシャ文字などに使われます。'
  },
  {
    name: 'KaTeX_Size1',
    role: '少し大きな記号',
    examples: '∑、∫、少し伸びた括弧',
    usage: '上付き・下付きのある演算子や、内容に合わせて伸びる記号の小さめの段階に使われます。'
  },
  {
    name: 'KaTeX_Size2',
    role: '中型の記号',
    examples: '∑、∫、中型の括弧',
    usage: '分数などを囲む、より高さが必要な演算子や括弧に使われます。'
  },
  {
    name: 'KaTeX_Size3',
    role: '大型の記号',
    examples: '大きな ( )、[ ]、{ }',
    usage: '背の高い行列や式を囲む大型の区切り記号に使われます。'
  },
  {
    name: 'KaTeX_Size4',
    role: '最大・組み立て用の記号',
    examples: '非常に大きな括弧、根号の部品',
    usage: '特に背の高い式に合わせ、複数の字形部品をつないで伸縮記号を組み立てる際にも使われます。'
  },
  {
    name: 'KaTeX_AMS',
    role: '追加の数学記号',
    examples: 'ℝ、⊆、∅、論理・集合記号',
    usage: 'AMS系の追加記号や黒板太字など、専門的な数学表現を補います。'
  },
  {
    name: 'KaTeX_Caligraphic',
    role: 'カリグラフィ体',
    examples: '𝒜、ℬ、𝒞',
    usage: '集合、空間、作用素などを装飾的な大文字で表す \u005cmathcal に使われます。'
  },
  {
    name: 'KaTeX_Fraktur',
    role: 'フラクトゥール体',
    examples: '𝔄、𝔅、𝔠',
    usage: '代数学などで特別な対象を区別する \u005cmathfrak に使われます。'
  },
  {
    name: 'KaTeX_Script',
    role: '筆記体',
    examples: '𝒜、ℬ、𝒞',
    usage: '流れるような筆記体を使う \u005cmathscr の文字に使われます。'
  },
  {
    name: 'KaTeX_SansSerif',
    role: 'サンセリフ体',
    examples: 'ABC 123',
    usage: '線の端に飾りがない \u005cmathsf の英数字に使われます。'
  },
  {
    name: 'KaTeX_Typewriter',
    role: '等幅書体',
    examples: 'ABC 123',
    usage: 'すべての文字幅が揃った \u005cmathtt の英数字に使われます。'
  }
];

const katexCategories = [
  { id: 'basic', number: '03', title: '基本文字', description: '数字、英字、ギリシャ文字、基本的な演算記号を確認します。' },
  { id: 'symbols', number: '04', title: '数学記号', description: '大小比較や正負など、数式を組み立てる基本記号を確認します。' },
  { id: 'scripts', number: '05', title: '上付き・下付き', description: '指数や添字が本文とバランスよく配置される様子を確認します。' },
  { id: 'fractions', number: '06', title: '分数・根号', description: '上下に広がる分数と、内容に合わせて伸びる根号を確認します。' },
  { id: 'large-operators', number: '07', title: '総和・積・極限', description: '大型演算子と、その上下に置かれる範囲指定を確認します。' },
  { id: 'integrals', number: '08', title: '積分', description: '一重・二重・周回積分と微小量の組版を確認します。' },
  { id: 'delimiters', number: '09', title: '伸縮する括弧', description: '内容の高さに応じて括弧が段階的に伸びる様子を確認します。' },
  { id: 'matrices', number: '10', title: '行列', description: '行と列の整列、括弧や行列式の区切りを確認します。' },
  { id: 'equations', number: '11', title: '方程式', description: '文字、演算子、分数、根号が組み合わされた代表的な式です。' },
  { id: 'calculus', number: '12', title: '微分・偏微分', description: '微分記号、偏微分記号、二階微分の配置を確認します。' },
  { id: 'physics', number: '13', title: 'ベクトル・物理式', description: '太字ベクトルやナブラを含む物理式を確認します。' },
  { id: 'sets', number: '14', title: '集合・論理記号', description: '包含、和集合、量化記号などAMS系の表現を確認します。' },
  { id: 'decorative', number: '15', title: '装飾書体', description: '意味や対象を区別するための6種類の書体を見比べます。' },
  { id: 'practical', number: '16', title: '長い実用数式', description: '複数の部品とフォントが協調して、ひとつの式を組み立てる様子を確認します。' }
];

const katexExamples = [
  { id: 'digits', category: 'basic', title: '数字', description: '数式で頻繁に使う0から9までの数字です。', latex: '0123456789', primaryFonts: ['KaTeX_Main'] },
  { id: 'uppercase', category: 'basic', title: '英大文字', description: '変数や集合名などに使われる大文字です。', latex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', primaryFonts: ['KaTeX_Math'] },
  { id: 'lowercase', category: 'basic', title: '英小文字', description: '変数として使われる斜体の小文字です。', latex: 'abcdefghijklmnopqrstuvwxyz', primaryFonts: ['KaTeX_Math'] },
  { id: 'greek', category: 'basic', title: 'ギリシャ文字', description: '角度、係数、定数などを表す代表的な文字です。', latex: '\u005calpha \u005cbeta \u005cgamma \u005cdelta \u005cepsilon \u005ctheta \u005clambda \u005cmu \u005cpi \u005csigma \u005cphi \u005comega', primaryFonts: ['KaTeX_Math', 'KaTeX_Main'] },

  { id: 'operators', category: 'symbols', title: '基本演算・比較記号', description: '演算や値の関係を表す記号です。', latex: '+ - \u005ctimes \u005cdiv = \u005cneq < > \u005cleq \u005cgeq \u005cpm \u005cmp', primaryFonts: ['KaTeX_Main', 'KaTeX_AMS'] },

  { id: 'square', category: 'scripts', title: '二乗', description: '右上に指数を置く基本形です。', latex: 'x^2', primaryFonts: ['KaTeX_Math', 'KaTeX_Main'] },
  { id: 'sequence', category: 'scripts', title: '数列の添字', description: '右下に要素番号を置きます。', latex: 'a_n', primaryFonts: ['KaTeX_Math'] },
  { id: 'mixed-script', category: 'scripts', title: '上付きと下付き', description: '同じ文字に指数と添字を組み合わせます。', latex: 'x_i^2', primaryFonts: ['KaTeX_Math', 'KaTeX_Main'] },
  { id: 'euler-identity', category: 'scripts', title: 'オイラーの等式', description: '指数内にも複数の文字と記号を配置します。', latex: 'e^{i\u005cpi}+1=0', primaryFonts: ['KaTeX_Math', 'KaTeX_Main'] },

  { id: 'half', category: 'fractions', title: '2分の1', description: '最も基本的な分数です。', latex: '\u005cfrac{1}{2}', primaryFonts: ['KaTeX_Main'] },
  { id: 'fraction-expression', category: 'fractions', title: '文字式の分数', description: '分子と分母に文字式を配置します。', latex: '\u005cfrac{a+b}{c+d}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'square-root', category: 'fractions', title: '平方根', description: '内容に合わせて根号の横線が伸びます。', latex: '\u005csqrt{x}', primaryFonts: ['KaTeX_Size1', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'cube-root', category: 'fractions', title: '三乗根', description: '根指数と長い内容を持つ根号です。', latex: '\u005csqrt[3]{x^2+y^2}', primaryFonts: ['KaTeX_Size1', 'KaTeX_Main', 'KaTeX_Math'] },

  { id: 'summation', category: 'large-operators', title: '総和', description: '総和記号の上下に範囲を配置します。', latex: '\u005csum_{k=1}^{n} k', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'product', category: 'large-operators', title: '総積', description: '積を表す大型演算子を使います。', latex: '\u005cprod_{i=1}^{n} x_i', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'limit', category: 'large-operators', title: '極限', description: '極限の条件と分数を組み合わせます。', latex: '\u005clim_{x \u005cto 0} \u005cfrac{\u005csin x}{x}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },

  { id: 'integral', category: 'integrals', title: '定積分', description: '積分範囲、関数、微小量を組み合わせます。', latex: '\u005cint_a^b f(x)\u005c,dx', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'double-integral', category: 'integrals', title: '二重積分', description: '領域上の二変数関数を積分します。', latex: '\u005ciint_D f(x,y)\u005c,dA', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'contour-integral', category: 'integrals', title: '周回積分', description: 'ベクトル場の線積分を表します。', latex: '\u005coint_C \u005cmathbf{F}\u005ccdot d\u005cmathbf{r}', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },

  { id: 'stretch-parentheses', category: 'delimiters', title: '丸括弧', description: '分数の高さに合わせて丸括弧が伸びます。', latex: '\u005cleft(\u005cfrac{a}{b}\u005cright)', primaryFonts: ['KaTeX_Size1', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'stretch-brackets', category: 'delimiters', title: '角括弧', description: '総和全体を伸縮する角括弧で囲みます。', latex: '\u005cleft[\u005csum_{i=1}^{n}x_i\u005cright]', primaryFonts: ['KaTeX_Size2', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'stretch-braces', category: 'delimiters', title: '波括弧', description: '分数全体を伸縮する波括弧で囲みます。', latex: '\u005cleft\u005c{\u005cfrac{x^2}{y^2}\u005cright\u005c}', primaryFonts: ['KaTeX_Size1', 'KaTeX_Size4', 'KaTeX_Main', 'KaTeX_Math'] },

  { id: 'pmatrix', category: 'matrices', title: '丸括弧の行列', description: '2行2列を丸括弧で囲みます。', latex: '\u005cbegin{pmatrix} a & b \u005c\u005c c & d \u005cend{pmatrix}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1'] },
  { id: 'bmatrix', category: 'matrices', title: '角括弧の単位行列', description: '角括弧で囲んだ単位行列です。', latex: '\u005cbegin{bmatrix} 1 & 0 \u005c\u005c 0 & 1 \u005cend{bmatrix}', primaryFonts: ['KaTeX_Main', 'KaTeX_Size1'] },
  { id: 'vmatrix', category: 'matrices', title: '行列式', description: '縦線で囲んだ行列式です。', latex: '\u005cbegin{vmatrix} a & b \u005c\u005c c & d \u005cend{vmatrix}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1'] },

  { id: 'quadratic', category: 'equations', title: '二次方程式', description: '次数、係数、演算記号の基本的な組み合わせです。', latex: 'ax^2+bx+c=0', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'quadratic-formula', category: 'equations', title: '二次方程式の解の公式', description: '分数、根号、上付き文字を含む代表的な公式です。', latex: 'x=\u005cfrac{-b\u005cpm\u005csqrt{b^2-4ac}}{2a}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1'] },
  { id: 'euler-formula', category: 'equations', title: 'オイラーの公式', description: '指数関数と三角関数の関係を表します。', latex: 'e^{i\u005ctheta}=\u005ccos\u005ctheta+i\u005csin\u005ctheta', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },

  { id: 'ordinary-derivative', category: 'calculus', title: '常微分方程式', description: '導関数を分数形式で表します。', latex: '\u005cfrac{dy}{dx}=ky', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'heat-equation', category: 'calculus', title: '熱方程式', description: '時間と空間に関する偏微分を表します。', latex: '\u005cfrac{\u005cpartial u}{\u005cpartial t}=\u005calpha\u005cfrac{\u005cpartial^2 u}{\u005cpartial x^2}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },

  { id: 'newton', category: 'physics', title: '運動方程式', description: '太字でベクトル量を表します。', latex: '\u005cmathbf{F}=m\u005cmathbf{a}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'mass-energy', category: 'physics', title: '質量とエネルギー', description: '短い式の中で大文字、変数、指数を組み合わせます。', latex: 'E=mc^2', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'gauss-law', category: 'physics', title: 'ガウスの法則', description: 'ナブラ、内積、ギリシャ文字、添字を含みます。', latex: '\u005cnabla \u005ccdot \u005cmathbf{E}=\u005cfrac{\u005crho}{\u005cvarepsilon_0}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },

  { id: 'element-of', category: 'sets', title: '要素', description: '要素が集合に属することを表します。', latex: 'x \u005cin A', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'subset', category: 'sets', title: '部分集合', description: '集合の包含関係を表します。', latex: 'A \u005csubseteq B', primaryFonts: ['KaTeX_AMS', 'KaTeX_Math'] },
  { id: 'union', category: 'sets', title: '和集合', description: '2つの集合の和を表します。', latex: 'A \u005ccup B', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'intersection', category: 'sets', title: '共通部分', description: '2つの集合の共通部分を表します。', latex: 'A \u005ccap B', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'forall', category: 'sets', title: '全称記号', description: '実数全体の任意の要素を表します。', latex: '\u005cforall x \u005cin \u005cmathbb{R}', primaryFonts: ['KaTeX_AMS', 'KaTeX_Main', 'KaTeX_Math'] },
  { id: 'exists', category: 'sets', title: '存在記号', description: '自然数に条件を満たす要素があることを表します。', latex: '\u005cexists y \u005cin \u005cmathbb{N}', primaryFonts: ['KaTeX_AMS', 'KaTeX_Main', 'KaTeX_Math'] },

  { id: 'caligraphic', category: 'decorative', title: 'カリグラフィ体', description: '装飾的な大文字です。', latex: '\u005cmathcal{ABC}', primaryFonts: ['KaTeX_Caligraphic'] },
  { id: 'fraktur', category: 'decorative', title: 'フラクトゥール体', description: '角張った歴史的な字形です。', latex: '\u005cmathfrak{ABC}', primaryFonts: ['KaTeX_Fraktur'] },
  { id: 'blackboard', category: 'decorative', title: '黒板太字', description: '数の集合などでよく使う二重線の書体です。', latex: '\u005cmathbb{RNC}', primaryFonts: ['KaTeX_AMS'] },
  { id: 'typewriter', category: 'decorative', title: '等幅書体', description: '文字ごとの幅が揃う書体です。', latex: '\u005cmathtt{ABC123}', primaryFonts: ['KaTeX_Typewriter'] },
  { id: 'sans-serif', category: 'decorative', title: 'サンセリフ体', description: '線の端に飾りがない書体です。', latex: '\u005cmathsf{ABC123}', primaryFonts: ['KaTeX_SansSerif'] },
  { id: 'script', category: 'decorative', title: '筆記体', description: '流れるような装飾書体です。', latex: '\u005cmathscr{ABC}', primaryFonts: ['KaTeX_Script'] },

  { id: 'normal-distribution', category: 'practical', title: '正規分布', description: '定数、分数、根号、指数、ギリシャ文字を組み合わせます。', latex: 'f(x)=\u005cfrac{1}{\u005csqrt{2\u005cpi\u005csigma^2}}\u005cexp\u005cleft(-\u005cfrac{(x-\u005cmu)^2}{2\u005csigma^2}\u005cright)', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1', 'KaTeX_Size2'] },
  { id: 'fourier-transform', category: 'practical', title: 'フーリエ変換', description: '無限区間の積分と複雑な指数を含みます。', latex: '\u005chat{f}(\u005cxi)=\u005cint_{-\u005cinfty}^{\u005cinfty}f(x)e^{-2\u005cpi i x\u005cxi}\u005c,dx', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size2'] },
  { id: 'binomial-theorem', category: 'practical', title: '二項定理', description: '総和、二項係数、複数の指数を含みます。', latex: '(x+y)^n=\u005csum_{k=0}^{n}\u005cbinom{n}{k}x^{n-k}y^k', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size2'] },
  { id: 'taylor-series', category: 'practical', title: 'テイラー展開', description: '無限級数、階乗、高階導関数を含みます。', latex: 'f(x)=\u005csum_{n=0}^{\u005cinfty}\u005cfrac{f^{(n)}(a)}{n!}(x-a)^n', primaryFonts: ['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size2'] },
  { id: 'euler-practical', category: 'practical', title: 'オイラーの公式', description: '指数関数と三角関数を結ぶ基本公式です。', latex: 'e^{i\u005ctheta}=\u005ccos\u005ctheta+i\u005csin\u005ctheta', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] },
  { id: 'maxwell', category: 'practical', title: 'マクスウェル方程式の例', description: '回転、ベクトル、偏微分を含む電磁気学の式です。', latex: '\u005cnabla \u005ctimes \u005cmathbf{E}=-\u005cfrac{\u005cpartial \u005cmathbf{B}}{\u005cpartial t}', primaryFonts: ['KaTeX_Main', 'KaTeX_Math'] }
];

window.katexFontGroups = katexFontGroups;
window.katexCategories = katexCategories;
window.katexExamples = katexExamples;
