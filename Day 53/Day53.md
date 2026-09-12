# Day 53 — HireLens Resume Parsing Module

## 🚀 Capstone Project

**HireLens — AI Resume Analyzer & Job Match Assistant**

Today I moved HireLens from system design into a working resume parsing implementation.

## 🎯 Day 3 Objective

Build a reliable resume parsing foundation that extracts clean text from PDF and DOCX resumes.

## ✅ What I Built

- PDF resume extraction using `pdfplumber`
- DOCX resume extraction using `python-docx`
- Resume text cleaning
- Consistent `parse_resume()` output contract
- Flask `POST /upload-resume` endpoint
- PDF and DOCX file validation
- 5 MB upload size validation
- Graceful error handling
- Scanned/image-based PDF detection
- Temporary resume verification UI

## 🧪 Verification

Successfully uploaded a resume through the local HireLens application and displayed the extracted resume text in the browser.

## 📂 Parsing Module

```text
parsing/
├── __init__.py
├── pdf_parser.py
├── docx_parser.py
└── cleaner.py
