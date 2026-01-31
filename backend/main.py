from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from services.scout import DocScout
from services.writer import DocWriter
from services.generator import DocGenerator
from services.database import DatabaseService, supabase
from services.slides import SlidesGenerator 
from services.firecrawl_service import FirecrawlService
from services.openai_service import OpenAIService
from services.file_extractor import extract_text_from_file

import os
import uuid
import shutil
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="DocTerra API", version="1.0")

# Services
scout = DocScout()
writer = DocWriter()
generator = DocGenerator(output_dir="exports")
slides_gen = SlidesGenerator(output_dir="exports")
db = DatabaseService()
firecrawl = FirecrawlService()
openai_svc = OpenAIService()

class IngestUrlRequest(BaseModel):
    url: str
    project_id: str

class AnalyzeRequest(BaseModel):
    project_id: str
    source_id: str

# Configuration CORS
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
    user_id = payload.get("user_id", str(uuid.uuid4()))
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    doc_res = db.save_document(user_id, f"Recherche : {query}", "", "")
    doc_id = doc_res.data[0]['id']
    
    results = await scout.search_and_extract(query)
    
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

@app.get("/documents")
async def list_documents(user_id: str = "default_user"):
    from services.database import supabase
    res = supabase.table("documents").select("id, title, created_at, status").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data

@app.get("/documents/{doc_id}")
async def get_document_full(doc_id: str):
    from services.database import supabase
    # Récupérer le doc
    doc = supabase.table("documents").select("*").eq("id", doc_id).single().execute()
    # Récupérer les sources
    sources = supabase.table("sources").select("*").eq("document_id", doc_id).execute()
    # Récupérer les sections
    sections = supabase.table("sections").select("*").eq("document_id", doc_id).order("sort_order").execute()
    
    return {
        "document": doc.data,
        "sources": sources.data,
        "sections": sections.data
    }

@app.post("/refine")
async def refine_section(payload: dict):
    section_content = payload.get("content")
    section_title = payload.get("title")
    query = payload.get("query")
    instruction = payload.get("instruction", "Enrichis cette section avec des données factuelles et un style académique premium.")
    
    if not section_title:
        raise HTTPException(status_code=400, detail="Title is required")

    prompt = f"""
    Contexte : Rédaction d'un rapport sur '{query}'.
    Section : {section_title}
    Contenu actuel : {section_content}
    
    Instruction : {instruction}
    
    Tâche : Réécris ce paragraphe pour qu'il soit dense, informatif et parfaitement structuré (env. 150 mots). Utilise un ton d'expert.
    """
    
    try:
        response = writer.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}]
        )
        new_content = response.choices[0].message.content
        return {"content": new_content}
    except Exception as e:
         return {"content": f"Erreur d'alchimie : {str(e)}", "error": True}

# --- NOUVEAUX ENDPOINTS DE PRISME (MULTI-FORMAT) ---

@app.post("/prism/report")
async def generate_report(payload: dict):
    data = payload.get("data")
    if not data:
        raise HTTPException(status_code=400, detail="Data is required")
    
    file_name = f"Report_{uuid.uuid4().hex[:8]}"
    output_path = generator.generate_docx("default.docx", data, file_name)
    return {"status": "success", "file_path": output_path, "filename": f"{file_name}.docx"}

@app.post("/prism/slides")
async def generate_slides(payload: dict):
    data = payload.get("data")
    if not data:
        raise HTTPException(status_code=400, detail="Data is required")
    
    file_name = f"Slides_{uuid.uuid4().hex[:8]}"
    output_path = slides_gen.generate_slides(data, file_name)
    return {"status": "success", "file_path": output_path, "filename": f"{file_name}.pptx"}

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join("exports", filename)
    if os.path.exists(file_path):
        # Déterminer le media type
        media_type = 'application/octet-stream'
        if filename.endswith(".docx"):
            media_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        elif filename.endswith(".pptx"):
            media_type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        
        return FileResponse(file_path, media_type=media_type, filename=filename)
    raise HTTPException(status_code=404, detail="Fichier introuvable")

# --- NOUVEAUX ENDPOINTS D'INGESTION ---

@app.post("/api/ingest/file")
async def ingest_file(project_id: str, file: UploadFile = File(...)):
    """Ingère un fichier PDF/DOCX et extrait le texte."""
    file_id = str(uuid.uuid4())
    temp_dir = "temp"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
        
    file_path = os.path.join(temp_dir, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        text_content = extract_text_from_file(file_path, file.filename)
        
        source_data = {
            "document_id": project_id,
            "title": file.filename,
            "source_type": "file",
            "content": text_content,
            "status": "raw"
        }
        
        res = supabase.table("sources").insert(source_data).execute()
        source = res.data[0]
        
        # Cleanup
        os.remove(file_path)
        
        return {"status": "success", "source": source}
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ingest/url")
async def ingest_url(request: IngestUrlRequest):
    """Scrape une URL via Firecrawl."""
    try:
        res = firecrawl.scrape_url(request.url)
        
        source_data = {
            "document_id": request.project_id,
            "title": res.get("title", request.url),
            "url": request.url,
            "source_type": "web",
            "content": res.get("markdown", ""),
            "status": "raw"
        }
        
        db_res = supabase.table("sources").insert(source_data).execute()
        return {"status": "success", "source": db_res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/analyze/{source_id}")
async def analyze_source(source_id: str):
    """Analyse une source spécifique pour générer un résumé structuré."""
    try:
        # Récupérer la source
        res = supabase.table("sources").select("*").eq("id", source_id).single().execute()
        source = res.data
        
        analysis = await openai_svc.analyze_source(source["title"], source["content"])
        
        # Mettre à jour la source avec le résumé
        summary_text = analysis.get("executive_summary", "Pas de résumé.")
        supabase.table("sources").update({"summary": summary_text, "status": "analysed"}).eq("id", source_id).execute()
        
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/synthesize/{project_id}")
async def synthesize_project(project_id: str):
    """Génère un résumé global (Premier jet du Canvas) à partir de toutes les sources du projet."""
    try:
        # Récupérer toutes les sources du projet
        res = supabase.table("sources").select("*").eq("document_id", project_id).execute()
        sources = res.data
        
        if not sources:
            raise HTTPException(status_code=400, detail="Aucune source trouvée pour ce projet.")
            
        synthesis = await openai_svc.generate_global_summary(sources)
        
        # Mettre à jour le document Canvas
        supabase.table("documents").update({"content": synthesis}).eq("id", project_id).execute()
        
        return {"status": "success", "synthesis": synthesis}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
