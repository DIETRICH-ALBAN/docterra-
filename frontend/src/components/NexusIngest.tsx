"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Check, Loader2, X, Search, Globe, Youtube, Zap, Sparkles, Database, FileType } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusIngest({ project_id, onSourceAdded }: { project_id: string, onSourceAdded: (source: any) => void }) {
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDiscovery, setShowDiscovery] = useState(false);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'upload' | 'web' | 'text' | 'drive'>('upload');

    const handleUrlSubmit = async (e: any) => {
        e.preventDefault();
        if (!urlInput) return;

        // Si c'est un format de recherche ou une URL simple
        const isUrl = urlInput.startsWith('http') || (urlInput.includes('.') && !urlInput.includes(' '));
        if (isUrl) {
            await ingestUrl(urlInput);
        } else {
            await performSearch(urlInput);
        }
    };

    const ingestUrl = async (url: string) => {
        setIsProcessing(true);
        console.log(`[Nexus] Ingestion URL: ${url}`);
        try {
            const response = await fetch("http://localhost:8000/api/ingest/url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, project_id: project_id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                console.log("[Nexus] URL Ingestée avec succès", data.source);
                onSourceAdded(data.source);
                setUrlInput("");
                setShowDiscovery(false);
                // Lancer l'analyse en arrière-plan
                fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
            }
        } catch (error) {
            console.error("[Nexus] Erreur Ingestion URL:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const performSearch = async (query: string) => {
        setIsSearching(true);
        setShowDiscovery(true);
        setSearchResults([]);
        console.log(`[Nexus] Recherche Investigator: ${query}`);
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
            console.error("[Nexus] Erreur Investigator Search:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFileUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsProcessing(true);
        console.log(`[Nexus] Tentative d'upload de ${files.length} fichiers`);

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
                    console.log(`[Nexus] Fichier ${file.name} uploadé`, data.source);
                    onSourceAdded(data.source);
                    fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
                }
            } catch (error) {
                console.error(`[Nexus] Upload échoué pour ${file.name}:`, error);
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

    const options = [
        { id: 'upload', icon: <Upload size={18} />, label: 'Upload Files', desc: 'PDF, DOCX, TXT' },
        { id: 'web', icon: <Youtube size={18} />, label: 'Web / YouTube', desc: 'URLs directes' },
        { id: 'drive', icon: <Database size={18} />, label: 'Google Drive', desc: 'Bientôt', disabled: true },
        { id: 'text', icon: <FileText size={18} />, label: 'Copied Text', desc: 'Bientôt', disabled: true },
    ];

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto items-center">

            {/* L'HUB DE SOURCES (NotebookLM Style Refined) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    w-full bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.4)] transition-all duration-500
                    ${isDragging ? 'ring-2 ring-accent/40 bg-accent/[0.02]' : 'ring-1 ring-white/5'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                }}
            >
                <div className="p-10 md:p-12 flex flex-col gap-10">
                    {/* Header dynamique */}
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-white">Create Mission Overview from <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-8 italic">sources</span></h3>
                    </div>

                    {/* BARRE DE RECHERCHE DOMINANTE */}
                    <form onSubmit={handleUrlSubmit} className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/10 group-focus-within:text-accent transition-colors">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search the web for new sources..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-7 pl-16 pr-36 text-lg text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!urlInput || isSearching}
                            className="absolute right-3 top-3 bottom-3 px-8 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-accent hover:scale-[1.02] active:scale-95 disabled:opacity-0"
                        >
                            {isSearching ? <Loader2 className="animate-spin" size={16} /> : "Investigation"}
                        </button>
                    </form>

                    {/* GRILLE D'OPTIONS NOTEBOOK-STYLE */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                disabled={opt.disabled}
                                onClick={() => {
                                    if (opt.id === 'upload') document.getElementById('file-upload-master')?.click();
                                    else setActiveTab(opt.id as any);
                                }}
                                className={`
                                    flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 gap-3 group/opt
                                    ${opt.disabled ? 'opacity-20 cursor-not-allowed border-transparent' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'}
                                `}
                            >
                                <div className="p-3 bg-white/5 rounded-2xl text-white/30 group-hover/opt:text-accent group-hover/opt:bg-accent/10 transition-all">
                                    {opt.icon}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white/60 group-hover/opt:text-white">{opt.label}</span>
                                    <span className="text-[8px] font-bold text-white/20 italic">{opt.desc}</span>
                                </div>
                            </button>
                        ))}
                        <input type="file" id="file-upload-master" className="hidden" multiple onChange={(e) => handleFileUpload(e.target.files)} />
                    </div>

                    {/* Zone de drop info */}
                    <div className="flex flex-col items-center pt-4 opacity-20 group">
                        <div className="h-[1px] w-40 bg-white/10 group-hover:bg-accent/40 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] py-4">or drop your files anywhere</span>
                    </div>
                </div>
            </motion.div>

            {/* LOADER GLOBAL D'INGESTION */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4 bg-accent/10 border border-accent/20 px-8 py-4 rounded-2xl"
                    >
                        <Loader2 className="animate-spin text-accent" size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-accent">Alchimie en cours : Ingestion des sources...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RÉSULTATS DE L'INVESTIGATION */}
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
                            <div className="flex items-center gap-4">
                                {selectedSources.length > 0 && (
                                    <button
                                        onClick={ingestSelected}
                                        className="bg-accent text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                                    >
                                        Ingérer {selectedSources.length} sélectionnés
                                    </button>
                                )}
                                <button onClick={() => setShowDiscovery(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>
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
                                        onClick={() => toggleSourceSelection(result.url)}
                                        className={`
                                            group p-5 rounded-3xl border flex items-start gap-4 transition-all cursor-pointer relative
                                            ${selectedSources.includes(result.url) ? 'bg-accent/5 border-accent/40' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}
                                        `}
                                    >
                                        {selectedSources.includes(result.url) && (
                                            <div className="absolute top-4 right-4 text-accent">
                                                <Check size={18} />
                                            </div>
                                        )}
                                        <div className="p-3 bg-white/5 rounded-2xl text-white/30 group-hover:text-accent transition-colors">
                                            {result.url.includes('youtube') ? <Youtube size={20} /> : <Globe size={20} />}
                                        </div>
                                        <div className="flex flex-col gap-1 pr-10">
                                            <span className="text-sm font-bold text-white/80 line-clamp-1 group-hover:text-white transition-colors">{result.title}</span>
                                            <p className="text-[10px] text-white/20 line-clamp-2 leading-relaxed italic">{result.description}</p>
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
