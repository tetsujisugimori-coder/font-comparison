(function (globalScope) {
  'use strict';

  const STATUS = Object.freeze({
    SUPPORTED: 'supported',
    UNSUPPORTED: 'unsupported',
    UNKNOWN: 'unknown'
  });

  function coverageFor(fontId, data = globalScope?.FontCoverageData) {
    const coverage = data?.fonts?.[fontId];
    return coverage?.status === 'analyzed' && Array.isArray(coverage.ranges) ? coverage : null;
  }

  function rangeContains(ranges, codepoint) {
    let low = 0;
    let high = ranges.length - 1;
    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const [start, end] = ranges[middle];
      if (codepoint < start) high = middle - 1;
      else if (codepoint > end) low = middle + 1;
      else return true;
    }
    return false;
  }

  function formatCodepoint(character) {
    return `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
  }

  function isVariationSelector(codepoint) {
    return (codepoint >= 0xFE00 && codepoint <= 0xFE0F) || (codepoint >= 0xE0100 && codepoint <= 0xE01EF);
  }

  function isJoiner(codepoint) {
    return codepoint === 0x200C || codepoint === 0x200D;
  }

  function isEmojiModifier(codepoint) {
    return codepoint >= 0x1F3FB && codepoint <= 0x1F3FF;
  }

  function isRegionalIndicator(codepoint) {
    return codepoint >= 0x1F1E6 && codepoint <= 0x1F1FF;
  }

  function shouldIgnoreForUnsupportedDecision(codepoint, character) {
    return isVariationSelector(codepoint)
      || isJoiner(codepoint)
      || /[\p{Cf}]/u.test(character);
  }

  function shouldKeepNormalOpacity(character) {
    return /[\p{White_Space}\p{Cc}\p{Cf}]/u.test(character);
  }

  function isSegmenterSupported() {
    return typeof Intl !== 'undefined'
      && typeof Intl.Segmenter === 'function';
  }

  function getGraphemeClusters(text) {
    if (!text) return [];

    if (isSegmenterSupported()) {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      return [...segmenter.segment(text)].map((item) => item.segment);
    }

    return fallbackToCodepointAwareClusters(text);
  }

  function fallbackToCodepointAwareClusters(text) {
    const clusters = [];
    let current = '';
    let previousCodepoint = null;

    for (const character of String(text)) {
      const codepoint = character.codePointAt(0);
      const attachToPrevious = current.length > 0
        && (
          previousCodepoint === 0x200D
          || isVariationSelector(codepoint)
          || isJoiner(codepoint)
          || isEmojiModifier(codepoint)
          || isRegionalIndicator(codepoint)
          || /[\p{M}]/u.test(character)
        );

      if (attachToPrevious) {
        current += character;
      } else {
        if (current) clusters.push(current);
        current = character;
      }
      previousCodepoint = codepoint;
    }

    if (current) clusters.push(current);
    return clusters;
  }

  function evaluateGraphemeCluster(fontId, cluster, data) {
    const clusterCoverage = {
      status: STATUS.SUPPORTED,
      unsupportedCodepoints: []
    };

    const allCharacters = [];
    for (const character of String(cluster)) allCharacters.push(character);

    if (allCharacters.every((character) => shouldKeepNormalOpacity(character))) {
      return clusterCoverage;
    }

    for (const character of allCharacters) {
      const codepoint = character.codePointAt(0);
      if (shouldKeepNormalOpacity(character)) continue;
      const status = codepointStatus(fontId, codepoint, data);
      if (status !== STATUS.UNSUPPORTED) continue;
      if (shouldIgnoreForUnsupportedDecision(codepoint, character)) continue;
      clusterCoverage.status = STATUS.UNSUPPORTED;
      clusterCoverage.unsupportedCodepoints.push(formatCodepoint(character));
    }

    return clusterCoverage;
  }

  function codepointStatus(fontId, codepoint, data = globalScope?.FontCoverageData) {
    const coverage = coverageFor(fontId, data);
    if (!coverage || !Number.isInteger(codepoint)) return STATUS.UNKNOWN;
    return rangeContains(coverage.ranges, codepoint) ? STATUS.SUPPORTED : STATUS.UNSUPPORTED;
  }

  function characterStatus(fontId, character, data = globalScope?.FontCoverageData) {
    if (!character) return STATUS.UNKNOWN;
    return codepointStatus(fontId, character.codePointAt(0), data);
  }

  function appendCoverageText(container, text, fontId, data = globalScope?.FontCoverageData) {
    const documentRef = container.ownerDocument;
    let plainText = '';
    let unsupportedCount = 0;

    const flushPlainText = () => {
      if (!plainText) return;
      container.appendChild(documentRef.createTextNode(plainText));
      plainText = '';
    };

    for (const cluster of getGraphemeClusters(text)) {
      const evaluation = evaluateGraphemeCluster(fontId, cluster, data);
      if (evaluation.status !== STATUS.UNSUPPORTED) {
        plainText += cluster;
        continue;
      }

      let onlyWhitespaceOrFormat = true;
      for (const character of String(cluster)) {
        if (!shouldKeepNormalOpacity(character)) {
          onlyWhitespaceOrFormat = false;
          break;
        }
      }

      if (onlyWhitespaceOrFormat) {
        plainText += cluster;
        continue;
      }

      flushPlainText();
      const span = documentRef.createElement('span');
      span.className = 'unsupported-glyph';
      span.dataset.codepoint = evaluation.unsupportedCodepoints.join(', ');
      span.dataset.codepoints = evaluation.unsupportedCodepoints.join(' ');
      const title = evaluation.unsupportedCodepoints.join(', ');
      span.title = `未収録（${title}）`;
      span.textContent = cluster;
      container.appendChild(span);
      unsupportedCount += 1;
    }
    flushPlainText();
    return unsupportedCount;
  }

  const api = {
    STATUS,
    appendCoverageText,
    characterStatus,
    codepointStatus,
    coverageFor,
    evaluateGraphemeCluster,
    fallbackToCodepointAwareClusters,
    formatCodepoint,
    getGraphemeClusters,
    rangeContains,
    shouldKeepNormalOpacity
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FontCoverage = api;
})(typeof window !== 'undefined' ? window : globalThis);
