'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const integrationUtils = fs.readFileSync('integration-utils.js', 'utf8');
const fontFaceDataSource = fs.readFileSync('font-face-data.js', 'utf8');
const katexData = fs.readFileSync('katex-data.js', 'utf8');
const katexPage = fs.readFileSync('katex-page.js', 'utf8');
const { FONT_OPTIONS } = require('./font-recommendation-catalog');

function appFunction(name, nextName) {
  const start = app.indexOf(`function ${name}(`);
  const end = app.indexOf(`\nfunction ${nextName}(`, start);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${nextName} must follow ${name}`);
  return new Function(`${app.slice(start, end)}\nreturn ${name};`)();
}

function appFunctionWithDependencies(name, nextName, dependencies) {
  const start = app.indexOf(`function ${name}(`);
  const end = app.indexOf(`\nfunction ${nextName}(`, start);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${nextName} must follow ${name}`);
  return new Function(...Object.keys(dependencies), `${app.slice(start, end)}\nreturn ${name};`)(...Object.values(dependencies));
}

test('Memo Nexus連携パネルは通常起動時に非表示で戻る操作だけを持つ', () => {
  assert.match(html, /id="memoNexusPanel"[^>]*hidden/);
  assert.match(html, /id="returnToMemoButton"[^>]*>Memo Nexusで使用/);
  assert.doesNotMatch(html, /id="recommendedOnly"/);
  assert.doesNotMatch(html, /この用途への推奨だけ表示/);
  assert.match(html, /integration-utils\.js/);
  assert.match(html, /font-recommendation-catalog\.js[\s\S]*font-recommendation\.js[\s\S]*app\.js/);
});

test('通常・連携モードで共用する単一の条件検索UIを持つ', () => {
  assert.equal((html.match(/id="fontRecommendationForm"/g) || []).length, 1);
  assert.equal((html.match(/id="fontRecommendationResults"/g) || []).length, 1);
  assert.match(html, /<h2 id="fontSearchTitle">条件からフォントを探す<\/h2>/);
  assert.match(html, /使用言語・文章の雰囲気・主な用途を選ぶと、条件に合うフォントを3件表示します。/);
  assert.equal((html.match(/<fieldset>/g) || []).length, 3);
  assert.match(html, /<legend>使用言語<\/legend>/);
  assert.match(html, /<legend>文章の雰囲気<\/legend>/);
  assert.match(html, /<legend>主な用途<\/legend>/);
  for (const name of ['recommendationLanguage', 'recommendationMood', 'recommendationPurpose']) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
  assert.match(html, /id="fontRecommendationResults"[^>]*aria-live="polite"/);
  assert.doesNotMatch(html, /id="recommendFontsButton"/);
  assert.match(app, /fontRecommendationForm\.addEventListener\('change', showRecommendations\)/);
  assert.match(app, /initializeMemoIntegration\(\);\s*showRecommendations\(\);/);
});

test('受け取った比較文章はtextContentまたは安全な文字描画を経由しHTMLとして解釈しない', () => {
  assert.match(app, /memoNexusSample\.textContent = memoIntegration\.sample/);
  assert.match(app, /appendSection\('Memo Nexusの比較文章', memoIntegration\.sample/);
  assert.match(app, /coverageApi\.appendCoverageText/);
  assert.doesNotMatch(app, /memoNexusSample\.innerHTML\s*=/);
});

test('連携モードでは推薦3件を先頭へ並べても全フォントを残し、明示選択後だけ戻す', () => {
  assert.match(app, /state\.selectedIds = fonts\.map/);
  assert.match(app, /recommendationApi\.recommendFonts\(recommendationFonts, recommendationAnswers\(\), 3\)/);
  assert.match(app, /const selectedFonts = orderedFonts\(fonts\.filter\(\(font\) => state\.selectedIds\.includes\(font\.id\)\)\)/);
  assert.match(app, /推薦\$\{recommendation\.rank\}位/);
  assert.match(app, /recommendation\.reasons\.map/);
  assert.match(app, /if \(memoIntegration\) selectMemoFont\(font\);/);
  assert.match(app, /selectedMemoFontId = font\.id/);
  assert.match(app, /location\.assign\(integrationApi\.buildMemoNexusReturnUrl/);
  assert.doesNotMatch(app.slice(app.indexOf('function selectMemoFont('), app.indexOf('\nfunction bindControls(')), /location\.assign/);
});

test('両モードの初期条件は日本語・ニュートラル・長文で、連携targetは用途だけを上書きする', () => {
  assert.match(app, /const targetPurposes = \{ body: 'writing', heading: 'heading', code: 'code' \}/);
  assert.match(html, /name="recommendationLanguage" value="japanese" checked/);
  assert.match(html, /name="recommendationMood" value="neutral" checked/);
  assert.match(html, /name="recommendationPurpose" value="writing" checked/);
  assert.match(app, /initialPurpose\.checked = true/);
});

test('候補とカードはシステムフォントとWebフォントを文字で識別する', () => {
  assert.match(html, /システムフォント[\s\S]*端末にインストール/);
  assert.match(html, /Webフォント[\s\S]*選択後にインターネットから読み込み/);
  assert.match(html, /CSSの後続フォントへフォールバック/);
  assert.match(app, /fontSourceTypeLabel/);
  assert.match(app, /Webフォント' : 'システムフォント/);
  assert.match(css, /\.font-source-badge/);
});

test('Memo NexusのコピーUIと文字列生成は戻さず、KaTeXのコピーUIだけを維持する', () => {
  for (const source of [html, app, css, integrationUtils]) {
    assert.doesNotMatch(source, /copyFontSettingButton|fontSettingCopyPreview|fontSettingCopyText/);
  }
  assert.doesNotMatch(app, /navigator\.clipboard|execCommand\(['"]copy/);
  assert.doesNotMatch(html, /フォント指定をコピー|コピー内容：用途/);
  assert.doesNotMatch(css, /\.copy-content-label/);
  assert.match(html, /id="copyToast" class="copy-toast"/);
  assert.match(katexPage, /navigator\.clipboard\.writeText\(latex\)/);
  assert.match(katexPage, /document\.execCommand\('copy'\)/);
  assert.match(css, /\.copy-toast[\s\S]*\.copy-fallback/);
  assert.match(app, /比較は続けられますが、Memo Nexusへ戻ることはできません。/);
  assert.match(app, /比較状態は保持しています。連携URLを確認してください。/);
});

test('通常モードの検索候補は既存比較状態へ追加し、候補外フォントを維持する', () => {
  assert.match(app, /if \(!state\.selectedIds\.includes\(font\.id\)\) state\.selectedIds\.push\(font\.id\)/);
  assert.match(app, /else selectComparisonFont\(font\)/);
  assert.match(app, /比較対象に追加済み/);
  assert.match(app, /比較対象に追加/);
  assert.doesNotMatch(app, /state\.selectedIds\s*=\s*currentRecommendations/);
});

test('未確認情報を未対応と断定せず公式メタデータと分けて表示する', () => {
  assert.match(app, /languages: \{ latin: 'supported', japanese: 'unknown', simplifiedChinese: 'unknown', traditionalChinese: 'unknown', korean: 'unknown' \}/);
  assert.match(app, /SIL Open Font License 1\.1/);
  assert.match(app, /Microsoft製品付属（再配布は別途ライセンス確認）/);
  assert.match(app, /収録文字情報は未確認です。通常濃度の文字も収録済みとは判定していません。/);
  assert.match(app, /公式情報:/);
});

test('推薦契約をカード表示メタデータから分離し、Memo Nexus順の18件を検索だけに使う', () => {
  assert.equal(FONT_OPTIONS.length, 18);
  assert.match(app, /const fontCardSupplementalMetadata =/);
  assert.match(app, /const recommendationMetadataById = new Map/);
  assert.match(app, /const recommendationFonts = recommendationCatalog\.map/);
  assert.match(app, /return \{ \.\.\.font, \.\.\.metadata \}/);
  assert.match(app, /memoCssFamily: recommendationMetadata\.memoCssFamily/);
});

test('Memo Nexusカードの条件検索言語は推薦契約の4区分を表示し、カード解析情報と分離する', () => {
  const recommendationLanguageInfoText = appFunctionWithDependencies('recommendationLanguageInfoText', 'orderedFonts', {
    recommendationMetadataById: new Map(FONT_OPTIONS.map((font) => [font.id, font])),
    languageStatusLabel: (value) => ({ supported: '対応', partial: '一部対応', unsupported: '非対応', unknown: '未確認' }[value] || '未確認')
  });

  assert.equal(
    recommendationLanguageInfoText({ id: 'segoe-ui' }),
    '条件検索の言語区分：ラテン 対応 / 日本語 一部対応 / 簡体字 未確認 / 繁体字 未確認'
  );
  assert.equal(
    recommendationLanguageInfoText({ id: 'cascadia-code' }),
    '条件検索の言語区分：ラテン 対応 / 日本語 非対応 / 簡体字 非対応 / 繁体字 非対応'
  );
  assert.match(app, /\$\{officialMetadataHtml\(font\)\}[\s\S]*recommendationLanguageInfoText\(font\)/);
  assert.doesNotMatch(app.slice(app.indexOf('function recommendationLanguageInfoText('), app.indexOf('\nfunction orderedFonts(')), /font\.languages|korean|韓国語/);
});

test('収録判定データと文字判定スクリプトをapp.jsより先に読み込む', () => {
  assert.match(html, /font-coverage-data\.js[\s\S]*font-coverage\.js[\s\S]*app\.js/);
});

test('解析証拠の詳細JSは起動時に読み込まず、許可済みローダーでダイアログ表示後にだけ取得する', () => {
  assert.match(html, /font-opentype-data\.js[\s\S]*analysis-details-loader\.js[\s\S]*app\.js/);
  assert.doesNotMatch(html, /analysis-details\/[\w-]+\.js/);
  assert.match(app, /FontAnalysisDetailsLoader\.load\(fontId, profile\.analysis\.detailSchemaVersion\)/);
  assert.match(app, /解析詳細を読み込んでいます。/);
  assert.match(app, /data-retry-analysis-detail/);
  assert.match(app, /activeOpenTypeDetailRequest/);
  assert.match(app, /requestId !== activeOpenTypeDetailRequest/);
  assert.match(app, /解析詳細データはありません。/);
});

test('通常・固定マス・実幅枠へ同じ文字判定を適用する', () => {
  assert.match(app, /state\.mode === 'fixed'[\s\S]*appendCoverageText/);
  assert.match(app, /state\.mode === 'width'[\s\S]*appendCoverageText/);
  assert.match(app, /for \(const section of samples\.normal\)[\s\S]*appendSection/);
  assert.doesNotMatch(app, /state\.mode === 'detail'/);
  assert.match(css, /\.unsupported-glyph\s*\{[\s\S]*opacity:\s*0\.3/);
});

test('通常モードの初期3カードと3表示モードを維持し、詳細モードを削除する', () => {
  assert.match(app, /selectedIds: \['segoe-ui', 'yu-gothic-ui', 'consolas'\]/);
  for (const mode of ['normal', 'fixed', 'width']) {
    assert.match(html, new RegExp(`data-mode="${mode}"`));
  }
  assert.doesNotMatch(html, /data-mode="detail"/);
  assert.doesNotMatch(app, /詳細用/);
});

test('凡例は未収録がある解析済みカードだけに出し、未解析は未確認とする', () => {
  assert.match(app, /if \(coverage\.status !== 'analyzed'\)[\s\S]*収録文字情報は未確認/);
  assert.match(app, /if \(unsupportedCount === 0\) return null/);
  assert.match(app, /薄い文字は、解析した対象フォントに未収録です。ブラウザが別のフォントによる代替表示を試みます。/);
  assert.doesNotMatch(app, /別のフォントで代替表示されています。/);
});

test('MS Minchoは通常カードの属性欄で等幅属性を表示する', () => {
  assert.match(app, /id: 'ms-mincho',[\s\S]*?width: '等幅'/);
  assert.match(app, /font\.attributes\.width/);
  assert.match(app, /function coverageStatusLabel\(coverage\)/);
  assert.match(app, /収録文字データ: \$\{coverageStatusLabel\(coverage\)\}/);
});

test('KaTeXの51用例と表示切替処理を維持する', () => {
  assert.equal((katexData.match(/\{ id: '[^']+', category:/g) || []).length, 51);
  assert.match(katexPage, /viewButtons\.forEach/);
  assert.match(katexPage, /setView\(isKatexHash\(window\.location\.hash\) \? 'katex' : 'fonts'/);
});

test('連携UIは狭幅とOSダークモードへ対応する', () => {
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /@media \(max-width: 699px\)[\s\S]*?\.memo-integration-panel/);
  assert.match(css, /\.font-search-panel/);
  assert.match(css, /\.recommendation-badge\.recommended/);
});

test('OpenType機能はカードの展開トグルではなく共通ダイアログへ変更されている', () => {
  assert.doesNotMatch(app, /openTypeFeaturePanels/);
  assert.doesNotMatch(app, /open-type-toggle/);
  assert.match(app, /openTypeFeatureDialog/);
  assert.match(app, /openTypeFeatureDialogForFont/);
  assert.match(app, /openTypeFeatureRows\(font\)/);
  assert.match(app, /aria-controls="openTypeFeatureDialog"/);
  assert.match(app, /OpenType機能の詳細/);
});

test('OpenType機能は共通辞書で公開され、未確認タグは掲載しない', () => {
  assert.match(app, /openTypeFeatureDefinitions/);
  assert.match(app, /任意/);
  assert.match(app, /自動/);
  assert.match(app, /フォント固有/);
  assert.doesNotMatch(app, /説明未確認/);
  assert.doesNotMatch(app, /未確認のみを/);
  assert.match(app, /openTypeUnparsedMessage =/);
  assert.match(app, /openTypeNoFeatureMessage =/);
});

test('Webフォントも同じカード構造でOpenType情報を扱う', () => {
  assert.match(app, /'noto-sans-jp-web'/);
  assert.match(app, /sourceType: 'web'/);
  assert.match(app, /fontOrigin: 'Webブラウザ'/);
  assert.match(app, /sourceType: 'system'/);
  assert.match(app, /font\.attributes\.sourceKind/);
  assert.match(app, /const webFontCatalog =/);
  assert.match(app, /noto-sans-jp-web/);
});

test('WeightとStyleは全カード共通の個別フェイス情報として表示し、重複するFont Family行は出力しない', () => {
  assert.match(app, /fontFace: createFontFaceProfile\(font\)/);
  assert.match(app, /Weight:/);
  assert.match(app, /Style:/);
  assert.match(app, /function createFontFaceProfile\(font\)/);
  assert.match(app, /function fontVariantInfoRows\(font\)/);
  assert.doesNotMatch(app, /Font Family:/);
  assert.match(app, /const fontFaceData = window\.FontFaceData/);
  assert.match(app, /const analyzed = fontFaceData\.fonts\?\.\[font\.id\]/);
  assert.match(app, /configuredWeights: webFont\.weights/);
  assert.match(app, /function webFontVariantInfoRows\(font\)/);
  assert.doesNotMatch(app, /noto-sans-jp-web[\s\S]*?if \(font\.id === 'noto-sans-jp-web'\)/);
});

test('追加Webフォントは共通カタログで定義し、初期HTMLでは先行読込しない', () => {
  const webFontIds = ['noto-sans-jp-web', 'noto-serif-jp-web', 'noto-sans-sc-web', 'noto-sans-tc-web', 'source-han-sans-web', 'inter-web', 'ibm-plex-sans-web', 'jetbrains-mono-web', 'zen-kaku-gothic-new-web', 'shippori-mincho-web'];
  const catalog = app.slice(app.indexOf('const webFontCatalog ='), app.indexOf('\nfunction makeFontEntry'));
  for (const id of webFontIds) {
    assert.match(app, new RegExp(`'${id}'`));
  }
  assert.doesNotMatch(catalog, /memoCssFamily:/);
  assert.equal(FONT_OPTIONS.filter((font) => font.sourceType === 'web').length, 10);
  assert.doesNotMatch(html, /family=Noto\+Sans\+JP/);
  assert.match(app, /function loadWebFont\(font/);
  assert.match(app, /document\.createElement\('link'\)/);
  assert.match(app, /new FontFace\(font\.webFont\.family/);
  assert.match(app, /webFontLoadStates/);
});

test('Webフォントの読み込み中・失敗・再試行と、選択済みフォントだけの読込を表示する', () => {
  assert.match(app, /読み込み中/);
  assert.match(app, /読込失敗/);
  assert.match(app, /再試行/);
  assert.match(app, /requestSelectedWebFonts/);
  assert.match(app, /if \(event\.target\.checked\) explicitlyRequestWebFont\(font\)/);
  assert.match(app, /web-font-status/);
  assert.match(css, /\.web-font-notice/);
  assert.match(app, /webFontFacePromises\.delete\(key\)/);
  assert.match(app, /explicitlyRequestedWebFonts/);
  assert.match(app, /coverageLoadText\(font\)/);
  assert.doesNotMatch(app, /document\.fonts\.load\([^\n]+, 'A'\)/);
});

test('Webフォントの言語別注意とSource Han Sans CNの地域別字形を明示する', () => {
  assert.match(app, /簡体字向け/);
  assert.match(app, /繁体字向け/);
  assert.match(app, /Source Han Sans CN/);
  assert.match(app, /地域別字形/);
  assert.match(app, /日本語・中国語は別フォントへフォールバック/);
  assert.match(app, /JetBrains Mono/);
});

test('Windows実フォントの生成データはWeightを順序付きで集約し、TTC faceIndexと専用Italicを保持する', () => {
  const context = { window: {} };
  require('node:vm').runInNewContext(fontFaceDataSource, context);
  const data = context.window.FontFaceData;
  assert.deepEqual([...data.fonts['segoe-ui'].availableWeights], [300, 350, 400, 600, 700, 900]);
  assert.equal(data.fonts['segoe-ui'].family, 'Segoe UI');
  assert.equal(data.fonts['segoe-ui'].sources[0].family, 'Segoe UI');
  assert.deepEqual([...data.fonts['yu-gothic-ui'].availableStyles].map((style) => style.value), ['normal']);
  assert.equal(data.fonts['meiryo'].sources.some((source) => source.fileName === 'meiryo.ttc' && source.faceIndex === 1), true);
  assert.equal(data.fonts.consolas.availableStyles.some((style) => style.value === 'italic' && style.native), true);
  assert.equal(data.fonts['cascadia-code'].status, 'not-analyzed');
  assert.match(data.fonts['segoe-ui'].verification.label, /この検証環境（Windows）で確認済み/);
});

test('Weight・Style情報は既存の属性リストと狭幅対応を使い、確認範囲を区別してItalicを推測表示しない', () => {
  assert.match(app, /fontVariantInfoRows\(font\)/);
  assert.match(css, /\.font-card\s*\{[\s\S]*?min-width:\s*0/);
  assert.match(css, /\.attribute-list li\s*\{[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(app, /Italic対応/);
  assert.match(html, /font-face-data\.js[\s\S]*app\.js/);
  assert.match(fontFaceDataSource, /この検証環境（Windows）で確認済み/);
  assert.match(fs.readFileSync('font-metadata.js', 'utf8'), /このアプリで読み込み確認済み/);
});

test('Webフォントは解析済みの見本文字で読込を確認し、実行時成功だけを表示する', () => {
  assert.match(app, /coverageApi\.codepointStatus\(font\.id, codepoint, coverageData\) !== 'supported'/);
  assert.match(app, /読み込み対象:/);
  assert.match(app, /解析ファイルで確認:/);
  assert.match(app, /読み込み成功:/);
  assert.match(app, /読み込み失敗:/);
  assert.match(app, /ファミリー全体: 未確認/);
  assert.doesNotMatch(app, /loadedWeights: webFont\.weights/);
});

test('初期候補表示・条件変更・連携の全カード表示はWebフォント取得を誘発しない', () => {
  assert.match(app, /state\.selectedIds = fonts\.map/);
  assert.match(app, /requestWebFontsForSelectedIds\(fonts, state\.selectedIds, explicitlyRequestedWebFonts, loadWebFont\)/);
  const recommendationFlow = app.slice(app.indexOf('function showRecommendations('), app.indexOf('\nfunction openTypeFeatureRows('));
  assert.doesNotMatch(recommendationFlow, /loadWebFont|explicitlyRequestWebFont/);
  assert.match(app, /fontRecommendationForm\.addEventListener\('change', showRecommendations\)/);
});

test('Memo Nexusの明示選択は対象Webフォントへ毎回判断を委譲し、システムフォントは要求しない', () => {
  const requestExplicitWebFont = appFunction('requestExplicitWebFont', 'explicitlyRequestWebFont');
  const requested = new Set();
  const calls = [];
  const load = (font) => {
    calls.push(font.id);
    return Promise.resolve();
  };
  const notoSansJp = { id: 'noto-sans-jp-web', webFont: {} };
  const sourceHan = { id: 'source-han-sans-web', webFont: {} };
  const system = { id: 'segoe-ui' };

  assert.deepEqual(requestExplicitWebFont(notoSansJp, requested, load).isWebFont, true);
  assert.deepEqual([...requested], ['noto-sans-jp-web']);
  assert.deepEqual(calls, ['noto-sans-jp-web']);
  assert.deepEqual(requestExplicitWebFont(notoSansJp, requested, load).isWebFont, true);
  assert.deepEqual(calls, ['noto-sans-jp-web', 'noto-sans-jp-web']);
  assert.equal(requestExplicitWebFont(system, requested, load).isWebFont, false);
  assert.deepEqual(calls, ['noto-sans-jp-web', 'noto-sans-jp-web']);
  requestExplicitWebFont(sourceHan, requested, load);
  assert.deepEqual([...requested], ['noto-sans-jp-web', 'source-han-sans-web']);
  assert.deepEqual(calls, ['noto-sans-jp-web', 'noto-sans-jp-web', 'source-han-sans-web']);
});

test('loadWebFontは現在の要求を満たすerrorを通信なしで復旧し、不足Weightだけを取得する', async () => {
  const missingWebFontWeights = appFunction('missingWebFontWeights', 'loadWebFont');
  const states = new Map();
  const requests = [];
  const font = { id: 'noto-sans-jp-web', webFont: {} };
  let selectorRenders = 0;
  let cardRenders = 0;
  let fail700 = false;
  let active = { status: 'error', loadedWeights: new Set([400]), error: new Error('700 failed') };
  let requiredWeights = [400];
  const loadWebFont = appFunctionWithDependencies('loadWebFont', 'requestExplicitWebFont', {
    webFontState: () => active,
    requestedWebFontWeights: () => requiredWeights,
    missingWebFontWeights,
    webFontLoadStates: states,
    renderSelector: () => { selectorRenders += 1; },
    renderCards: () => { cardRenders += 1; },
    loadWebFontWeight: async (_font, weight) => {
      requests.push(weight);
      if (fail700 && weight === 700) throw new Error('700 failed');
    }
  });

  assert.deepEqual(missingWebFontWeights(requiredWeights, active.loadedWeights), []);
  await loadWebFont(font);
  active = states.get(font.id);
  assert.equal(active.status, 'loaded');
  assert.deepEqual([...active.loadedWeights], [400]);
  assert.equal(active.error, null);
  assert.deepEqual(requests, []);
  assert.equal(selectorRenders, 1);
  assert.equal(cardRenders, 1);

  const recoveryState = active;
  assert.deepEqual(missingWebFontWeights(requiredWeights, active.loadedWeights), []);
  await loadWebFont(font);
  assert.strictEqual(states.get(font.id), recoveryState);
  assert.deepEqual(requests, []);
  assert.equal(selectorRenders, 1);
  assert.equal(cardRenders, 1);

  requiredWeights = [400, 700];
  assert.deepEqual(missingWebFontWeights(requiredWeights, active.loadedWeights), [700]);
  await loadWebFont(font);
  active = states.get(font.id);
  assert.deepEqual(requests, [700]);
  assert.equal(active.status, 'loaded');
  assert.deepEqual([...active.loadedWeights], [400, 700]);
  assert.equal(active.error, null);

  const inFlight = Promise.resolve();
  active = { status: 'loading', loadedWeights: new Set([400]), promise: inFlight };
  const stateBeforeLoading = states.get(font.id);
  assert.strictEqual(loadWebFont(font), inFlight);
  assert.strictEqual(states.get(font.id), stateBeforeLoading);
  assert.deepEqual(requests, [700]);

  active = { status: 'error', loadedWeights: new Set([400]), error: new Error('network') };
  requiredWeights = [400, 700];
  fail700 = true;
  await loadWebFont(font);
  active = states.get(font.id);
  assert.equal(active.status, 'error');
  assert.deepEqual(requests, [700, 700]);
  assert.deepEqual([...active.loadedWeights], [400]);
  assert.match(active.error.message, /700 failed/);

  fail700 = false;
  await loadWebFont(font);
  active = states.get(font.id);
  assert.deepEqual(requests, [700, 700, 700]);
  assert.equal(active.status, 'loaded');
  assert.deepEqual([...active.loadedWeights], [400, 700]);
  assert.equal(active.error, null);
});

test('明示選択済みのWebフォントだけがWeight変更時の追加読込対象になる', () => {
  const requestWebFontsForSelectedIds = appFunction('requestWebFontsForSelectedIds', 'requestSelectedWebFonts');
  const fonts = [
    { id: 'noto-sans-jp-web', webFont: {} },
    { id: 'source-han-sans-web', webFont: {} },
    { id: 'segoe-ui' }
  ];
  const calls = [];
  requestWebFontsForSelectedIds(
    fonts,
    fonts.map((font) => font.id),
    new Set(),
    (font) => calls.push(font.id)
  );
  assert.deepEqual(calls, []);
  requestWebFontsForSelectedIds(
    fonts,
    fonts.map((font) => font.id),
    new Set(['noto-sans-jp-web']),
    (font) => calls.push(font.id)
  );
  assert.deepEqual(calls, ['noto-sans-jp-web']);
  assert.match(app, /function requestedWebFontWeights\(font\)[\s\S]*new Set\(\[400, state\.fontWeight\]\)/);
  assert.match(app, /missingWebFontWeights\(requestedWebFontWeights\(font\), current\.loadedWeights\)/);
});

test('通常候補とMemo Nexusの選択操作は共通の明示読込処理を通す', () => {
  assert.match(app, /const request = explicitlyRequestWebFont\(font\);/);
  assert.match(app, /function selectComparisonFont\(font\)[\s\S]*explicitlyRequestWebFont\(font\)/);
  assert.match(app, /Webフォントの読込状態はカードに表示します。/);
  assert.match(app, /if \(event\.target\.checked\) explicitlyRequestWebFont\(font\);/);
  assert.match(app, /requestWebFontsForSelectedIds\(fonts, state\.selectedIds, explicitlyRequestedWebFonts, loadWebFont\)/);
});

test('OpenType機能ダイアログにはボタン、一覧、説明欄の要素があり、同一ダイアログを再利用する', () => {
  assert.match(html, /id="openTypeFeatureDialog"/);
  assert.match(html, /openTypeFeatureDialogSummary/);
  assert.match(html, /openTypeFeatureDialogMeta/);
  assert.match(html, /openTypeFeatureDialogFeatureList/);
  assert.match(html, /openTypeFeatureDialogFeatureDetail/);
  assert.match(app, /openTypeFeatureDialogForFont\(font, openTypeButton\)/);
  assert.match(html, /opentype-dialog\.js[\s\S]*app\.js/);
  assert.match(app, /OpenTypeDialog\.createController/);
  assert.match(app, /aria-pressed="false"/);
  assert.doesNotMatch(app, /role="option"/);
  assert.doesNotMatch(app, /role', 'listbox/);
  assert.match(css, /\.open-type-feature-button/);
  assert.match(css, /\.open-type-dialog/);
});

test('ダイアログは指定された情報順とGoogle Fontsの注意書きを持つ', () => {
  const metaPosition = html.indexOf('openTypeFeatureDialogMeta');
  const filesPosition = html.indexOf('openTypeFeatureDialogFiles');
  const summaryPosition = html.indexOf('openTypeFeatureDialogSummary');
  const listPosition = html.indexOf('openTypeFeatureDialogFeatureList');
  const detailPosition = html.indexOf('openTypeFeatureDialogFeatureDetail');
  const notePosition = html.indexOf('openTypeFeatureDialogDisclaimer');
  const officialPosition = html.indexOf('openTypeFeatureDialogOfficial');
  assert.ok(metaPosition < filesPosition && filesPosition < summaryPosition);
  assert.ok(summaryPosition < listPosition && listPosition < detailPosition);
  assert.ok(detailPosition < notePosition && notePosition < officialPosition);
  assert.match(app, /Google FontsのCSSに定義された複数の配信ファイルを解析し/);
  assert.match(app, /CSS取得日/);
  assert.match(app, /User-Agent/);
  assert.match(app, /確認できたOpenType機能数/);
  assert.match(app, /フォントバージョン/);
  assert.match(app, /meta\.caveat/);
});

test('cmap収録情報とOpenType情報を分離し、内部フェイスの未確認表示をしない', () => {
  assert.doesNotMatch(app, /解析フォント:/);
  assert.doesNotMatch(app, /内部フェイス未確認/);
  assert.match(app, /文字収録判定の解析元/);
  assert.match(app, /webCoverageAnalysisRows/);
  assert.match(app, /shouldDisplayInternalFace/);
  assert.match(html, /font-metadata\.js[\s\S]*app\.js/);
});

test('OpenType機能辞書は公式Registered Featuresページだけを参照する', () => {
  for (const page of ['features_ae', 'features_fj', 'features_ko', 'features_pt', 'features_uz']) {
    assert.match(app, new RegExp(page));
  }
  assert.doesNotMatch(app, /features_(?:[0-9]+|zh)(?:['"/])/);
  assert.doesNotMatch(app, /unicode\.org\/standard\/reports\/tr11/);
  for (const officialName of [
    'Alternative Fractions',
    'Small Capitals From Capitals',
    'Contextual Alternates',
    'Case-Sensitive Forms',
    'Glyph Composition / Decomposition',
    'Capital Spacing',
    'Required Contextual Alternates',
    'Required Ligatures',
    'Alternate Vertical Half Metrics'
  ]) {
    assert.match(app, new RegExp(officialName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(app, /変え内容/);
});
