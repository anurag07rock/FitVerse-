"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseCard } from './ExerciseCard';
import { YogaFlowCard } from './YogaFlowCard';
import api from '@/services/api';

export const SearchPortal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [resultTypes, setResultTypes] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const performSearch = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/search?q=${query}`);
                const data = response.data;
                if (isMounted) {
                    const mappedExercises = (data.exercises || []).map((e: any) => ({ ...e, _type: 'exercise' }));
                    const mappedWorkouts = (data.workouts || []).map((w: any) => ({ ...w, _type: 'workout' }));
                    const mappedYoga = (data.yoga || []).map((y: any) => ({ ...y, _type: 'yoga' }));

                    setResults([...mappedExercises, ...mappedWorkouts, ...mappedYoga]);
                }
            } catch (error) {
                console.error('Search failed', error);
                if (isMounted) {
                    // Fallback data
                    setResults([
                        { id: '1', title: `Result for ${query}`, zone: { name: 'Fitness' }, difficulty: 'Beginner', hero_thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', _type: 'workout' }
                    ]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (query.length > 2) {
            const timer = setTimeout(() => {
                performSearch();
            }, 500);
            return () => {
                clearTimeout(timer);
                isMounted = false;
            };
        } else {
            setResults([]);
        }

        return () => { isMounted = false; };
    }, [query]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-start justify-center px-6"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-4xl bg-[#111] border border-white/10 border-t-0 rounded-b-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Search Input Area */}
                        <div className="p-6 border-b border-white/5 flex items-center gap-4">
                            <Search className="text-[#ccff00]" size={24} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search Exercises, Workouts, or Yoga..."
                                className="flex-1 bg-transparent border-none text-2xl font-bold text-white focus:outline-none placeholder:text-white/10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X size={24} /></button>
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="animate-spin text-[#ccff00]" size={40} />
                                    <p className="text-white/20 font-bold uppercase tracking-widest">Querying FitVerse Index...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((item) => (
                                        <div key={`${item._type}-${item.id}`}>
                                            {item._type === 'yoga' ? (
                                                <YogaFlowCard flow={item} />
                                            ) : (
                                                <ExerciseCard exercise={item} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-white/20 text-xl font-medium">Start typing to search 500+ items</p>
                                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                                        {['Chest', 'HIIT', 'Flow', 'Advanced', 'Home'].map(tag => (
                                            <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-white/5 rounded-full text-xs text-white/40 hover:bg-[#ccff00] hover:text-black transition-all">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-white/5 p-4 px-6 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                                <kbd className="px-1.5 py-0.5 bg-black rounded border border-white/10">ESC</kbd> to close
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[#ccff00] font-black uppercase">
                                FitVerse Engine V4.0 <ArrowRight size={10} />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
