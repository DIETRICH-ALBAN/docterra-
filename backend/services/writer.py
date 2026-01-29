from typing import List, Dict
import os
from openai import OpenAI

class DocWriter:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    async def generate_structure(self, topic: str, context: str = "") -> Dict:
        """
        Génère une table des matières structurée.
        """
        if not self.client:
            return {
                "title": f"Rapport sur {topic}",
                "sections": [
                    {"title": "Introduction", "content": "Lorem ipsum..."},
                    {"title": "Analyse Technique", "content": "Détails techniques..."},
                    {"title": "Conclusion", "content": "Finalité..."}
                ]
            }

        prompt = f"Génère une table des matières détaillée pour un rapport académique sur : {topic}.\nContexte extrait du web : {context[:2000]}\nRéponds en JSON avec 'title' et 'sections' (liste d'objets avec 'title' et 'brief')."
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"error": str(e)}
