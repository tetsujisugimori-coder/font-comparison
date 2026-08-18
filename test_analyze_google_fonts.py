from __future__ import annotations

import argparse
import os
import tempfile
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

    def test_deduplicates_urls_but_preserves_all_weights(self) -> None:
        files = subject.deduplicate_font_faces(subject.parse_google_fonts_css(FIXTURE))
        self.assertEqual(len(files), 2)
        self.assertEqual(files[0]["weights"], [400, 700])

    def test_missing_weight_is_an_error(self) -> None:
        with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "300"):
            subject.parse_google_fonts_css(FIXTURE, weights=(300, 700))

    def test_variable_weight_range_is_expanded_for_requested_weights(self) -> None:
        css = """@font-face { font-family: Test; font-style: normal; font-weight: 300 700; src: url(https://fonts.gstatic.com/test.woff2) format('woff2'); unicode-range: U+0041; }"""
        faces = subject.parse_google_fonts_css(css, weights=(400, 700), styles=("normal",))
        self.assertEqual([(item["weight"], item["style"]) for item in faces], [(400, "normal"), (700, "normal")])

    def test_unsupported_weight_syntax_is_not_silently_ignored(self) -> None:
        css = """@font-face { font-family: Test; font-style: normal; font-weight: normal bold extra; src: url(https://fonts.gstatic.com/test.woff2) format('woff2'); }"""
        with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "未対応"):
            subject.parse_google_fonts_css(css)


class AnalysisMergeTests(unittest.TestCase):
    def test_merges_duplicate_tags_and_keeps_both_tables(self) -> None:
        merged = subject.merge_feature_results([{"features": [{"tag": "kern", "tables": ["GPOS"]}, {"tag": "ccmp", "tables": ["GSUB"]}]}, {"features": [{"tag": "ccmp", "tables": ["GPOS"]}, {"tag": "liga", "tables": ["GSUB"]}]}])
        self.assertEqual(merged, [{"tag": "ccmp", "tables": ["GSUB", "GPOS"]}, {"tag": "kern", "tables": ["GPOS"]}, {"tag": "liga", "tables": ["GSUB"]}])

    def test_unions_cmaps_once_and_compresses_ranges(self) -> None:
        parsed = [{"fontVersion": "Version 2.004-H2", "features": [{"tag": "kern", "tables": ["GPOS"]}], "codepoints": {0x41, 0x42}}, {"fontVersion": "Version 2.004-H2", "features": [{"tag": "kern", "tables": ["GPOS"]}], "codepoints": {0x42, 0x44}}]
        with patch.object(subject, "analyze_woff2", side_effect=parsed):
            result = subject.analyze_css_delivery(FIXTURE, subject.DEFAULT_CSS_URL, "fixture-agent", "2026-08-18", downloader=lambda _url, _ua: b"fixture")
        self.assertEqual(result["coverage"]["codepointCount"], 3)
        self.assertEqual(result["coverage"]["ranges"], [[0x41, 0x42], [0x44, 0x44]])
        self.assertEqual(result["coverage"]["analysisTarget"], "Google Fonts配信WOFF2 2ファイル")
        self.assertEqual(result["openType"]["files"][0]["fileName"], "shared.woff2")
        self.assertEqual(result["openType"]["files"][0]["sha256"], result["openType"]["files"][1]["sha256"])

    def test_target_identity_is_used_for_each_result(self) -> None:
        target = subject.WebFontTarget("noto-serif-jp-web", "Noto Serif JP", (400, 700), ("normal",), subject.DEFAULT_CSS_URL)
        parsed = [{"fontVersion": "Version 1", "features": [], "codepoints": {0x41}}, {"fontVersion": "Version 1", "features": [], "codepoints": {0x42}}]
        with patch.object(subject, "analyze_woff2", side_effect=parsed):
            result = subject.analyze_css_delivery(FIXTURE, target, "fixture-agent", "2026-08-18", downloader=lambda _url, _ua: b"fixture")
        self.assertEqual(result["coverage"]["fontName"], "Noto Serif JP")
        self.assertEqual(result["openType"]["requestedStyles"], ["normal"])

    def test_source_han_file_delivery_records_size_and_hash(self) -> None:
        target = subject.WebFontTarget("source-han-sans-web", "Source Han Sans CN", (400,), ("normal",), font_files=((400, "https://example.test/SourceHanSansCN-Regular.otf"),))
        with patch.object(subject, "analyze_woff2", return_value={"fontVersion": "Version 2", "features": [{"tag": "kern", "tables": ["GPOS"]}], "codepoints": {0x4E00}}):
            result = subject.analyze_font_file_delivery(target, "fixture-agent", "2026-08-18", downloader=lambda _url, _ua: b"fixture")
        self.assertEqual(result["coverage"]["files"][0]["fileSize"], 7)
        self.assertEqual(result["openType"]["files"][0]["weights"], [400])

    def test_empty_cmap_is_valid_but_parser_failure_is_not(self) -> None:
        parsed = [{"fontVersion": "Version 1", "features": [], "codepoints": set()}, {"fontVersion": "Version 1", "features": [], "codepoints": set()}]
        with patch.object(subject, "analyze_woff2", side_effect=parsed):
            result = subject.analyze_css_delivery(FIXTURE, subject.DEFAULT_CSS_URL, "fixture-agent", "2026-08-18", downloader=lambda _url, _ua: b"fixture")
        self.assertEqual(result["coverage"]["codepointCount"], 0)
        with patch.object(subject, "analyze_woff2", side_effect=subject.GoogleFontsAnalysisError("cmap missing")):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "1/2"):
                subject.analyze_css_delivery(FIXTURE, subject.DEFAULT_CSS_URL, "fixture-agent", "2026-08-18", downloader=lambda _url, _ua: b"fixture")

    def test_aggregates_equal_and_multiple_versions_without_inventing_one(self) -> None:
        self.assertEqual(subject.aggregate_font_versions([{"fileName": "a", "fontVersion": "Version 1"}, {"fileName": "b", "fontVersion": "Version 1"}]), {"fontVersionMissingFiles": [], "fontVersion": "Version 1"})
        self.assertEqual(subject.aggregate_font_versions([{"fileName": "a", "fontVersion": "Version 1"}, {"fileName": "b", "fontVersion": "Version 2"}, {"fileName": "c", "fontVersion": None}]), {"fontVersionMissingFiles": ["c"], "fontVersions": ["Version 1", "Version 2"]})

    def test_failure_does_not_overwrite_either_generated_file(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            output, coverage = Path(temporary) / "font-opentype-data.js", Path(temporary) / "font-coverage-data.js"
            output.write_text("old open type", encoding="utf-8")
            coverage.write_text("old coverage", encoding="utf-8")
            args = argparse.Namespace(css_url=subject.DEFAULT_CSS_URL, user_agent="fixture-agent", output=output, coverage_output=coverage)
            with patch.object(subject, "parse_args", return_value=args), patch.object(subject, "fetch_bytes", return_value=FIXTURE.encode("utf-8")), patch.object(subject, "analyze_woff2", side_effect=subject.GoogleFontsAnalysisError("broken")):
                self.assertEqual(subject.main(), 2)
            self.assertEqual(output.read_text(encoding="utf-8"), "old open type")
            self.assertEqual(coverage.read_text(encoding="utf-8"), "old coverage")


class OutputUpdateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        directory = Path(self.temporary.name)
        self.opentype = directory / "font-opentype-data.js"
        self.coverage = directory / "font-coverage-data.js"
        self.opentype.write_text('window.FontOpenTypeData = {"generatedAt":"old","fonts":{"existing":{}}};\n', encoding="utf-8")
        self.coverage.write_text('window.FontCoverageData = {"generatedAt":"old","fonts":{"existing":{}}};\n', encoding="utf-8")
        self.original_opentype = self.opentype.read_text(encoding="utf-8")
        self.original_coverage = self.coverage.read_text(encoding="utf-8")
        self.result = {
            "openType": {"analysisDate": "2026-08-18", "fontName": "Noto Sans JP", "status": "analyzed", "features": []},
            "coverage": {"analysisDate": "2026-08-18", "fontName": "Noto Sans JP", "status": "analyzed", "ranges": []},
        }

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def assert_originals_and_no_artifacts(self) -> None:
        self.assertEqual(self.opentype.read_text(encoding="utf-8"), self.original_opentype)
        self.assertEqual(self.coverage.read_text(encoding="utf-8"), self.original_coverage)
        self.assertEqual(list(Path(self.temporary.name).glob("*.tmp")), [])
        self.assertEqual(list(Path(self.temporary.name).glob("*.bak")), [])

    def test_normal_update_changes_both_outputs_with_matching_generated_at(self) -> None:
        subject.update_outputs(self.opentype, self.coverage, self.result)
        opentype = subject.load_javascript_data(self.opentype, "FontOpenTypeData")
        coverage = subject.load_javascript_data(self.coverage, "FontCoverageData")
        self.assertIn(subject.FONT_ID, opentype["fonts"])
        self.assertIn(subject.FONT_ID, coverage["fonts"])
        self.assertEqual(opentype["generatedAt"], coverage["generatedAt"])
        self.assertEqual(list(Path(self.temporary.name).glob("*.tmp")), [])
        self.assertEqual(list(Path(self.temporary.name).glob("*.bak")), [])

    def test_multiple_font_results_preserve_existing_fonts_and_update_together(self) -> None:
        second = {
            "openType": {"analysisDate": "2026-08-18", "fontName": "Noto Serif JP", "status": "analyzed", "features": []},
            "coverage": {"analysisDate": "2026-08-18", "fontName": "Noto Serif JP", "status": "analyzed", "ranges": []},
        }
        subject.update_outputs(self.opentype, self.coverage, {"noto-sans-jp-web": self.result, "noto-serif-jp-web": second})
        opentype = subject.load_javascript_data(self.opentype, "FontOpenTypeData")
        coverage = subject.load_javascript_data(self.coverage, "FontCoverageData")
        self.assertIn("existing", opentype["fonts"])
        self.assertIn("noto-serif-jp-web", opentype["fonts"])
        self.assertIn("noto-serif-jp-web", coverage["fonts"])

    def test_first_temporary_creation_failure_keeps_both_outputs(self) -> None:
        with patch.object(subject, "create_temporary_file", side_effect=OSError("first temporary failure")):
            with self.assertRaises(OSError):
                subject.update_outputs(self.opentype, self.coverage, self.result)
        self.assert_originals_and_no_artifacts()

    def test_second_temporary_creation_failure_keeps_both_outputs(self) -> None:
        original = subject.create_temporary_file
        calls = 0

        def fail_second(target: Path, contents: str, suffix: str = ".tmp") -> Path:
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError("second temporary failure")
            return original(target, contents, suffix)

        with patch.object(subject, "create_temporary_file", side_effect=fail_second):
            with self.assertRaises(OSError):
                subject.update_outputs(self.opentype, self.coverage, self.result)
        self.assert_originals_and_no_artifacts()

    def test_invalid_temporary_data_does_not_replace_outputs(self) -> None:
        original = subject.create_temporary_file
        calls = 0

        def corrupt_first(target: Path, contents: str, suffix: str = ".tmp") -> Path:
            nonlocal calls
            calls += 1
            temporary = original(target, contents, suffix)
            if calls == 1:
                temporary.write_text('window.FontOpenTypeData = {"generatedAt":"new","fonts":{}};\n', encoding="utf-8")
            return temporary

        with patch.object(subject, "create_temporary_file", side_effect=corrupt_first):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "対象フォントID"):
                subject.update_outputs(self.opentype, self.coverage, self.result)
        self.assert_originals_and_no_artifacts()

    def test_second_replace_failure_rolls_back_first_output_and_cleans_up(self) -> None:
        original_replace = os.replace

        def fail_coverage_replace(source: str | Path, destination: str | Path) -> None:
            if Path(destination) == self.coverage and Path(source).suffix == ".tmp":
                raise OSError("coverage replace failure")
            original_replace(source, destination)

        with patch.object(subject.os, "replace", side_effect=fail_coverage_replace):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "coverage replace failure"):
                subject.update_outputs(self.opentype, self.coverage, self.result)
        self.assert_originals_and_no_artifacts()

    def test_rollback_failure_preserves_recovery_backup(self) -> None:
        original_replace = os.replace

        def fail_coverage_replace_and_rollback(source: str | Path, destination: str | Path) -> None:
            source_path = Path(source)
            destination_path = Path(destination)
            if destination_path == self.coverage and source_path.suffix == ".tmp":
                raise OSError("coverage replace failure")
            if destination_path == self.opentype and source_path.suffix == ".bak":
                raise OSError("opentype rollback failure")
            original_replace(source, destination)

        with patch.object(subject.os, "replace", side_effect=fail_coverage_replace_and_rollback):
            with self.assertRaises(subject.GoogleFontsAnalysisError) as raised:
                subject.update_outputs(self.opentype, self.coverage, self.result)

        backups = list(Path(self.temporary.name).glob("*.bak"))
        self.assertEqual(len(backups), 1)
        self.assertIn(str(self.opentype), str(raised.exception))
        self.assertIn(str(backups[0]), str(raised.exception))
        self.assertIn("opentype rollback failure", str(raised.exception))
        self.assertEqual(backups[0].read_text(encoding="utf-8"), self.original_opentype)
        self.assertEqual(list(Path(self.temporary.name).glob("*.tmp")), [])

    def test_css_fetch_failure_is_explicit(self) -> None:
        with patch("analyze_google_fonts.urlopen", side_effect=OSError("offline")), patch("analyze_google_fonts.shutil.which", return_value=None):
            with self.assertRaisesRegex(subject.GoogleFontsAnalysisError, "取得に失敗"):
                subject.fetch_bytes(subject.DEFAULT_CSS_URL, "fixture-agent")


if __name__ == "__main__":
    unittest.main()
