"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Search, LayoutGrid, List, Sparkles, Zap, Flame } from 'lucide-react';
import api from '@/services/api';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Navbar } from '@/components/Navbar';

export default function ZumbaPage() {
    const [routines, setRoutines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRoutines = async () => {
            setLoading(true);
            try {
                const response = await api.get('/zumba/routines');
                setRoutines(response.data);
            } catch (error) {
                console.error("Error fetching zumba routines:", error);
                // Fallback / Mock
                setRoutines([
                    { id: 'z1', title: "Beginner Zumba: Latin Heat", difficulty: "Beginner", total_duration_min: 30, estimated_calories: 350, description: "A high-energy entry point to the world of Zumba. Focus on rhythm and basic steps.", hero_thumbnail_url: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=800&q=80", category: 'zumba' },
                    { id: 'z2', title: "Fat Burn Zumba: Carnival", difficulty: "Intermediate", total_duration_min: 45, estimated_calories: 600, description: "Intense cardio dance session using traditional Carnival beats to maximize calorie burn.", hero_thumbnail_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80", category: 'zumba' },
                    { id: 'z3', title: "Dance Cardio: Urban Groove", difficulty: "Advanced", total_duration_min: 40, estimated_calories: 500, description: "Fast-paced hip-hop inspired zumba session for peak fitness and coordination.", hero_thumbnail_url: "https://images.unsplash.com/photo-1535531492708-208e93c0fa11?auto=format&fit=crop&w=800&q=80", category: 'zumba' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    const filteredRoutines = routines.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
            <Navbar />

            {/* Ambient Animated Elements */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <Music className="text-[#ff006e]" size={24} />
                            <span className="text-[#ff006e] text-sm font-black uppercase tracking-[0.3em]">Beat Sync Protocol</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none"
                        >
                            Zumba <span className="text-[#ff006e]">Dance</span>
                        </motion.h1>
                        <p className="text-white/40 text-xl font-medium max-w-2xl">High-energy cardio routines that sync with your Spotify library for a cinematic workout experience.</p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff006e] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search routines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-[#ff006e] transition-all backdrop-blur-xl"
                        />
                    </div>
                </div>

                {/* Categories / Tags */}
                <div className="flex gap-4 mb-20">
                    <div className="px-6 py-2 bg-[#ff006e]/20 border border-[#ff006e]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff006e] shadow-[0_0_20px_rgba(255,0,110,0.2)]">
                        All Routines
                    </div>
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:border-white/30 hover:text-white cursor-pointer transition-all">
                        Latin Zumba
                    </div>
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:border-white/30 hover:text-white cursor-pointer transition-all">
                        Beginner Series
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredRoutines.map((routine) => (
                                <ExerciseCard key={routine.id} exercise={routine} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredRoutines.length === 0 && (
                    <div className="py-40 text-center">
                        <p className="text-white/20 text-3xl font-black uppercase italic tracking-tighter">No rhythms found in this set.</p>

                    </div>
                )}
            </div>
        </div>
    );
}
