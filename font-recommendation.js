(function (globalScope) {
  'use strict';

  const FONT_TONE_PROFILES = {
    'segoe-ui': ['neutral'],
    'yu-gothic-ui': ['neutral', 'formal'],
    meiryo: ['neutral'],
    'ms-mincho': ['formal'],
    consolas: ['neutral'],
    'cascadia-code': ['neutral', 'casual'],
    'noto-sans-jp-web': ['neutral'],
    'noto-serif-jp-web': ['formal'],
    'noto-sans-sc-web': ['neutral'],
    'noto-sans-tc-web': ['neutral'],
    'source-han-sans-web': ['neutral'],
    'inter-web': ['neutral', 'casual'],
    'ibm-plex-sans-web': ['neutral'],
    'jetbrains-mono-web': ['neutral', 'casual'],
    'zen-kaku-gothic-new-web': ['neutral', 'casual'],
    'shippori-mincho-web': ['formal'],
    'courier-new': ['formal'],
    'times-new-roman': ['formal']
  };

  const LANGUAGE_REASON = {
    japanese: '日本語向けとして登録',
    simplifiedChinese: '簡体字中国語向けとして登録',
    traditionalChinese: '繁体字中国語向けとして登録',
    latin: '英数字中心のUI・本文向け'
  };

  const LANGUAGE_LABEL = {
    japanese: '日本語',
    simplifiedChinese: '簡体字中国語',
    traditionalChinese: '繁体字中国語',
    latin: '英数字'
  };

  const MOOD_KEYWORDS = {
    casual: ['親しみ', '軽快', '現代的'],
    neutral: ['読みやすい', '可読性', '明快', '安定感', '汎用', '実用的', '中立'],
    formal: ['落ち着いた', '上品', '古典的', '印刷物風', '端正']
  };

  function languageStatusScore(status) {
    return {
      supported: 12,
      partial: 4,
      unknown: 0,
      unsupported: -12
    }[status] ?? 0;
  }

  function purposeTarget(purpose) {
    return {
      writing: 'body',
      reading: 'body',
      heading: 'heading',
      code: 'code'
    }[purpose] || null;
  }

  function includesKeyword(values, keywords) {
    return (values || []).some((value) => keywords.some((keyword) => String(value).includes(keyword)));
  }

  function purposeScore(font, purpose) {
    const target = purposeTarget(purpose);
    let score = font.recommendedFor?.includes(target) ? 5 : 0;
    const uses = font.uses || [];

    if (purpose === 'code') {
      if (font.categoryType === 'monospace') score += 10;
      if (includesKeyword(uses, ['コード'])) score += 5;
      return score;
    }

    if (font.categoryType === 'monospace') score -= 3;
    if (purpose === 'heading' && includesKeyword(uses, ['見出し', 'UI'])) score += 4;
    if (purpose === 'writing' && includesKeyword(uses, ['本文', '長文', '説明文'])) score += 4;
    if (purpose === 'reading' && includesKeyword(uses, ['本文', '長文'])) score += 5;
    return score;
  }

  function moodScore(font, mood) {
    let score = FONT_TONE_PROFILES[font.id]?.includes(mood) ? 5 : 0;
    if (includesKeyword(font.impression, MOOD_KEYWORDS[mood] || [])) score += 2;
    if (mood === 'formal' && font.categoryType === 'serif') score += 4;
    if (mood === 'neutral' && font.categoryType === 'sans-serif') score += 2;
    if (mood === 'casual' && font.categoryType === 'sans-serif') score += 1;
    return score;
  }

  function languageReason(font, answers) {
    const status = font.languages?.[answers.language] || 'unknown';
    if (status === 'partial') return `${LANGUAGE_LABEL[answers.language]}に一部対応`;
    if (status === 'unknown') return 'この言語への対応は未確認';
    if (status === 'unsupported') return 'この言語には非対応';
    if (answers.language === 'japanese' && ['writing', 'reading'].includes(answers.purpose)) {
      return '日本語の長文向け';
    }
    if (answers.language === 'japanese' && answers.purpose === 'heading') return '日本語の見出し向け';
    if (answers.language === 'latin' && answers.purpose === 'code') return '英数字中心のコード向け';
    return LANGUAGE_REASON[answers.language];
  }

  function moodReason(font, mood) {
    if (mood === 'formal' && font.categoryType === 'serif') return '落ち着いた明朝・セリフ系';
    if (!FONT_TONE_PROFILES[font.id]?.includes(mood)) return null;
    return {
      casual: '親しみやすい雰囲気',
      neutral: '中立的で読みやすさを重視',
      formal: '落ち着いた・フォーマルな雰囲気'
    }[mood];
  }

  function purposeReason(font, purpose) {
    if (purpose === 'code' && font.categoryType === 'monospace') return '等幅でコード向け';
    if (purpose === 'heading' && font.recommendedFor?.includes('heading')) return '見出し・短文向け';
    if (purpose === 'reading' && font.recommendedFor?.includes('body')) return '長文を読む用途向け';
    if (purpose === 'writing' && font.recommendedFor?.includes('body')) return '長文を書く用途向け';
    return null;
  }

  function recommendationReasons(font, answers) {
    const language = languageReason(font, answers);
    const mood = moodReason(font, answers.mood);
    const purpose = purposeReason(font, answers.purpose);
    const reasons = (answers.purpose === 'code' ? [language, purpose, mood] : [language, mood, purpose])
      .filter(Boolean);
    const unique = [...new Set(reasons)];
    if (!unique.length) {
      unique.push(font.sourceType === 'web' ? '選択時に読み込むWebフォント' : '端末のシステムフォントを使用');
    }
    return unique.slice(0, 2);
  }

  function hasCompleteAnswers(answers) {
    return Boolean(answers?.language && answers?.mood && purposeTarget(answers?.purpose));
  }

  function recommendFonts(fonts, answers, limit = 3) {
    if (!hasCompleteAnswers(answers)) return [];
    const uniqueFonts = [];
    const seenIds = new Set();
    for (const font of fonts || []) {
      if (!font?.id || seenIds.has(font.id)) continue;
      seenIds.add(font.id);
      uniqueFonts.push(font);
    }

    const maximum = Math.max(0, Math.min(3, Number(limit) || 0));
    const scoredFonts = uniqueFonts
      .map((font, index) => ({
        font,
        index,
        score: languageStatusScore(font.languages?.[answers.language])
          + purposeScore(font, answers.purpose)
          + moodScore(font, answers.mood),
        reasons: recommendationReasons(font, answers)
      }));
    const languageStatus = (result) => result.font.languages?.[answers.language] || 'unknown';
    const candidateGroups = [
      scoredFonts.filter((result) => ['supported', 'partial'].includes(languageStatus(result))),
      scoredFonts.filter((result) => languageStatus(result) === 'unknown'),
      scoredFonts.filter((result) => languageStatus(result) === 'unsupported')
    ];
    const selected = [];
    for (const group of candidateGroups) {
      group.sort((a, b) => b.score - a.score || a.index - b.index);
      for (const result of group) {
        if (selected.length >= maximum) break;
        selected.push(result);
      }
      if (selected.length >= maximum) break;
    }
    return selected.map((result, index) => ({ ...result, rank: index + 1 }));
  }

  const api = {
    FONT_TONE_PROFILES,
    languageStatusScore,
    recommendFonts
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (globalScope) globalScope.FontRecommendation = api;
})(typeof window !== 'undefined' ? window : globalThis);
