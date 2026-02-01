"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Check, Loader2, X, Search, Globe, Youtube, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusIngest({ project_id, onSourceAdded }: { project_id: string, onSourceAdded: (source: any) => void }) {
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDiscovery, setShowDiscovery] = useState(false);

    const handleUrlSubmit = async (e: any) => {
        e.preventDefault();
        if (!urlInput) return;

        const isUrl = urlInput.startsWith('http') || urlInput.includes('.');
        if (isUrl && !urlInput.includes(' ')) {
            await ingestUrl(urlInput);
        } else {
            await performSearch(urlInput);
        }
    };

    const ingestUrl = async (url: string) => {
        setIsProcessing(true);
        try {
            const response = await fetch("http://localhost:8000/api/ingest/url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, project_id: project_id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                onSourceAdded(data.source);
                setUrlInput("");
                setShowDiscovery(false);
                fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
            }
        } catch (error) {
            console.error("Scraping failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const performSearch = async (query: string) => {
        setIsSearching(true);
        setShowDiscovery(true);
        try {
            const response = await fetch("http://localhost:8000/api/scout/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setSearchResults(data.results);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsProcessing(true);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await fetch(`http://localhost:8000/api/ingest/file?project_id=${project_id}`, {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                if (data.status === 'success') {
                    onSourceAdded(data.source);
                    fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
                }
            } catch (error) {
                console.error(`Upload failed for ${file.name}`, error);
            }
        }
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto items-center">

            <div className="flex flex-col md:flex-row gap-8 w-full items-stretch">
                {/* BLOC GAUCHE : IMPORTATION LOCALE */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`
                        flex-1 relative group rounded-[2.5rem] p-10 
                        bg-[#080808] border border-white/5 transition-all duration-500
                        flex flex-col items-center justify-center text-center gap-6
                        ${isDragging ? 'border-accent/40 bg-accent/[0.02] scale-[1.02]' : 'hover:border-white/10 hover:bg-white/[0.01]'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFileUpload(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input type="file" id="file-upload" className="hidden" multiple onChange={(e) => handleFileUpload(e.target.files)} />

                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500 shadow-2xl">
                        <Upload size={32} className="text-white/20 group-hover:text-accent transition-colors" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Importer</h3>
                        <p className="text-xs text-white/30 font-medium max-w-[200px]">
                            PDF, DOCX ou archives locales. Glissez-déposez vos fichiers.
                        </p>
                    </div>

                    <div className="absolute inset-0 rounded-[2.5rem] border border-accent/0 group-hover:border-accent/10 transition-all pointer-events-none" />
                </motion.div>

                {/* BLOC DROIT : DÉCOUVERTE WEB / CHAT */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-[1.2] flex flex-col gap-6"
                >
                    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 flex flex-col gap-8 h-full justify-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                <Search size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Investigation</h3>
                                <p className="text-xs text-white/30">Laissez l'IA explorer le web pour vous.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUrlSubmit} className="relative group/input">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Sparkles size={16} className="text-white/20 group-focus-within/input:text-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Un sujet, une URL, un lien YouTube..."
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-20 text-sm text-white focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!urlInput || isSearching}
                                className="absolute right-2 top-2 bottom-2 px-6 bg-accent text-black rounded-xl font-black text-[10px] uppercase tracking-tighter transition-all hover:bg-white disabled:opacity-0"
                            >
                                {isSearching ? <Loader2 className="animate-spin" size={14} /> : "Analyser"}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 pt-4 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest flex-shrink-0">Suggestions :</span>
                            {['Analyse Marché IA', 'Rapport Tesla 2024', 'SOP Agence Web'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setUrlInput(s); }}
                                    className="text-[10px] text-white/30 hover:text-accent hover:bg-accent/5 px-3 py-1.5 rounded-full border border-white/5 whitespace-nowrap transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RÉSULTATS DE L'INVESTIGATION (SCOUT) */}
            <AnimatePresence>
                {showDiscovery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="w-full bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-accent" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Sources identifiées par Intel-Scout</span>
                            </div>
                            <button onClick={() => setShowDiscovery(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {isSearching ? (
                                <div className="col-span-full py-20 flex flex-col items-center gap-6 opacity-20">
                                    <Loader2 size={32} className="animate-spin text-accent" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.5em]">Scan Global en cours...</span>
                                </div>
                            ) : (
                                searchResults.map((result, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => ingestUrl(result.url)}
                                        className="group p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-start gap-4 hover:bg-accent/[0.03] hover:border-accent/20 transition-all cursor-pointer"
                                    >
                                        <div className="p-3 bg-white/5 rounded-2xl text-white/30 group-hover:text-accent transition-colors">
                                            {result.url.includes('youtube') ? <Youtube size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="flex flex-col gap-1 pr-6 relative w-full">
                                            <span className="text-sm font-bold text-white/80 line-clamp-1 group-hover:text-white transition-colors">{result.title}</span>
                                            <p className="text-[10px] text-white/20 line-clamp-2 leading-relaxed">{result.description}</p>
                                            <div className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Zap size={14} className="text-accent" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
