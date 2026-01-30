import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL") or ""
key: str = os.getenv("SUPABASE_ANON_KEY") or ""
supabase: Client = create_client(url, key)

class DatabaseService:
    @staticmethod
    def save_document(user_id: str, title: str, content: str, file_path: str):
        # Exemple de fonction pour sauvegarder les métadonnées
        data = {
            "user_id": user_id,
            "title": title,
            "content": content,
            "file_path": file_path
        }
        return supabase.table("documents").insert(data).execute()
