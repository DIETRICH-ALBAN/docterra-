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
    const [selectedSources, setSelectedSources] = useState<string[]>([]);

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
        setSearchResults([]);
        setSelectedSources([]);
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

    const toggleSourceSelection = (url: string) => {
        setSelectedSources(prev =>
            prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
        );
    };

    const ingestSelected = async () => {
        for (const url of selectedSources) {
            await ingestUrl(url);
        }
        setSelectedSources([]);
        setShowDiscovery(false);
    };

    return (
        <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto items-center">

            {/* LE MONOLITHE D'INGESTION (SOFT V3) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-[#080808]/60 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
            >
                {/* 1. TOP : INVESTIGATION (Prompt First) */}
                <div className="p-10 md:p-14 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,209,255,0.1)]">
                                <Sparkles size={22} className="animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Investigation IA</h3>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Node-Scout Active</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleUrlSubmit} className="relative group">
                        <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none text-white/10 group-focus-within:text-accent transition-all duration-500">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Entrez un sujet, une URL ou un lien YouTube..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] py-8 pl-18 pr-36 text-lg text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 focus:bg-white/[0.04] transition-all duration-500 font-medium tracking-tight"
                        />
                        <button
                            type="submit"
                            disabled={!urlInput || isSearching}
                            className="absolute right-3 top-3 bottom-3 px-10 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-accent hover:shadow-[0_0_30px_rgba(0,209,255,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-0"
                        >
                            {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Analyser"}
                        </button>
                    </form>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] flex-shrink-0">Inspiration & Flux :</span>
                        {['Analyse Marché IA', 'Rapport Tesla 2024', 'SOP Agence Web'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => { setUrlInput(s); }}
                                className="text-[10px] text-white/30 hover:text-white hover:bg-white/5 px-5 py-2.5 rounded-full border border-white/5 transition-all duration-300"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. DIVISEUR ÉLÉGANT AVEC GLOW */}
                <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 bg-[#080808] text-[10px] font-black text-white/10 uppercase tracking-[0.6em] whitespace-nowrap">
                        Alimentation Manuelle
                    </div>
                </div>

                {/* 3. BOTTOM : DROPZONE SILENCIEUSE */}
                <div
                    className={`
                        p-10 md:p-14 transition-all duration-700 cursor-pointer
                        flex flex-col items-center justify-center text-center gap-6
                        ${isDragging ? 'bg-accent/[0.04]' : 'hover:bg-white/[0.01]'}
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

                    <div className="flex items-center gap-8 group/drop">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover/drop:text-white/40 group-hover/drop:bg-white/10 transition-all duration-500">
                            <Upload size={24} />
                        </div>
                        <div className="flex flex-col text-left gap-1">
                            <span className="text-sm font-bold text-white/50 group-hover/drop:text-white/80 transition-colors">Glissez vos documents bruts ici</span>
                            <span className="text-[11px] text-white/10 uppercase tracking-widest font-black">PDF, DOCX, TXT • Sécurisé de bout en bout</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* RÉSULTATS DE L'INVESTIGATION (SCOUT RESULTS) */}
            <AnimatePresence>
                {showDiscovery && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full bg-[#080808]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-4">
                                <Globe size={20} className="text-accent" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Curation des Sources</span>
                                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{selectedSources.length} sélectionnée(s)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedSources.length > 0 && (
                                    <button
                                        onClick={ingestSelected}
                                        className="bg-accent text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                                    >
                                        Ingérer la sélection
                                    </button>
                                )}
                                <button onClick={() => setShowDiscovery(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-white/20 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto custom-scrollbar bg-black/40">
                            {isSearching ? (
                                <div className="col-span-full py-28 flex flex-col items-center gap-8 opacity-20">
                                    <div className="relative">
                                        <Loader2 size={40} className="animate-spin text-accent" />
                                        <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
                                    </div>
                                    <span className="text-[11px] uppercase font-black tracking-[0.6em]">Extraction du savoir mondial...</span>
                                </div>
                            ) : (
                                searchResults.map((result, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.04 }}
                                        onClick={() => toggleSourceSelection(result.url)}
                                        className={`
                                            group p-6 rounded-[2rem] border flex items-start gap-5 transition-all duration-500 cursor-pointer relative overflow-hidden
                                            ${selectedSources.includes(result.url)
                                                ? 'bg-accent/[0.04] border-accent/40 shadow-[0_0_30px_rgba(0,209,255,0.05)]'
                                                : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'}
                                        `}
                                    >
                                        {selectedSources.includes(result.url) && (
                                            <div className="absolute top-4 right-4 text-accent">
                                                <Check size={20} />
                                            </div>
                                        )}
                                        <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedSources.includes(result.url) ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/20 group-hover:bg-white/10'}`}>
                                            {result.url.includes('youtube') ? <Youtube size={22} /> : <Globe size={22} />}
                                        </div>
                                        <div className="flex flex-col gap-2 pr-10">
                                            <span className={`text-sm font-black transition-colors duration-500 ${selectedSources.includes(result.url) ? 'text-white' : 'text-white/60'}`}>{result.title}</span>
                                            <p className="text-[10px] text-white/20 line-clamp-2 leading-relaxed font-medium uppercase tracking-tighter italic">{result.description}</p>
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
