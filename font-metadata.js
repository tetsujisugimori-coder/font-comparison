'use strict';

(function exposeFontMetadata(root) {
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

  root.FontMetadata = { formatFontVersion, isFontCollection, safeUnparsedReason, versionValues };
})(window);
