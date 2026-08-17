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

  function codepointStatus(fontId, codepoint, data = globalScope?.FontCoverageData) {
    const coverage = coverageFor(fontId, data);
    if (!coverage || !Number.isInteger(codepoint)) return STATUS.UNKNOWN;
    return rangeContains(coverage.ranges, codepoint) ? STATUS.SUPPORTED : STATUS.UNSUPPORTED;
  }

  function characterStatus(fontId, character, data = globalScope?.FontCoverageData) {
    if (!character) return STATUS.UNKNOWN;
    return codepointStatus(fontId, character.codePointAt(0), data);
  }

  function shouldKeepNormalOpacity(character) {
    return /[\p{White_Space}\p{Cc}\p{Cf}]/u.test(character);
  }

  function formatCodepoint(character) {
    return `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
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

    for (const character of String(text)) {
      const status = characterStatus(fontId, character, data);
      if (status !== STATUS.UNSUPPORTED || shouldKeepNormalOpacity(character)) {
        plainText += character;
        continue;
      }
      flushPlainText();
      const span = documentRef.createElement('span');
      span.className = 'unsupported-glyph';
      span.dataset.codepoint = formatCodepoint(character);
      span.title = `未収録（${span.dataset.codepoint}）`;
      span.textContent = character;
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
    formatCodepoint,
    rangeContains,
    shouldKeepNormalOpacity
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FontCoverage = api;
})(typeof window !== 'undefined' ? window : globalThis);
