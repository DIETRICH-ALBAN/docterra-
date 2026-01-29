"use client";

import { motion } from "framer-motion";
import { Upload, FilePlus, Search, FileText, LayoutDashboard, Sparkles, Orbit } from "lucide-react";
import { useState, useEffect } from "react";

const QUICK_MODELS = [
    { icon: FilePlus, title: "Rapport Académique", desc: "Standard A+", color: "from-cyan-500/20 to-blue-500/20" },
    { icon: FileText, title: "Analyse Stratégique", desc: "McKinsey/BCG", color: "from-purple-500/20 to-pink-500/20" },
    { icon: Orbit, title: "Deck Futuriste", desc: "Style Gamma.app", color: "from-orange-500/20 to-red-500/20" },
];

export default function UploadZone() {
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-96 glass-card animate-pulse" />;

    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-8"
        >
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-accent">
                        <Sparkles size={16} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Poste de Contrôle</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter">Nouvelle Usine</h2>
                    <p className="text-white/40 max-w-md text-sm font-medium">L'IA prépare vos documents. Déposez vos sources pour commencer l'alchimie numérique.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 209, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    <Search size={14} />
                    Explorer le Web
                </motion.button>
            </div>

            {/* Main Drop Area */}
            <motion.div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`group relative h-80 glass-card flex flex-col items-center justify-center gap-6 cursor-pointer border-dashed border-white/10 transition-all hover:border-accent/40 ${isHovering ? "bg-accent/[0.03]" : ""
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <motion.div
                    animate={{
                        y: isHovering ? -10 : 0,
                        scale: isHovering ? 1.1 : 1
                    }}
                    className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-accent glow-cyan"
                >
                    <Upload size={32} strokeWidth={1.5} />
                </motion.div>

                <div className="text-center relative">
                    <span className="text-2xl font-black block glow-text">Transférez vos sources</span>
                    <span className="text-white/20 text-xs mt-1 block font-mono">DOCX, PDF, PPTX (Max 50MB)</span>
                </div>
            </motion.div>

            {/* Bento Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {QUICK_MODELS.map((model, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                        className="glass-card p-6 flex items-center gap-5 group cursor-pointer"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center text-white/80 group-hover:text-white transition-all`}>
                            <model.icon size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-sm">{model.title}</span>
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{model.desc}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
