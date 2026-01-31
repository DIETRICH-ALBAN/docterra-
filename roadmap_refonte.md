# Roadmap de Refonte (Source-First DocTerra V2.1)

## 🎯 Vision : La Document Factory Intelligente
Unifier l'importation de connaissances et la production de livrables dans un workflow fluide et premium.

---

## 🧹 Phase 1 & 2 : Nettoyage et Ingestion (Terminées) ✅
*   Architecture Backend Ingestion (PDF/URL).
*   Nettoyage UI (Suppression des anciens modèles).
*   Base de l'accueil "Command Center".

---

## 🏗️ Phase 3 : Intel Center & Transition UX (PLANIFICATION)
*Objectif : Différencier l'importation manuelle de la découverte assistée.*

### 3.1 L'Interface d'Accueil Duale
- [ ] **Multi-Upload (Le "Apport")** : Refonte de NexusIngest pour supporter le drag-and-drop de fichiers multiples simultanément avec file d'attente.
- [ ] **Autonomous Scout (La "Découverte")** : Intégration d'un agent de recherche qui scanne le Web/YouTube selon un prompt et propose une liste de sources à "Ingérer" via Firecrawl.
- [ ] **Omni-Box UI** : Unifier ces deux modes sans confusion visuelle (Deux onglets ou zone de drop hybride).

### 3.2 Navigation & Menu
- [ ] **Archives** : Liste fonctionnelle des projets passés (Titre, Date, Nb de sources) avec prévisualisation rapide au survol.
- [ ] **Projets** : Système de dossiers/missions.
- [ ] **Settings** : Configuration des modèles (GPT-4 / Claude) et des préférences de sortie.

### 3.3 Le Workflow (Le Swipe)
- [ ] **Transition State** : Animation fluide entre l'Accueil et la Forge avec transfert du contexte (ProjectID + Sources).

---

## 🎨 Phase 4 : La Forge (Studio de Production)
*Objectif : Transformer l'intel en livrables.*

### 4.1 Layout "Production Standard"
- [ ] **Intel Panel (Gauche)** : Gestionnaire de sources contextuel. Visualisation du texte extrait.
- [ ] **Canvas (Centre)** : Éditeur dynamique pré-rempli par la synthèse initiale.
- [ ] **Studio (Droite)** : Outil de transformation (Prisme) vers Slides, DOCX, ou Audio.

### 4.2 Chat Co-Pilot Contextuel
- [ ] **Floating Bar** : Chat en bas de l'écran avec capacité d'écriture directe dans le Canvas.

---
*Statut : Planification V2.1 validée. Prêt pour mise à jour des documents.*
