# Roadmap de Refonte (Source-First DocTerra)

## 🎯 Project Goal
Réorienter DocTerra vers une philosophie "Ingestion -> Itération -> Output Multi-Format", en se débarrassant des modèles pré-établis bloquants.

---

## 🧹 Phase 1 : Nettoyage & Simplification (Clean Slate) ✅
*Objectif : Retirer ce qui ne correspond plus à la vision pour partir sur une base saine.*
- [x] **Tâche 1.1** : Supprimer l'onglet "Modèles" et le fichier `templates.json`.
- [x] **Tâche 1.2** : Vider l'interface de "Forge" par défaut (Page Blanche).
- [x] **Tâche 1.3** : Simplifier le Backend pour ne plus générer de structure automatique au démarrage.

## 📥 Phase 2 : Ingestion de Sources (Nexus V2) ✅
*Objectif : Créer la porte d'entrée unique par les sources.*
- [x] **Tâche 2.1** : UI d'Upload (Drag & Drop PDF/Docx) + Input URL.
- [x] **Tâche 2.2** : Backend d'Ingestion (Extraction texte PDF + Firecrawl pour URL).
- [x] **Tâche 2.3** : Stockage persistant (Supabase) & Analyse OpenAI (Résumé auto).
- [x] **Tâche 2.4** : Affichage liste des sources dans la Sidebar avec status "Analysed" réel.

## 💬 Phase 3 : Itération Interactive (Chat Co-Pilot) 🚀
*Objectif : Le moteur de création par dialogue.*
- [ ] **Tâche 3.1** : UI Chat fluide positionné en BAS (Style ChatGPT).
- [ ] **Tâche 3.2** : Système de Double Interface (Mode Analyse / Mode Production).
- [ ] **Tâche 3.3** : Questionnaire de Calibrage Proactif (Style/Ton/Public cible).
- [ ] **Tâche 3.4** : Bouton "Synthesize Project" (Génération du 1er jet dans le Canvas).

## 📤 Phase 4 : Sortie Multi-Format (Le Prisme Réel)
*Objectif : Générer les livrables à la demande.*
- [ ] **Tâche 4.1** : Bouton de Génération Final (pas avant).
- [ ] **Tâche 4.2** : Sélecteur de Format (Rapport PDF, Slides PPTX, Flashcards).
- [ ] **Tâche 4.3** : Backend de Transformation Intelligente (Contenu Markdown -> Format Cible).

---
*Statut : Phase 2 Complétée. Prochaine étape : Construction du Chat & Mode Production.*
