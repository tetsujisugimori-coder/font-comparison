const fontComparisonView = document.getElementById('fontComparisonView');
const katexView = document.getElementById('katexView');
const viewButtons = document.querySelectorAll('.view-button');
const copyToast = document.getElementById('copyToast');
let toastTimer;

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function setView(view, updateHash = true) {
  const showKatex = view === 'katex';
  fontComparisonView.hidden = showKatex;
  katexView.hidden = !showKatex;

  viewButtons.forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (updateHash) {
    history.replaceState(null, '', showKatex ? '#katex' : window.location.pathname + window.location.search);
  }
}

function showToast(message, isError = false) {
  window.clearTimeout(toastTimer);
  copyToast.textContent = message;
  copyToast.classList.toggle('error', isError);
  copyToast.hidden = false;
  toastTimer = window.setTimeout(() => {
    copyToast.hidden = true;
  }, 2200);
}

async function copyLatex(latex) {
  try {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await Promise.race([
          navigator.clipboard.writeText(latex),
          new Promise((_, reject) => window.setTimeout(() => reject(new Error('クリップボードが応答しませんでした。')), 800))
        ]);
        copied = true;
      } catch (error) {
        copied = false;
      }
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = latex;
      textarea.setAttribute('readonly', '');
      textarea.className = 'copy-fallback';
      document.body.appendChild(textarea);
      textarea.select();
      copied = document.execCommand('copy');
      textarea.remove();
    }

    if (!copied) throw new Error('コピー操作が許可されませんでした。');
    showToast('LaTeXをコピーしました');
  } catch (error) {
    showToast('コピーできませんでした', true);
  }
}

function renderMath(target, example) {
  target.replaceChildren();

  if (!window.katex) {
    renderMathError(target, example, new Error('KaTeXを読み込めませんでした。ネットワーク接続を確認してください。'));
    return false;
  }

  try {
    window.katex.render(example.latex, target, {
      displayMode: true,
      throwOnError: true,
      strict: 'warn',
      trust: false,
      output: 'htmlAndMathml'
    });
    return true;
  } catch (error) {
    renderMathError(target, example, error);
    return false;
  }
}

function renderMathError(target, example, error) {
  target.classList.add('has-error');
  const heading = createElement('p', 'math-error-title', '数式を表示できませんでした');
  const source = createElement('code', 'math-error-source', example.latex);
  const detail = createElement('p', 'math-error-detail', error.message || '不明なレンダリングエラーです。');
  target.append(heading, source, detail);
}

function renderFontRoles() {
  const container = document.getElementById('katexFontRoles');
  const fragment = document.createDocumentFragment();

  window.katexFontGroups.forEach((font) => {
    const card = createElement('article', 'role-card');
    const header = createElement('div', 'role-card-header');
    header.append(createElement('h3', null, font.name), createElement('span', 'role-label', font.role));

    const examples = createElement('p', 'role-examples');
    examples.append(createElement('strong', null, '文字・記号の例'), document.createTextNode(font.examples));

    const usage = createElement('p', 'role-usage', font.usage);
    const note = createElement('p', 'role-note', '通常の本文フォントではなく、数式内でほかのKaTeXフォントと組み合わせて使われます。');
    card.append(header, examples, usage, note);
    fragment.appendChild(card);
  });

  container.replaceChildren(fragment);
}

function createExampleCard(example) {
  const card = createElement('article', 'math-card');
  card.dataset.exampleId = example.id;

  const header = createElement('header', 'math-card-header');
  header.append(createElement('h3', null, example.title), createElement('p', null, example.description));

  const resultGroup = createElement('div', 'math-result-group');
  resultGroup.appendChild(createElement('p', 'math-field-label', 'KaTeXによる表示結果'));
  const result = createElement('div', 'math-result');
  resultGroup.appendChild(result);

  const sourceGroup = createElement('div', 'latex-source-group');
  const sourceHeader = createElement('div', 'latex-source-header');
  sourceHeader.appendChild(createElement('p', 'math-field-label', '元のLaTeX入力'));
  const copyButton = createElement('button', 'copy-button', 'コピー');
  copyButton.type = 'button';
  copyButton.setAttribute('aria-label', `${example.title}のLaTeXをコピー`);
  copyButton.addEventListener('click', () => copyLatex(example.latex));
  sourceHeader.appendChild(copyButton);
  sourceGroup.append(sourceHeader, createElement('code', 'latex-source', example.latex));

  const fontsGroup = createElement('div', 'primary-fonts');
  fontsGroup.appendChild(createElement('p', 'math-field-label', '主に使用されるフォント'));
  const tags = createElement('div', 'font-tag-row');
  example.primaryFonts.forEach((font) => tags.appendChild(createElement('span', 'font-tag', font)));
  fontsGroup.appendChild(tags);

  card.append(header, resultGroup, sourceGroup, fontsGroup);
  renderMath(result, example);
  return card;
}

function renderExamples() {
  const examplesContainer = document.getElementById('katexExamples');
  const nav = document.getElementById('katexCategoryNav');
  const sections = document.createDocumentFragment();
  const navItems = document.createDocumentFragment();

  const rolesLink = createElement('a', 'category-link', 'フォント群の役割');
  rolesLink.href = '#fontRolesSection';
  navItems.appendChild(rolesLink);

  window.katexCategories.forEach((category) => {
    const section = createElement('section', 'katex-section');
    section.id = `category-${category.id}`;
    section.setAttribute('aria-labelledby', `category-title-${category.id}`);

    const heading = createElement('div', 'section-heading');
    heading.appendChild(createElement('p', 'section-number', category.number));
    const headingText = createElement('div');
    const title = createElement('h2', null, category.title);
    title.id = `category-title-${category.id}`;
    headingText.append(title, createElement('p', null, category.description));
    heading.appendChild(headingText);

    const grid = createElement('div', 'math-card-grid');
    window.katexExamples
      .filter((example) => example.category === category.id)
      .forEach((example) => grid.appendChild(createExampleCard(example)));

    section.append(heading, grid);
    sections.appendChild(section);

    const link = createElement('a', 'category-link', category.title);
    link.href = `#category-${category.id}`;
    navItems.appendChild(link);
  });

  examplesContainer.replaceChildren(sections);
  nav.replaceChildren(navItems);
}

viewButtons.forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view));
});

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#katex' || window.location.hash.startsWith('#category-') || window.location.hash === '#fontRolesSection') {
    setView('katex', false);
  }
});

renderFontRoles();
renderExamples();
const initialHash = window.location.hash;
setView(initialHash === '#katex' || initialHash.startsWith('#category-') || initialHash === '#fontRolesSection' ? 'katex' : 'fonts', false);

window.renderKatexExample = renderMath;
