"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FileText,
    History,
    Settings,
    HelpCircle,
    Cpu,
    LogOut,
    ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import templatesData from '@/lib/templates.json';

const MENU_ITEMS = [
    { id: 'dash', icon: LayoutDashboard, label: "Console" },
    { id: 'templates', icon: FileText, label: "Modèles" },
    { id: 'history', icon: History, label: "Archives" },
    { id: 'settings', icon: Settings, label: "Système" },
];

export default function Sidebar({ onLoadProject }: any) {
    const [active, setActive] = useState('dash');
    const [mounted, setMounted] = useState(false);
    const [archives, setArchives] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        // Récupération des archives si possible
        fetch("http://localhost:8000/documents")
            .then(res => res.json())
            .then(data => setArchives(data))
            .catch(() => console.log("Backend non connecté"));
    }, []);

    if (!mounted) return <aside className="w-64 h-screen bg-background" />;

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 h-screen border-r border-white/5 flex flex-col p-8 gap-12 sticky top-0 bg-[#050505]/50 backdrop-blur-md z-50"
        >
            {/* Brand */}
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                    <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                        <Cpu size={24} className="group-hover:rotate-90 transition-transform duration-700" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tighter glow-text">DOCTERRA</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Document Factory</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2">
                {MENU_ITEMS.map((item, idx) => (
                    <div key={item.id}>
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            onClick={() => setActive(item.id)}
                            className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${active === item.id
                                ? "bg-white/5 border border-white/10 text-accent font-bold"
                                : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} strokeWidth={active === item.id ? 2 : 1.5} />
                                <span className="text-sm tracking-wide">{item.label}</span>
                            </div>

                            {active === item.id && (
                                <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-accent glow-cyan" />
                            )}

                            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active === item.id ? 'hidden' : ''}`} />
                        </motion.div>

                        {/* Sous-menu Modèles */}
                        {item.id === 'templates' && active === 'templates' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="pl-12 flex flex-col gap-3 py-4"
                            >
                                {templatesData.map((tmpl, i) => (
                                    <div
                                        key={tmpl.id}
                                        onClick={() => onLoadProject(`TEMPLATE::${tmpl.id}`)} // Hack temporaire pour charger un template
                                        className="flex flex-col group/tmpl cursor-pointer"
                                    >
                                        <span className="text-[11px] font-bold text-white/50 group-hover/tmpl:text-accent transition-colors truncate">
                                            {tmpl.title}
                                        </span>
                                        <span className="text-[8px] text-white/20 italic truncate max-w-[180px]">{tmpl.description}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Sous-menu Archives */}
                        {item.id === 'history' && active === 'history' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="pl-12 flex flex-col gap-3 py-4"
                            >
                                {archives.length > 0 ? archives.map((doc, i) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => onLoadProject(doc.id)}
                                        className="flex flex-col group/doc cursor-pointer"
                                    >
                                        <span className="text-[11px] font-bold text-white/50 group-hover/doc:text-accent transition-colors truncate">
                                            {doc.title}
                                        </span>
                                        <span className="text-[8px] text-white/10 uppercase tracking-widest">{new Date(doc.created_at).toLocaleDateString()}</span>
                                    </div>
                                )) : (
                                    <span className="text-[10px] text-white/10 italic">Aucun document archivé</span>
                                )}
                            </motion.div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer Info */}
            <div className="mt-auto flex flex-col gap-4" >
                <div className="glass-card p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">IA Active</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">Prêt pour l'extraction stratégique.</p>
                </div>

                <div className="flex items-center justify-between px-2 text-white/20 hover:text-red-500 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span className="text-sm font-semibold">Déconnexion</span>
                    </div>
                </div>
            </div >
        </motion.aside >
    );
}
