# Roadmap de Refonte (Source-First DocTerra)

## 🎯 Vision Globale
Transformer DocTerra en une "Document Factory" premium où l'utilisateur commence par importer ses sources (fichiers/web) pour ensuite co-créer des livrables de haute valeur (Rapports, Slides, Podcasts) via une interface unifiée.

---

## 🧹 Phase 1 : Nettoyage & Fondation (Terminée) ✅
*Objectif : Créer une base saine et éliminer l'ancien système de templates.*
- [x] **Tâche 1.1** : Suppression des anciens templates et boutons "fake".
- [x] **Tâche 1.2** : Mise en place de l'architecture "Nexus" (Backend Ingestion).
- [x] **Tâche 1.3** : Création de l'interface d'accueil "Command Center" épurée.

---

## 📥 Phase 2 : Ingestion Unifiée (Nexus V3) (Terminée) ✅
*Objectif : L'expérience d'importation fluide "Omni-Box".*
- [x] **Tâche 2.1** : Création du composant `NexusIngest` unifié (Dropzone + URL intelligent).
- [x] **Tâche 2.2** : Backend supportant l'analyse automatique post-ingestion (OpenAI Summary).
- [x] **Tâche 2.3** : Suppression des distinctions visuelles inutiles "Web vs Fichier".

---

## 🚀 Phase 3 : Le Workflow "Source-to-Forge" (À Faire)
*Objectif : Connecter l'accueil à l'espace de travail via une transition fluide.*

### 3.1 UX de Transition (Le "Swipe")
- [ ] **Déclencheur** : Ajouter un bouton "Lancer la Mission" qui apparaît dès qu'une source est chargée.
- [ ] **Animation** : Transition "Swipe Up" ou "Slide Left" pour révéler le Cockpit (Forge).
- [ ] **Persistance** : Garder les sources en mémoire lors du changement de vue.

### 3.2 L'Interface "Cockpit" (Nouvelle Forge)
- [ ] **Layout 3-Colonnes** :
    -   *Gauche* : **Intel Panel**. Liste des sources actives (avec statut d'analyse). Cliquables pour visualiser le contenu brut.
    -   *Centre* : **Canvas**. L'éditeur de document (TipTap ou simple Textarea riche).
    -   *Droite* : **Studio**. Les outils de transformation (Boutons d'action).
- [ ] **Nettoyage Menu** : Retirer définitivement "Analytiques" et "Équipe". Ne garder que "Projets" (Archives) et "Réglages".

### 3.3 Le "Chat Co-Pilot"
- [ ] **Position** : Barre flottante en bas de l'écran (style Messenger/ChatGPT).
- [ ] **Contexte** : Le chat doit avoir accès au contenu des sources (RAG).
- [ ] **Actions** : Capacité du chat à écrire dans le Canvas ("Insère ce paragraphe").

---

## ⚙️ Phase 4 : Personnalisation & Formats (Le "Prisme") (À Faire)
*Objectif : Donner le contrôle à l'utilisateur sur le résultat.*

### 4.1 Réglages de Génération
- [ ] **Panneau "Calibrage"** : Avant de générer, demander :
    -   *Ton* : Académique, Juridique, Journalistique, Viral.
    -   *Langue* : FR, EN, ES.
    -   *Format* : Rapport, Slides, Thread Twitter.
- [ ] **Selecteur de Modèle** : Laisser le choix (GPT-4o, Claude 3.5 Sonnet) pour les utilisateurs avancés.

### 4.2 Nouveaux Formats de Sortie
- [ ] **Slides PPTX** : Backend de génération Python-pptx.
- [ ] **Audio Overview** : Intégration TTS (OpenAI Audio) pour générer un podcast de synthèse.

---

*Statut Actuel : Phase 2 validée. En attente de GO pour lancer la Phase 3 (Transition UX).*
