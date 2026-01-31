from pypdf import PdfReader
from docx import Document
import os

def extract_text_from_file(file_path: str, filename: str) -> str:
    """
    Extrait le texte brut d'un fichier PDF ou DOCX.
    """
    extension = filename.split('.')[-1].lower()
    
    if extension == 'pdf':
        return _extract_from_pdf(file_path)
    elif extension in ['docx', 'doc']:
        return _extract_from_docx(file_path)
    elif extension == 'txt':
        return _extract_from_txt(file_path)
    else:
        raise ValueError(f"Format non supporté: {extension}")

def _extract_from_pdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Erreur lecture PDF: {str(e)}"

def _extract_from_docx(file_path: str) -> str:
    try:
        doc = Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        return f"Erreur lecture DOCX: {str(e)}"

def _extract_from_txt(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()
