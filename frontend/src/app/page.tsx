"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import UploadZone from "@/components/UploadZone";
import ResearchTerminal from "@/components/ResearchTerminal";
import Forge from "@/components/Forge";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'scout' | 'forge'>('scout');
  const [structure, setStructure] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bypass pour le test visuel - Ctrl + Shift + F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F' && e.ctrlKey && e.shiftKey) {
        setPhase('forge');
        setStructure({
          title: "LE FUTUR DE L'IA EN AFRIQUE",
          sections: [
            { title: "Introduction Stratégique", brief: "Analyse des hubs technologiques de Douala à Nairobi." },
            { title: "Infrastructure & Connectivité", brief: "L'impact de la 5G sur le développement local." },
            { title: "Éducation & Capital Humain", brief: "La formation des talents WebTerra." }
          ]
        });
        setSources([
          { title: "Rapport ONU 2025", type: "pdf", status: "analysed" },
          { title: "Étude Statistique Afrique", type: "web", status: "analysed" }
        ]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoadProject = async (docId: string) => {
    try {
      const resp = await fetch(`http://localhost:8000/documents/${docId}`);
      const data = await resp.json();

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

  if (!mounted) return <div className="bg-background min-h-screen" />;

  const handleStructureGenerated = (data: any, searchQuery: string, scanSources: any[]) => {
    setStructure(data);
    setQuery(searchQuery);
    setSources(scanSources);
    setPhase('forge');
  };

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
            className="flex-1 px-16 py-12 flex flex-col gap-16 overflow-y-auto max-h-screen custom-scrollbar"
          >
            {/* Header Minimaliste */}
            <header className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black tracking-tight uppercase">User Alpha</span>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none">ID: WT-0912</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-secondary p-[1px] group cursor-pointer">
                  <div className="w-full h-full rounded-2xl bg-[#050505] flex items-center justify-center text-sm font-black italic group-hover:bg-accent group-hover:text-black transition-all">
                    UA
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-8 text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">
                <span className="hover:text-white transition-colors cursor-pointer border-b-2 border-accent pb-1">Vue d'ensemble</span>
                <span className="hover:text-white transition-colors cursor-pointer">Analytiques</span>
                <span className="hover:text-white transition-colors cursor-pointer">Équipe</span>
              </div>
            </header>

            {/* Content Area */}
            <div className="max-w-6xl w-full mx-auto flex flex-col gap-20">
              <UploadZone />
              <div className="flex flex-col gap-4 border-t border-white/5 pt-16">
                <ResearchTerminal onStructureReady={handleStructureGenerated} />
              </div>
            </div>

            <footer className="mt-auto py-8 border-t border-white/5 flex justify-between items-center text-[10px] text-white/10 font-bold uppercase tracking-[0.4em]">
              <span>© 2026 WebTerra Agency - Core System</span>
              <div className="flex gap-6">
                <span>Status: Optimal</span>
                <span>Latency: {14 + Math.floor(Math.random() * 5)}ms</span>
              </div>
            </footer>
          </motion.section>
        ) : (
          <Forge
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
