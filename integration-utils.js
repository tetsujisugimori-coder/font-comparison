(function (globalScope) {
  'use strict';

  const MAX_SAMPLE_LENGTH = 700;
  const TARGETS = ['body', 'heading', 'code'];
  const SCOPES = ['global', 'note'];
  const PRODUCTION_MEMO_URL = 'https://tetsujisugimori-coder.github.io/memo/';

  function parseMemoNexusParams(search, fontIds) {
    const params = new URLSearchParams(search);
    if (params.get('mode') !== 'memo-nexus') return null;

    const errors = [];
    const target = params.get('target');
    const scope = params.get('scope') || 'global';
    const currentFontId = params.get('currentFontId');
    if (!TARGETS.includes(target)) errors.push('比較対象が不正です。');
    if (!SCOPES.includes(scope)) errors.push('適用範囲が不正です。');
    if (!fontIds.includes(currentFontId)) errors.push('現在のフォントを確認できません。');

    return {
      source: 'memo-nexus',
      target: TARGETS.includes(target) ? target : 'body',
      scope: SCOPES.includes(scope) ? scope : 'global',
      currentFontId: fontIds.includes(currentFontId) ? currentFontId : fontIds[0],
      returnUrl: String(params.get('returnUrl') || ''),
      sample: String(params.get('sample') || '').slice(0, MAX_SAMPLE_LENGTH),
      memoId: String(params.get('memoId') || '').slice(0, 100),
      errors
    };
  }

  function isAllowedReturnUrl(value) {
    try {
      const url = new URL(value);
      if (url.username || url.password) return false;
      const production = new URL(PRODUCTION_MEMO_URL);
      if (url.origin === production.origin && url.pathname === production.pathname) return true;
      return ['http:', 'https:'].includes(url.protocol)
        && ['localhost', '127.0.0.1'].includes(url.hostname);
    } catch {
      return false;
    }
  }

  function buildMemoNexusReturnUrl(context, font) {
    if (!context || context.errors.length) throw new Error('連携パラメータが不正です。');
    if (!isAllowedReturnUrl(context.returnUrl)) throw new Error('安全なMemo Nexusの戻り先を確認できません。');
    if (!font || !font.id || !font.memoCssFamily) throw new Error('返すフォント情報が不正です。');

    const url = new URL(context.returnUrl);
    url.hash = '';
    url.searchParams.set('fontSource', 'font-comparison');
    url.searchParams.set('fontTarget', context.target);
    url.searchParams.set('fontScope', context.scope);
    url.searchParams.set('fontId', font.id);
    url.searchParams.set('fontFamily', font.memoCssFamily);
    url.searchParams.set('fontLabel', font.name);
    if (context.memoId) url.searchParams.set('fontMemoId', context.memoId);
    return url.toString();
  }

  const api = {
    MAX_SAMPLE_LENGTH,
    PRODUCTION_MEMO_URL,
    SCOPES,
    TARGETS,
    buildMemoNexusReturnUrl,
    isAllowedReturnUrl,
    parseMemoNexusParams
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FontComparisonIntegration = api;
})(typeof window !== 'undefined' ? window : globalThis);
