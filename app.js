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

function renderSelector() {
  selector.innerHTML = '';
  fonts.forEach((font) => {
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
  const selectedFonts = fonts.filter((font) => state.selectedIds.includes(font.id));

  if (selectedFonts.length === 0) {
    cardGrid.innerHTML = '<div class="empty-state">表示するフォントがありません。選択を増やしてください。</div>';
    return;
  }

  cardGrid.innerHTML = '';
  selectedFonts.forEach((font) => {
    const card = document.createElement('article');
    card.className = 'font-card';
    card.style.setProperty('--font-size', `${state.fontSize}px`);
    card.style.setProperty('--font-weight', `${state.fontWeight}`);
    card.style.setProperty('--line-height', `${state.lineHeight}`);
    card.style.setProperty('--letter-spacing', `${state.letterSpacing}px`);
    card.style.setProperty('--sample-font', font.cssFamily);

    card.innerHTML = `
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
          </ul>
        </div>
        <div class="footer-block">
          <h4>注意点</h4>
          <p class="notes">${font.notes}</p>
        </div>
      </div>
    `;

    cardGrid.appendChild(card);
  });
}

function renderSampleContent(font) {
  if (state.mode === 'fixed') {
    const chars = ['あ', '漢', 'A', 'g', '0', '1', 'i', 'W'];
    return `
      <div class="fixed-grid">
        ${chars.map((char) => `<div class="fixed-cell">${char}</div>`).join('')}
      </div>
    `;
  }

  if (state.mode === 'width') {
    const rows = ['iiiiiiiiii', 'WWWWWWWWWW', '1234567890'];
    return `
      <div class="sample-text">
        ${rows.map((row) => `<div class="width-line">${Array.from(row).map((char) => `<span class="width-char">${char}</span>`).join('')}</div>`).join('')}
      </div>
    `;
  }

  if (state.mode === 'detail') {
    return `
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

  return `
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
}

renderSelector();
bindControls();
updateControlLabels();
renderCards();
