"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Check, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusIngest({ project_id, onSourceAdded }: { project_id: string, onSourceAdded: (source: any) => void }) {
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUrlSubmit = async (e: any) => {
        e.preventDefault();
        if (!urlInput) return;

        setIsProcessing(true);
        try {
            const response = await fetch("http://localhost:8000/api/ingest/url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: urlInput, project_id: project_id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                onSourceAdded(data.source);
                setUrlInput("");
                // Auto-analyze in background
                fetch(`http://localhost:8000/api/analyze/${data.source.id}`, { method: 'POST' });
            }
        } catch (error) {
            console.error("Scraping failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setIsProcessing(true);
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
            console.error("Upload failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Détection intelligente du contenu collé
    const handlePaste = async (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text');
        if (text.startsWith('http')) {
            e.preventDefault();
            setUrlInput(text);
            // Optionnel: Auto-submit si on veut être très agressif
            // handleUrlSubmit(e); 
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 w-full">
            {/* OMNI-BOX : La seule zone d'interaction */}
            <div
                className={`
                    relative group overflow-hidden
                    bg-[#050505] border-2 border-dashed rounded-3xl p-8 transition-all duration-300
                    flex flex-col items-center justify-center text-center gap-6
                    ${isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file);
                }}
                onPaste={handlePaste}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                    }}
                />

                {/* Icône Centrale Animée */}
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {isProcessing ? (
                        <Loader2 size={24} className="text-accent animate-spin" />
                    ) : (
                        <div className="relative">
                            <Upload size={24} className="text-white/40 group-hover:text-white transition-colors" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Instructions Unifiées */}
                <div className="z-10 flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-white">Déposez vos sources ici</h3>
                    <p className="text-xs text-white/40 font-medium">
                        Fichiers (PDF, DOCX) ou <span className="text-white/60 border-b border-white/20">collez une URL</span>
                    </p>
                </div>

                {/* Input URL Discret mais Puissant */}
                <div className="w-full max-w-sm relative mt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <LinkIcon size={12} className="text-white/30" />
                    </div>
                    <input
                        type="text"
                        placeholder="Ou collez un lien Web / YouTube..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(e)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-mono"
                    />
                    <button
                        onClick={handleUrlSubmit}
                        disabled={!urlInput || isProcessing}
                        className="absolute inset-y-1 right-1 px-2 bg-white/10 hover:bg-accent hover:text-black rounded-lg text-white/40 transition-colors disabled:opacity-0"
                    >
                        <Check size={12} />
                    </button>
                </div>

                {/* Zone de clic globale */}
                <div
                    className="absolute inset-0 z-0 cursor-pointer"
                    onClick={() => document.getElementById('file-upload')?.click()}
                />
            </div>
        </div>
    );
}
