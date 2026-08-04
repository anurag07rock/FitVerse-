"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Search, LayoutGrid, List, Sparkles } from 'lucide-react';
import { YogaFlowCard } from '@/components/YogaFlowCard';
import api from '@/services/api';

export default function YogaPage() {
    const [flows, setFlows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchFlows = async () => {
            setLoading(true);
            try {
                const response = await api.get('/yoga/flows');
                setFlows(response.data);
            } catch (error) {
                console.error("Error fetching yoga flows:", error);
                // Fallback / Mock
                setFlows([
                    { id: '1', title: "Ethereal Morning Flow", difficulty: "Beginner", duration: 25, description: "A gentle sequence to awaken the body and mind with the rising sun.", hero_thumbnail_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" },
                    { id: '2', title: "Zen Mastery: Peak Power", difficulty: "Advanced", duration: 45, description: "Intense balancing poses designed to test your focus and core stability.", hero_thumbnail_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" },
                    { id: '3', title: "Twilight Restoration", difficulty: "Intermediate", duration: 30, description: "Deep stretching and meditative breathing to unwind after a long day.", hero_thumbnail_url: "https://images.unsplash.com/photo-1599447421416-3414502d18a5?auto=format&fit=crop&w=800&q=80" },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFlows();
    }, []);

    const filteredFlows = flows.filter(f =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
            {/* Ambient Background Element */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Wind className="text-[#70a1ff]" size={24} />
                            <span className="text-[#70a1ff] text-sm font-black uppercase tracking-[0.3em]">Zen Protocol</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none"
                        >
                            Yoga <span className="text-[#70a1ff]">Flows</span>
                        </motion.h1>
                        <p className="text-white/40 text-xl font-medium max-w-2xl">Find your center with cinematic, AI-sequenced movement patterns for every skill level.</p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#70a1ff] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search flows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-[#70a1ff] transition-all backdrop-blur-xl"
                        />
                    </div>
                </div>

                {/* Featured Tag */}
                <div className="flex items-center gap-6 mb-12">
                    <div className="h-px flex-1 bg-white/5" />
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                        <Sparkles size={14} className="text-[#70a1ff]" /> CURATED SEQUENCES
                    </div>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredFlows.map((flow) => (
                                <YogaFlowCard key={flow.id} flow={flow} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredFlows.length === 0 && (
                    <div className="py-40 text-center">
                        <p className="text-white/20 text-3xl font-black uppercase italic tracking-tighter">No flows found in this realm.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
