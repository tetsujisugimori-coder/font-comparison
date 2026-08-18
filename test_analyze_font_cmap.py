from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

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
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.directory = Path(self.temporary.name)
        self.coverage_path = self.directory / "font-coverage-data.js"
        self.open_type_path = self.directory / "font-opentype-data.js"
        self.details = self.directory / "analysis-details"
        self.first_coverage, self.first_open_type = result("First", 65, "first.ttf")
        self.second_coverage, self.second_open_type = result("Second", 66, "second.ttf")
        self.coverage_data = {"generatedAt": "2026-08-18", "fonts": {"first": self.first_coverage, "second": self.second_coverage}}
        self.open_type_data = {"generatedAt": "2026-08-18", "fonts": {"first": self.first_open_type, "second": self.second_open_type}}
        subject.write_javascript(self.coverage_path, self.open_type_path, self.coverage_data, self.open_type_data, self.details)
        self.original_coverage = self.coverage_path.read_bytes()
        self.original_open_type = self.open_type_path.read_bytes()
        self.original_details = {path.name: path.read_bytes() for path in self.details.glob("*.js")}

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def assert_originals_and_no_artifacts(self) -> None:
        self.assertEqual(self.coverage_path.read_bytes(), self.original_coverage)
        self.assertEqual(self.open_type_path.read_bytes(), self.original_open_type)
        self.assertEqual({path.name: path.read_bytes() for path in self.details.glob("*.js")}, self.original_details)
        self.assertEqual(list(self.directory.rglob("*.tmp")), [])
        self.assertEqual(list(self.directory.rglob("*.bak")), [])

    def test_partial_update_preserves_other_summary_and_detail_files(self) -> None:
        second_detail_before = (self.details / "second.js").read_text(encoding="utf-8")
        self.first_coverage["ranges"] = [[67, 67]]
        subject.write_javascript(
            self.coverage_path, self.open_type_path,
            {"generatedAt": "2026-08-19", "fonts": {"first": self.first_coverage, "second": self.second_coverage}},
            {"generatedAt": "2026-08-19", "fonts": {"first": self.first_open_type, "second": self.second_open_type}},
            self.details,
            {"first"},
        )
        coverage = subject.load_javascript_data(self.coverage_path, "FontCoverageData")
        self.assertEqual(coverage["fonts"]["first"]["ranges"], [[67, 67]])
        self.assertEqual(coverage["fonts"]["second"]["ranges"], [[66, 66]])
        self.assertEqual((self.details / "second.js").read_text(encoding="utf-8"), second_detail_before)
        self.assertEqual(list(self.directory.rglob("*.tmp")), [])
        self.assertEqual(list(self.directory.rglob("*.bak")), [])

    def test_preparation_failure_cleans_temporary_files_without_replacing_existing_outputs(self) -> None:
        original = subject.create_temporary_file
        for failing_call in (2, 3, 4):
            calls = 0

            def fail_at(target: Path, contents: str) -> Path:
                nonlocal calls
                calls += 1
                if calls == failing_call:
                    raise OSError(f"temporary failure {failing_call}")
                return original(target, contents)

            with self.subTest(failing_call=failing_call), patch.object(subject, "create_temporary_file", side_effect=fail_at):
                with self.assertRaisesRegex(OSError, f"temporary failure {failing_call}"):
                    subject.write_javascript(self.coverage_path, self.open_type_path, self.coverage_data, self.open_type_data, self.details)
            self.assert_originals_and_no_artifacts()

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
