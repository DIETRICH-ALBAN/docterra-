# Architecture Technique : DocTerra v1.0

Structure validée pour garantir la manipulation de fichiers sans perte de design.

## 1. Stack Technologique
- **Frontend** : Next.js 14+ (App Router), CSS Vanilla (pour le contrôle total demandé), Framer Motion (animations).
- **Backend API** : FastAPI (Python 3.11+) - choisi pour sa rapidité et sa compatibilité avec les libs de traitement de documents.
- **Manipulation de Documents** :
    - **Word** : `docxtpl` (Utilisation de templates Jinja2 dans .docx).
    - **PowerPoint** : `python-pptx` (Génération dynamique de slides).
    - **PDF** : `typst-py` (pour un rendu vectoriel parfait) ou `ReportLab`.
- **IA/Contenu** : LangChain / OpenAI SDK pour l'expansion de texte et le "Scouting" de données.

## 2. Flux de Données (Handoff)
1. **Input** : Sujet + Fichiers Modèles (Word/PDF).
2. **Analysis** : Extraction du style CSS et des zones de texte via `PyMuPDF`.
3. **Processing** : Recherche web -> Génération Markdown -> Injection dans les thèmes.
4. **Generation** : Compilation finale dans le format choisi.

## 3. Infrastructure
- **Hébergement** : Vercel (Front) + Cloud Run ou Railway (Backend Python pour la persistance et les builds lourds).
