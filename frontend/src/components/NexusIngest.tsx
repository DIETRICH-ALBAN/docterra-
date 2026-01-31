"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Check, Loader2, X, Search, Globe, Youtube, File as FileIcon } from "lucide-react";
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

        // Détection : URL ou Recherche ?
        const isUrl = urlInput.startsWith('http://') || urlInput.startsWith('https://') || urlInput.includes('.');

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
                // Auto-analyze in background
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
                    // Auto-analyze in background
                    fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
                }
            } catch (error) {
                console.error(`Upload failed for ${file.name}`, error);
            }
        }
        setIsProcessing(false);
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text');
        if (text.startsWith('http')) {
            setUrlInput(text);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 w-full">
            {/* OMNI-BOX Unifiée */}
            <div
                className={`
                    relative group overflow-hidden
                    bg-[#050505] border-2 border-dashed rounded-3xl p-8 transition-all duration-500
                    flex flex-col items-center justify-center text-center gap-6
                    ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                }}
                onPaste={handlePaste}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                />

                {/* Icône Dynamique */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                    {isProcessing || isSearching ? (
                        <Loader2 size={24} className="text-accent animate-spin" />
                    ) : (
                        <div className="relative">
                            <Upload size={24} className="text-white/40 group-hover:text-accent transition-colors" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="z-10 flex flex-col gap-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Nexus Ingest</h3>
                    <p className="text-xs text-white/30 font-medium max-w-[280px]">
                        Déposez vos fichiers ou lancez une <span className="text-white/60">Investigation IA</span> par mot-clé.
                    </p>
                </div>

                {/* Input Intelligent */}
                <div className="w-full max-w-md relative mt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        {isSearching ? <Search size={14} className="text-accent animate-pulse" /> : <Globe size={14} className="text-white/20" />}
                    </div>
                    <input
                        type="text"
                        placeholder="URL ou Sujet de recherche..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(e)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 focus:bg-white/[0.07] transition-all font-medium"
                    />
                    <button
                        onClick={handleUrlSubmit}
                        disabled={!urlInput || isProcessing || isSearching}
                        className="absolute inset-y-2 right-2 px-4 bg-accent text-black rounded-xl font-black text-[10px] uppercase tracking-tighter hover:bg-white transition-all disabled:opacity-0"
                    >
                        Go
                    </button>
                </div>

                {/* Zone de clic pour upload */}
                <div
                    className="absolute inset-0 z-0 cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                />
            </div>

            {/* PREVIEW DISCOVERY (Scout Results) */}
            <AnimatePresence>
                {showDiscovery && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Search size={16} className="text-accent" />
                                <span className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em]">Résultats de l'Investigation</span>
                            </div>
                            <button onClick={() => setShowDiscovery(false)} className="text-white/20 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
                            {isSearching ? (
                                <div className="py-12 flex flex-col items-center gap-4 text-white/20">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Scanning World Web...</span>
                                </div>
                            ) : (
                                searchResults.map((result, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-all cursor-pointer"
                                        onClick={() => ingestUrl(result.url)}
                                    >
                                        <div className="flex flex-col gap-1 max-w-[80%]">
                                            <div className="flex items-center gap-2">
                                                {result.url.includes('youtube.com') ? <Youtube size={14} className="text-red-500" /> : <Globe size={14} className="text-blue-500" />}
                                                <span className="text-xs font-bold text-white/80 group-hover:text-accent transition-colors truncate">{result.title}</span>
                                            </div>
                                            <p className="text-[10px] text-white/30 line-clamp-1">{result.description}</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                            <Check size={14} className="text-accent" />
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
