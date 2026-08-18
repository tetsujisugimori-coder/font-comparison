/* 解析証拠の詳細JSを必要時だけ読み込む。file:// でも動く従来型scriptを使う。 */
(function attachAnalysisDetailsLoader(global) {
  'use strict';

  const detailPaths = Object.freeze({
    'segoe-ui': 'analysis-details/segoe-ui.js',
    'yu-gothic-ui': 'analysis-details/yu-gothic-ui.js',
    meiryo: 'analysis-details/meiryo.js',
    'ms-mincho': 'analysis-details/ms-mincho.js',
    consolas: 'analysis-details/consolas.js',
    'courier-new': 'analysis-details/courier-new.js',
    'times-new-roman': 'analysis-details/times-new-roman.js',
    'noto-sans-jp-web': 'analysis-details/noto-sans-jp-web.js',
    'noto-serif-jp-web': 'analysis-details/noto-serif-jp-web.js',
    'noto-sans-sc-web': 'analysis-details/noto-sans-sc-web.js',
    'noto-sans-tc-web': 'analysis-details/noto-sans-tc-web.js',
    'source-han-sans-web': 'analysis-details/source-han-sans-web.js',
    'inter-web': 'analysis-details/inter-web.js',
    'ibm-plex-sans-web': 'analysis-details/ibm-plex-sans-web.js',
    'jetbrains-mono-web': 'analysis-details/jetbrains-mono-web.js',
    'zen-kaku-gothic-new-web': 'analysis-details/zen-kaku-gothic-new-web.js',
    'shippori-mincho-web': 'analysis-details/shippori-mincho-web.js'
  });
  const pending = new Map();

  global.FontAnalysisDetails = global.FontAnalysisDetails || {};
  const loadedScripts = new Map();

  function unavailable(fontId) {
    return new Error(`解析詳細データはありません: ${fontId}`);
  }

  function validationError(fontId, detail, expectedSchemaVersion) {
    if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
      return new Error(`解析詳細データがオブジェクトではありません: ${fontId}`);
    }
    if (detail.fontId !== fontId) {
      return new Error(`解析詳細データのfontIdが一致しません: 要求 ${fontId} / 登録 ${detail.fontId || '未設定'}`);
    }
    if (expectedSchemaVersion != null && detail.schemaVersion !== expectedSchemaVersion) {
      return new Error(`解析詳細データのschemaVersionが一致しません: ${fontId} / 期待 ${expectedSchemaVersion} / 登録 ${detail.schemaVersion ?? '未設定'}`);
    }
    return null;
  }

  function discardInvalidDetail(fontId, script) {
    delete global.FontAnalysisDetails[fontId];
    pending.delete(fontId);
    const loadedScript = loadedScripts.get(fontId);
    if (script || loadedScript) (script || loadedScript).remove();
    loadedScripts.delete(fontId);
  }

  function load(fontId, expectedSchemaVersion) {
    const path = detailPaths[fontId];
    if (!path) return Promise.reject(unavailable(fontId));
    const hasCached = Object.prototype.hasOwnProperty.call(global.FontAnalysisDetails, fontId);
    const cached = global.FontAnalysisDetails[fontId];
    if (hasCached) {
      const error = validationError(fontId, cached, expectedSchemaVersion);
      if (!error) return Promise.resolve(cached);
      discardInvalidDetail(fontId);
      return Promise.reject(error);
    }
    if (pending.has(fontId)) return pending.get(fontId);

    const request = new Promise((resolve, reject) => {
      const script = global.document.createElement('script');
      script.src = path;
      script.async = true;
      script.dataset.analysisDetailFor = fontId;
      script.onload = () => {
        const detail = global.FontAnalysisDetails[fontId];
        const error = validationError(fontId, detail, expectedSchemaVersion);
        if (error) {
          discardInvalidDetail(fontId, script);
          reject(error);
          return;
        }
        pending.delete(fontId);
        loadedScripts.set(fontId, script);
        resolve(detail);
      };
      script.onerror = () => {
        pending.delete(fontId);
        loadedScripts.delete(fontId);
        script.remove();
        reject(new Error(`解析詳細JSを読み込めませんでした: ${path}`));
      };
      global.document.head.append(script);
    });
    pending.set(fontId, request);
    return request;
  }

  global.FontAnalysisDetailsLoader = Object.freeze({ detailPaths, load });
}(window));
