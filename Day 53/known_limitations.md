# HireLens — Known Limitations

## 1. Multi-Column PDF Reading Order

PDF text extraction may not always preserve the original visual reading order of multi-column resumes.

For example, text from the left and right columns may appear in a different order after extraction.

This is a known limitation of the current PDF parsing implementation.

---

## 2. Scanned / Image-Based PDFs

The current PDF parser works with text-based PDFs.

If a PDF contains scanned images instead of an actual text layer, `pdfplumber` may not be able to extract usable text.

The application detects this situation and returns a clear error message:

```text
This PDF appears to be scanned/image-based; please upload a text-based PDF.
