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
    Wand2
} from "lucide-react";
import NexusIngest from "./NexusIngest";

export default function Forge({ projectId, structure, query, sources = [], onBack }: any) {
    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [localSources, setLocalSources] = useState(sources);
    const [chatInput, setChatInput] = useState("");

    const handleAddSource = (newSource: any) => {
        setLocalSources((prev: any) => [newSource, ...prev]);
    };

    // État local pour le contenu du document (Vide par défaut)
    const [docContent, setDocContent] = useState<any[]>(structure?.sections || []);

    // Met à jour le contenu local si la structure change (ex: première génération)
    useEffect(() => {
        if (structure?.sections) {
            setDocContent(structure.sections);
        }
    }, [structure]);

    const handleRefineSection = async (index: number) => {
        const section = docContent[index];

        // Mise en état de chargement
        const newContent = [...docContent];
        newContent[index] = { ...section, isGenerating: true };
        setDocContent(newContent);

        try {
            const response = await fetch("http://localhost:8000/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: section.title,
                    content: section.brief || section.content,
                    query: query,
                    instruction: "Enrichis cette section avec des données factuelles et un style académique premium."
                }),
            });
            const data = await response.json();

            // Mise à jour avec le vrai contenu de l'IA
            const updatedContent = [...newContent];
            updatedContent[index] = {
                ...updatedContent[index],
                content: data.content,
                isGenerating: false
            };
            setDocContent(updatedContent);

        } catch (error) {
            alert("Erreur Nexus : Impossible de contacter l'intelligence centrale.");
            const updatedContent = [...newContent];
            updatedContent[index] = { ...updatedContent[index], isGenerating: false };
            setDocContent(updatedContent);
        }
    };

    const handleExport = async (type: 'report' | 'slides') => {
        const payload = {
            data: {
                title: structure?.title || "Rapport DocTerra",
                sections: docContent.map((s: any) => ({
                    title: s.title,
                    content: s.content || s.brief
                }))
            }
        };

        try {
            const endpoint = type === 'report' ? '/prism/report' : '/prism/slides';
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (data.status === 'success') {
                window.open(`http://localhost:8000/download/${data.filename}`, '_blank');
            }
        } catch (error) {
            alert("Erreur lors de la génération du fichier.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505]"
        >
            {/* Top Bar Ultra-Sleek */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-2xl z-50">
                <div className="flex items-center gap-8">
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black tracking-tighter uppercase glow-text">Forge Alchimique</h2>
                            <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-widest">v1.2 Active</span>
                        </div>
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] truncate max-w-[300px]">Node : {query || "INITIATION_MODE"}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-tr from-accent/20 to-white/10 flex items-center justify-center text-[10px] font-black">
                                {i}
                            </div>
                        ))}
                    </div>

                    <div className="relative group">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest glow-cyan hover:scale-105 active:scale-95 transition-all">
                            <Sparkles size={14} strokeWidth={3} className="text-accent" />
                            Déployer le Prisme
                        </button>

                        {/* Menu Prisme (Dropdown Premium) */}
                        <div className="absolute right-0 top-full mt-4 w-64 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100]">
                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] px-4 pb-2">Sélectionnez le format final</span>

                                <button
                                    onClick={() => handleExport('report')}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><FileText size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Rapport DOCX</span>
                                    </div>
                                    <Download size={14} className="text-white/20 group-hover/item:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => handleExport('slides')}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500"><Share2 size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Slides PPTX</span>
                                    </div>
                                    <Download size={14} className="text-white/20 group-hover/item:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => alert("Génération de l'Audio Brief en cours... (Coming Soon)")}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><MessageSquare size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Audio Brief</span>
                                    </div>
                                    <Zap size={14} className="text-white/20 group-hover/item:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={() => alert("Génération de la Mind Map en cours... (Coming Soon)")}
                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group/item text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-xl text-accent"><Database size={16} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Mind Map</span>
                                    </div>
                                    <Share2 size={14} className="text-white/20 group-hover/item:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Nexus (Gauche) : Management des Sources & Itération */}
                <section className="w-[480px] border-r border-white/5 flex flex-col bg-[#070707] shadow-2xl z-40">
                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-xl text-accent">
                                    <Database size={18} />
                                </div>
                                <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-white/40">Nexus des Sources</h3>
                            </div>
                        </div>

                        <NexusIngest project_id={projectId} onSourceAdded={handleAddSource} />

                        {/* Source Cards */}
                        <div className="flex flex-col gap-3">
                            {localSources.map((source: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${source.status === 'analysed' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/20'}`}>
                                            {source.type === 'web' ? <Globe size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div className="flex flex-col max-w-[200px]">
                                            <span className="text-xs font-black text-white/80 truncate">{source.title}</span>
                                            <span className="text-[9px] text-white/20 uppercase tracking-widest font-black italic">{source.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink size={14} className="text-white/20 hover:text-white" />
                                        <X size={14} className="text-red-500/40 hover:text-red-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Iteratif (Style Gemini/NotebookLM) */}
                    <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles size={14} className="text-accent animate-pulse" />
                            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 truncate">Commande Alchimique Directe</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Terminal size={14} className="text-accent/40" />
                            </div>
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ex: Développe l'analyse économique..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-mono"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent/20 rounded-xl text-accent hover:bg-accent transition-all hover:text-black">
                                <Zap size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Forge (Droite) : Le Canvas Canvas */}
                <section className="flex-1 overflow-y-auto bg-black p-20 flex flex-col items-center custom-scrollbar">
                    <div className="max-w-4xl w-full flex flex-col gap-24">
                        {/* Hero Section of Document */}
                        <header className="flex flex-col gap-10 items-center text-center">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
                            />
                            <h1 className="text-8xl font-black tracking-tighter glow-text leading-[0.9] text-white/95">
                                {structure?.title || "Rapport de Recherche"}
                            </h1>
                            <div className="flex items-center gap-12 text-[11px] text-white/10 uppercase tracking-[0.6em] font-black pt-4">
                                <div className="flex flex-col gap-1">
                                    <span>Classification</span>
                                    <span className="text-accent/60">S-Tier Academic</span>
                                </div>
                                <div className="w-[1px] h-8 bg-white/5" />
                                <div className="flex flex-col gap-1">
                                    <span>Date</span>
                                    <span className="text-white/40">{new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        </header>

                        {/* Document Content Blocks */}
                        <div className="flex flex-col gap-16 pb-32">
                            {docContent.map((section: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    onClick={() => setSelectedSection(idx)}
                                    className={`relative p-16 rounded-[2.5rem] border transition-all duration-700 cursor-pointer group ${selectedSection === idx
                                        ? "bg-white/[0.03] border-accent/20 shadow-[0_0_100px_rgba(0,209,255,0.03)]"
                                        : "bg-transparent border-transparent grayscale hover:grayscale-0 hover:bg-white/[0.01]"
                                        }`}
                                >
                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[120px] font-black italic text-white/[0.02] pointer-events-none select-none">
                                        0{idx + 1}
                                    </div>

                                    <div className="relative flex flex-col gap-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-8 rounded-full transition-colors duration-500 ${selectedSection === idx ? 'bg-accent' : 'bg-white/5'}`} />
                                                <h3 className={`text-4xl font-black transition-colors duration-500 ${selectedSection === idx ? 'text-white' : 'text-white/20'}`}>
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <div className={`opacity-0 group-hover:opacity-100 transition-all ${selectedSection === idx ? 'text-accent' : 'text-white/20'}`}>
                                                <Sparkles size={24} className={selectedSection === idx ? "animate-pulse" : ""} />
                                            </div>
                                        </div>

                                        <div className={`text-2xl leading-relaxed text-justify transition-all duration-1000 ${selectedSection === idx ? "text-white/70" : "text-white/10"
                                            } font-serif italic min-h-[100px]`}>
                                            {section.isGenerating ? (
                                                <div className="flex items-center gap-3 text-accent animate-pulse">
                                                    <Wand2 className="animate-spin" size={20} />
                                                    <span>Alchimie en cours...</span>
                                                </div>
                                            ) : (
                                                section.content || section.brief || "En attente des données du Nexus..."
                                            )}
                                        </div>

                                        {/* Action micro-pannel inside section */}
                                        {selectedSection === idx && !section.isGenerating && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-4 pt-10"
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRefineSection(idx);
                                                    }}
                                                    className="px-6 py-3 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-accent/10 hover:border-accent/40 transition-all text-accent group"
                                                >
                                                    Affiner cet axe
                                                    <Zap size={12} className="inline ml-2 group-hover:fill-accent transition-all" />
                                                </button>
                                                <button className="px-6 py-3 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all text-white/30">
                                                    Re-générer
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
