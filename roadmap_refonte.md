# Roadmap de Refonte (Source-First DocTerra)

## 🎯 Project Goal
Réorienter DocTerra vers une philosophie "Ingestion -> Itération -> Output Multi-Format", en se débarrassant des modèles pré-établis bloquants.

---

## 🧹 Phase 1 : Nettoyage & Simplification (Clean Slate)
*Objectif : Retirer ce qui ne correspond plus à la vision pour partir sur une base saine.*
- [x] **Tâche 1.1** : Supprimer l'onglet "Modèles" et le fichier `templates.json`.
- [x] **Tâche 1.2** : Vider l'interface de "Forge" par défaut (Page Blanche).
- [x] **Tâche 1.3** : Simplifier le Backend pour ne plus générer de structure automatique au démarrage.

## 📥 Phase 2 : Ingestion de Sources (Nexus V2)
*Objectif : Créer la porte d'entrée unique par les sources.*
- [x] **Tâche 2.1** : UI d'Upload (Drag & Drop PDF/Docx) + Input URL.
- [ ] **Tâche 2.2** : Backend d'Ingestion (Extraction texte PDF + Firecrawl pour URL).
- [ ] **Tâche 2.3** : Stockage vectoriel basique (Q&A ready).
- [ ] **Tâche 2.4** : Affichage liste des sources "brutes" dans la Sidebar.

## 💬 Phase 3 : Itération Interactive (Chat Co-Pilot)
*Objectif : Le moteur de création par dialogue.*
- [ ] **Tâche 3.1** : UI Chat fluide (comme Gemini/NotebookLM).
- [ ] **Tâche 3.2** : Backend Chat avec contexte des sources importées.
- [ ] **Tâche 3.3** : Implémentation des "Suggested Actions" (Chips) : "Résumer", "Extraire Plan", "Critiquer".
- [ ] **Tâche 3.4** : Action "Add to Document" (Transfert Chat -> Document).

## 📤 Phase 4 : Sortie Multi-Format (Le Prisme Réel)
*Objectif : Générer les livrables à la demande.*
- [ ] **Tâche 4.1** : Bouton de Génération Final (pas avant).
- [ ] **Tâche 4.2** : Sélecteur de Format (Rapport PDF, Slides PPTX, Flashcards).
- [ ] **Tâche 4.3** : Backend de Transformation (Contenu Markdown -> Format Cible).

---
*Statut : En attente de validation utilisateur avant lancement de la Phase 1.*
