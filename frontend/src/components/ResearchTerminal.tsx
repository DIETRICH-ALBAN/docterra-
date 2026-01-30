"use client";

import { Search, Terminal, Loader2, ListChecks, Sparkles, Database, Globe } from "lucide-react";
import ContentPreview from "./ContentPreview";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResearchTerminal({ onStructureReady }: any) {
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [structure, setStructure] = useState<any | null>(null);
    const [lastScanResults, setLastScanResults] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);
        setIsExpanded(true);
        setLogs(["Initialisation du moteur DocScout...", `Analyse de la requête : ${query}`]);

        try {
            // Étape 1 : Scouting Web (Firecrawl + Supabase initialisation)
            const response = await fetch("http://localhost:8000/scout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();
            setLogs(prev => [...prev, "Accès au Web mondial via Node AG-1...", "Sources identifiées. Extraction en cours...", "Formatage Markdown académique..."]);
            setResult(data.markdown);
            setLastScanResults(data.results || []);

            // Étape 2 : Intelligence Artificielle (GPT Structure)
            const structResp = await fetch("http://localhost:8000/structure", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: query,
                    context: data.markdown,
                    doc_id: data.doc_id
                }),
            });
            const structData = await structResp.json();
            setStructure(structData);
            setLogs(prev => [...prev, "Intelligence structurelle appliquée.", "Prêt pour la génération finale."]);
        } catch (error) {
            setLogs(prev => [...prev, "ERREUR CRITIQUE : Connexion perdue avec le Core Backend."]);
        } finally {
            setIsSearching(false);
        }
    };

    if (!mounted) return <div className="h-20 glass-card animate-pulse" />;

    return (
        <div className="flex flex-col gap-6 mt-12 pb-20">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Database size={16} className="text-secondary" />
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Base de Données Mondiale</h3>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className={`transition-colors duration-500 ${isSearching ? 'text-accent' : 'text-white/20'}`} size={20} />
                    </div>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Recherche stratégique (ex: Économie numérique Afrique 2030)"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 pl-16 pr-32 text-white text-lg placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium"
                    />
                    <div className="absolute inset-y-2 right-2 flex gap-2">
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-accent hover:bg-accent/80 text-black px-8 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all flex items-center gap-2 glow-cyan disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Globe size={16} />}
                            {isSearching ? "Calcul..." : "Lancer Scout"}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: 10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="glass-card bg-black/60 border-white/5 font-mono text-xs overflow-hidden"
                    >
                        <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className={`w-2 h-2 rounded-full ${isSearching ? 'bg-accent animate-pulse' : 'bg-green-500'}`} />
                                    <div className="w-2 h-2 rounded-full bg-white/5" />
                                </div>
                                <span className="text-[9px] text-white/40 uppercase tracking-widest font-black">Moteur de Recherche AG-7 (DocScout)</span>
                            </div>
                            <Terminal size={12} className="text-white/20" />
                        </div>

                        <div className="p-6 flex flex-col gap-2 max-h-80 overflow-y-auto">
                            {logs.map((log, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="flex gap-3"
                                >
                                    <span className="text-accent font-black">{">"}</span>
                                    <span className={log.includes("ERREUR") ? "text-red-400 font-bold" : "text-white/60"}>
                                        {log}
                                    </span>
                                </motion.div>
                            ))}

                            {isSearching && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-2 h-4 bg-accent/40 mt-1"
                                />
                            )}

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-white/50 text-sm leading-relaxed academic-text italic"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={14} className="text-accent" />
                                        <span className="text-[10px] uppercase font-black text-accent tracking-widest">Synthèse des données web</span>
                                    </div>
                                    {result.substring(0, 500)}...
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ContentPreview
                structure={structure}
                query={query}
                onForgeReady={(data: any) => onStructureReady(data, query, lastScanResults)}
            />
        </div>
    );
}
