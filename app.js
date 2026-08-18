const officialFeaturePages = {
  ae: 'https://learn.microsoft.com/en-us/typography/opentype/spec/features_ae',
  fj: 'https://learn.microsoft.com/en-us/typography/opentype/spec/features_fj',
  ko: 'https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko',
  pt: 'https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt',
  uz: 'https://learn.microsoft.com/en-us/typography/opentype/spec/features_uz'
};

function officialFeaturePage(tag) {
  const initial = tag[0];
  if (initial <= 'e') return officialFeaturePages.ae;
  if (initial <= 'j') return officialFeaturePages.fj;
  if (initial <= 'o') return officialFeaturePages.ko;
  if (initial <= 't') return officialFeaturePages.pt;
  return officialFeaturePages.uz;
}

function defineOpenTypeFeature(tag, name, officialName, description, category = '任意') {
  return { name, officialName, description, category, references: [officialFeaturePage(tag)] };
}

const openTypeFeatureDefinitions = {
  aalt: defineOpenTypeFeature('aalt', 'すべての代替字形', 'Access All Alternates', '選択した文字に用意された代替字形へアクセスするための機能です。', '任意'),
  afrc: defineOpenTypeFeature('afrc', '代替分数', 'Alternative Fractions', 'スラッシュで区切られた数字を、別形式の分数字形へ置き換えます。', '任意'),
  c2sc: defineOpenTypeFeature('c2sc', '大文字からスモールキャップ', 'Small Capitals From Capitals', '大文字を対応する小型大文字の字形へ置き換えます。', '任意'),
  calt: defineOpenTypeFeature('calt', '文脈依存の代替字形', 'Contextual Alternates', '前後の字形や位置関係に応じて、適切な代替字形へ置き換えます。', '自動'),
  case: defineOpenTypeFeature('case', '大文字・小文字対応字形', 'Case-Sensitive Forms', '大文字だけで組む文章に合わせ、約物などの位置や形を調整します。', '任意'),
  ccmp: defineOpenTypeFeature('ccmp', '字形の合成／分解', 'Glyph Composition / Decomposition', '文字と結合記号を合成済み字形へ置換する、または処理に適した字形へ分解します。', '自動'),
  cpsp: defineOpenTypeFeature('cpsp', '大文字間隔', 'Capital Spacing', '大文字だけで組む文章の読みやすさを保つため、字間を広げます。', '任意'),
  dlig: defineOpenTypeFeature('dlig', '任意合字', 'Discretionary Ligatures', '装飾や特別な効果のため、利用者が任意で選ぶ合字へ置き換えます。', '任意'),
  dnom: defineOpenTypeFeature('dnom', '分母用数字', 'Denominators', '数字を分数の分母に適した小型の字形へ置き換えます。', '任意'),
  expt: defineOpenTypeFeature('expt', 'エキスパート字形', 'Expert Forms', '通常の字形を、専門的な組版向けに用意された字形へ置き換えます。', '任意'),
  fina: defineOpenTypeFeature('fina', '語末字形', 'Terminal Forms', '単語末尾に位置する文字を語末用の字形へ置き換えます。', '自動'),
  frac: defineOpenTypeFeature('frac', '分数', 'Fractions', 'スラッシュで区切られた数字を、分子・分母と分数線からなる字形へ整えます。', '任意'),
  fwid: defineOpenTypeFeature('fwid', '全角幅', 'Full Widths', '文字を1 emの全角幅に合わせた字形またはメトリクスへ置き換えます。', '任意'),
  halt: defineOpenTypeFeature('halt', '代替半角幅', 'Alternate Half Widths', '全角幅の字形を中央に保ったまま、送り幅を半角へ調整します。', '任意'),
  hlig: defineOpenTypeFeature('hlig', '歴史的合字', 'Historical Ligatures', '歴史的な組版で使われる合字へ置き換えます。', '任意'),
  hkna: defineOpenTypeFeature('hkna', '横組み用かな字形', 'Horizontal Kana Alternates', 'かなを横組みに適した字形へ置き換えます。', '任意'),
  hojo: defineOpenTypeFeature('hojo', '補助漢字字形', 'Hojo Kanji Forms', 'JIS X 0212で定義された補助漢字の字形へ置き換えます。', '任意'),
  hwid: defineOpenTypeFeature('hwid', '半角幅', 'Half Widths', '文字を半角幅に合わせた字形またはメトリクスへ置き換えます。', '任意'),
  init: defineOpenTypeFeature('init', '語頭字形', 'Initial Forms', '単語の先頭に位置する文字を語頭用の字形へ置き換えます。', '自動'),
  isol: defineOpenTypeFeature('isol', '独立字形', 'Isolated Forms', '他の文字と連結しない文字を独立用の字形へ置き換えます。', '自動'),
  ital: defineOpenTypeFeature('ital', 'イタリック字形', 'Italics', '通常の字形を対応するイタリック字形へ置き換えます。', '任意'),
  jp04: defineOpenTypeFeature('jp04', 'JIS2004字形', 'JIS2004 Forms', '既定の日本語字形をJIS X 0213:2004に対応する字形へ置き換えます。', '任意'),
  jp78: defineOpenTypeFeature('jp78', 'JIS78字形', 'JIS78 Forms', '既定の日本語字形をJIS C 6226-1978に対応する字形へ置き換えます。', '任意'),
  jp83: defineOpenTypeFeature('jp83', 'JIS83字形', 'JIS83 Forms', '既定の日本語字形をJIS X 0208-1983に対応する字形へ置き換えます。', '任意'),
  jp90: defineOpenTypeFeature('jp90', 'JIS90字形', 'JIS90 Forms', '既定の日本語字形をJIS X 0208-1990に対応する字形へ置き換えます。', '任意'),
  kern: defineOpenTypeFeature('kern', 'カーニング', 'Kerning', '特定の字形の組み合わせで、見た目の間隔が均一になるよう字間を調整します。', '自動'),
  liga: defineOpenTypeFeature('liga', '標準合字', 'Standard Ligatures', '通常の文章で標準的に使う文字の組み合わせを合字へ置き換えます。', '自動'),
  lnum: defineOpenTypeFeature('lnum', 'ライニング数字', 'Lining Figures', '数字を大文字と同程度の高さにそろった字形へ置き換えます。', '任意'),
  locl: defineOpenTypeFeature('locl', '地域・言語別字形', 'Localized Forms', '指定された言語や地域に適した字形へ置き換えます。', '自動'),
  mark: defineOpenTypeFeature('mark', 'マーク配置', 'Mark Positioning', '結合記号を基底字形に対して正しい位置へ配置します。', '自動'),
  medi: defineOpenTypeFeature('medi', '語中字形', 'Medial Forms', '単語の途中に位置する文字を語中用の字形へ置き換えます。', '自動'),
  mkmk: defineOpenTypeFeature('mkmk', 'マーク間配置', 'Mark to Mark Positioning', '複数の結合記号を互いに対して正しい位置へ配置します。', '自動'),
  nalt: defineOpenTypeFeature('nalt', '注釈用代替字形', 'Alternate Annotation Forms', '文字を丸・四角・括弧などで囲んだ注釈用の字形へ置き換えます。', '任意'),
  nlck: defineOpenTypeFeature('nlck', 'NLC漢字字形', 'NLC Kanji Forms', '日本の国語審議会が2000年に示した漢字字形へ置き換えます。', '任意'),
  numr: defineOpenTypeFeature('numr', '分子用数字', 'Numerators', '数字を分数の分子に適した小型の字形へ置き換えます。', '任意'),
  onum: defineOpenTypeFeature('onum', 'オールドスタイル数字', 'Oldstyle Figures', '数字を小文字本文になじむ高さと上下位置を持つ字形へ置き換えます。', '任意'),
  ordn: defineOpenTypeFeature('ordn', '序数', 'Ordinals', '序数を表す文字を上付きなどの適切な字形へ置き換えます。', '任意'),
  palt: defineOpenTypeFeature('palt', 'プロポーショナル代替幅', 'Proportional Alternate Widths', '全角字形を字形ごとの自然な幅に合わせたメトリクスへ調整します。', '任意'),
  pkna: defineOpenTypeFeature('pkna', 'プロポーショナルかな', 'Proportional Kana', 'かなを字形ごとの自然な幅に設計された字形へ置き換えます。', '任意'),
  pnum: defineOpenTypeFeature('pnum', 'プロポーショナル数字', 'Proportional Figures', '数字を字形ごとに異なる自然な幅へ置き換えます。', '任意'),
  pwid: defineOpenTypeFeature('pwid', 'プロポーショナル幅', 'Proportional Widths', '等幅の字形を字形ごとの自然な幅へ置き換えます。', '任意'),
  qwid: defineOpenTypeFeature('qwid', '四分角幅', 'Quarter Widths', '文字を1 emの4分の1幅に合わせた字形またはメトリクスへ置き換えます。', '任意'),
  rclt: defineOpenTypeFeature('rclt', '必須の文脈依存代替', 'Required Contextual Alternates', '正しい接続や字形関係に不可欠な文脈依存の代替字形へ置き換えます。', '自動'),
  rlig: defineOpenTypeFeature('rlig', '必須合字', 'Required Ligatures', '文字体系を正しく表示するために不可欠な合字へ置き換えます。', '自動'),
  ruby: defineOpenTypeFeature('ruby', 'ルビ用字形', 'Ruby Notation Forms', 'ルビとして小さく組んだときに読みやすい字形へ置き換えます。', '任意'),
  salt: defineOpenTypeFeature('salt', 'スタイル代替', 'Stylistic Alternates', '利用者が選択できる別デザインの字形へ置き換えます。', '任意'),
  sinf: defineOpenTypeFeature('sinf', '科学用下付き文字', 'Scientific Inferiors', '化学式などで使う、ベースラインより下に配置された小型字形へ置き換えます。', '任意'),
  smcp: defineOpenTypeFeature('smcp', 'スモールキャップ', 'Small Capitals', '小文字を対応する小型大文字の字形へ置き換えます。', '任意'),
  subs: defineOpenTypeFeature('subs', '下付き文字', 'Subscript', '文字を下付き位置に合う小型の字形へ置き換えます。', '任意'),
  sups: defineOpenTypeFeature('sups', '上付き文字', 'Superscript', '文字を上付き位置に合う小型の字形へ置き換えます。', '任意'),
  tnum: defineOpenTypeFeature('tnum', '等幅数字', 'Tabular Figures', '数字を表や列で桁位置がそろう等幅の字形へ置き換えます。', '任意'),
  trad: defineOpenTypeFeature('trad', '繁体字形', 'Traditional Forms', '文字を伝統的な字形へ置き換えます。', '任意'),
  twid: defineOpenTypeFeature('twid', '三分角幅', 'Third Widths', '文字を1 emの3分の1幅に合わせた字形またはメトリクスへ置き換えます。', '任意'),
  vert: defineOpenTypeFeature('vert', '縦組み用字形', 'Vertical Alternates', '横組み用の字形を縦組みに適した字形へ置き換えます。', '自動'),
  vhal: defineOpenTypeFeature('vhal', '代替縦半角メトリクス', 'Alternate Vertical Half Metrics', '全角字形を中央に保ったまま、縦方向の送りを半角へ調整します。', '任意'),
  vkna: defineOpenTypeFeature('vkna', '縦組み用かな字形', 'Vertical Kana Alternates', 'かなを縦組みに適した字形へ置き換えます。', '任意'),
  vkrn: defineOpenTypeFeature('vkrn', '縦方向カーニング', 'Vertical Kerning', '縦組みで特定の字形の組み合わせの間隔を調整します。', '自動'),
  vpal: defineOpenTypeFeature('vpal', 'プロポーショナル代替縦メトリクス', 'Proportional Alternate Vertical Metrics', '全角字形の縦方向の送りを字形ごとの自然な高さへ調整します。', '任意'),
  vrt2: defineOpenTypeFeature('vrt2', '縦組み用代替字形と回転', 'Vertical Alternates and Rotation', '縦組みで必要な代替字形を適用し、必要に応じて字形を回転します。', '自動'),
  zero: defineOpenTypeFeature('zero', '斜線付きゼロ', 'Slashed Zero', '数字のゼロを英大文字Oと区別しやすい斜線付き字形へ置き換えます。', '任意')
};

const stylisticSetDescription = 'フォント制作者が用意した別デザインの字形へ切り替える機能です。どの文字がどのように変化するかは、フォントごとに異なります。';
for (let index = 1; index <= 20; index += 1) {
  const number = String(index).padStart(2, '0');
  const tag = `ss${number}`;
  openTypeFeatureDefinitions[tag] = defineOpenTypeFeature(tag, `スタイルセット${index}`, `Stylistic Set ${index}`, stylisticSetDescription, 'フォント固有');
}
const openTypeUnparsedMessage = 'OpenType機能は未確認です。解析対象のフォントファイルを確認できていません。';
const openTypeNoFeatureMessage = '解析したフォントファイルでは、OpenType機能を確認できませんでした。';

function makeOpenTypeProfile(value, maybeFeatures = []) {
  if (typeof value === 'boolean') {
    const baseFeatures = Array.isArray(maybeFeatures) ? maybeFeatures : [];
    return {
      verified: value,
      totalFeatures: baseFeatures.length,
      features: baseFeatures.map((feature) => ({
        tag: feature?.tag || '',
        tables: Array.isArray(feature?.tables) ? feature.tables : []
      })).filter((feature) => feature.tag),
      analysis: {
        status: value ? 'analyzed' : 'not-analyzed',
        reason: value ? null : openTypeUnparsedMessage
      }
    };
  }
  const valueObject = value || {};
  return {
    verified: !!valueObject.verified,
    totalFeatures: valueObject.totalFeatures || 0,
    features: Array.isArray(valueObject.features) ? valueObject.features : [],
    analysis: valueObject.analysis || {}
  };
}

function buildOpenTypeProfile(fontId) {
  const entry = openTypeData.fonts?.[fontId];
  if (!entry || entry.status !== 'analyzed') {
    return makeOpenTypeProfile({
      verified: false,
      totalFeatures: 0,
      features: [],
      analysis: {
        status: 'not-analyzed',
        reason: entry?.reason || openTypeUnparsedMessage
      }
    });
  }

  const features = Array.isArray(entry.features) ? entry.features : [];
  const normalizedFeatures = features
    .map((feature) => ({
      tag: feature?.tag || '',
      tables: Array.isArray(feature?.tables) ? feature.tables : [],
      ...feature
    }))
    .filter((feature) => feature.tag);

  return makeOpenTypeProfile({
    verified: true,
    totalFeatures: normalizedFeatures.length,
    features: normalizedFeatures,
    analysis: {
      status: entry.status,
      fileName: entry.fileName || null,
      faceName: entry.faceName || null,
      faceIndex: entry.faceIndex ?? null,
      fontVersion: entry.fontVersion || null,
      fontVersions: Array.isArray(entry.fontVersions) ? entry.fontVersions : [],
      fontVersionMissingFiles: Array.isArray(entry.fontVersionMissingFiles) ? entry.fontVersionMissingFiles : [],
      sourceType: entry.sourceType || null,
      analysisTarget: entry.analysisTarget || null,
      caveat: entry.caveat || null,
      analysisDate: entry.analysisDate || null,
      analysisMethod: entry.analysisMethod || 'fontTools FeatureList解析（GSUB/GPOS）',
      cssUrl: entry.cssUrl || null,
      cssFetchedAt: entry.cssFetchedAt || null,
      userAgent: entry.userAgent || null,
      cssHost: entry.cssHost || null,
      woff2Hosts: Array.isArray(entry.woff2Hosts) ? entry.woff2Hosts : [],
      requestedWeights: Array.isArray(entry.requestedWeights) ? entry.requestedWeights : [],
      fileCount: entry.fileCount ?? null,
      hasDetails: Boolean(entry.hasDetails),
      detailSchemaVersion: entry.detailSchemaVersion ?? null,
      reason: null
    }
  });
}

const webFontCatalog = {
  'noto-sans-jp-web': {
    displayName: 'Noto Sans JP', family: 'Noto Sans JP', cssFamily: '"Noto Sans JP", sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+JP', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['日本語', 'ラテン'], weights: [400, 700], styles: ['normal']
  },
  'noto-serif-jp-web': {
    displayName: 'Noto Serif JP', family: 'Noto Serif JP', cssFamily: '"Noto Serif JP", serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Serif+JP', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['日本語', 'ラテン'], weights: [400, 700], styles: ['normal']
  },
  'noto-sans-sc-web': {
    displayName: 'Noto Sans SC', family: 'Noto Sans SC', cssFamily: '"Noto Sans SC", sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+SC', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['簡体字中国語', 'ラテン'], weights: [400, 700], styles: ['normal']
  },
  'noto-sans-tc-web': {
    displayName: 'Noto Sans TC', family: 'Noto Sans TC', cssFamily: '"Noto Sans TC", sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+TC', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['繁体字中国語', 'ラテン'], weights: [400, 700], styles: ['normal']
  },
  'source-han-sans-web': {
    displayName: 'Source Han Sans', family: 'Source Han Sans CN', cssFamily: '"Source Han Sans CN", sans-serif',
    sourceUrl: 'https://github.com/adobe-fonts/source-han-sans/tree/2.005R', provider: 'Adobe Source Han Sans 2.005R', license: 'SIL Open Font License 1.1', officialScripts: ['簡体字中国語', 'ラテン'], weights: [400, 700], styles: ['normal'], fontFiles: { 400: 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@2.005R/SubsetOTF/CN/SourceHanSansCN-Regular.otf', 700: 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@2.005R/SubsetOTF/CN/SourceHanSansCN-Bold.otf' }
  },
  'inter-web': {
    displayName: 'Inter', family: 'Inter', cssFamily: 'Inter, sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/specimen/Inter', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['ラテン'], weights: [400, 700], styles: ['normal']
  },
  'ibm-plex-sans-web': {
    displayName: 'IBM Plex Sans', family: 'IBM Plex Sans', cssFamily: '"IBM Plex Sans", sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/specimen/IBM+Plex+Sans', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['ラテン'], weights: [400, 700], styles: ['normal']
  },
  'jetbrains-mono-web': {
    displayName: 'JetBrains Mono', family: 'JetBrains Mono', cssFamily: '"JetBrains Mono", monospace',
    cssUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/specimen/JetBrains+Mono', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['ラテン'], weights: [400, 700], styles: ['normal']
  },
  'zen-kaku-gothic-new-web': {
    displayName: 'Zen Kaku Gothic New', family: 'Zen Kaku Gothic New', cssFamily: '"Zen Kaku Gothic New", sans-serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/specimen/Zen+Kaku+Gothic+New', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['日本語', 'ラテン'], weights: [400, 700], styles: ['normal']
  },
  'shippori-mincho-web': {
    displayName: 'Shippori Mincho', family: 'Shippori Mincho', cssFamily: '"Shippori Mincho", serif',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap', sourceUrl: 'https://fonts.google.com/specimen/Shippori+Mincho', provider: 'Google Fonts', license: 'SIL Open Font License 1.1', officialScripts: ['日本語', 'ラテン'], weights: [400, 700], styles: ['normal']
  }
};

function makeFontEntry(base) {
  const webFont = base.webFont;
  return {
    ...base,
    attributes: {
      ...base.attributes,
      sourceKind: base.sourceType === 'web' ? 'Webフォント' : 'システムフォント',
      source: base.sourceType === 'web' ? webFont?.provider || 'Web配布元' : 'Windows'
    },
    sourceInfo: {
      environment: base.sourceType === 'web' ? 'Webブラウザ' : 'Windows',
      provider: base.sourceType === 'web' ? webFont?.provider || 'Web配布元' : 'Microsoft',
      loadingMethod: base.sourceType === 'web' ? (webFont?.cssUrl ? 'CSS stylesheet + Font Loading API' : 'Font Loading API') : 'OS標準フォント',
      cssHost: base.sourceType === 'web' && webFont?.cssUrl ? 'fonts.googleapis.com' : '-',
      fileHost: base.sourceType === 'web' && webFont?.cssUrl ? 'fonts.gstatic.com' : (base.sourceType === 'web' ? 'cdn.jsdelivr.net' : '-'),
      weights: base.sourceType === 'web' ? webFont?.weights?.map(String) || [] : ['-'],
      sourceUrl: base.sourceType === 'web'
        ? webFont?.sourceUrl
        : base.sourceUrl
    }
  };
}

function makeWebFontEntry(id, details) {
  const webFont = webFontCatalog[id];
  return makeFontEntry({ ...details, id, name: webFont.displayName, cssFamily: webFont.cssFamily, sourceType: 'web', fontOrigin: 'Webブラウザ', sourceUrl: webFont.sourceUrl, webFont });
}

const fonts = [
  makeFontEntry({
    id: 'segoe-ui',
    name: 'Segoe UI',
    cssFamily: '"Segoe UI"',
    category: 'サンセリフ / プロポーショナル',
    impression: ['端正', '現代的', 'すっきり'],
    uses: ['UI', '本文', '数字表示'],
    attributes: {
      supports: ['基本ラテン対応', 'Windows標準'],
      width: 'プロポーショナル',
      classification: 'ゴシック体 / サンセリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  }),
  makeFontEntry({
    id: 'yu-gothic-ui',
    name: 'Yu Gothic UI',
    cssFamily: '"Yu Gothic UI"',
    category: 'ゴシック体 / サンセリフ',
    impression: ['細身', '現代的', '落ち着いた'],
    uses: ['UI', '日本語本文', '長文'],
    attributes: {
      supports: ['基本ラテン対応', '日本語対応', 'Windows標準'],
      width: 'プロポーショナル',
      classification: 'ゴシック体 / サンセリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '小さいサイズや細いウェイトでは、文字が薄く見える場合があります。'
  }),
  makeFontEntry({
    id: 'meiryo',
    name: 'Meiryo',
    cssFamily: 'Meiryo',
    category: 'ゴシック体 / サンセリフ',
    impression: ['明快', '安定感がある', '画面向け'],
    uses: ['日本語本文', 'UI', '長文'],
    attributes: {
      supports: ['基本ラテン対応', '日本語対応', 'Windows標準'],
      width: 'プロポーショナル',
      classification: 'ゴシック体 / サンセリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '文字が比較的大きく、文章によっては密度が高く見える場合があります。'
  }),
  makeFontEntry({
    id: 'ms-mincho',
    name: 'MS Mincho',
    cssFamily: '"ＭＳ 明朝", "MS Mincho", serif',
    category: '明朝体 / セリフ',
    impression: ['古典的', '落ち着いた', '印刷物風'],
    uses: ['日本語本文', '印刷', '長文'],
    attributes: {
      supports: ['基本ラテン対応', '日本語対応', 'Windows標準'],
      width: '等幅',
      classification: '明朝体 / セリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '画面上の小さいサイズでは、細い線が見えにくい場合があります。'
  }),
  makeFontEntry({
    id: 'consolas',
    name: 'Consolas',
    cssFamily: 'Consolas',
    category: 'サンセリフ寄り / 等幅',
    impression: ['明快', '実用的', 'コード向け'],
    uses: ['コード', '数字表示'],
    attributes: {
      supports: ['基本ラテン対応', '等幅', 'Windows標準'],
      width: '等幅',
      classification: 'サンセリフ寄り',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  }),
  makeFontEntry({
    id: 'cascadia-code',
    name: 'Cascadia Code',
    cssFamily: '"Cascadia Code"',
    category: 'サンセリフ寄り / 等幅',
    impression: ['現代的', '明快', 'コード向け'],
    uses: ['コード', '数字表示'],
    attributes: {
      supports: ['基本ラテン対応', '等幅'],
      width: '等幅',
      classification: 'サンセリフ寄り',
      environment: 'インストール済みか要確認',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '環境によってはインストールされていない可能性があります。'
  }),
  makeWebFontEntry('noto-sans-jp-web', {
    category: 'サンセリフ / プロポーショナル',
    impression: ['読みやすい', '汎用', 'Web配信向け'],
    uses: ['本文', 'UI', '説明文'],
    attributes: {
      supports: ['基本ラテン対応', '日本語対応', 'Webフォント'],
      width: 'プロポーショナル',
      classification: 'サンセリフ',
      environment: 'Webブラウザ',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    openTypeAnalysisState: 'not-analyzed',
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' },
    notes: 'Web配信フォント向けに同じ表示形式でOpenType機能を確認します。'
  }),
  makeWebFontEntry('noto-serif-jp-web', { category: '明朝体 / セリフ', impression: ['端正', '落ち着いた', '本文向け'], uses: ['日本語本文', '見出し'], attributes: { supports: ['基本ラテン対応', '日本語対応', 'Webフォント'], width: 'プロポーショナル', classification: '明朝体 / セリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '日本語の明朝・セリフ系として選択時に読み込みます。' }),
  makeWebFontEntry('noto-sans-sc-web', { category: 'ゴシック体 / サンセリフ', impression: ['明快', '簡体字向け', 'Web配信向け'], uses: ['簡体字本文', 'UI'], attributes: { supports: ['基本ラテン対応', '簡体字対応', 'Webフォント'], width: 'プロポーショナル', classification: 'ゴシック体 / サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'supported', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '簡体字向けです。繁体字や日本語の字形は別フォントへフォールバックする場合があります。' }),
  makeWebFontEntry('noto-sans-tc-web', { category: 'ゴシック体 / サンセリフ', impression: ['明快', '繁体字向け', 'Web配信向け'], uses: ['繁体字本文', 'UI'], attributes: { supports: ['基本ラテン対応', '繁体字対応', 'Webフォント'], width: 'プロポーショナル', classification: 'ゴシック体 / サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'supported', korean: 'unknown' }, notes: '繁体字向けです。簡体字や日本語の字形は別フォントへフォールバックする場合があります。' }),
  makeWebFontEntry('source-han-sans-web', { category: 'ゴシック体 / サンセリフ', impression: ['CJK', '簡体字字形', '実用的'], uses: ['簡体字本文', 'UI'], attributes: { supports: ['基本ラテン対応', '簡体字対応', 'Webフォント'], width: 'プロポーショナル', classification: 'ゴシック体 / サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'supported', traditionalChinese: 'unknown', korean: 'unknown' }, notes: 'Adobe公式releaseのSource Han Sans CNを選択時に読み込みます。CJKには地域別字形があり、日本語・繁体字用とは区別します。' }),
  makeWebFontEntry('inter-web', { category: 'サンセリフ / プロポーショナル', impression: ['現代的', '可読性', 'UI向け'], uses: ['欧文UI', '欧文本文'], attributes: { supports: ['基本ラテン対応', 'Webフォント'], width: 'プロポーショナル', classification: 'サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '主にラテン文字向けです。日本語・中国語は別フォントへフォールバックします。' }),
  makeWebFontEntry('ibm-plex-sans-web', { category: 'サンセリフ / プロポーショナル', impression: ['技術的', '明快', '汎用'], uses: ['欧文UI', '欧文本文'], attributes: { supports: ['基本ラテン対応', 'Webフォント'], width: 'プロポーショナル', classification: 'サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '主にラテン文字向けです。日本語・中国語は別フォントへフォールバックします。' }),
  makeWebFontEntry('jetbrains-mono-web', { category: 'サンセリフ / 等幅', impression: ['明快', 'コード向け', '等幅'], uses: ['コード', '数字表示'], attributes: { supports: ['基本ラテン対応', '等幅', 'Webフォント'], width: '等幅', classification: 'サンセリフ寄り', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'monospace', recommendedFor: ['code'], languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '等幅フォントとしてコード用サンプルにも適用します。日本語・中国語は別フォントへフォールバックします。' }),
  makeWebFontEntry('zen-kaku-gothic-new-web', { category: 'ゴシック体 / サンセリフ', impression: ['端正', '日本語向け', '軽快'], uses: ['日本語本文', 'UI'], attributes: { supports: ['基本ラテン対応', '日本語対応', 'Webフォント'], width: 'プロポーショナル', classification: 'ゴシック体 / サンセリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'sans-serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '日本語ゴシックとして選択時に読み込みます。' }),
  makeWebFontEntry('shippori-mincho-web', { category: '明朝体 / セリフ', impression: ['上品', '日本語向け', '本文向け'], uses: ['日本語本文', '見出し'], attributes: { supports: ['基本ラテン対応', '日本語対応', 'Webフォント'], width: 'プロポーショナル', classification: '明朝体 / セリフ', environment: 'Webブラウザ', features: [], openType: makeOpenTypeProfile(false, []) }, categoryType: 'serif', recommendedFor: ['body', 'heading'], languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }, notes: '日本語の明朝・セリフ系として選択時に読み込みます。' }),
  makeFontEntry({
    id: 'courier-new',
    name: 'Courier New',
    cssFamily: '"Courier New"',
    category: 'セリフ / 等幅',
    impression: ['古典的', 'タイプライター風', '機械的'],
    uses: ['コード', '文章の幅確認', '印刷'],
    attributes: {
      supports: ['基本ラテン対応', '等幅', 'Windows標準'],
      width: '等幅',
      classification: 'セリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  }),
  makeFontEntry({
    id: 'times-new-roman',
    name: 'Times New Roman',
    cssFamily: '"Times New Roman"',
    category: 'セリフ / プロポーショナル',
    impression: ['古典的', '落ち着いた', '欧文本文向け'],
    uses: ['欧文本文', '印刷', '長文'],
    attributes: {
      supports: ['基本ラテン対応', 'Windows標準'],
      width: 'プロポーショナル',
      classification: 'セリフ',
      environment: 'Windows標準',
      features: [],
      openType: makeOpenTypeProfile(false, [])
    },
    sourceType: 'system',
    fontOrigin: 'システム',
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  })
];

const recommendationCatalog = window.FontRecommendationCatalog?.FONT_OPTIONS || [];
const recommendationMetadataById = new Map(recommendationCatalog.map((font) => [font.id, font]));

const fontCardSupplementalMetadata = {
  'segoe-ui': {
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'yu-gothic-ui': {
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  meiryo: {
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'ms-mincho': {
    categoryType: 'serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  consolas: {
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'cascadia-code': {
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'unknown', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'courier-new': {
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'times-new-roman': {
    categoryType: 'serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  }
};

const officialFontMetadata = {
  'segoe-ui': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['ラテン', 'ギリシャ', 'キリル', 'アルメニア', 'グルジア', 'アラビア', 'ヘブライ', 'リス'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/segoe-ui'
  },
  'yu-gothic-ui': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['日本語（漢字・ひらがな・カタカナ）', 'ラテン', 'ギリシャ', 'キリル'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/yu-gothic'
  },
  meiryo: {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['日本語（漢字・ひらがな・カタカナ）', 'ラテン', 'ギリシャ', 'キリル'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/meiryo'
  },
  'ms-mincho': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['日本語（漢字・ひらがな・カタカナ）', 'ラテン', 'ギリシャ', 'キリル'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/ms-mincho'
  },
  consolas: {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['ラテン', 'ギリシャ', 'キリル', 'アルメニア'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/consolas'
  },
  'cascadia-code': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準/同梱を確認',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: '同梱経路が環境依存のため、配信元を特定していない'
    },
    officialScripts: ['文字体系一覧は公式リポジトリで未確認'],
    license: 'SIL Open Font License 1.1',
    sourceUrl: 'https://github.com/microsoft/cascadia-code'
  },
  'courier-new': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['ラテン', 'ギリシャ', 'キリル', 'アルメニア', 'アラビア（補助）', 'ヘブライ（補助）'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/courier-new'
  },
  'times-new-roman': {
    delivery: {
      environment: 'Windows',
      provider: 'Microsoft',
      loadingMethod: 'OS標準フォント',
      cssHost: '-',
      fileHost: '-',
      weights: ['-'],
      details: 'OSにインストールされた同名フォントを利用'
    },
    officialScripts: ['ラテン', 'ギリシャ', 'キリル', 'アルメニア', 'アラビア（補助）', 'ヘブライ（補助）'],
    license: 'Microsoft製品付属（再配布は別途ライセンス確認）',
    sourceUrl: 'https://learn.microsoft.com/en-us/typography/font-list/times-new-roman'
  },
  'noto-sans-jp-web': {
    delivery: {
      environment: 'Webブラウザ',
      provider: 'Google Fonts',
      loadingMethod: 'Google Fonts CSS API',
      cssHost: 'fonts.googleapis.com',
      fileHost: 'fonts.gstatic.com',
      weights: ['400', '700'],
      details: '文字種ごとにサブセット配信される可能性があります。ブラウザ・言語環境で実際の配信ファイルが異なる場合があります。'
    },
    fontFaceMetadata: {
      loadedStyles: [{ value: 'normal', native: true }]
    },
    officialScripts: ['日本語', 'ラテン'],
    license: 'SIL Open Font License 1.1',
    sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+JP'
  }
};

Object.assign(officialFontMetadata, Object.fromEntries(Object.entries(webFontCatalog).map(([id, webFont]) => [id, {
  delivery: {
    environment: 'Webブラウザ',
    provider: webFont.provider,
    loadingMethod: webFont.cssUrl ? '選択時にCSS stylesheet + Font Loading API' : '選択時にFont Loading API',
    cssHost: webFont.cssUrl ? 'fonts.googleapis.com' : '-',
    fileHost: webFont.cssUrl ? 'fonts.gstatic.com' : 'cdn.jsdelivr.net',
    weights: webFont.weights.map(String),
    details: '未選択時は読み込まず、選択後に必要なウェイトだけを取得します。'
  },
  fontFaceMetadata: {
    configuredWeights: webFont.weights,
    configuredStyles: webFont.styles.map((value) => ({ value, native: true }))
  },
  officialScripts: webFont.officialScripts,
  license: webFont.license,
  sourceUrl: webFont.sourceUrl
}])));

const openTypeData = window.FontOpenTypeData || { fonts: {} };
const fontFaceData = window.FontFaceData || { fonts: {} };

function normalizeOpenTypeProfile(fontId) {
  return buildOpenTypeProfile(fontId);
}

fonts.forEach((font) => {
  const recommendationMetadata = recommendationMetadataById.get(font.id);
  if (!recommendationMetadata) throw new Error(`推薦用メタデータがありません: ${font.id}`);
  Object.assign(font, fontCardSupplementalMetadata[font.id], {
    memoCssFamily: recommendationMetadata.memoCssFamily
  }, officialFontMetadata[font.id]);
  font.attributes = {
    ...font.attributes,
    fontFace: createFontFaceProfile(font),
    openType: normalizeOpenTypeProfile(font.id)
  };
  font.metadataConfirmedAt = '2026-08-18';
});

const recommendationFonts = recommendationCatalog.map((metadata) => {
  const font = fonts.find((item) => item.id === metadata.id);
  if (!font) throw new Error(`推薦用メタデータに未登録のフォントがあります: ${metadata.id}`);
  return { ...font, ...metadata };
});

const samples = {
  normal: [
    { title: '日本語', text: 'いろはにほへと　ちりぬるを\n第３条天皇ハ神聖ニシテ侵スヘカラス', lang: null },
    { title: '英語', text: 'The quick brown fox jumps over the lazy dog.\nABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz', lang: null },
    { title: '繁体字', text: '天地玄黃，宇宙洪荒。日月盈昃，辰宿列張。\n快速的棕色狐狸跳過懶惰的狗。', lang: 'zh-Hant' },
    { title: '簡体字', text: '天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。\n快速的棕色狐狸跳过懒惰的狗。', lang: 'zh-Hans' },
    { title: '判別', text: 'Il1 O0 rn m\niiiiiiiiii\nWWWWWWWWWW\n1234567890', lang: null },
    { title: '記号', text: '() [] {} <> \\ / " \' → ← ※ ★ ♪ ① ㊤ ㎏ ㈱', lang: null },
    { title: 'コード', text: 'function test() { return true; }\nC:\\Users\\tetsu\\Documents', lang: null }
  ]
};

const state = {
  selectedIds: ['segoe-ui', 'yu-gothic-ui', 'consolas'],
  fontSize: 20,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  mode: 'normal'
};

const selector = document.getElementById('fontSelector');
const cardGrid = document.getElementById('cardGrid');
const integrationApi = window.FontComparisonIntegration;
const recommendationApi = window.FontRecommendation;
const coverageApi = window.FontCoverage;
const coverageData = window.FontCoverageData;
const memoIntegration = integrationApi.parseMemoNexusParams(location.search, fonts.map((font) => font.id));
const memoNexusPanel = document.getElementById('memoNexusPanel');
const memoNexusContext = document.getElementById('memoNexusContext');
const memoNexusSample = document.getElementById('memoNexusSample');
const memoNexusStatus = document.getElementById('memoNexusStatus');
const fontRecommendationForm = document.getElementById('fontRecommendationForm');
const fontRecommendationPrompt = document.getElementById('fontRecommendationPrompt');
const fontRecommendationResults = document.getElementById('fontRecommendationResults');
const returnToMemoButton = document.getElementById('returnToMemoButton');
let selectedMemoFontId = memoIntegration?.currentFontId || null;
let currentRecommendations = [];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function recommendationForFont(font) {
  return currentRecommendations.find((result) => result.font.id === font.id) || null;
}

function languageStatusLabel(value) {
  return {
    supported: '対応',
    partial: '一部対応',
    unsupported: '非対応',
    unknown: '未確認'
  }[value] || '未確認';
}

function orderedFonts(items) {
  if (!memoIntegration || currentRecommendations.length === 0) return items;
  const ranks = new Map(currentRecommendations.map((result) => [result.font.id, result.rank]));
  return [...items].sort((a, b) => (ranks.get(a.id) || Infinity) - (ranks.get(b.id) || Infinity));
}

function recommendationAnswers() {
  const values = new FormData(fontRecommendationForm);
  return {
    language: values.get('recommendationLanguage'),
    mood: values.get('recommendationMood'),
    purpose: values.get('recommendationPurpose')
  };
}

function fontSourceTypeLabel(font) {
  return font.sourceType === 'web' ? 'Webフォント' : 'システムフォント';
}

function appendRecommendationResult(result) {
  const item = document.createElement('li');
  item.className = 'font-recommendation-result';

  const heading = document.createElement('div');
  heading.className = 'font-recommendation-result-heading';
  const name = document.createElement('strong');
  name.textContent = `${result.rank}位 ${result.font.name}`;
  const source = document.createElement('span');
  source.className = `font-source-badge ${result.font.sourceType === 'web' ? 'web' : 'system'}`;
  source.textContent = fontSourceTypeLabel(result.font);
  heading.append(name, source);

  const reasons = document.createElement('ul');
  reasons.className = 'recommendation-reasons';
  result.reasons.forEach((reason) => {
    const entry = document.createElement('li');
    entry.textContent = reason;
    reasons.appendChild(entry);
  });

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'select-recommended-font';
  const selected = memoIntegration
    ? result.font.id === selectedMemoFontId
    : state.selectedIds.includes(result.font.id);
  button.textContent = selected
    ? (memoIntegration ? '選択中' : '比較対象に追加済み')
    : (memoIntegration ? 'このフォントを選択' : '比較対象に追加');
  button.setAttribute('aria-pressed', String(selected));
  button.addEventListener('click', () => selectRecommendedFont(result.font));
  item.append(heading, reasons, button);
  fontRecommendationResults.appendChild(item);
}

function renderRecommendationResults() {
  if (!fontRecommendationResults) return;
  fontRecommendationResults.textContent = '';
  fontRecommendationPrompt.hidden = currentRecommendations.length > 0;
  currentRecommendations.forEach(appendRecommendationResult);
}

function showRecommendations() {
  currentRecommendations = recommendationApi.recommendFonts(recommendationFonts, recommendationAnswers(), 3);
  renderRecommendationResults();
  renderSelector();
  renderCards();
}

function openTypeFeatureRows(font) {
  const profile = font.attributes?.openType;
  const features = Array.isArray(profile?.features) ? profile.features : [];
  return [...features]
    .sort((a, b) => a.tag.localeCompare(b.tag))
    .map((feature) => {
      const tag = feature.tag || '';
      if (!tag) return null;
      const definition = openTypeFeatureDefinitions[tag];
      if (!definition) return null;
      return {
        tag,
        name: definition.name,
        officialName: definition.officialName,
        description: definition.description,
        category: definition.category || null,
        note: definition.note || null,
        references: Array.isArray(definition.references) ? definition.references : [],
        tables: Array.isArray(feature.tables) ? feature.tables : []
      };
    }).filter(Boolean);
}

function openTypeFeatureSummaryText(font) {
  const profile = font.attributes?.openType;
  if (!profile?.verified) {
    return 'OpenType機能：未確認';
  }
  return `OpenType機能：解析ファイルで${profile.totalFeatures || 0}件を確認`;
}

const openTypeDialog = document.getElementById('openTypeFeatureDialog');
const openTypeDialogTitle = document.getElementById('openTypeFeatureDialogTitle');
const openTypeDialogSummary = document.getElementById('openTypeFeatureDialogSummary');
const openTypeDialogMeta = document.getElementById('openTypeFeatureDialogMeta');
const openTypeDialogFiles = document.getElementById('openTypeFeatureDialogFiles');
const openTypeDialogFeatureList = document.getElementById('openTypeFeatureDialogFeatureList');
const openTypeDialogFeatureDetail = document.getElementById('openTypeFeatureDialogFeatureDetail');
const openTypeDialogClose = document.getElementById('openTypeFeatureDialogClose');
const openTypeDialogDisclaimer = document.getElementById('openTypeFeatureDialogDisclaimer');
const openTypeDialogOfficial = document.getElementById('openTypeFeatureDialogOfficial');
let openTypeDialogController = null;
let activeOpenTypeFont = null;
let activeOpenTypeDetailRequest = 0;

function openTypeButtonLabel(font) {
  return `${font.name}のOpenType機能を確認`;
}

function formatFeatureLabel(feature) {
  return `${feature.tag} ${feature.name}`;
}

function renderOpenTypeDialogDetail(feature) {
  if (!feature) {
    return '<p class="open-type-feature-empty">対象の説明を選択してください。</p>';
  }
  const category = feature.category ? `<p><strong>分類:</strong> ${escapeHtml(feature.category)}</p>` : '';
  const note = feature.note ? `<p><strong>注意:</strong> ${escapeHtml(feature.note)}</p>` : '';
  const tables = (feature.tables || []).join(' / ');
  const reference = feature.references?.[0]
    ? `<p><strong>仕様:</strong> <a href="${escapeHtml(feature.references[0])}" target="_blank" rel="noopener noreferrer">OpenType Registered Features</a></p>`
    : '';
  return `
    <div class="open-type-feature-detail-content">
      <p><strong>OpenTypeタグ:</strong> ${escapeHtml(feature.tag)}</p>
      <p><strong>機能名:</strong> ${escapeHtml(feature.name)}</p>
      <p><strong>公式名称:</strong> ${escapeHtml(feature.officialName)}</p>
      <p><strong>説明:</strong> ${escapeHtml(feature.description)}</p>
      <p><strong>GSUB／GPOS:</strong> ${escapeHtml(tables || '不明')}</p>
      ${category}
      ${note}
      ${reference}
    </div>
  `;
}

function detailFileEvidenceHtml(files) {
  if (!Array.isArray(files) || !files.length) return '';
  return `<li><details class="open-type-analysis-evidence"><summary>ファイル別解析証拠（${files.length}件）</summary><ul>${files.map((file) => {
    const parts = [
      file.fileName,
      file.url,
      Number.isFinite(file.fileSize) ? `${file.fileSize} bytes` : '',
      file.sha256 ? `SHA-256: ${file.sha256}` : '',
      Array.isArray(file.weights) && file.weights.length ? `Weight: ${file.weights.join(' / ')}` : '',
      Array.isArray(file.styles) && file.styles.length ? `Style: ${file.styles.join(' / ')}` : '',
      Array.isArray(file.unicodeRanges) && file.unicodeRanges.length ? `unicode-range: ${file.unicodeRanges.join(' | ')}` : ''
    ].filter(Boolean);
    return `<li>${parts.map((part) => escapeHtml(part)).join('<br>')}</li>`;
  }).join('')}</ul></details></li>`;
}

function renderAnalysisDetail(fontId, detail, stateMessage = '') {
  if (activeOpenTypeFont !== fontId || !openTypeDialog?.open) return;
  const evidence = detail?.evidence || {};
  const openType = detail?.openType || {};
  const fontVersion = formatFontVersion(evidence);
  openTypeDialogFiles.innerHTML = [
    `<li><strong>解析対象:</strong> ${escapeHtml(openType.analysisTarget || evidence.analysisTarget || '未確認')}</li>`,
    fontVersion ? `<li><strong>フォントバージョン:</strong> ${escapeHtml(fontVersion)}</li>` : '',
    evidence.cssUrl ? `<li><strong>CSS API:</strong> ${escapeHtml(evidence.cssUrl)}</li>` : '',
    evidence.cssFetchedAt ? `<li><strong>CSS取得日:</strong> ${escapeHtml(evidence.cssFetchedAt)}</li>` : '',
    evidence.userAgent ? `<li><strong>User-Agent:</strong> ${escapeHtml(evidence.userAgent)}</li>` : '',
    evidence.fontFaceCount != null ? `<li><strong>CSS内の@font-face:</strong> ${escapeHtml(evidence.fontFaceCount)}件</li>` : '',
    evidence.fileCount != null ? `<li><strong>解析ファイル数:</strong> ${escapeHtml(evidence.fileCount)}件</li>` : '',
    evidence.sourceNote ? `<li><strong>注記:</strong> ${escapeHtml(evidence.sourceNote)}</li>` : '',
    detailFileEvidenceHtml(evidence.files),
    stateMessage ? `<li class="open-type-analysis-status">${escapeHtml(stateMessage)}</li>` : ''
  ].filter(Boolean).join('');
}

function renderAnalysisDetailLoading(fontId) {
  if (activeOpenTypeFont !== fontId) return;
  openTypeDialogFiles.insertAdjacentHTML('beforeend', '<li class="open-type-analysis-status">解析詳細を読み込んでいます。</li>');
}

function renderAnalysisDetailFailure(fontId, error) {
  if (activeOpenTypeFont !== fontId || !openTypeDialog?.open) return;
  openTypeDialogFiles.insertAdjacentHTML(
    'beforeend',
    `<li class="open-type-analysis-status">解析詳細を読み込めませんでした: ${escapeHtml(error.message || '不明なエラー')} <button type="button" data-retry-analysis-detail="${escapeHtml(fontId)}">再試行</button></li>`
  );
}

function loadOpenTypeAnalysisDetail(font) {
  const fontId = font?.id;
  const profile = font?.attributes?.openType;
  if (!fontId || !profile?.analysis?.hasDetails) return;
  const requestId = ++activeOpenTypeDetailRequest;
  renderAnalysisDetailLoading(fontId);
  window.FontAnalysisDetailsLoader.load(fontId, profile.analysis.detailSchemaVersion)
    .then((detail) => {
      if (requestId !== activeOpenTypeDetailRequest) return;
      renderAnalysisDetail(fontId, detail, '解析詳細を読み込みました。');
    })
    .catch((error) => {
      if (requestId !== activeOpenTypeDetailRequest) return;
      renderAnalysisDetailFailure(fontId, error);
    });
}

function setOpenTypeSelection(tag) {
  if (!tag || !activeOpenTypeFont) return;
  const font = fonts.find((item) => item.id === activeOpenTypeFont);
  if (!font) return;

  const rows = openTypeFeatureRows(font);
  const selected = rows.find((item) => item.tag === tag);
  if (!selected) return;

  openTypeDialogFeatureDetail.setAttribute('aria-label', `OpenType機能: ${selected.tag} ${selected.name} の詳細`);
  openTypeDialogFeatureDetail.innerHTML = renderOpenTypeDialogDetail(selected);
}

function openTypeFeatureDialogForFont(font, triggerButton) {
  if (!openTypeDialog) return;
  activeOpenTypeFont = font?.id || null;
  activeOpenTypeDetailRequest += 1;

  const profile = font?.attributes?.openType || {};
  const meta = profile?.analysis || {};
  const rows = openTypeFeatureRows(font);
  const source = font?.delivery || font?.sourceInfo || {};
  const isGoogleFonts = meta.sourceType === 'web';
  const fontVersion = formatFontVersion(meta);

  openTypeDialogTitle.textContent = `${font?.name || ''}`;
  openTypeDialogMeta.innerHTML = [
    `<li><strong>利用環境:</strong> ${escapeHtml(source.environment || font?.attributes?.environment || '未確認')}</li>`,
    `<li><strong>提供元:</strong> ${escapeHtml(source.provider || '未確認')}</li>`,
    `<li><strong>読み込み方法:</strong> ${escapeHtml(source.loadingMethod || '未確認')}</li>`,
    `<li><strong>CSS取得先:</strong> ${escapeHtml(source.cssHost || '-')}</li>`,
    `<li><strong>フォントファイル配信先:</strong> ${escapeHtml(source.fileHost || '-')}</li>`,
    `<li><strong>指定ウェイト:</strong> ${escapeHtml((meta.requestedWeights?.length ? meta.requestedWeights : source.weights || ['-']).join(' / '))}</li>`
  ].join('');
  openTypeDialogFiles.innerHTML = [
    `<li><strong>解析対象:</strong> ${escapeHtml(meta.analysisTarget || openTypeAnalysisTarget(meta) || '未確認')}</li>`,
    fontVersion ? `<li><strong>フォントバージョン:</strong> ${escapeHtml(fontVersion)}</li>` : '',
    `<li><strong>解析ファイル数:</strong> ${escapeHtml(meta.fileCount ?? '未確認')}件</li>`,
    profile?.analysis?.hasDetails ? '<li class="open-type-analysis-status">解析証拠の詳細は、このダイアログを開いた後に読み込みます。</li>' : '<li class="open-type-analysis-status">解析詳細データはありません。</li>'
  ].join('');
  openTypeDialogSummary.innerHTML = [
    `<li><strong>OpenType解析:</strong> ${profile.verified ? '解析済み' : '未解析'}</li>`,
    `<li><strong>解析日:</strong> ${escapeHtml(meta.analysisDate || '未確認')}</li>`,
    `<li><strong>解析方法:</strong> ${escapeHtml(meta.analysisMethod || '未確認')}</li>`,
    `<li><strong>確認できたOpenType機能数:</strong> ${profile.totalFeatures || 0}件</li>`,
    `<li><strong>説明付きで掲載している機能数:</strong> ${rows.length}件</li>`
  ].join('');
  openTypeDialogDisclaimer.textContent = isGoogleFonts
    ? `Google FontsのCSSに定義された複数の配信ファイルを解析し、確認できたOpenType機能を統合して表示しています。実際にブラウザが取得するファイルは、表示する文字やブラウザ環境によって異なる場合があります。${meta.caveat || ''}`
    : 'これらは解析したフォントのGSUB／GPOS FeatureListに基づく確認です。閲覧環境のフォント版が解析対象と異なる場合があります。';
  const sourceUrl = font?.sourceUrl || '';
  openTypeDialogOfficial.innerHTML = `<strong>公式情報:</strong> <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceUrl || '未確認')}</a>`;

  if (openTypeDialogFeatureDetail) {
    openTypeDialogFeatureDetail.setAttribute('aria-live', 'polite');
    openTypeDialogFeatureDetail.removeAttribute('aria-label');
  }
  openTypeDialogFeatureList.setAttribute('aria-label', `${font?.name || ''}のOpenType機能`);

  if (!profile?.verified) {
    openTypeDialogFeatureList.innerHTML = '';
    openTypeDialogFeatureDetail.innerHTML = `<p class="open-type-feature-empty">${escapeHtml(profile?.analysis?.reason || openTypeUnparsedMessage)}</p>`;
    openTypeDialogFeatureDetail.setAttribute('aria-label', 'OpenType機能: 未確認');
    openTypeDialogController.open(triggerButton);
    return;
  }

  if (!rows.length) {
    openTypeDialogFeatureList.innerHTML = '';
    openTypeDialogFeatureDetail.innerHTML = `<p class="open-type-feature-empty">${openTypeNoFeatureMessage}</p>`;
    openTypeDialogFeatureDetail.setAttribute('aria-label', 'OpenType機能: 0件');
    openTypeDialogController.open(triggerButton);
    loadOpenTypeAnalysisDetail(font);
    return;
  }

  openTypeDialogFeatureList.innerHTML = rows
    .map(
      (row) => `
    <button
      type="button"
      class="open-type-feature-chip"
      aria-pressed="false"
      data-feature-tag="${escapeHtml(row.tag)}"
    >${escapeHtml(formatFeatureLabel(row))}</button>
  `
    )
    .join('');

  const firstChip = openTypeDialogFeatureList.querySelector('.open-type-feature-chip');
  openTypeDialogController.open(triggerButton, firstChip);
  loadOpenTypeAnalysisDetail(font);
}

function bindOpenTypeDialogEvents() {
  if (!openTypeDialog || !openTypeDialogClose) return;
  if (!openTypeDialogFeatureList) return;
  openTypeDialogController = window.OpenTypeDialog.createController({
    dialog: openTypeDialog,
    closeButton: openTypeDialogClose,
    featureList: openTypeDialogFeatureList,
    onSelect: setOpenTypeSelection
  });
  openTypeDialog.addEventListener('close', () => {
    activeOpenTypeFont = null;
    activeOpenTypeDetailRequest += 1;
  });
  openTypeDialogFiles?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-retry-analysis-detail]');
    if (!button) return;
    const font = fonts.find((item) => item.id === button.dataset.retryAnalysisDetail);
    if (font) loadOpenTypeAnalysisDetail(font);
  });
}

function coverageMetadata(font) {
  return coverageData?.fonts?.[font.id] || {
    status: 'not-analyzed',
    reason: 'フォントファイルを確認できていません。'
  };
}

function coverageStatusLabel(coverage) {
  return coverage.status === 'analyzed' ? '解析済み' : '未解析';
}

function formatFontVersion(metadata, options) {
  return window.FontMetadata?.formatFontVersion(metadata, options) || '';
}

function shouldDisplayInternalFace(metadata) {
  return Boolean(window.FontMetadata?.isFontCollection(metadata) && metadata.faceName);
}

function safeCoverageReason(coverage) {
  return window.FontMetadata?.safeUnparsedReason(coverage) || 'フォントファイルを確認できていません。';
}

function createFontFaceProfile(font) {
  const analyzed = fontFaceData.fonts?.[font.id];
  const metadata = analyzed?.status === 'analyzed' ? analyzed : (font.fontFaceMetadata || {});
  return window.FontMetadata?.createFontFaceProfile({
    family: metadata.family || font.name,
    availableWeights: metadata.availableWeights,
    loadedWeights: metadata.loadedWeights || (font.sourceType === 'web' ? [] : font.delivery?.weights),
    availableStyles: metadata.availableStyles,
    loadedStyles: metadata.loadedStyles || (font.sourceType === 'web' ? [] : metadata.loadedStyles),
    syntheticStyles: metadata.syntheticStyles,
    verification: metadata.verification
  }) || {
    family: font.name,
    availableWeights: [],
    loadedWeights: [],
    availableStyles: [],
    loadedStyles: [],
    syntheticStyles: [],
    verification: null
  };
}

function fontVariantInfoRows(font) {
  if (font.webFont) return webFontVariantInfoRows(font);
  const profile = font.attributes?.fontFace || createFontFaceProfile(font);
  const weight = window.FontMetadata?.formatWeightSummary(profile) || '未確認';
  const style = window.FontMetadata?.formatStyleSummary(profile) || '未確認';
  return `
    <li>Weight: ${escapeHtml(weight)}</li>
    <li>Style: ${escapeHtml(style)}</li>
  `;
}

function openTypeAnalysisTarget(meta) {
  const target = [meta.fileName, formatFontVersion(meta)];
  if (shouldDisplayInternalFace(meta)) target.splice(1, 0, `${meta.faceName}（faceIndex ${meta.faceIndex}）`);
  return target.filter(Boolean).join(' / ');
}

function webCoverageAnalysisRows(coverage) {
  return [
    `<li>文字収録判定の解析元: ${escapeHtml(coverage.analysisTarget || 'Google Fonts配信WOFF2')}</li>`,
    formatFontVersion(coverage, { compact: true }) ? `<li>フォントバージョン: ${escapeHtml(formatFontVersion(coverage, { compact: true }))}</li>` : '',
    coverage.analysisMethod ? `<li>解析方法: ${escapeHtml(coverage.analysisMethod)}</li>` : '',
    coverage.caveat ? `<li>文字収録情報: ${escapeHtml(coverage.caveat)}</li>` : ''
  ].join('');
}

function coverageAnalysisRows(coverage) {
  if (coverage.status !== 'analyzed') {
    return `<li>文字収録判定: 未解析</li><li>理由: ${escapeHtml(safeCoverageReason(coverage))}</li>`;
  }
  if (coverage.sourceType === 'web') return webCoverageAnalysisRows(coverage);
  const rows = [
    `<li>文字収録判定の解析元: ${escapeHtml(coverage.fileName || '確認済みの解析元なし')}</li>`,
    formatFontVersion(coverage, { compact: true }) ? `<li>フォントバージョン: ${escapeHtml(formatFontVersion(coverage, { compact: true }))}</li>` : ''
  ];
  if (shouldDisplayInternalFace(coverage)) rows.push(`<li>内部フェイス: ${escapeHtml(`${coverage.faceName}（faceIndex ${coverage.faceIndex}）`)}</li>`);
  return rows.join('');
}

function officialMetadataHtml(font) {
  const coverage = coverageMetadata(font);
  const sourceUrl = escapeHtml(font.sourceUrl);
  return `
    <li>公式に確認した文字体系: ${font.officialScripts.map(escapeHtml).join(' / ')}</li>
    <li>見本文字の収録判定は言語対応とは別のcmap情報です。</li>
    <li>収録文字データ: ${coverageStatusLabel(coverage)}</li>
    <li>取得元: ${escapeHtml(font.delivery?.environment || font.attributes?.environment || '-')}</li>
    <li>配信/読み込み情報: ${escapeHtml(font.delivery?.provider || font.source || '-')} / ${escapeHtml(font.delivery?.loadingMethod || '-')}</li>
    ${coverageAnalysisRows(coverage)}
    <li>確認日: ${escapeHtml(font.metadataConfirmedAt)}</li>
    <li>ライセンス: ${escapeHtml(font.license)}</li>
    <li>公式情報: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceUrl}</a></li>
    <li>OpenType解析状態: ${font.attributes?.openType?.verified ? '解析済み（GSUB/GPOS FeatureList確認）' : '未解析'}</li>
  `;
}

function createSampleSection(title, text, font, lang = null, extraClass = '') {
  const section = document.createElement('section');
  section.className = `sample-section${extraClass ? ` ${extraClass}` : ''}`;
  const heading = document.createElement('h4');
  heading.className = 'section-title';
  heading.textContent = title;
  const content = document.createElement('div');
  content.className = 'sample-text';
  if (lang) content.lang = lang;
  const unsupportedCount = coverageApi.appendCoverageText(content, text, font.id, coverageData);
  section.append(heading, content);
  return { section, unsupportedCount };
}

function createCoverageLegend(font, unsupportedCount) {
  const coverage = coverageMetadata(font);
  if (coverage.status !== 'analyzed') {
    const unknown = document.createElement('p');
    unknown.className = 'coverage-legend coverage-unknown';
    unknown.textContent = '収録文字情報は未確認です。通常濃度の文字も収録済みとは判定していません。';
    return unknown;
  }
  if (unsupportedCount === 0) return null;
  const legend = document.createElement('p');
  legend.className = 'coverage-legend';
  legend.textContent = '薄い文字は、解析した対象フォントに未収録です。ブラウザが別のフォントによる代替表示を試みます。';
  return legend;
}

function formatWebFontWeights(weights) {
  return weights.map((weight) => window.FontMetadata?.formatWeightSummary({ availableWeights: [weight] }).replace(/（.*$/, '') || `Weight ${weight}`).join(' / ');
}

function webFontVariantInfoRows(font) {
  const config = font.webFont;
  const coverage = coverageMetadata(font);
  const runtime = webFontState(font);
  const configuredWeights = formatWebFontWeights(config.weights);
  const analyzedWeights = coverage.status === 'analyzed' ? formatWebFontWeights(coverage.requestedWeights || []) : '未確認';
  const successfulWeights = formatWebFontWeights([...runtime.loadedWeights]);
  const requestedNow = formatWebFontWeights(requestedWebFontWeights(font));
  const runtimeWeight = runtime.status === 'loading'
    ? `読み込み中: ${requestedNow}`
    : runtime.status === 'loaded'
      ? `読み込み成功: ${successfulWeights || 'なし'}`
      : runtime.status === 'error'
        ? `読み込み失敗: ${requestedNow}`
        : '実行時の読み込み: 未実行';
  const styles = config.styles.map((style) => style === 'normal' ? 'Normal' : style).join(' / ');
  return `
    <li>Weight: 読み込み対象: ${escapeHtml(configuredWeights)}</li>
    <li>Weight: 解析ファイルで確認: ${escapeHtml(analyzedWeights)}</li>
    <li>Weight: ${escapeHtml(runtimeWeight)}</li>
    <li>Style: 読み込み対象: ${escapeHtml(styles)} / 実行時成功: ${runtime.status === 'loaded' ? escapeHtml(styles) : '未確認'} / ファミリー全体: 未確認</li>
  `;
}

const webFontLoadStates = new Map();
const webFontStylesheetPromises = new Map();
const webFontFacePromises = new Map();
const explicitlyRequestedWebFonts = new Set();

function webFontState(font) {
  return webFontLoadStates.get(font.id) || { status: 'idle', loadedWeights: new Set(), error: null };
}

function webFontStatusText(font) {
  if (!font.webFont) return '';
  const current = webFontState(font);
  if (current.status === 'loading') return '読み込み中';
  if (current.status === 'loaded') return '読込済み';
  if (current.status === 'error') return '読込失敗';
  return '選択時に読込';
}

function loadStylesheet(url) {
  if (webFontStylesheetPromises.has(url)) return webFontStylesheetPromises.get(url);
  const promise = new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.webFontStylesheet = url;
    link.onload = () => resolve();
    link.onerror = () => {
      link.remove();
      webFontStylesheetPromises.delete(url);
      reject(new Error('配布元のCSSを取得できませんでした。'));
    };
    document.head.appendChild(link);
  });
  webFontStylesheetPromises.set(url, promise);
  return promise;
}

function loadSourceHanFace(font, weight) {
  const key = `${font.id}:${weight}`;
  if (webFontFacePromises.has(key)) return webFontFacePromises.get(key);
  const url = font.webFont.fontFiles?.[weight];
  if (!url) return Promise.resolve();
  const promise = new FontFace(font.webFont.family, `url(${url}) format('opentype')`, { weight: String(weight), style: 'normal', display: 'swap' })
    .load()
    .then((face) => document.fonts.add(face))
    .catch((error) => {
      webFontFacePromises.delete(key);
      throw error;
    });
  webFontFacePromises.set(key, promise);
  return promise;
}

async function loadWebFontWeight(font, weight) {
  const config = font.webFont;
  if (!config.weights.includes(weight)) return;
  if (config.cssUrl) {
    await loadStylesheet(config.cssUrl);
    const loadedFaces = await document.fonts.load(`${weight} 1em "${config.family}"`, coverageLoadText(font));
    if (!loadedFaces.length) throw new Error(`指定したFontFaceを確認できませんでした: ${font.name} ${weight}`);
    return;
  }
  await loadSourceHanFace(font, weight);
}

function requestedWebFontWeights(font) {
  const values = new Set([400, state.fontWeight]);
  return [...values].filter((weight) => font.webFont.weights.includes(weight));
}

function coverageLoadText(font) {
  const sampleText = samples.normal.map((section) => section.text).join('');
  const characters = [];
  const seen = new Set();
  for (const character of sampleText) {
    const codepoint = character.codePointAt(0);
    if (seen.has(codepoint) || coverageApi.codepointStatus(font.id, codepoint, coverageData) !== 'supported') continue;
    seen.add(codepoint);
    characters.push(character);
  }
  if (!characters.length) throw new Error(`解析済み見本文字がありません: ${font.name}`);
  return characters.join('');
}

function missingWebFontWeights(requestedWeights, loadedWeights) {
  return requestedWeights.filter((weight) => !loadedWeights.has(weight));
}

function loadWebFont(font) {
  if (!font.webFont) return Promise.resolve();
  const current = webFontState(font);
  if (current.status === 'loading') return current.promise;
  const missingWeights = missingWebFontWeights(requestedWebFontWeights(font), current.loadedWeights);
  if (!missingWeights.length) {
    if (current.status === 'error') {
      webFontLoadStates.set(font.id, {
        status: 'loaded',
        loadedWeights: new Set(current.loadedWeights),
        error: null,
        promise: null
      });
      renderSelector();
      renderCards();
    }
    return Promise.resolve();
  }

  const next = { status: 'loading', loadedWeights: new Set(current.loadedWeights), error: null, promise: null };
  webFontLoadStates.set(font.id, next);
  renderSelector();
  renderCards();
  next.promise = Promise.all(missingWeights.map(async (weight) => {
    await loadWebFontWeight(font, weight);
    next.loadedWeights.add(weight);
  }))
    .then(() => { next.status = 'loaded'; })
    .catch((error) => { next.status = 'error'; next.error = error; })
    .finally(() => { renderSelector(); renderCards(); });
  return next.promise;
}

function requestExplicitWebFont(font, requestedFonts, load) {
  if (!font.webFont) return { isWebFont: false };
  requestedFonts.add(font.id);
  return { isWebFont: true, promise: load(font) };
}

function explicitlyRequestWebFont(font) {
  return requestExplicitWebFont(font, explicitlyRequestedWebFonts, loadWebFont);
}

function requestWebFontsForSelectedIds(fontList, selectedIds, requestedFonts, load) {
  fontList
    .filter((font) => font.webFont && selectedIds.includes(font.id) && requestedFonts.has(font.id))
    .forEach((font) => { load(font); });
}

function requestSelectedWebFonts() {
  requestWebFontsForSelectedIds(fonts, state.selectedIds, explicitlyRequestedWebFonts, loadWebFont);
}

function webFontLoadNotice(font) {
  if (!font.webFont) return '';
  const current = webFontState(font);
  if (current.status === 'loading') return '<p class="web-font-notice loading">このWebフォントを読み込み中です。</p>';
  if (current.status === 'error') return '<p class="web-font-notice error">Webフォントを読み込めませんでした。ネットワークまたは配布元を確認し、再試行してください。 <button type="button" class="retry-web-font">再試行</button></p>';
  return '';
}

function renderSelector() {
  selector.innerHTML = '';
  orderedFonts(fonts).forEach((font) => {
    const label = document.createElement('label');
    label.className = 'font-option';
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(font.id)}" ${state.selectedIds.includes(font.id) ? 'checked' : ''} />
      <span>${escapeHtml(font.name)}</span>
      ${memoIntegration
        ? `<span class="font-source-badge ${font.webFont ? 'web' : 'system'}">${font.webFont ? 'Web' : 'システム'}</span>`
        : (font.webFont ? '<span class="web-font-badge">Web</span>' : '')}
      ${font.webFont ? `<span class="web-font-status ${webFontState(font).status}">${webFontStatusText(font)}</span>` : ''}
    `;
    label.querySelector('input').addEventListener('change', (event) => {
      if (event.target.checked) {
        if (!state.selectedIds.includes(font.id)) {
          state.selectedIds.push(font.id);
        }
      } else {
        state.selectedIds = state.selectedIds.filter((id) => id !== font.id);
      }
      renderCards();
      if (event.target.checked) explicitlyRequestWebFont(font);
    });
    selector.appendChild(label);
  });
}

function renderCards() {
  const selectedFonts = orderedFonts(fonts.filter((font) => state.selectedIds.includes(font.id)));

  if (selectedFonts.length === 0) {
    cardGrid.innerHTML = '<div class="empty-state">表示するフォントがありません。選択を増やしてください。</div>';
    return;
  }

  cardGrid.innerHTML = '';
  selectedFonts.forEach((font) => {
    const recommendation = recommendationForFont(font);
    const card = document.createElement('article');
    card.className = `font-card${font.id === selectedMemoFontId ? ' memo-selected' : ''}${recommendation ? ' memo-recommended' : ''}`;
    card.dataset.fontId = font.id;
    card.style.setProperty('--font-size', `${state.fontSize}px`);
    card.style.setProperty('--font-weight', `${state.fontWeight}`);
    card.style.setProperty('--line-height', `${state.lineHeight}`);
    card.style.setProperty('--letter-spacing', `${state.letterSpacing}px`);
    card.style.setProperty('--sample-font', font.cssFamily);

    card.innerHTML = `
      ${memoIntegration ? `
        <div class="memo-font-choice">
          <div class="memo-font-choice-meta">
            <span class="font-source-badge ${font.webFont ? 'web' : 'system'}">${font.webFont ? 'Webフォント' : 'システムフォント'}</span>
            <span class="recommendation-badge ${recommendation ? 'recommended' : ''}">
              ${recommendation ? `推薦${recommendation.rank}位` : '推薦順位なし'}
            </span>
          </div>
          <button type="button" class="select-memo-font" data-font-id="${escapeHtml(font.id)}" aria-pressed="${font.id === selectedMemoFontId}">
            ${font.id === selectedMemoFontId ? '選択中' : 'このフォントを選択'}
          </button>
        </div>
        ${recommendation ? `<ul class="card-recommendation-reasons">${recommendation.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>` : ''}
      ` : ''}
      <div class="font-card-header">
        <h3 class="font-card-name">${escapeHtml(font.name)}</h3>
        <p class="font-card-category">${escapeHtml(font.category)}</p>
        ${webFontLoadNotice(font)}
      </div>
      <div class="sample-area"></div>
      <div class="card-footer">
        <div class="footer-block">
          <h4>印象</h4>
          <div class="tag-row">
            ${font.impression.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
          </div>
        </div>
        <div class="footer-block">
          <h4>向いている用途</h4>
          <div class="tag-row">
            ${font.uses.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
          </div>
        </div>
        <div class="footer-block">
          <h4>属性</h4>
          <ul class="attribute-list">
            <li>従来の概要: ${font.attributes.supports.map(escapeHtml).join(' / ')}</li>
            <li>文字幅: ${escapeHtml(font.attributes.width)}</li>
            <li>書体分類: ${escapeHtml(font.attributes.classification)}</li>
            <li>利用環境: ${escapeHtml(font.attributes.environment)}</li>
            ${fontVariantInfoRows(font)}
            <li>取得元: ${escapeHtml(font.fontOrigin)} / ${escapeHtml(font.attributes.sourceKind)} (${escapeHtml(font.attributes.source)})</li>
            <li>${openTypeFeatureSummaryText(font)}</li>
            ${officialMetadataHtml(font)}
            ${memoIntegration ? `
              <li>言語情報: ラテン ${languageStatusLabel(font.languages.latin)} / 日本語 ${languageStatusLabel(font.languages.japanese)} / 簡体字 ${languageStatusLabel(font.languages.simplifiedChinese)} / 繁体字 ${languageStatusLabel(font.languages.traditionalChinese)} / 韓国語 ${languageStatusLabel(font.languages.korean)}</li>
            ` : ''}
          </ul>
        </div>
        <div class="footer-block opentype-feature-block">
          <h4>OpenType機能</h4>
          <button type="button"
            class="open-type-feature-button"
            data-font-id="${escapeHtml(font.id)}"
            aria-haspopup="dialog"
            aria-controls="openTypeFeatureDialog"
            aria-label="${openTypeButtonLabel(font)}"
          >OpenType機能の詳細</button>
        </div>
        <div class="footer-block">
          <h4>注意点</h4>
          <p class="notes">${escapeHtml(font.notes)}</p>
        </div>
      </div>
    `;

    renderSampleContent(font, card.querySelector('.sample-area'));

    card.querySelector('.select-memo-font')?.addEventListener('click', () => selectMemoFont(font));
    card.querySelector('.retry-web-font')?.addEventListener('click', () => loadWebFont(font));
    const openTypeButton = card.querySelector('.open-type-feature-button');
    if (openTypeButton) {
      openTypeButton.addEventListener('click', () => {
        openTypeFeatureDialogForFont(font, openTypeButton);
      });
    }
    cardGrid.appendChild(card);
  });
}

function renderSampleContent(font, sampleArea) {
  let unsupportedCount = 0;
  const appendSection = (title, text, lang = null, extraClass = '') => {
    const rendered = createSampleSection(title, text, font, lang, extraClass);
    unsupportedCount += rendered.unsupportedCount;
    sampleArea.appendChild(rendered.section);
  };

  if (memoIntegration?.sample) {
    appendSection('Memo Nexusの比較文章', memoIntegration.sample, null, 'memo-passed-sample');
  }

  if (state.mode === 'fixed') {
    const grid = document.createElement('div');
    grid.className = 'fixed-grid';
    for (const character of ['あ', '漢', 'A', 'g', '0', '1', 'i', 'W']) {
      const cell = document.createElement('div');
      cell.className = 'fixed-cell';
      unsupportedCount += coverageApi.appendCoverageText(cell, character, font.id, coverageData);
      grid.appendChild(cell);
    }
    sampleArea.appendChild(grid);
  } else if (state.mode === 'width') {
    const wrapper = document.createElement('div');
    wrapper.className = 'sample-text';
    for (const row of ['iiiiiiiiii', 'WWWWWWWWWW', '1234567890']) {
      const line = document.createElement('div');
      line.className = 'width-line';
      for (const character of row) {
        const characterBox = document.createElement('span');
        characterBox.className = 'width-char';
        unsupportedCount += coverageApi.appendCoverageText(characterBox, character, font.id, coverageData);
        line.appendChild(characterBox);
      }
      wrapper.appendChild(line);
    }
    sampleArea.appendChild(wrapper);
  } else {
    for (const section of samples.normal) {
      appendSection(section.title, section.text, section.lang);
    }
  }

  const legend = createCoverageLegend(font, unsupportedCount);
  if (legend) sampleArea.prepend(legend);
}

function updateControlLabels() {
  document.getElementById('fontSizeValue').textContent = `${state.fontSize}px`;
  document.getElementById('lineHeightValue').textContent = `${state.lineHeight.toFixed(1)}`;
  document.getElementById('letterSpacingValue').textContent = `${state.letterSpacing}px`;
}

function initializeMemoIntegration() {
  if (!memoIntegration) return;
  const targetLabels = { body: '本文', heading: '見出し', code: 'コード' };
  const targetPurposes = { body: 'writing', heading: 'heading', code: 'code' };
  const currentFont = fonts.find((font) => font.id === memoIntegration.currentFontId);
  state.selectedIds = fonts.map((font) => font.id);
  memoNexusPanel.hidden = false;
  document.body.classList.add('memo-integration-mode');
  document.querySelector('.view-switch').hidden = true;
  memoNexusContext.textContent = [
    `対象: ${targetLabels[memoIntegration.target]}`,
    `適用範囲: ${memoIntegration.scope === 'note' ? 'このメモ' : '全体設定'}`,
    `現在: ${currentFont?.name || '未確認'}`
  ].join(' / ');
  memoNexusSample.textContent = memoIntegration.sample || '比較文章は指定されていません。';
  const initialPurpose = fontRecommendationForm.querySelector(`[name="recommendationPurpose"][value="${targetPurposes[memoIntegration.target]}"]`);
  if (initialPurpose) initialPurpose.checked = true;

  const canReturn = memoIntegration.errors.length === 0
    && integrationApi.isAllowedReturnUrl(memoIntegration.returnUrl);
  returnToMemoButton.disabled = !canReturn;
  if (!canReturn) {
    const detail = memoIntegration.errors.length
      ? memoIntegration.errors.join(' ')
      : '安全なMemo Nexusの戻り先を確認できません。';
    memoNexusStatus.textContent = `${detail} 比較は続けられますが、Memo Nexusへ戻ることはできません。`;
  }
}

function selectedMemoFont() {
  return fonts.find((font) => font.id === selectedMemoFontId);
}

function selectComparisonFont(font) {
  if (!state.selectedIds.includes(font.id)) state.selectedIds.push(font.id);
  explicitlyRequestWebFont(font);
  renderRecommendationResults();
  renderSelector();
  renderCards();
}

function selectRecommendedFont(font) {
  if (memoIntegration) selectMemoFont(font);
  else selectComparisonFont(font);
}

function selectMemoFont(font) {
  selectedMemoFontId = font.id;
  if (!state.selectedIds.includes(font.id)) state.selectedIds.push(font.id);
  const request = explicitlyRequestWebFont(font);
  memoNexusStatus.textContent = request.isWebFont
    ? `${font.name}を選択しました。Webフォントの読込状態はカードに表示します。`
    : `${font.name}を選択しました。内容を確認してMemo Nexusへ戻れます。`;
  renderRecommendationResults();
  renderSelector();
  renderCards();
}

function bindControls() {
  document.getElementById('fontSizeRange').addEventListener('input', (event) => {
    state.fontSize = Number(event.target.value);
    updateControlLabels();
    renderCards();
  });

  document.getElementById('fontWeightSelect').addEventListener('change', (event) => {
    state.fontWeight = Number(event.target.value);
    renderCards();
    requestSelectedWebFonts();
  });

  document.getElementById('lineHeightRange').addEventListener('input', (event) => {
    state.lineHeight = Number(event.target.value) / 10;
    updateControlLabels();
    renderCards();
  });

  document.getElementById('letterSpacingRange').addEventListener('input', (event) => {
    state.letterSpacing = Number(event.target.value);
    updateControlLabels();
    renderCards();
  });

  document.querySelectorAll('.mode-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll('.mode-button').forEach((item) => {
        const active = item.dataset.mode === state.mode;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderCards();
    });
  });

  document.getElementById('selectAllButton').addEventListener('click', () => {
    state.selectedIds = fonts.map((font) => font.id);
    fonts.filter((font) => font.webFont).forEach((font) => explicitlyRequestedWebFonts.add(font.id));
    renderSelector();
    renderCards();
    requestSelectedWebFonts();
  });

  document.getElementById('clearAllButton').addEventListener('click', () => {
    state.selectedIds = [];
    renderSelector();
    renderCards();
  });

  fontRecommendationForm.addEventListener('change', showRecommendations);
  returnToMemoButton.addEventListener('click', () => {
    try {
      location.assign(integrationApi.buildMemoNexusReturnUrl(memoIntegration, selectedMemoFont()));
    } catch (error) {
      memoNexusStatus.textContent = `${error.message} 比較状態は保持しています。連携URLを確認してください。`;
    }
  });
}

initializeMemoIntegration();
showRecommendations();
bindControls();
bindOpenTypeDialogEvents();
updateControlLabels();
renderCards();
requestSelectedWebFonts();
