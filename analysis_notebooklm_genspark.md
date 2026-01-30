# Comparative Analysis: NotebookLM vs. Genspark vs. DocTerra

## 1. NotebookLM (Google)
**Core Philosophy:** "Grounding". It's not about searching the web endlessly, but about "chatting" with a specific set of documents you upload.
**Workflow:**
1.  **Source Upload:** User dumps PDFs, GDocs, or URLs.
2.  **Source Guide:** AI automatically generates a summary, key topics, and suggested questions.
3.  **Chat Iteration:** User asks questions *only* about the uploaded sources.
4.  **Audio Brief:** One-click generation of a "Podcast" discussing the sources.
**Key Lesson for DocTerra:** The "Source Guide" is genius. Before even writing, show the user what the AI understood from the sources.

## 2. Genspark AI (Sparkle)
**Core Philosophy:** "Sparkpage". It generates a custom landing page for every query. It's a "Zero-Click Search" on steroids.
**Workflow:**
1.  **Query:** User types a question.
2.  **Sparkpage Generation:** AI creates a structured page (Introduction, Pros/Cons, Videos, Deep Dive).
3.  **Parallel Agent Execution:** It runs multiple searches to fill different sections of the page simultaneously.
**Key Lesson for DocTerra:** The "Parallel Agent" approach. Don't just scan once. Scan for "Background", then scan for "Data", then scan for "Opposing Views".

## 3. DocTerra (The Synthesis)
**Vision:** Combining the *Grounding* of NotebookLM with the *Proactive Generation* of Genspark.

### 🆕 The "DocTerra Way" Workflow (Revised):
1.  **Initiation (The Seed)**: User chooses a Template OR starts with a Query.
2.  **The Scout (Multi-Agent)**: 
    *   *Agent A* searches for general context.
    *   *Agent B* searches for academic papers/PDFs.
    *   *Agent C* searches for recent news.
3.  **The Nexus (Source Consolidation)**: 
    *   User sees a list of "Candidates" (URLs/PDFs found).
    *   User *validates* which ones to keep (like NotebookLM).
4.  **The Forge (Iterative Construction)**:
    *   Instead of writing the whole doc at once, we write it *Section by Section*.
    *   **Chat with Section**: "Rewrite this section using Source #3".
5.  **The Prism (Output)**:
    *   One-click transform to PPTX, PDF, Audio.

---
**Next Step Recommendation:**
Implement the **Nexus Source Validation** screen. Before generating the text, show the user what was found and let them uncheck irrelevant sources.
