"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Check, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NexusIngest({ onSourceAdded }: { onSourceAdded: (source: any) => void }) {
    const [urlInput, setUrlInput] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUrlSubmit = async (e: any) => {
        e.preventDefault();
        if (!urlInput) return;

        setIsProcessing(true);
        // Simulation de l'appel backend pour scraper l'URL
        // TODO: Connecter à /scout pour de vrai
        setTimeout(() => {
            onSourceAdded({
                id: Date.now().toString(),
                title: urlInput, // Sera remplacé par le vrai titre
                type: 'web',
                status: 'analysed',
                content: "Contenu extrait..."
            });
            setUrlInput("");
            setIsProcessing(false);
        }, 1500);
    };

    const handleFileUpload = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simulation d'upload
        setIsProcessing(true);
        setTimeout(() => {
            onSourceAdded({
                id: Date.now().toString(),
                title: file.name,
                type: 'pdf',
                status: 'analysed',
                content: "Contenu PDF extrait..."
            });
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Zone d'Ingestion Unifiée */}
            <div
                className={`border-2 border-dashed rounded-2xl p-6 transition-all ${isDragging ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/20'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    // Handle file drop logic here (similaire à handleFileUpload)
                }}
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <Upload size={20} className="text-white/40" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-white">Glissez vos fichiers ici</span>
                        <span className="text-xs text-white/40">PDF, DOCX, TXT (Max 50MB)</span>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <div className="h-[1px] bg-white/10 flex-1" />
                        <span className="text-[10px] uppercase font-black text-white/20">OU</span>
                        <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <form onSubmit={handleUrlSubmit} className="w-full flex gap-2">
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
