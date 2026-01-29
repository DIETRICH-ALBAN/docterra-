from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from services.scout import DocScout
from services.writer import DocWriter
from services.generator import DocGenerator
import os

app = FastAPI(title="DocTerra API", version="1.0")
scout = DocScout()
writer = DocWriter()
generator = DocGenerator(template_dir="data/templates")

# Configuration CORS pour le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
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
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    results = await scout.search_and_extract(query)
    markdown_content = scout.format_to_markdown(results)
    
    return {
        "query": query,
        "results": results,
        "markdown": markdown_content
    }

@app.post("/structure")
async def generate_doc_structure(payload: dict):
    topic = payload.get("topic")
    context = payload.get("context", "")
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")
    
    structure = await writer.generate_structure(topic, context)
    return structure

@app.post("/generate")
async def generate_document(payload: dict):
    template = payload.get("template", "default.docx")
    data = payload.get("data")
    if not data:
        raise HTTPException(status_code=400, detail="Data is required")
    
    output_path = generator.generate_docx(template, data, data.get("title", "document").replace(" ", "_"))
    return {"status": "success", "file_path": output_path}

@app.get("/download/{filename}")
async def download_file(filename: str):
    # On cherche dans le dossier défini dans DocGenerator (data/templates par le passé, maintenant output_dir)
    file_path = os.path.join("data/templates", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename=filename)
    raise HTTPException(status_code=404, detail="Fichier introuvable")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
