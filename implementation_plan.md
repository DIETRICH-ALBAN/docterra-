# Plan de Développement DocTerra - Agence WebTerra

Ce document sert de feuille de route pour la construction de DocTerra, un outil de recherche et de synthèse de documents premium.

## 🏁 État Actuel
- Design System Quantum validé.
- Backend FastAPI fonctionnel.
- Repository GitHub : [docterra-](https://github.com/DIETRICH-ALBAN/docterra-.git) (CI/CD prêt).
- Structure Dual-View (Nexus + Forge) opérationnelle.

---

## 🏗️ Phase 1 : Consolidation UX & Transition
- [x] Initialisation GitHub et Push initial.
- [ ] Connecter le bouton "Entrer dans la Forge" au système de routage interne.
- [ ] Gérer l'état de la recherche (Query + Structure) à travers les phases.
- [ ] **Démo : Un écran splité fonctionnel avec Nexus à gauche et Document à droite.**

## 🧠 Phase 2 : Nexus des Sources (Intelligence de Source)
*Objectif : Faire de DocTerra un véritable NotebookLM.*
- [ ] Liste interactive des sources scrapées dans le panneau gauche.
- [ ] Prévisualisation rapide des sources (Popup ou tiroir).
- [ ] Capacité d'ajouter/supprimer des sources en temps réel pendant l'écriture.

## ⚡ Phase 3 : Édition Alchimique (L'Effet Wow)
*Objectif : Permettre une itération au niveau de la section.*
- [ ] Chaque bloc de texte devient éditable via un prompt de section (Ex: "Rends ce paragraphe plus technique").
- [ ] Système d'itération par Chat : Le chat du Nexus modifie le document à droite.
- [ ] Animation de génération de texte façon "Terminal de données".

## 📄 Phase 4 : Finalisation & Exports
*Objectif : Produire des documents prêts pour le monde réel.*
- [ ] Export DOCX avec styles académiques WebTerra.
- [ ] Conversion automatique du plan en Presentation Slides (Expérimental).
- [ ] Déploiement d'un lien de partage web sécurisé.

---

## 📈 Suivi des Milestones
- **M1 : Le Split-View (Aujourd'hui)**
- **M2 : L'Intelligence de Source**
- **M3 : L'Édition Contextuelle**
- **M4 : L'Alchimie Terminale (Lancement)**
