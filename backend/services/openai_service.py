from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def analyze_source(self, title: str, content: str) -> dict:
        """
        Génère un résumé structuré d'une source unique.
        """
        prompt = f"""
        Analyse la source suivante :
        Titre: {title}
        Contenu: {content[:4000]} # Limite pour éviter les dépassements de contexte

        Tâche : Propose un résumé structuré en JSON avec les champs suivants :
        - title: Un titre optimisé
        - short_summary: Un résumé en 2 phrases
        - key_topics: Une liste de 5 mots-clés
        - executive_summary: Un résumé détaillé (~100 mots)
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "system", "content": "Tu es un analyste stratégique expert."},
                          {"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": str(e)}

    async def generate_global_summary(self, sources: list) -> str:
        """
        Génère une synthèse globale de plusieurs sources.
        """
        combined_text = "\n\n".join([f"Source: {s['title']}\nContenu: {s['content'][:1000]}" for s in sources])
        
        prompt = f"""
        Voici plusieurs sources d'informations sur un sujet. 
        Synthétise-les pour créer un document de base (un premier jet) qui combine tous les points clés.
        
        Sources :
        {combined_text}
        
        Retourne un document structuré en Markdown.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "system", "content": "Tu es un rédacteur de haut niveau."},
                          {"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Erreur de synthèse : {str(e)}"
