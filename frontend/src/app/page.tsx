"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import NexusIngest from "@/components/NexusIngest"; // Import correct
import Forge from "@/components/Forge";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'scout' | 'forge'>('scout');
  const [structure, setStructure] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadProject = async (docId: string) => {
    try {
      const resp = await fetch(`http://localhost:8000/documents/${docId}`);
      const data = await resp.json();

      setProjectId(docId);
      setStructure({
        title: data.document.title,
        sections: data.sections
      });
      setSources(data.sources);
      setQuery(data.document.title);
      setPhase('forge');
    } catch (error) {
      alert("Erreur Nexus : Impossible de charger l'archive.");
    }
  };

  const handleSourceAdded = (newSource: any) => {
    // Quand une source est ajoutée, on met à jour l'état local et on prépare le terrain
    setSources(prev => [...prev, newSource]);
    // Note: On reste sur l'écran d'accueil pour permettre d'ajouter d'autres sources
    // Un bouton "Lancer la Forge" (swipe) devra être ajouté pour passer à l'étape suivante quand l'user est prêt.
  };

  if (!mounted) return <div className="bg-background min-h-screen" />;

  return (
    <main className="flex min-h-screen selection:bg-accent/40 selection:text-white bg-[#050505] overflow-hidden">
      <Sidebar onLoadProject={handleLoadProject} />

      <AnimatePresence mode="wait">
        {phase === 'scout' ? (
          <motion.section
            key="scout-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col relative overflow-hidden"
          >
            {/* Header Minimaliste - Identité de Marque */}
            <header className="flex items-center justify-between p-8 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-black flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(34,211,238,0.2)]">WT</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-widest uppercase leading-none">WebTerra</span>
                  <span className="text-[10px] text-white/30 font-mono">Document Factory v2.0</span>
                </div>
              </div>
            </header>

            {/* Content Area : Focus Ingestion (Centré) */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20 z-10 relative px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center gap-10 max-w-3xl w-full"
              >
                {/* Titre Accrocheur */}
                <div className="text-center space-y-4">
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                    Nouvelle <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Mission</span>
                  </h1>
                  <p className="text-white/40 text-sm md:text-base max-w-lg mx-auto font-medium">
                    Déposez vos documents bruts ou URLs. L'IA les transformera en rapports stratégiques, slides et synthèses.
                  </p>
                </div>

                {/* Composant d'Ingestion (La "Star") */}
                <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-1 ring-white/5 hover:ring-accent/20 transition-all duration-500 group">
                  <div className="bg-[#050505] rounded-2xl border border-dashed border-white/10 group-hover:border-accent/30 transition-colors">
                    <NexusIngest project_id="" onSourceAdded={handleSourceAdded} />
                  </div>
                </div>

                {/* Indicateurs de Confiance */}
                <div className="flex gap-8 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> Sécurisé</span>
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> PDF / DOCX</span>
                  <span className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full" /> Web Scraping</span>
                </div>
              </motion.div>
            </div>

            {/* Background Elements (Ambiance) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
            </div>

          </motion.section>
        ) : (
          <Forge
            projectId={projectId}
            structure={structure}
            query={query}
            sources={sources}
            onBack={() => setPhase('scout')}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
