"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { ProfessionalDirectory } from '@/components/community/ProfessionalDirectory';

export default function CommunityHubPage() {
    const [activeTab, setActiveTab] = useState<'feed' | 'profs'>('feed');

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* 1. Community Header */}
            <section className="relative overflow-hidden pt-32 pb-20 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] aspect-square bg-[#ccff00]/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8"
                    >
                        <Users size={16} className="text-[#ccff00]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 text-shadow-glow">Community Nexus V4.2</span>
                    </motion.div>

                    <h1 className="text-7xl font-black mb-6 tracking-tighter uppercase italic">
                        Ascend <span className="text-[#ccff00]">Together.</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">
                        Connect with elite performance coaches and 50,000+ athletes crushing their goals in the FitVerse ecosystem.
                    </p>

                    <div className="flex justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit mx-auto shadow-2xl">
                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'feed' ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20' : 'text-white/40 hover:text-white'}`}
                        >
                            Social Feed
                        </button>
                        <button
                            onClick={() => setActiveTab('profs')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'profs' ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20' : 'text-white/40 hover:text-white'}`}
                        >
                            Professional Hub
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Isolated Content Module */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Sidebar Utilities (Passive) */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                            <h4 className="text-[#ccff00] text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp size={14} /> Global Momentum
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/40">Workouts Today</span>
                                    <span className="font-bold">4,192</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/40">Active Streaks</span>
                                    <span className="font-bold text-[#ccff00]">89%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldCheck className="text-[#ccff00]" size={20} />
                                <h4 className="text-sm font-bold">Safe Feed</h4>
                            </div>
                            <p className="text-[10px] text-white/30 leading-relaxed uppercase">
                                FitVerse Nexus uses AI moderation to ensure a professional, supportive environment for all athletes.
                            </p>
                        </div>
                    </div>

                    {/* Main Feed/Pro Directory (Active) */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'feed' ? <CommunityFeed /> : <ProfessionalDirectory />}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
