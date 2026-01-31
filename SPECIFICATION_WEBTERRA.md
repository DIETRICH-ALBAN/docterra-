# SPECIFICATION_WEBTERRA.md - Le Contrat de Vision (Définitif)

## 1. Philosophie & Détail UI
DocTerra est un atelier professionnel. L'interface doit être épurée et fonctionnelle. Pas de "fake buttons".

### Accueil (Dashboard)
- **Menu Header Actuel (Analytiques/Équipe/Vue d'ensemble)** : 
    - *Décision* : Suppression pour le MVP pour éviter la confusion. On garde "Vue d'ensemble" (Dashboard).
    - *Futur* : On pourra les réactiver quand on aura des features multi-users.
- **Corps de Page** :
    - Remplacer le bouton unique "Nouvelle Usine" par une vraie vue de gestion.
    - **Grille de Projets** : "Mes Dossiers".
    - **Bouton Rapide** : "Nouveau" (Ingestion).

## 2. Architecture du Workflow (Séquentiel)

### Phase A : Ingestion & Analyse (Interface 1)
*Objectif : Constituer et comprendre la base de connaissance.*
- **UI** : Gestionnaire de fichiers / Liste des sources.
- **Action** : Upload (drag/drop) + URL (scraping).
- **Traitement** : Résumé auto de toutes les sources dès l'ingestion.
- **Interaction** : Chat possible dès cette étape.

### Phase B : Calibrage (Transition)
*Objectif : Définir l'intention avant l'écriture.*
- Questionnaire style / ton / public avant de générer le premier jet du Canvas.

### Phase C : Production (Interface 2 - La Forge)
*Objectif : Rédaction assistée.*
- **Disposition** :
    - **Haut (60%)** : Canvas (Éditeur de texte riche pré-rempli).
    - **Bas (40%)** : Chat d'interaction.
- **Sidebar** : Liste des sources toujours visible (repliable).

### Phase D : Export (Le Prisme)
- Formats : PDF, PPTX, Flashcards.
- Le Prisme est un outil de transformation intelligente du contenu validé dans le Canvas.

---

## 3. Détails Techniques
- **Stockage** : Persistant (Supabase).
- **Limites** : 10 sources max.
- **Composants d'interface** : Nettoyage des menus latéraux inutiles ("Système" sans fonction).

---
**STATUT : VALIDÉ POUR DÉVELOPPEMENT.**
**PROCHAINE ÉTAPE : Code Backend Ingestion (Tâche 2.2).**
