from __future__ import annotations

import unittest
from pathlib import Path
from unittest.mock import patch

import analyze_google_fonts as subject


FIXTURE = Path("tests/fixtures/google-fonts-noto-sans-jp.css").read_text(encoding="utf-8")


class GoogleFontsCssTests(unittest.TestCase):
    def test_extracts_faces_weights_and_unicode_ranges(self) -> None:
        faces = subject.parse_google_fonts_css(FIXTURE)
        self.assertEqual([face["weight"] for face in faces], [400, 700, 700])
        self.assertEqual(faces[0]["unicodeRange"], "U+3041-3096")
        self.assertEqual(faces[2]["unicodeRange"], "U+0000-00FF")

    def test_deduplicates_urls_but_preserves_all_weights(self) -> None:
        files = subject.deduplicate_font_faces(subject.parse_google_fonts_css(FIXTURE))
        self.assertEqual(len(files), 2)
        self.assertEqual(files[0]["weights"], [400, 700])
        self.assertEqual(files[0]["unicodeRanges"], ["U+3041-3096"])

    def test_missing_weight_is_an_error(self) -> None:
        with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "300"):
            subject.parse_google_fonts_css(FIXTURE, weights=(300, 700))


class FeatureMergeTests(unittest.TestCase):
    def test_merges_duplicate_tags_and_keeps_both_tables(self) -> None:
        merged = subject.merge_feature_results(
            [
                {"features": [{"tag": "kern", "tables": ["GPOS"]}, {"tag": "ccmp", "tables": ["GSUB"]}]},
                {"features": [{"tag": "ccmp", "tables": ["GPOS"]}, {"tag": "liga", "tables": ["GSUB"]}]},
            ]
        )
        self.assertEqual(
            merged,
            [
                {"tag": "ccmp", "tables": ["GSUB", "GPOS"]},
                {"tag": "kern", "tables": ["GPOS"]},
                {"tag": "liga", "tables": ["GSUB"]},
            ],
        )

    def test_woff2_failure_aborts_instead_of_returning_empty_success(self) -> None:
        with patch.object(subject, "analyze_woff2", side_effect=subject.GoogleFontsAnalysisError("broken")):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "1/2"):
                subject.analyze_css_delivery(
                    FIXTURE,
                    subject.DEFAULT_CSS_URL,
                    "fixture-agent",
                    "2026-08-18",
                    downloader=lambda _url, _ua: b"not-a-font",
                )

    def test_css_fetch_failure_is_explicit(self) -> None:
        with patch("analyze_google_fonts.urlopen", side_effect=OSError("offline")), patch(
            "analyze_google_fonts.shutil.which", return_value=None
        ):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "取得に失敗"):
                subject.fetch_bytes(subject.DEFAULT_CSS_URL, "fixture-agent")


if __name__ == "__main__":
    unittest.main()
