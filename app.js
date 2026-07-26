const fonts = [
  {
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
      features: []
    },
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  },
  {
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
      features: []
    },
    notes: '小さいサイズや細いウェイトでは、文字が薄く見える場合があります。'
  },
  {
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
      features: []
    },
    notes: '文字が比較的大きく、文章によっては密度が高く見える場合があります。'
  },
  {
    id: 'ms-mincho',
    name: 'MS Mincho',
    cssFamily: '"ＭＳ 明朝", "MS Mincho", serif',
    category: '明朝体 / セリフ',
    impression: ['古典的', '落ち着いた', '印刷物風'],
    uses: ['日本語本文', '印刷', '長文'],
    attributes: {
      supports: ['基本ラテン対応', '日本語対応', 'Windows標準'],
      width: 'プロポーショナル',
      classification: '明朝体 / セリフ',
      environment: 'Windows標準',
      features: []
    },
    notes: '画面上の小さいサイズでは、細い線が見えにくい場合があります。'
  },
  {
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
      features: []
    },
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  },
  {
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
      features: []
    },
    notes: '環境によってはインストールされていない可能性があります。'
  },
  {
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
      features: []
    },
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  },
  {
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
      features: []
    },
    notes: '日本語や中国語部分ではフォールバックが発生する可能性があります。'
  }
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
    languages: { latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' }
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
  }
};

fonts.forEach((font) => Object.assign(font, memoFontMetadata[font.id], {
  license: '未確認',
  sourceUrl: ''
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

function renderSelector() {
  selector.innerHTML = '';
  orderedFonts(fonts).forEach((font) => {
    const label = document.createElement('label');
    label.className = 'font-option';
    label.innerHTML = `
      <input type="checkbox" value="${font.id}" ${state.selectedIds.includes(font.id) ? 'checked' : ''} />
      <span>${font.name}</span>
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
          <button type="button" class="select-memo-font" data-font-id="${font.id}" aria-pressed="${font.id === selectedMemoFontId}">
            ${font.id === selectedMemoFontId ? '選択中' : 'このフォントを選択'}
          </button>
        </div>
      ` : ''}
      <div class="font-card-header">
        <h3 class="font-card-name">${font.name}</h3>
        <p class="font-card-category">${font.category}</p>
      </div>
      <div class="sample-area">
        ${renderSampleContent(font)}
      </div>
      <div class="card-footer">
        <div class="footer-block">
          <h4>印象</h4>
          <div class="tag-row">
            ${font.impression.map((item) => `<span class="tag">${item}</span>`).join('')}
          </div>
        </div>
        <div class="footer-block">
          <h4>向いている用途</h4>
          <div class="tag-row">
            ${font.uses.map((item) => `<span class="tag">${item}</span>`).join('')}
          </div>
        </div>
        <div class="footer-block">
          <h4>属性</h4>
          <ul class="attribute-list">
            <li>対応文字: ${font.attributes.supports.join(' / ')}</li>
            <li>文字幅: ${font.attributes.width}</li>
            <li>書体分類: ${font.attributes.classification}</li>
            <li>利用環境: ${font.attributes.environment}</li>
            <li>フォント機能: ${font.attributes.features.length > 0 ? font.attributes.features.join(' / ') : '未調査'}</li>
            ${memoIntegration ? `
              <li>言語情報: ラテン ${languageStatusLabel(font.languages.latin)} / 日本語 ${languageStatusLabel(font.languages.japanese)} / 簡体字 ${languageStatusLabel(font.languages.simplifiedChinese)} / 繁体字 ${languageStatusLabel(font.languages.traditionalChinese)} / 韓国語 ${languageStatusLabel(font.languages.korean)}</li>
              <li>ライセンス: ${font.license}</li>
              <li>配布元URL: ${font.sourceUrl || '未確認'}</li>
            ` : ''}
          </ul>
        </div>
        <div class="footer-block">
          <h4>注意点</h4>
          <p class="notes">${font.notes}</p>
        </div>
      </div>
    `;

    card.querySelector('.select-memo-font')?.addEventListener('click', () => {
      selectedMemoFontId = font.id;
      memoNexusStatus.textContent = `${font.name}を選択しました。内容を確認してMemo Nexusへ戻れます。`;
      renderCards();
    });
    cardGrid.appendChild(card);
  });
}

function renderSampleContent(font) {
  const memoSample = memoIntegration?.sample
    ? `
      <section class="sample-section memo-passed-sample">
        <h4 class="section-title">Memo Nexusの比較文章</h4>
        <div class="sample-text">${escapeHtml(memoIntegration.sample)}</div>
      </section>
    `
    : '';

  if (state.mode === 'fixed') {
    const chars = ['あ', '漢', 'A', 'g', '0', '1', 'i', 'W'];
    return `${memoSample}
      <div class="fixed-grid">
        ${chars.map((char) => `<div class="fixed-cell">${char}</div>`).join('')}
      </div>
    `;
  }

  if (state.mode === 'width') {
    const rows = ['iiiiiiiiii', 'WWWWWWWWWW', '1234567890'];
    return `${memoSample}
      <div class="sample-text">
        ${rows.map((row) => `<div class="width-line">${Array.from(row).map((char) => `<span class="width-char">${char}</span>`).join('')}</div>`).join('')}
      </div>
    `;
  }

  if (state.mode === 'detail') {
    return `${memoSample}
      ${samples.normal.map((section) => `
        <section class="sample-section">
          <h4 class="section-title">${section.title}</h4>
          <div class="sample-text"${section.lang ? ` lang="${section.lang}"` : ''}>${section.text}</div>
        </section>
      `).join('')}
      <section class="sample-section">
        <h4 class="section-title">属性</h4>
        <ul class="attribute-list">
          <li>対応文字: ${font.attributes.supports.join(' / ')}</li>
          <li>文字幅: ${font.attributes.width}</li>
          <li>書体分類: ${font.attributes.classification}</li>
          <li>利用環境: ${font.attributes.environment}</li>
          <li>フォント機能: ${font.attributes.features.length > 0 ? font.attributes.features.join(' / ') : '未調査'}</li>
        </ul>
      </section>
    `;
  }

  return `${memoSample}
    ${samples.normal.map((section) => `
      <section class="sample-section">
        <h4 class="section-title">${section.title}</h4>
        <div class="sample-text"${section.lang ? ` lang="${section.lang}"` : ''}>${section.text}</div>
      </section>
    `).join('')}
  `;
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
updateControlLabels();
renderCards();
