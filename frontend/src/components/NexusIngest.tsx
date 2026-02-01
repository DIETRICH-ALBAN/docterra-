"use client";

import { useState } from "react";
import { Upload, FileText, Check, Loader2, X, Search, Globe, Youtube, Zap, Sparkles } from "lucide-react";
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
        <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto items-center">

            {/* LE MONOLITHE D'INGESTION */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-[#080808]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
            >
                {/* SECTION HAUT : INVESTIGATION (Prompt First) */}
                <div className="p-10 md:p-14 flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <Sparkles size={18} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Investigation IA</h3>
                    </div>

                    <form onSubmit={handleUrlSubmit} className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/10 group-focus-within:text-accent transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Entrez un sujet, une URL ou un lien YouTube..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-3xl py-7 pl-16 pr-32 text-lg text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.04] transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!urlInput || isSearching}
                            className="absolute right-3 top-3 bottom-3 px-8 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-accent hover:scale-105 active:scale-95 disabled:opacity-0"
                        >
                            {isSearching ? <Loader2 className="animate-spin" size={16} /> : "Analyser"}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] flex-shrink-0">Inspiration :</span>
                        {['Analyse Marché IA', 'Rapport Tesla 2024', 'SOP Agence Web'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => { setUrlInput(s); }}
                                className="text-[10px] text-white/30 hover:text-white hover:bg-white/5 px-4 py-2 rounded-full border border-white/5 transition-all"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DIVISEUR ÉLÉGANT */}
                <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-[#080808] text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">
                        OU
                    </div>
                </div>

                {/* SECTION BAS : DROPZONE SOFTE */}
                <div
                    className={`
                        p-10 md:p-14 transition-all duration-500 cursor-pointer
                        flex flex-col items-center justify-center text-center gap-4
                        ${isDragging ? 'bg-accent/[0.03]' : 'hover:bg-white/[0.01]'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFileUpload(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById('file-upload-soft')?.click()}
                >
                    <input type="file" id="file-upload-soft" className="hidden" multiple onChange={(e) => handleFileUpload(e.target.files)} />

                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                            <Upload size={20} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-white/60">Déposez vos documents locaux</span>
                            <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">PDF, DOCX, TXT (Max 50MB)</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* RÉSULTATS DE L'INVESTIGATION (S'AFFICHE EN DESSOUS) */}
            <AnimatePresence>
                {showDiscovery && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="w-full bg-[#080808]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
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
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => ingestUrl(result.url)}
                                        className="group p-5 bg-white/[0.01] border border-white/5 rounded-[2rem] flex items-start gap-4 hover:bg-accent/[0.03] hover:border-accent/20 transition-all cursor-pointer"
                                    >
                                        <div className="p-3 bg-white/5 rounded-xl text-white/30 group-hover:text-accent transition-colors">
                                            {result.url.includes('youtube') ? <Youtube size={18} /> : <Globe size={18} />}
                                        </div>
                                        <div className="flex flex-col gap-1 pr-6 w-full">
                                            <span className="text-xs font-bold text-white/70 line-clamp-1 group-hover:text-white transition-colors">{result.title}</span>
                                            <p className="text-[9px] text-white/10 line-clamp-2 leading-relaxed uppercase tracking-tighter">{result.description}</p>
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
