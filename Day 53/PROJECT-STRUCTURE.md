# HireLens — Project Structure

## Day 53 — Resume Parsing Module

The HireLens project follows a modular Flask-based structure. Day 53 focuses on building and integrating the resume parsing layer for PDF and DOCX files.

```text
hirelens/
│
├── app.py
├── README.md
├── requirements.txt
│
├── parsing/
│   ├── __init__.py
│   ├── pdf_parser.py
│   ├── docx_parser.py
│   └── cleaner.py
│
├── scoring/
│   └── __init__.py
│
├── ai_service/
│   └── __init__.py
│
├── report/
│   └── __init__.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   └── js/
│
├── test_files/
│   └── HireLens_Sample_Resume.pdf
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── HireLens_Implementation_Blueprint.md
│   ├── PROJECT-STRUCTURE.md
│   ├── SCHEMA.md
│   └── UI-WIREFRAMES.md
│
└── venv/
