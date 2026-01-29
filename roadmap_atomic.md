# Roadmap Atomique : DocTerra (Version Agence Elite)

## 🎯 North Star
Transformer une vision alpha en un document institutionnel ou stratégique de 50+ pages avec un design "Quantum Academic" sans aucune saisie manuelle lourde.

## 🛠️ Stack Validée
- **Frontend** : Next.js 14, CSS Vanilla, Framer Motion.
- **Backend** : FastAPI (Python), Docxtpl, Typst.
- **Intelligence** : Firecrawl, LangChain.

---

## 🛰️ Phase 1 : Initialisation & Dashboard Quantum (Sprint 1)
### 1.1 Configuration de l'Environnement
- [x] Initialiser le projet Next.js avec une structure `src/`.
- [x] Configurer un serveur FastAPI local pour les futurs traitements de fichiers.
- [x] Installer les dépendances UI : `framer-motion`, `lucide-react`.

### 1.2 Design System "Quantum Academic"
- [x] Créer `globals.css` avec les variables de couleurs (Fond: #050505, Accents: #00D1FF).
- [x] Implémenter la classe utilitaire `.glass` (backdrop-filter, border translucide).
- [x] Configurer la typographie (Inter pour l'UI, une Serif premium pour les documents).

### 1.3 Dashboard Shell (UI Soft)
- [x] Créer le layout principal avec une sidebar minimaliste.
- [x] Implémenter la zone centrale de "Drop" pour les templates (Word/PDF).
- [x] **CHECKPOINT** : Validation de la structure visuelle du Dashboard.


---

## 🕵️ Phase 2 : Le Cœur Intelligent (Sprint 2)
### 2.1 Moteur de Recherche "DocScout"
- [x] Créer le script backend utilisant Firecrawl pour extraire des données sur un sujet donné.
- [x] Implémenter le parser de contenu pour transformer le web en structure Markdown.


### 2.2 Expansion de Contenu
- [x] Développer la logique de "Structuring" : Sujet -> Table des matières -> Sections détaillées.
- [x] Créer une interface de prévisualisation du contenu textuel AVANT génération.

---

## 📄 Phase 3 : Moteur de Documents (Sprint 3)
### 3.1 Template Injection (DOCX)
- [x] Créer un script de test `docx_injector.py` (intégré dans `generator.py`).
- [x] Réussir à mapper des variables dynamiques (Étudiant, Professeur, Titre) dans un modèle DOCX fourni.


### 3.2 Conversion & Styles
- [ ] Intégrer Typst pour la génération de PDFs complexes avec une typographie parfaite.
- [ ] Gérer l'insertion d'images et de graphiques générés automatiquement.

---

## ✨ Phase 4 : Motion & Polissage (Sprint 4)
### 4.1 "Jack Roberts" Vibe
- [ ] Ajouter des transitions de page "Spring" via Framer Motion.
- [ ] Implémenter des barres de progression néon animées pour le temps de génération.
- [ ] Micro-interactions au hover sur tous les boutons (Motion Master).

### 🚀 Livraison Finale
- [ ] Génération d'un rapport de test de 50 pages sur le thème "L'IA en Afrique 2026".
- [ ] Rapport final de l'agence (Project Manager).

---
**Status** : ⏳ En attente de démarrage Phase 1.1
