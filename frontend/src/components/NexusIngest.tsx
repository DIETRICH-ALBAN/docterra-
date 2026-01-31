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

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Zone d'Ingestion Unifiée */}
            <div
                className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer ${isDragging ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file);
                }}
                onClick={() => document.getElementById('file-upload')?.click()}
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
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Upload size={20} className="text-white/40" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white">Glissez vos fichiers ici</span>
                        <span className="text-xs text-white/40">PDF, DOCX, TXT (Max 50MB)</span>
                    </div>

                    <div className="flex items-center gap-3 w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="h-[1px] bg-white/10 flex-1" />
                        <span className="text-[10px] uppercase font-black text-white/20">OU</span>
                        <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <form onSubmit={handleUrlSubmit} className="w-full flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex-1">
                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Collez une URL..."
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-white text-black px-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
