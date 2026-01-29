"use client";

import { motion } from "framer-motion";
import { ListChecks, Edit3, Trash2, Plus, Download, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ContentPreview({ structure, query, onForgeReady }: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadLink, setDownloadLink] = useState<string | null>(null);

    if (!structure) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("http://localhost:8000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    template: "academic",
                    data: {
                        title: structure.title || query,
                        author: "User DocTerra",
                        professor: "Maitresse de l'IA",
                        date: new Date().toLocaleDateString("fr-FR"),
                        sections: structure.sections.map((s: any) => ({
                            title: s.title,
                            content: s.brief || "Contenu généré par l'alchimie DocTerra."
                        }))
                    }
                }),
            });
            const data = await response.json();

            // Simuler un délai premium pour l'effet
            setTimeout(() => {
                setDownloadLink(data.file_path);
                setIsGenerating(false);
                alert("ALCHIMIE TERMINÉE : Votre document est prêt.");
            }, 2000);

        } catch (error) {
            setIsGenerating(false);
            alert("Erreur lors de la génération. Le Core Backend ne répond pas.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-10 glass-card flex flex-col gap-8 border-accent/10"
        >
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <ListChecks size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black glow-text">{structure.title || "Structure du Rapport"}</h3>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Plan Intellectuel Identifié</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/20">
                    <Sparkles size={14} className="text-accent animate-pulse" />
                    <span className="text-[10px] text-accent font-black tracking-widest uppercase">Prêt pour Export</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {structure.sections.map((section: any, idx: number) => (
                    <motion.div
                        key={idx}
                        whileHover={{ x: 8, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                        className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group transition-colors"
                    >
                        <div className="flex items-center gap-5">
                            <span className="text-accent/30 font-black text-xl italic">{String(idx + 1).padStart(2, '0')}</span>
                            <div className="flex flex-col gap-1">
                                <h4 className="font-bold text-lg text-white/90 group-hover:text-accent transition-colors">{section.title}</h4>
                                <p className="text-xs text-white/30 font-medium">{section.brief || "Séquence analytique activée."}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 transition-colors"><Edit3 size={16} /></button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/40 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}

                <button className="p-5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white/20 hover:border-accent/30 hover:text-accent/60 transition-all font-bold text-sm">
                    <Plus size={18} />
                    <span>INSÉRER UN NOUVEL AXE ANALYTIQUE</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 209, 255, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onForgeReady && onForgeReady(structure)}
                    className="py-4 border border-accent/30 text-accent rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles size={16} />
                    Entrer dans la Forge
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(255, 255, 255, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} strokeWidth={3} />}
                    {isGenerating ? "ALCHIMIE..." : "Exportation DOCX"}
                </motion.button>
            </div>

            {downloadLink && (
                <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    href={`http://localhost:8000/download/${downloadLink}`}
                    className="text-center p-4 rounded-xl border border-white/10 text-accent font-black text-[10px] uppercase hover:bg-accent/10 transition-colors tracking-widest"
                >
                    Lien de téléchargement sécurisé généré : {downloadLink}
                </motion.a>
            )}
        </motion.div>
    );
}
