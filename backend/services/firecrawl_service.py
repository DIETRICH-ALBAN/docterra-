import os
import requests
from dotenv import load_dotenv

load_dotenv()

class FirecrawlService:
    def __init__(self):
        self.api_key = os.getenv("FIRECRAWL_API_KEY")
        self.base_url = "https://api.firecrawl.dev/v1"

    def scrape_url(self, url: str) -> dict:
        """
        Scrape une URL en Markdown via l'API Firecrawl.
        """
        if not self.api_key:
            return {"markdown": f"Contenu simulé pour {url} (API Key manquante)", "title": "Mock Source"}

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": url,
            "formats": ["markdown"]
        }
        
        try:
            response = requests.post(f"{self.base_url}/scrape", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            return {
                "markdown": data.get("data", {}).get("markdown", "Pas de contenu trouvé."),
                "title": data.get("data", {}).get("metadata", {}).get("title", url)
            }
        except Exception as e:
            return {"error": str(e), "markdown": f"Erreur lors du scraping de {url}"}
