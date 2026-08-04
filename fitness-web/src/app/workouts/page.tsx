"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ExerciseCard } from '@/components/ExerciseCard';
import api from '@/services/api';

const CATEGORIES = ['All Sessions', 'Strength', 'Cardio', 'Yoga', 'Zumba', 'Home', 'Stretching'];

function WorkoutsContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryQuery && CATEGORIES.includes(categoryQuery) ? categoryQuery : 'All Sessions');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/workouts', {
                    params: { category: activeCategory === 'All Sessions' ? undefined : activeCategory.toLowerCase() }
                });
                setWorkouts(response.data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
                // Mock data fallback
                setWorkouts([
                    { id: '1', title: "Viking HIIT: Ascension", zone: { name: "HIIT" }, hero_thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", total_duration_min: 45, estimated_calories: 450, difficulty: "Advanced" },
                    { id: '2', title: "Iron Core 2.0", zone: { name: "Strength" }, hero_thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80", total_duration_min: 30, estimated_calories: 280, difficulty: "Intermediate" },
                    { id: '3', title: "Zen Mobility Flow", zone: { name: "Mobility" }, hero_thumbnail_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80", total_duration_min: 20, estimated_calories: 120, difficulty: "Beginner" },
                    { id: '4', title: "Power Yoga I", zone: { name: "Yoga" }, hero_thumbnail_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", total_duration_min: 40, estimated_calories: 200, difficulty: "Intermediate" },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, [activeCategory]);

    const filteredWorkouts = workouts.filter(w =>
        (w.title || w.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl font-black uppercase italic tracking-tighter mb-4"
                        >
                            Pro <span className="text-[#ccff00]">Workouts</span>
                        </motion.h1>
                        <p className="text-white/40 text-lg font-medium">Stream high-performance sessions designed by elite coaches.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ccff00] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-[#ccff00] transition-all"
                            />
                        </div>
                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#ccff00] text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#ccff00] text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === category ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-lg shadow-[#ccff00]/20' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredWorkouts.map((workout) => (
                                <ExerciseCard key={workout.id} exercise={workout} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredWorkouts.length === 0 && !loading && (
                    <div className="py-32 text-center">
                        <p className="text-white/20 text-xl font-bold italic uppercase tracking-widest">No matching sessions found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WorkoutsPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[#ccff00] animate-pulse">Loading Workouts...</div>
            </div>
        }>
            <WorkoutsContent />
        </React.Suspense>
    );
}
