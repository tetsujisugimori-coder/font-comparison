(function (globalScope) {
  'use strict';

  const languageSupport = (latin, japanese, simplifiedChinese, traditionalChinese) => ({
    latin,
    japanese,
    simplifiedChinese,
    traditionalChinese
  });

  const fontOption = (id, name, sourceType, memoCssFamily, details) => ({
    id,
    name,
    sourceType,
    memoCssFamily,
    ...details
  });

  const FONT_OPTIONS = [
    fontOption('segoe-ui', 'Segoe UI', 'system', '"Segoe UI", "Yu Gothic UI", sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'partial', 'unknown', 'unknown'),
      impression: ['中立', '読みやすい'], uses: ['欧文UI', '本文', '見出し']
    }),
    fontOption('yu-gothic-ui', 'Yu Gothic UI', 'system', '"Yu Gothic UI", "Hiragino Sans", Meiryo, system-ui, sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['中立', '落ち着いた'], uses: ['日本語本文', '長文', 'UI', '見出し']
    }),
    fontOption('meiryo', 'Meiryo', 'system', 'Meiryo, "Yu Gothic UI", sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['読みやすい', '実用的'], uses: ['日本語本文', '長文', 'UI']
    }),
    fontOption('ms-mincho', 'MS Mincho', 'system', '"ＭＳ 明朝", "MS Mincho", serif', {
      categoryType: 'serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('partial', 'supported', 'unknown', 'unknown'),
      impression: ['落ち着いた', '古典的'], uses: ['日本語本文', '長文', '見出し']
    }),
    fontOption('consolas', 'Consolas', 'system', 'Consolas, "Courier New", monospace', {
      categoryType: 'monospace', recommendedFor: ['code'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['中立', '実用的'], uses: ['コード']
    }),
    fontOption('cascadia-code', 'Cascadia Code', 'system', '"Cascadia Code", Consolas, monospace', {
      categoryType: 'monospace', recommendedFor: ['code'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['現代的', '明快'], uses: ['コード']
    }),
    fontOption('courier-new', 'Courier New', 'system', '"Courier New", Consolas, monospace', {
      categoryType: 'monospace', recommendedFor: ['code'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['古典的'], uses: ['コード']
    }),
    fontOption('times-new-roman', 'Times New Roman', 'system', '"Times New Roman", "ＭＳ 明朝", serif', {
      categoryType: 'serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['落ち着いた', '古典的'], uses: ['欧文本文', '長文', '見出し']
    }),
    fontOption('noto-sans-jp-web', 'Noto Sans JP', 'web', '"Noto Sans JP", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['読みやすい', '汎用'], uses: ['日本語本文', '長文', 'UI', '見出し']
    }),
    fontOption('noto-serif-jp-web', 'Noto Serif JP', 'web', '"Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif', {
      categoryType: 'serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['端正', '落ち着いた'], uses: ['日本語本文', '長文', '見出し']
    }),
    fontOption('noto-sans-sc-web', 'Noto Sans SC', 'web', '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unknown', 'supported', 'partial'),
      impression: ['明快', '汎用'], uses: ['簡体字本文', '長文', 'UI', '見出し']
    }),
    fontOption('noto-sans-tc-web', 'Noto Sans TC', 'web', '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unknown', 'partial', 'supported'),
      impression: ['明快', '汎用'], uses: ['繁体字本文', '長文', 'UI', '見出し']
    }),
    fontOption('source-han-sans-web', 'Source Han Sans', 'web', '"Source Han Sans CN", "Noto Sans SC", "Microsoft YaHei", sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unknown', 'supported', 'partial'),
      impression: ['実用的', '明快'], uses: ['簡体字本文', '長文', 'UI', '見出し']
    }),
    fontOption('inter-web', 'Inter', 'web', 'Inter, "Segoe UI", Arial, sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['可読性', '現代的'], uses: ['欧文本文', '長文', '欧文UI', '見出し']
    }),
    fontOption('ibm-plex-sans-web', 'IBM Plex Sans', 'web', '"IBM Plex Sans", "Segoe UI", Arial, sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['中立', '端正'], uses: ['欧文本文', '長文', '欧文UI', '見出し']
    }),
    fontOption('jetbrains-mono-web', 'JetBrains Mono', 'web', '"JetBrains Mono", "Cascadia Code", Consolas, monospace', {
      categoryType: 'monospace', recommendedFor: ['code'],
      languages: languageSupport('supported', 'unsupported', 'unsupported', 'unsupported'),
      impression: ['明快', '現代的'], uses: ['コード']
    }),
    fontOption('zen-kaku-gothic-new-web', 'Zen Kaku Gothic New', 'web', '"Zen Kaku Gothic New", "Yu Gothic UI", "Hiragino Sans", Meiryo, sans-serif', {
      categoryType: 'sans-serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['親しみ', '現代的'], uses: ['日本語本文', '長文', 'UI', '見出し']
    }),
    fontOption('shippori-mincho-web', 'Shippori Mincho', 'web', '"Shippori Mincho", "Yu Mincho", "Hiragino Mincho ProN", "MS PMincho", serif', {
      categoryType: 'serif', recommendedFor: ['body', 'heading'],
      languages: languageSupport('supported', 'supported', 'unknown', 'unknown'),
      impression: ['上品', '落ち着いた'], uses: ['日本語本文', '長文', '見出し']
    })
  ];

  const api = { FONT_OPTIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FontRecommendationCatalog = api;
})(typeof window !== 'undefined' ? window : globalThis);
