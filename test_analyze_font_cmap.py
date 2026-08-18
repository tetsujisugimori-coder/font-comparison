from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import analyze_font_cmap as subject


def result(name: str, codepoint: int, file_name: str) -> tuple[dict[str, object], dict[str, object]]:
    coverage = {
        "fontName": name, "status": "analyzed", "sourceType": "file", "fileName": file_name,
        "fontVersion": "Version 1", "codepointCount": 1, "ranges": [[codepoint, codepoint]],
        "analysisDate": "2026-08-18", "analysisTarget": file_name, "analysisMethod": "cmap",
        "files": [{"fileName": file_name, "sha256": "a" * 64}],
    }
    open_type = {
        "fontName": name, "status": "analyzed", "sourceType": "file", "fileName": file_name,
        "fontVersion": "Version 1", "fileCount": 1, "analysisDate": "2026-08-18",
        "analysisTarget": file_name, "analysisMethod": "FeatureList", "features": [{"tag": "kern", "tables": ["GPOS"]}],
        "files": [{"fileName": file_name, "sha256": "a" * 64, "features": [{"tag": "kern", "tables": ["GPOS"]}]}],
    }
    return coverage, open_type


class SummaryDetailOutputTests(unittest.TestCase):
    def test_partial_update_preserves_other_summary_and_detail_files(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            coverage_path = directory / "font-coverage-data.js"
            open_type_path = directory / "font-opentype-data.js"
            details = directory / "analysis-details"
            first_coverage, first_open_type = result("First", 65, "first.ttf")
            second_coverage, second_open_type = result("Second", 66, "second.ttf")
            subject.write_javascript(
                coverage_path, open_type_path,
                {"generatedAt": "2026-08-18", "fonts": {"first": first_coverage, "second": second_coverage}},
                {"generatedAt": "2026-08-18", "fonts": {"first": first_open_type, "second": second_open_type}},
                details,
            )
            second_detail_before = (details / "second.js").read_text(encoding="utf-8")
            first_coverage["ranges"] = [[67, 67]]
            subject.write_javascript(
                coverage_path, open_type_path,
                {"generatedAt": "2026-08-19", "fonts": {"first": first_coverage, "second": second_coverage}},
                {"generatedAt": "2026-08-19", "fonts": {"first": first_open_type, "second": second_open_type}},
                details,
                {"first"},
            )
            coverage = subject.load_javascript_data(coverage_path, "FontCoverageData")
            self.assertEqual(coverage["fonts"]["first"]["ranges"], [[67, 67]])
            self.assertEqual(coverage["fonts"]["second"]["ranges"], [[66, 66]])
            self.assertEqual((details / "second.js").read_text(encoding="utf-8"), second_detail_before)
            self.assertEqual(list(directory.rglob("*.tmp")), [])
            self.assertEqual(list(directory.rglob("*.bak")), [])

    def test_split_keeps_ranges_and_integrated_features_in_summary_only_once(self) -> None:
        coverage, open_type = result("Test", 65, "test.ttf")
        coverage_summary, open_type_summary, detail = subject.split_analysis_entries("test", coverage, open_type)
        self.assertEqual(coverage_summary["ranges"], [[65, 65]])
        self.assertEqual(open_type_summary["features"], [{"tag": "kern", "tables": ["GPOS"]}])
        self.assertNotIn("files", coverage_summary)
        self.assertNotIn("files", open_type_summary)
        self.assertEqual(len(detail["evidence"]["files"]), 1)
        self.assertEqual(detail["schemaVersion"], coverage_summary["detailSchemaVersion"])


if __name__ == "__main__":
    unittest.main()
