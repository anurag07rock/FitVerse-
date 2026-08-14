"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, ChevronRight, LayoutGrid, List, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Navbar } from '@/components/Navbar';
import { exercises } from '@/data/exercises';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'Zumba', 'Recovery'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const EQUIPMENT = ['Bodyweight', 'Dumbbells', 'Barbell', 'Mat', 'None'];

function StudioPageContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [workouts, setWorkouts] = useState<any[]>(exercises);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categoryQuery && CATEGORIES.includes(categoryQuery) ? categoryQuery : 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeDifficulty, setActiveDifficulty] = useState('All');

    const filteredWorkouts = workouts.filter(w => {
        const matchesSearch = (w.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || w.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesDiff = activeDifficulty === 'All' || w.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
        return matchesSearch && matchesCategory && matchesDiff;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-2xl mb-6 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                        >
                            <Sparkles size={14} className="text-[#ccff00]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00]">AI Session Engine</span>
                        </motion.div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Fitness <span className="text-[#ccff00]">Studio.</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-medium">
                            Explore over 300+ professional sessions with real-time visual guidance for beginner success.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ccff00] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="SEARCH THE STUDIO..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm font-bold tracking-widest focus:outline-none focus:border-[#ccff00]/50 transition-colors uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Filters Row */}
                <div className="flex flex-nowrap items-center gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex flex-nowrap bg-white/5 border border-white/10 p-1 rounded-2xl flex-shrink-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-h-[44px] ${activeCategory === cat ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20' : 'text-white/40 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
                        <select
                            value={activeDifficulty}
                            onChange={(e) => setActiveDifficulty(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest px-6 py-3 border-none focus:ring-0 cursor-pointer text-white/40 hover:text-white"
                        >
                            <option value="All" className="bg-[#111]">Difficulty: All</option>
                            <option value="Beginner" className="bg-[#111]">Beginner</option>
                            <option value="Intermediate" className="bg-[#111]">Intermediate</option>
                            <option value="Advanced" className="bg-[#111]">Advanced</option>
                        </select>
                    </div>

                    <div className="ml-auto flex bg-white/5 border border-white/10 p-1 rounded-2xl">
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

                {/* 3. Grid Display */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10" : "flex flex-col gap-6"}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredWorkouts.slice(0, 24).map((workout) => (
                                <ExerciseCard key={workout.id} exercise={workout} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredWorkouts.length === 0 && (
                    <div className="py-40 text-center">
                        <p className="text-white/20 text-3xl font-black uppercase italic tracking-tighter">No sessions found in this frequency.</p>
                    </div>
                )}

                {filteredWorkouts.length > 24 && (
                    <div className="mt-20 flex justify-center">
                        <button className="px-12 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-white/40 hover:text-white">
                            Load 200+ more sessions
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default function StudioPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <StudioPageContent />
        </React.Suspense>
    );
}
