"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    Database,
    Sparkles,
    FileText,
    MessageSquare,
    ArrowLeft,
    Share2,
    Download,
    Globe,
    Zap,
    Plus,
    X,
    ExternalLink,
    Terminal,
    Wand2,
    Settings,
    History,
    ChevronRight,
    Youtube
} from "lucide-react";

export default function Forge({ projectId, structure, query, sources = [], onBack }: any) {
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [localSources, setLocalSources] = useState(sources);
    const [chatInput, setChatInput] = useState("");
    const [docContent, setDocContent] = useState<any[]>(structure?.sections || []);

    useEffect(() => {
        if (structure?.sections) {
            setDocContent(structure.sections);
        }
    }, [structure]);

    const handleAddSource = (newSource: any) => {
        setLocalSources((prev: any) => [newSource, ...prev]);
    };

    const handleExport = async (type: 'report' | 'slides' | 'audio') => {
        alert(`Génération du format ${type.toUpperCase()}... (Bientôt disponible via le Prisme)`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505] text-white"
        >
            {/* TOP BAR : Cockpit Control */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-3xl z-[100]">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Forge Alchimique</span>
                        <span className="text-xs font-bold text-white/40 truncate max-w-[200px]">{query || "Nouvelle Mission"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Sync Active</span>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/20">
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">

                {/* COLONNE GAUCHE : INTEL PANEL (Sources) */}
                <aside className="w-80 border-r border-white/5 bg-[#070707] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database size={14} className="text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Intel Center</span>
                        </div>
                        <span className="text-[10px] font-bold text-accent">{localSources.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                        {localSources.map((source: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-accent/5 hover:border-accent/20 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${source.status === 'analysed' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'}`}>
                                        {source.source_type === 'web' ? <Globe size={14} /> : <FileText size={14} />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] font-bold truncate group-hover:text-white transition-colors">{source.title}</span>
                                        <span className="text-[8px] uppercase font-black text-white/20 tracking-tighter italic">{source.status || 'raw'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <button className="flex items-center justify-center gap-2 p-4 border border-dashed border-white/5 rounded-2xl text-white/20 hover:text-white hover:border-white/20 transition-all">
                            <Plus size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ajouter Source</span>
                        </button>
                    </div>
                </aside>

                {/* COLONNE CENTRALE : CANVAS (Éditeur) */}
                <main className="flex-1 overflow-y-auto bg-black p-12 md:p-24 flex flex-col items-center custom-scrollbar relative">
                    <div className="max-w-3xl w-full flex flex-col gap-12">
                        {/* Header Document */}
                        <div className="space-y-6">
                            <h1 className="text-6xl font-black tracking-tighter leading-tight">
                                {structure?.title || "Rapport Stratégique"}
                            </h1>
                            <div className="h-1 w-20 bg-accent" />
                        </div>

                        {/* Sections Document */}
                        <div className="flex flex-col gap-16 pb-40">
                            {docContent.length > 0 ? docContent.map((section: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="group relative cursor-text transition-all duration-500 hover:pl-6"
                                    onClick={() => setSelectedSection(idx)}
                                >
                                    <div className="absolute left-0 top-0 h-full w-[2px] bg-accent/0 group-hover:bg-accent/40 transition-all" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/60 mb-4 italic">Zone 0{idx + 1} / {section.title}</h3>
                                    <p className="text-xl leading-relaxed text-white/80 font-serif selection:bg-accent/40">
                                        {section.content || section.brief || "L'IA est prête à rédiger cet axe..."}
                                    </p>
                                </div>
                            )) : (
                                <div className="py-40 flex flex-col items-center gap-6 opacity-20">
                                    <Wand2 size={40} />
                                    <p className="text-xs font-black uppercase tracking-[0.4em]">Canvas en attente de synthèse</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* COLONNE DROITE : STUDIO (Prisme & Formats) */}
                <aside className="w-80 border-l border-white/5 bg-[#070707] flex flex-col">
                    <div className="p-6 border-b border-white/5 border-white/5">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Prisme : Transformation</span>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Générer le Livrable</span>

                        <button onClick={() => handleExport('report')} className="w-full p-5 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-3 group hover:bg-white/10 hover:border-accent/40 transition-all text-left">
                            <FileText size={18} className="text-red-500" />
                            <span className="text-xs font-bold text-white/80 group-hover:text-white">Rapport DOCX Premium</span>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Standard A+ Académique</p>
                        </button>

                        <button onClick={() => handleExport('slides')} className="w-full p-5 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-3 group hover:bg-white/10 hover:border-accent/40 transition-all text-left">
                            <Share2 size={18} className="text-orange-500" />
                            <span className="text-xs font-bold text-white/80 group-hover:text-white">Slides PPTX Futuriste</span>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Style McKinsey / BCG</p>
                        </button>

                        <button onClick={() => handleExport('audio')} className="w-full p-5 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-3 group hover:bg-white/10 hover:border-accent/40 transition-all text-left">
                            <MessageSquare size={18} className="text-purple-500" />
                            <span className="text-xs font-bold text-white/80 group-hover:text-white">Audio Brief (Focus)</span>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Dialogue IA de 5 minutes</p>
                        </button>
                    </div>
                </aside>

            </div>

            {/* FLOATING COPILOT BAR (Bas) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[200]">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                    <div className="relative flex items-center">
                        <div className="absolute left-6 text-accent/40">
                            <Terminal size={14} />
                        </div>
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Pilotez la Forge (ex: 'Rends le paragraphe 2 plus technique')"
                            className="w-full bg-transparent py-5 pl-14 pr-20 text-xs text-white placeholder:text-white/20 focus:outline-none font-medium"
                        />
                        <button className="absolute right-2 px-6 py-3 bg-accent text-black rounded-[1.2rem] font-black text-[10px] uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                            Synthesize
                        </button>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
