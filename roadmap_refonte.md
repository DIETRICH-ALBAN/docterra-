# Roadmap de Refonte (Source-First DocTerra V2.2)

## 🎯 Vision : Le Studio de Production Alchimique
L'utilisateur n'est plus un spectateur, c'est le chef d'orchestre d'une IA qui cherche, trie et transforme.

---

## 🧹 Phase 1 & 2 : Nettoyage et Ingestion (Validées) ✅
*   Architecture Backend Ingestion (Fichiers/Web).
*   Nettoyage des anciens composants.

---

## 🏗️ Phase 3 : L'Intel Center & La Transition (DÉTAILLÉ)
*Objectif : Une porte d'entrée unique et puissante. Design "Soft & Elegant".*

### 3.1 Interface "Monolith V3" (Accueil)
- [ ] **Design Soft** : Un seul conteneur central, glassmorphism profond, coins 3rem.
- [ ] **Dualité Verticale** : 
    - *Haut* : Investigation (Search/Chat).
    - *Milieu* : Séparateur "Glow Line" avec label "OU".
    - *Bas* : Dropzone discrète pour multi-upload.

### 3.2 Workflow "Investigation / Scout" 🔍
- [ ] **Instant Search** : Quand l'utilisateur tape un sujet, appel à `/api/scout/search`.
- [ ] **Curation UI** : Affichage d'une grille de résultats (Web/Videos) avec checkboxes. 
- [ ] **Validation** : L'utilisateur coche ce qu'il veut avant d'importer réellement.

### 3.3 Multi-Upload & Statut 📁
- [ ] **Multi-Select** : Support de l'upload simultané de plusieurs fichiers.
- [ ] **Intel Pills** : Petits badges pour chaque source ajoutée (avec bouton X pour retirer).

### 3.4 La Transition "The Swipe" 🚀
- [ ] **Trigger** : Bouton "Lancer la Mission" visible uniquement si sources > 0.
- [ ] **Animation** : L'accueil monte (Slide Up), la Forge arrive par le bas avec un effet de profondeur.

---

## 🎨 Phase 4 : La Forge (Cockpit 3-Colonnes)
*Objectif : Travailler la matière grise.*

### 4.1 Layout Cockpit
- [ ] **Intel (Gauche)** : Liste des sources chargées.
- [ ] **Canvas (Centre)** : Éditeur Serif premium.
- [ ] **Studio (Droite)** : Centre d'export (Slides, Rapport, Audio).

### 4.2 Copilot (Chat Bar)
- [ ] **Floating Input** : Barre flottante en bas du Canvas pour commander l'IA.

---
*Statut : Planification V2.2 détaillée. En attente de validation finale.*
