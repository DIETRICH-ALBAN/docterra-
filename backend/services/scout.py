import os
from firecrawl import FirecrawlApp
from typing import List, Dict

class DocScout:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("FIRECRAWL_API_KEY")
        if self.api_key:
            self.app = FirecrawlApp(api_key=self.api_key)
        else:
            self.app = None

    async def search_and_extract(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Recherche sur le web et extrait le contenu principal des pages.
        """
        if not self.app:
            return [{"title": "Mode Démo", "content": "Veuillez configurer FIRECRAWL_API_KEY pour une recherche réelle.", "url": ""}]
        
        # Simulation ou appel réel si API Key présente
        try:
            search_result = self.app.search(query, params={"limit": limit})
            return search_result.get("data", [])
        except Exception as e:
            return [{"error": str(e)}]

    def format_to_markdown(self, data: List[Dict]) -> str:
        """
        Transforme les résultats bruts en structure Markdown propre.
        """
        md = "# Résultats de la Recherche DocScout\n\n"
        for item in data:
            md += f"## {item.get('title', 'Sans titre')}\n"
            md += f"**Source**: {item.get('url', 'N/A')}\n\n"
            md += f"{item.get('content', 'Pas de contenu extrait.')}\n\n"
            md += "---\n\n"
        return md
