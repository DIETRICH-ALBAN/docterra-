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

const MENU_ITEMS = [
    { id: 'dash', icon: LayoutDashboard, label: "Console" },
    { id: 'templates', icon: FileText, label: "Modèles" },
    { id: 'history', icon: History, label: "Archives" },
    { id: 'settings', icon: Settings, label: "Système" },
];

export default function Sidebar() {
    const [active, setActive] = useState('dash');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
            <nav className="flex flex-col gap-2">
                {MENU_ITEMS.map((item, idx) => (
                    <motion.div
                        key={item.id}
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
                ))}
            </nav>

            {/* Footer Info */}
            <div className="mt-auto flex flex-col gap-4">
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
            </div>
        </motion.aside>
    );
}
