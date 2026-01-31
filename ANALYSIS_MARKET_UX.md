# Rapport d'Analyse Stratégique : UX & Fonctionnalités (NotebookLM vs DocTerra)

## 1. Analyse des Standards du Marché (NotebookLM / Genspark)

### A. Philosophie d'Ingestion
*   **Omni-Sourcing** : L'utilisateur ne se soucie pas du format. PDF, Google Doc, Slide, URL YouTube, URL Web... tout va dans la même "boîte".
*   **Source-Grounded AI** : L'IA *refuse* de répondre si ce n'est pas dans les sources (ou l'indique clairement). C'est la clé de la confiance.
*   **Citations Cliquables** : Chaque affirmation de l'IA est une ancre vers le passage précis du document source. (Fonctionnalité "Check").

### B. Formats de Sortie ("Output Innovation")
*   **Le texte ne suffit plus**.
*   **Audio Overview** : Génération d'un dialogue type podcast entre deux hôtes IA. (Très engageant).
*   **Briefing Doc** : Un document "prêt à imprimer" généré automatiquement.
*   **FAQ / Study Guide** : Transformation du contenu en matériel d'apprentissage.

### C. UX / Interface
*   **Le "Notebook"** : C'est l'unité de base. Un conteneur de sources.
*   **Interface Fluide** : Pas de rechargement de page. Des panneaux coulissants (Glassmorphism).
*   **Sobriété** : Fond sombre ou très clair, typographie forte, peu de couleurs (juste des accents).

---

## 2. Le "Blueprint" DocTerra (Proposition de Valeur Unique)

Pour dépasser ces modèles, DocTerra doit être **"L'Atelier de Production"** (pas juste de consultation).

### Architecture Proposée

#### 1. L'Accueil (Le Hub)
*   **Visuel** : Épuré, sombre, "Cyber-Premium".
*   **Action** : Une "Dropzone" centrale massive. "Déposez n'importe quoi ici pour commencer une mission".
*   **Organisation** : Une grille "Mes Missions" en dessous.

#### 2. Le Cockpit de Mission (L'Interface Principale)
*   **Zone Gauche (Intel)** : Vos sources. Cliquables pour voir le contenu brut.
*   **Zone Centrale (Canvas)** : L'éditeur de texte riche. C'est là qu'on *travaille*.
*   **Zone Droite (Prisme)** : Les outils de transformation.
    *   *Bouton* : "Convertir en Slides".
    *   *Bouton* : "Générer Rapport Stratégique".
    *   *Bouton* : "Mode Podcast (Audio)".
*   **Zone Basse (Copilot)** : Le Chat barre flottante. "Aide-moi à reformuler le paragraphe 2".

### 3. Fonctionnalités Clés à Implémenter
1.  **Omni-Ingestion** : Unifier l'upload fichier et URL en un seul composant intelligent.
2.  **Citations** : Le système doit garder le lien vers la source (RAG avancé).
3.  **Output Slides** : C'est notre différenciateur majeur face à NotebookLM qui reste très "texte/audio".

---

## 3. Plan d'Action Immédiat (Technique)

1.  **Refonte de NexusIngest** : Le transformer en "Omni-Box".
2.  **Nettoyage final de l'Accueil** : Appliquer le design "Hub de Mission".
3.  **Activation du Workflow** : Connecter l'upload -> Création de Projet -> Redirection vers le Cockpit.

*Ce document sert de nouvelle boussole pour le développement.*
