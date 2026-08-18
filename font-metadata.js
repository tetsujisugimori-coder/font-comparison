'use strict';

(function exposeFontMetadata(root) {
  const weightNames = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black'
  };

  function versionValues(metadata = {}) {
    const values = [];
    if (metadata.fontVersion) values.push(String(metadata.fontVersion));
    if (Array.isArray(metadata.fontVersions)) values.push(...metadata.fontVersions.map(String));
    return [...new Set(values.filter(Boolean))];
  }

  function formatFontVersion(metadata, { compact = false } = {}) {
    const values = versionValues(metadata);
    if (!values.length) return '';
    return values.map((value) => (compact ? value.split(';')[0].trim() : value)).join(' / ');
  }

  function isFontCollection(metadata = {}) {
    return metadata.sourceType === 'collection' || /\.(ttc|otc)$/i.test(metadata.fileName || '');
  }

  function safeUnparsedReason(metadata = {}) {
    return String(metadata.reason || 'フォントファイルを確認できていません。');
  }

  function normalizeWeights(values) {
    const normalized = (Array.isArray(values) ? values : [])
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 1000);
    return [...new Set(normalized)].sort((left, right) => left - right);
  }

  function normalizeStyles(values) {
    const normalized = (Array.isArray(values) ? values : [])
      .map((style) => {
        if (typeof style === 'string') return { value: style, native: true };
        if (!style || typeof style !== 'object' || !style.value) return null;
        return { value: String(style.value), native: style.native === true };
      })
      .filter(Boolean);
    return normalized.filter((style, index) => normalized.findIndex((candidate) => candidate.value === style.value && candidate.native === style.native) === index);
  }

  function createFontFaceProfile(metadata = {}) {
    return {
      family: String(metadata.family || '未確認'),
      availableWeights: normalizeWeights(metadata.availableWeights),
      loadedWeights: normalizeWeights(metadata.loadedWeights),
      availableStyles: normalizeStyles(metadata.availableStyles),
      loadedStyles: normalizeStyles(metadata.loadedStyles),
      syntheticStyles: normalizeStyles(metadata.syntheticStyles),
      verification: metadata.verification && typeof metadata.verification === 'object'
        ? { ...metadata.verification }
        : null
    };
  }

  function formatWeight(value) {
    return `${weightNames[value] || 'Weight'} ${value}`;
  }

  function formatWeightSummary(profile = {}) {
    const loaded = normalizeWeights(profile.loadedWeights);
    if (loaded.length) return `${loaded.map(formatWeight).join(' / ')}（このアプリで読み込み確認済み。ファミリー全体は未確認）`;
    const available = normalizeWeights(profile.availableWeights);
    if (available.length) {
      const label = profile.verification?.label;
      return `${available.map(formatWeight).join(' / ')}${label ? `（${label}）` : ''}`;
    }
    return '未確認';
  }

  function formatStyle(style) {
    const label = style.value === 'normal' ? 'Normal' : style.value === 'italic' ? 'Italic' : style.value;
    return style.native ? label : `${label}（専用書体未確認）`;
  }

  function formatStyleSummary(profile = {}) {
    const loaded = normalizeStyles(profile.loadedStyles);
    if (loaded.length) return `${loaded.map(formatStyle).join(' / ')}（このアプリで読み込み確認済み）`;
    const available = normalizeStyles(profile.availableStyles);
    if (available.length) {
      const label = profile.verification?.label;
      return `${available.map(formatStyle).join(' / ')}${label ? `（${label}）` : ''}`;
    }
    if (normalizeStyles(profile.syntheticStyles).length) return '専用Styleは未確認';
    return '未確認';
  }

  root.FontMetadata = {
    createFontFaceProfile,
    formatFontVersion,
    formatStyleSummary,
    formatWeightSummary,
    isFontCollection,
    safeUnparsedReason,
    versionValues
  };
})(window);
