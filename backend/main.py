from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from services.scout import DocScout
from services.writer import DocWriter
from services.generator import DocGenerator
from services.database import DatabaseService
import os
import uuid
from typing import Optional

app = FastAPI(title="DocTerra API", version="1.0")

# Chargement des variables d'environnement si nécessaire (déjà fait dans les services)
scout = DocScout()
writer = DocWriter()
# Utilisation d'un dossier 'exports' pour les fichiers générés
generator = DocGenerator(output_dir="exports")
db = DatabaseService()

# Configuration CORS pour le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "online", "agency": "WebTerra", "project": "DocTerra"}

@app.post("/scout")
async def perform_scout(payload: dict):
    query = payload.get("query")
    user_id = payload.get("user_id", str(uuid.uuid4())) # ID temporaire si non fourni
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    # 1. Création de l'entrée Document dans Supabase
    doc_res = db.save_document(user_id, f"Recherche : {query}", "", "")
    doc_id = doc_res.data[0]['id']
    
    # 2. Recherche et Extraction réelle via Firecrawl
    results = await scout.search_and_extract(query)
    
    # 3. Sauvegarde des sources dans Supabase
    saved_sources = []
    for res in results:
        source_data = {
            "document_id": doc_id,
            "title": res.get("title", "Source sans titre"),
            "url": res.get("url", ""),
            "source_type": "web",
            "content": res.get("markdown", res.get("content", "")),
            "status": "analysed"
        }
        # Insertion individuelle (on pourrait optimiser avec insert([]) si le SDK le permet proprement ici)
        from services.database import supabase
        s_res = supabase.table("sources").insert(source_data).execute()
        saved_sources.append(s_res.data[0])
    
    markdown_content = scout.format_to_markdown(results)
    
    return {
        "doc_id": doc_id,
        "query": query,
        "results": saved_sources,
        "markdown": markdown_content
    }

@app.post("/structure")
async def generate_doc_structure(payload: dict):
    topic = payload.get("topic")
    context = payload.get("context", "")
    doc_id = payload.get("doc_id")
    
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")
    
    structure = await writer.generate_structure(topic, context)
    
    # facultatif : on pourrait sauvegarder la structure (sections) dans Supabase ici
    if doc_id and "sections" in structure:
        from services.database import supabase
        for i, section in enumerate(structure["sections"]):
            section_data = {
                "document_id": doc_id,
                "title": section.get("title"),
                "brief": section.get("brief"),
                "sort_order": i
            }
            supabase.table("sections").insert(section_data).execute()
            
    return structure

@app.post("/generate")
async def generate_document(payload: dict):
    template = payload.get("template", "default.docx")
    data = payload.get("data")
    doc_id = payload.get("doc_id")
    
    if not data:
        raise HTTPException(status_code=400, detail="Data is required")
    
    file_name = f"{data.get('title', 'document').replace(' ', '_')}_{uuid.uuid4().hex[:8]}"
    output_path = generator.generate_docx(template, data, file_name)
    
    # Mise à jour du document dans Supabase avec le lien du fichier
    if doc_id:
        from services.database import supabase
        supabase.table("documents").update({"file_path": output_path, "status": "completed"}).eq("id", doc_id).execute()
        
    return {"status": "success", "file_path": output_path}

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join("exports", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename=filename)
    raise HTTPException(status_code=404, detail="Fichier introuvable")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
