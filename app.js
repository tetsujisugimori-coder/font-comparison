const openTypeFeatureDefinitions = {
  aalt: {
    name: '代替字形',
    description: '既定の置換を含む代替字形を使うための補助機能です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_ae']
  },
  afrc: {
    name: '標準アラビア文字の分離',
    description: 'アラビア文字列の既定の字形選択ルールを定義する補助情報です。',
    category: '自動',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_uz']
  },
  c2sc: {
    name: '小文字の大文字字形化',
    description: '小文字を対応する小型の大文字相当字形へ置き換えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  calt: {
    name: '文脈依存合字',
    description: '前後の文字列の文脈で合字や代替字形を選択します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/otspec190/chapter2']
  },
  ccmp: {
    name: '複合文字・合字作成補助',
    description: '文字列内での既定の合字作成に備え、文字要素の連結・再配置を支援する補助置換です。',
    category: '自動',
    note: '文字の正しい組版に必要な置換として働くことが多く、表示上の差分はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_12']
  },
  case: {
    name: '大文字小文字変換',
    description: '大文字小文字の対応を行うための字形候補を示します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/otspec190/chapter2']
  },
  cpsp: {
    name: '結合文字シーケンス補助',
    description: '結合文字系の置換に用いる字形ルールを制御します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/otspec190/chapter2']
  },
  dlig: {
    name: '離散合字',
    description: '通常の合字より意図的に長い文字列の合字を選択します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_3']
  },
  dnom: {
    name: '下付き数字',
    description: '下付き数字の字形に置換します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  expt: {
    name: '指数',
    description: '上下方向の表現を行う上付き構成向けの代替字形を扱います。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  fina: {
    name: '語末字形',
    description: '語尾位置の文字形を使用します。',
    category: '自動',
    note: 'アラビア文字など、文字列中の位置に応じて通常は自動適用されます。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  frac: {
    name: '斜め分数',
    description: '分数表示のために上付き・下付き数字の配置と分割字形を行います。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_6']
  },
  fwid: {
    name: '全角幅',
    description: '文字を全角幅へ合わせるために代替字形を使うことがあります。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  halt: {
    name: '横書きハンドル位置補正',
    description: '横書き時の文字グリフや配置に関する補助情報です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/otspec190/chapter2']
  },
  hwid: {
    name: '半角幅',
    description: '文字を半角幅へ合わせるために代替字形を使うことがあります。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  hlig: {
    name: 'ヒンディー文字合字',
    description: '文字列内の特定パターンで合字候補を適用します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_2']
  },
  hkna: {
    name: '横書きかな',
    description: '横組み環境での和文かな形の置換候補を扱います。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_zh']
  },
  hojo: {
    name: '補助字形',
    description: '文字形状の保護または代替ルールとして用いられることがあります。',
    category: 'フォント固有',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  init: {
    name: '語頭字形',
    description: 'アラビア文字列の語頭位置の字形を選択します。',
    category: '自動',
    note: '文字の位置に応じた形が適用されるため、通常は自動で使われます。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  isol: {
    name: '孤立字形',
    description: 'アラビア文字列で単独で使う場合の基準字形を選択します。',
    category: '自動',
    note: '文字の位置に応じた形が適用されるため、通常は自動で使われます。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  ital: {
    name: 'イタリック字形',
    description: '斜体形の対応に関わる字形の選択規則です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  jp78: {
    name: 'JIS78字形',
    description: 'JIS78準拠の文字形に置き換える候補を提供します。',
    category: '任意',
    references: ['https://www.unicode.org/standard/reports/tr11/']
  },
  jp83: {
    name: 'JIS83字形',
    description: 'JIS83準拠の字形へ置き換える候補を提供します。',
    category: '任意',
    references: ['https://www.unicode.org/standard/reports/tr11/']
  },
  jp90: {
    name: 'JIS90字形',
    description: 'JIS90準拠の文字形へ置き換える候補を提供します。',
    category: '任意',
    references: ['https://www.unicode.org/standard/reports/tr11/']
  },
  jp04: {
    name: 'JIS2004字形',
    description: 'JIS2004準拠の字形へ置き換える候補を提供します。',
    category: '任意'
  },
  kern: {
    name: 'カーニング',
    description: '文字ペア間の字間を調整します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_3']
  },
  liga: {
    name: '標準合字',
    description: 'fiやflなど、既定の文字列を合字として置換します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_7']
  },
  lnum: {
    name: 'リニア数字',
    description: '数字を等幅のロング型（線形）配置へ置き換えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  locl: {
    name: 'ローカライズ',
    description: '言語や地域ごとの字形差し替えを行います。',
    category: 'フォント固有',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_10']
  },
  mark: {
    name: 'マーク配置',
    description: '基底文字と上付き記号の位置を調整します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_f']
  },
  medi: {
    name: '中間字形',
    description: 'アラビア文字列の中間位置の字形を選択します。',
    category: '自動',
    note: '文字の位置に応じた形が適用されるため、通常は自動で使われます。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt']
  },
  mkmk: {
    name: '連携記号',
    description: '合成記号を構成する際、記号同士の位置関係を調整します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_f']
  },
  nalt: {
    name: '異体字候補',
    description: '文脈に応じて別の字形候補へ切り替えます。',
    category: 'フォント固有',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  nlck: {
    name: 'ネガティブロック',
    description: '非標準字形のブロッキングと関連ルールを補助します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  numr: {
    name: '上付き数字',
    description: '上付き数字の字形に置き換えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  onum: {
    name: '旧字形数字',
    description: '旧字体の数字字形へ切り替えることがあります。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  ordn: {
    name: '序数接尾辞',
    description: '序数を示す接尾辞の字形を制御します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  pkna: {
    name: '縦形かな',
    description: 'プロポーショナルかな字形の縦方向処理に関係する代替候補です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_zh']
  },
  pnum: {
    name: 'プロポーショナル数字',
    description: '数字の幅を可変にするため、固定幅でなく可変幅字形を選びます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  palt: {
    name: 'プロポーショナル字形',
    description: '文字や約物の幅を環境に応じて揃える代替候補です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  pwid: {
    name: 'プロポーショナル幅',
    description: '文字幅の比例調整を行うための規則です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  qwid: {
    name: '全角数字',
    description: '数字幅を全角基準に合わせます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  rclt: {
    name: '相互参照連結',
    description: 'ラテン文字列を文脈と形状に応じて接続字形へ置換します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_7']
  },
  rlig: {
    name: '任意合字',
    description: '必要に応じて通常の合字セットを適用します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_7']
  },
  ruby: {
    name: 'ルビ',
    description: 'ルビ文字のための代替情報を示します。',
    category: 'フォント固有',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  salt: {
    name: 'スタイル代替',
    description: '用途や見た目に応じた代替字形を選べる機能です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_11']
  },
  sinf: {
    name: '上付き情報',
    description: '上下付き文字の補正を行うための代替字形を扱います。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  smcp: {
    name: 'スモールキャップ',
    description: '小文字を小型の大文字風字形へ置換します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_13']
  },
  ss01: {
    name: 'スタイルセット1',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss02: {
    name: 'スタイルセット2',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss03: {
    name: 'スタイルセット3',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss04: {
    name: 'スタイルセット4',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss05: {
    name: 'スタイルセット5',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss06: {
    name: 'スタイルセット6',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss07: {
    name: 'スタイルセット7',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss08: {
    name: 'スタイルセット8',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss18: {
    name: 'スタイルセット18',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss19: {
    name: 'スタイルセット19',
    description: '同じ文字について別デザインの字形へ切り替えます。変化内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  ss20: {
    name: 'スタイルセット20',
    description: '同じ文字について別デザインの字形へ切り替えます。変え内容はフォントごとに異なる場合があります。',
    category: 'フォント固有',
    note: '同じ文字のフォント内デザインを別パターンへ切り替えるため、具体的な見え方はフォントごとに異なります。',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_17']
  },
  subs: {
    name: '下付き文字',
    description: '文字を下付き位置へ置くための代替字形を選択します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  sups: {
    name: '上付き文字',
    description: '文字を上付き位置へ置くための代替字形を選択します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  tnum: {
    name: '等幅数字',
    description: '数字の幅を揃えた等幅表示用の字形へ置き換えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  trad: {
    name: '伝統字形',
    description: '簡易/繁体など特定の文字系に対して既定とは別の字形を提供します。',
    category: 'フォント固有',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_13']
  },
  twid: {
    name: '全角幅変更',
    description: '文字を全角幅へ寄せるための代替字形を提供します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  vkrn: {
    name: '縦方向カーニング',
    description: '縦組時の上下の字間を調整します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_3']
  },
  vert: {
    name: '縦書き字形',
    description: '文字を縦組み用に代替字形へ切り替えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  vhal: {
    name: '縦書きハンドル位置補正',
    description: '縦書き時の文字の位置・参照情報を補助するための情報です。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/otspec190/chapter2']
  },
  vkna: {
    name: '縦書き和文カナ',
    description: '縦組みでの和文かなの字形を切り替える可能性があります。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_zh']
  },
  vrt2: {
    name: '代替縦書き字形2',
    description: '縦組み用の追加字形への切替を提供します。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  },
  zero: {
    name: '斜線ゼロ',
    description: '数字のゼロを斜線付きの字形へ置き換えます。',
    category: '任意',
    references: ['https://learn.microsoft.com/en-us/typography/opentype/spec/features_1']
  }
};

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
      analysisDate: entry.analysisDate || null,
      analysisMethod: entry.analysisMethod || 'fontTools FeatureList解析（GSUB/GPOS）',
      reason: null
    }
  });
}

function makeFontEntry(base) {
  return {
    ...base,
    attributes: {
      ...base.attributes,
      sourceKind: base.sourceType === 'web' ? 'Webフォント' : 'システムフォント',
      source: base.sourceType === 'web' ? 'Google Fonts' : 'Windows'
    },
    sourceInfo: {
      environment: base.sourceType === 'web' ? 'Webブラウザ' : 'Windows',
      provider: base.sourceType === 'web' ? 'Google Fonts' : 'Microsoft',
      loadingMethod: base.sourceType === 'web' ? 'Google Fonts CSS API' : 'OS標準フォント',
      cssHost: base.sourceType === 'web' ? 'fonts.googleapis.com' : '-',
      fileHost: base.sourceType === 'web' ? 'fonts.gstatic.com' : '-',
      weights: base.sourceType === 'web' ? ['400', '700'] : ['-'],
      sourceUrl: base.sourceType === 'web'
        ? 'https://fonts.google.com/noto/specimen/Noto+Sans+JP'
        : base.sourceUrl
    }
  };
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
  makeFontEntry({
    id: 'noto-sans-jp-web',
    name: 'Noto Sans JP',
    cssFamily: '"Noto Sans JP", sans-serif',
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
    sourceType: 'web',
    fontOrigin: 'Webブラウザ',
    sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+JP',
    openTypeAnalysisState: 'not-analyzed',
    notes: 'Web配信フォント向けに同じ表示形式でOpenType機能を確認します。'
  }),
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

const memoFontMetadata = {
  'segoe-ui': {
    memoCssFamily: '"Segoe UI", "Yu Gothic UI", sans-serif',
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'yu-gothic-ui': {
    memoCssFamily: '"Yu Gothic UI", "Hiragino Sans", Meiryo, system-ui, sans-serif',
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  meiryo: {
    memoCssFamily: 'Meiryo, "Yu Gothic UI", sans-serif',
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'ms-mincho': {
    memoCssFamily: '"ＭＳ 明朝", "MS Mincho", serif',
    categoryType: 'serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  consolas: {
    memoCssFamily: 'Consolas, "Courier New", monospace',
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'cascadia-code': {
    memoCssFamily: '"Cascadia Code", Consolas, monospace',
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'unknown', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'courier-new': {
    memoCssFamily: '"Courier New", Consolas, monospace',
    categoryType: 'monospace',
    recommendedFor: ['code'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'times-new-roman': {
    memoCssFamily: '"Times New Roman", "ＭＳ 明朝", serif',
    categoryType: 'serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
  },
  'noto-sans-jp-web': {
    memoCssFamily: '"Noto Sans JP", sans-serif',
    categoryType: 'sans-serif',
    recommendedFor: ['body', 'heading'],
    languages: { latin: 'supported', japanese: 'supported', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
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
    officialScripts: ['日本語', 'ラテン'],
    license: 'SIL Open Font License 1.1',
    sourceUrl: 'https://fonts.google.com/noto/specimen/Noto+Sans+JP'
  }
};

const openTypeData = window.FontOpenTypeData || { fonts: {} };

function normalizeOpenTypeProfile(fontId) {
  const entry = openTypeData.fonts?.[fontId];
  if (!entry || entry.status !== 'analyzed') {
    return buildOpenTypeProfile(fontId);
  }
  const profile = buildOpenTypeProfile(fontId);
  return {
    ...profile,
    analysis: {
      ...profile.analysis,
      ...Object.fromEntries(
        ['analysisDate', 'analysisMethod', 'faceIndex', 'faceName', 'fileName', 'fontVersion'].map((key) => [
          key,
          profile.analysis?.[key] || null
        ])
      )
    }
  };
}

fonts.forEach((font) => Object.assign(font, memoFontMetadata[font.id], officialFontMetadata[font.id], {
  attributes: {
    ...font.attributes,
    openType: normalizeOpenTypeProfile(font.id)
  },
  metadataConfirmedAt: '2026-08-18'
}));

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
const coverageApi = window.FontCoverage;
const coverageData = window.FontCoverageData;
const memoIntegration = integrationApi.parseMemoNexusParams(location.search, fonts.map((font) => font.id));
const memoNexusPanel = document.getElementById('memoNexusPanel');
const memoNexusContext = document.getElementById('memoNexusContext');
const memoNexusSample = document.getElementById('memoNexusSample');
const memoNexusStatus = document.getElementById('memoNexusStatus');
const recommendedOnly = document.getElementById('recommendedOnly');
const returnToMemoButton = document.getElementById('returnToMemoButton');
const copyFontSettingButton = document.getElementById('copyFontSettingButton');
let selectedMemoFontId = memoIntegration?.currentFontId || null;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isRecommended(font) {
  return Boolean(memoIntegration && font.recommendedFor.includes(memoIntegration.target));
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
  if (!memoIntegration) return items;
  return [...items].sort((a, b) => Number(isRecommended(b)) - Number(isRecommended(a)));
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
        description: definition.description,
        category: definition.category || null,
        note: definition.note || null,
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
const openTypeDialogFeatureList = document.getElementById('openTypeFeatureDialogFeatureList');
const openTypeDialogFeatureDetail = document.getElementById('openTypeFeatureDialogFeatureDetail');
const openTypeDialogClose = document.getElementById('openTypeFeatureDialogClose');
let activeOpenTypeButton = null;
let activeOpenTypeFont = null;

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
  return `
    <div class="open-type-feature-detail-content">
      <p><strong>OpenTypeタグ:</strong> ${escapeHtml(feature.tag)}</p>
      <p><strong>機能名:</strong> ${escapeHtml(feature.name)}</p>
      <p><strong>説明:</strong> ${escapeHtml(feature.description)}</p>
      <p><strong>GSUB/GPOS:</strong> ${escapeHtml(tables || '不明')}</p>
      ${category}
      ${note}
    </div>
  `;
}

function setOpenTypeSelection(chip) {
  if (!chip || !activeOpenTypeFont) return;
  const tag = chip.dataset?.featureTag;
  const font = fonts.find((item) => item.id === activeOpenTypeFont);
  if (!font) return;

  const rows = openTypeFeatureRows(font);
  const selected = rows.find((item) => item.tag === tag);
  if (!selected) return;

  openTypeDialogFeatureList.querySelectorAll('.open-type-feature-chip').forEach((entry) => {
    const isActive = entry.dataset.featureTag === tag;
    entry.classList.toggle('is-selected', isActive);
    entry.setAttribute('aria-selected', String(isActive));
  });
  openTypeDialogFeatureDetail.setAttribute('aria-label', `OpenType機能: ${selected.tag} ${selected.name} の詳細`);
  openTypeDialogFeatureDetail.innerHTML = renderOpenTypeDialogDetail(selected);
}

function openTypeFeatureDialogForFont(font, triggerButton) {
  if (!openTypeDialog) return;
  activeOpenTypeButton = triggerButton || null;
  activeOpenTypeFont = font?.id || null;

  const profile = font?.attributes?.openType || {};
  const meta = profile?.analysis || {};
  const rows = openTypeFeatureRows(font);
  const source = font?.delivery || font?.sourceInfo || {};
  const summaryName = [
    `解析元: ${[meta.fileName, meta.faceName, meta.fontVersion].filter(Boolean).join(' / ') || '未確認'}`,
    `解析日: ${meta.analysisDate || '未確認'}`,
    `解析方法: ${meta.analysisMethod || 'fontToolsによるGSUB／GPOS FeatureList解析'}`,
    `解析ファイルで${profile.totalFeatures || 0}件を確認`,
    `説明付き掲載${rows.length}件`
  ];

  openTypeDialogTitle.textContent = `${font?.name || ''}`;
  openTypeDialogSummary.innerHTML = summaryName.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  openTypeDialogMeta.innerHTML = [
    `<li><strong>利用環境:</strong> ${escapeHtml(source.environment || font?.attributes?.environment || '未確認')}</li>`,
    `<li><strong>提供元:</strong> ${escapeHtml(source.provider || '未確認')}</li>`,
    `<li><strong>読み込み方法:</strong> ${escapeHtml(source.loadingMethod || '未確認')}</li>`,
    `<li><strong>CSS取得先:</strong> ${escapeHtml(source.cssHost || '-')}</li>`,
    `<li><strong>フォントファイル配信先:</strong> ${escapeHtml(source.fileHost || '-')}</li>`,
    `<li><strong>指定ウェイト:</strong> ${(source.weights || ['-']).join(' / ')}</li>`,
    `<li><strong>OpenType解析:</strong> ${profile.verified ? '解析済み' : '未解析'}</li>`,
    `<li><strong>公式情報:</strong> <a href="${escapeHtml(font?.sourceUrl || '')}" target="_blank" rel="noopener noreferrer">${escapeHtml(font?.sourceUrl || '未確認')}</a></li>`
  ].join('');

  if (openTypeDialogFeatureDetail) {
    openTypeDialogFeatureDetail.setAttribute('aria-live', 'polite');
    openTypeDialogFeatureDetail.removeAttribute('aria-label');
  }
  if (openTypeDialogFeatureList) {
    openTypeDialogFeatureList.setAttribute('role', 'listbox');
    openTypeDialogFeatureList.setAttribute('aria-label', `${font?.name || ''}のOpenType機能`);
  }

  if (!profile?.verified) {
    openTypeDialogFeatureList.innerHTML = '';
    openTypeDialogFeatureDetail.innerHTML = `<p class="open-type-feature-empty">${escapeHtml(profile?.analysis?.reason || openTypeUnparsedMessage)}</p>`;
    openTypeDialogFeatureDetail.setAttribute('aria-label', 'OpenType機能: 未確認');
    openTypeDialog.showModal();
    return;
  }

  if (!rows.length) {
    openTypeDialogFeatureList.innerHTML = '';
    openTypeDialogFeatureDetail.innerHTML = `<p class="open-type-feature-empty">${openTypeNoFeatureMessage}</p>`;
    openTypeDialogFeatureDetail.setAttribute('aria-label', 'OpenType機能: 0件');
    openTypeDialog.showModal();
    return;
  }

  openTypeDialogFeatureList.innerHTML = rows
    .map(
      (row) => `
    <button
      type="button"
      class="open-type-feature-chip"
      role="option"
      aria-selected="false"
      data-feature-tag="${row.tag}"
    >${escapeHtml(formatFeatureLabel(row))}</button>
  `
    )
    .join('');

  const firstChip = openTypeDialogFeatureList.querySelector('.open-type-feature-chip');
  if (firstChip) {
    setOpenTypeSelection(firstChip);
  }
  openTypeDialog.showModal();
}

function bindOpenTypeDialogEvents() {
  if (!openTypeDialog || !openTypeDialogClose) return;
  if (!openTypeDialogFeatureList) return;

  openTypeDialog.addEventListener('close', () => {
    if (activeOpenTypeButton) {
      activeOpenTypeButton.focus();
      activeOpenTypeButton = null;
    }
    activeOpenTypeFont = null;
  });

  openTypeDialogClose.addEventListener('click', () => {
    if (openTypeDialog.open) openTypeDialog.close();
  });

  openTypeDialog.addEventListener('cancel', (event) => {
    if (activeOpenTypeFont) {
      event.preventDefault();
      openTypeDialog.close();
    }
  });

  openTypeDialogFeatureList.addEventListener('click', (event) => {
    const chip = event.target.closest('.open-type-feature-chip');
    if (!chip) return;
    setOpenTypeSelection(chip);
  });
}

function coverageMetadata(font) {
  return coverageData?.fonts?.[font.id] || {
    status: 'not-analyzed',
    fileName: null,
    faceName: null,
    fontVersion: null
  };
}

function coverageStatusLabel(coverage) {
  return coverage.status === 'analyzed' ? '解析済み' : '解析未実施';
}

function officialMetadataHtml(font) {
  const coverage = coverageMetadata(font);
  const sourceUrl = escapeHtml(font.sourceUrl);
  const delivery = font.delivery || {};
  return `
    <li>公式に確認した文字体系: ${font.officialScripts.map(escapeHtml).join(' / ')}</li>
    <li>見本文字の収録判定: ${coverageStatusLabel(coverage)}（言語対応とは別のcmap情報）</li>
    <li>取得元: ${escapeHtml(font.delivery?.environment || font.attributes?.environment || '-')}</li>
    <li>配信/読み込み情報: ${escapeHtml(font.delivery?.provider || font.source || '-')} / ${escapeHtml(font.delivery?.loadingMethod || '-')}</li>
    <li>解析フォント: ${escapeHtml(coverage.fontVersion || '未確認')} / ${escapeHtml(coverage.fileName || '未確認')} / ${escapeHtml(coverage.faceName || '内部フェイス未確認')}</li>
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
    unknown.textContent = '収録文字情報は未確認です。未収録とは判定していません。';
    return unknown;
  }
  if (unsupportedCount === 0) return null;
  const legend = document.createElement('p');
  legend.className = 'coverage-legend';
  legend.textContent = '薄い文字は、解析した対象フォントに未収録です。ブラウザが別のフォントによる代替表示を試みます。';
  return legend;
}

function renderSelector() {
  selector.innerHTML = '';
  orderedFonts(fonts).forEach((font) => {
    const label = document.createElement('label');
    label.className = 'font-option';
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(font.id)}" ${state.selectedIds.includes(font.id) ? 'checked' : ''} />
      <span>${escapeHtml(font.name)}</span>
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
    });
    selector.appendChild(label);
  });
}

function renderCards() {
  const selectedFonts = orderedFonts(fonts.filter((font) => {
    if (!state.selectedIds.includes(font.id)) return false;
    return !memoIntegration || !recommendedOnly.checked || isRecommended(font);
  }));

  if (selectedFonts.length === 0) {
    cardGrid.innerHTML = '<div class="empty-state">表示するフォントがありません。選択を増やしてください。</div>';
    return;
  }

  cardGrid.innerHTML = '';
  selectedFonts.forEach((font) => {
    const card = document.createElement('article');
    card.className = `font-card${font.id === selectedMemoFontId ? ' memo-selected' : ''}`;
    card.dataset.fontId = font.id;
    card.style.setProperty('--font-size', `${state.fontSize}px`);
    card.style.setProperty('--font-weight', `${state.fontWeight}`);
    card.style.setProperty('--line-height', `${state.lineHeight}`);
    card.style.setProperty('--letter-spacing', `${state.letterSpacing}px`);
    card.style.setProperty('--sample-font', font.cssFamily);

    card.innerHTML = `
      ${memoIntegration ? `
        <div class="memo-font-choice">
          <span class="recommendation-badge ${isRecommended(font) ? 'recommended' : ''}">
            ${isRecommended(font) ? 'この用途に推奨' : '推奨情報なし'}
          </span>
          <button type="button" class="select-memo-font" data-font-id="${escapeHtml(font.id)}" aria-pressed="${font.id === selectedMemoFontId}">
            ${font.id === selectedMemoFontId ? '選択中' : 'このフォントを選択'}
          </button>
        </div>
      ` : ''}
      <div class="font-card-header">
        <h3 class="font-card-name">${escapeHtml(font.name)}</h3>
        <p class="font-card-category">${escapeHtml(font.category)}</p>
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

    card.querySelector('.select-memo-font')?.addEventListener('click', () => {
      selectedMemoFontId = font.id;
      memoNexusStatus.textContent = `${font.name}を選択しました。内容を確認してMemo Nexusへ戻れます。`;
      renderCards();
    });
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
    if (state.mode === 'detail') {
      const section = document.createElement('section');
      section.className = 'sample-section';
      const heading = document.createElement('h4');
      heading.className = 'section-title';
      heading.textContent = '属性';
      const list = document.createElement('ul');
      list.className = 'attribute-list';
      const details = [
        `公式に確認した文字体系: ${font.officialScripts.join(' / ')}`,
        `文字幅: ${font.attributes.width}`,
        `書体分類: ${font.attributes.classification}`,
        `利用環境: ${font.attributes.environment}`,
        `収録文字データ: ${coverageStatusLabel(coverageMetadata(font))}`
      ];
      for (const detail of details) {
        const item = document.createElement('li');
        item.textContent = detail;
        list.appendChild(item);
      }
      section.append(heading, list);
      sampleArea.appendChild(section);
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

  const canReturn = memoIntegration.errors.length === 0
    && integrationApi.isAllowedReturnUrl(memoIntegration.returnUrl);
  returnToMemoButton.disabled = !canReturn;
  if (!canReturn) {
    const detail = memoIntegration.errors.length
      ? memoIntegration.errors.join(' ')
      : '安全なMemo Nexusの戻り先を確認できません。';
    memoNexusStatus.textContent = `${detail} フォント設定のコピーは利用できます。`;
  }
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // ローカルファイルなどClipboard APIが使えない環境では下の方法を試します。
    }
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.className = 'copy-fallback';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('クリップボードへコピーできませんでした。');
}

function selectedMemoFont() {
  return fonts.find((font) => font.id === selectedMemoFontId);
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
    renderSelector();
    renderCards();
  });

  document.getElementById('clearAllButton').addEventListener('click', () => {
    state.selectedIds = [];
    renderSelector();
    renderCards();
  });

  recommendedOnly.addEventListener('change', renderCards);
  returnToMemoButton.addEventListener('click', () => {
    try {
      location.assign(integrationApi.buildMemoNexusReturnUrl(memoIntegration, selectedMemoFont()));
    } catch (error) {
      memoNexusStatus.textContent = `${error.message} フォント設定をコピーして手動で利用してください。`;
    }
  });
  copyFontSettingButton.addEventListener('click', () => {
    copyText(integrationApi.fontSettingCopyText(memoIntegration, selectedMemoFont()))
      .then(() => {
        memoNexusStatus.textContent = 'フォント設定をコピーしました。';
      })
      .catch((error) => {
        memoNexusStatus.textContent = error.message || 'フォント設定をコピーできませんでした。';
      });
  });
}

initializeMemoIntegration();
renderSelector();
bindControls();
bindOpenTypeDialogEvents();
updateControlLabels();
renderCards();
