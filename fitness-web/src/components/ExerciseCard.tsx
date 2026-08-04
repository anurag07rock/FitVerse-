"use client";

import React, { useState } from 'react';
import { Play, Flame, Timer, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ExerciseCardProps {
    exercise: {
        id: string;
        title?: string;
        name?: string;
        thumbnail?: string;
        hero_thumbnail_url?: string;
        thumbnail_url?: string;
        duration?: number;
        total_duration_min?: number;
        caloriesBurned?: number;
        estimated_calories?: number;
        calories?: number;
        difficulty: string;
        muscleGroup?: string;
        muscle?: string;
        zone?: { name: string };
    };
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
    const [isHovered, setIsHovered] = useState(false);

    const name = exercise.title || exercise.name;
    const thumbnail = exercise.thumbnail || exercise.hero_thumbnail_url || exercise.thumbnail_url;
    const duration = exercise.duration || exercise.total_duration_min;
    const calories = exercise.caloriesBurned || exercise.estimated_calories || exercise.calories;
    const zoneName = exercise.muscleGroup || exercise.zone?.name || exercise.muscle || 'Fitness';

    return (
        <Link href={`/workout/${exercise.id}`}>
            <motion.div
                layout
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#ccff00]/30 transition-all duration-500 shadow-2xl"
            >
                {/* Media Layer */}
                <div className="relative aspect-video overflow-hidden">
                    <motion.img
                        src={thumbnail}
                        alt={name}
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        className="w-full h-full object-cover transition-transform duration-700"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center"
                            >
                                <motion.button
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-[#ccff00] rounded-full flex items-center justify-center text-black shadow-2xl"
                                >
                                    <Play size={32} fill="black" className="ml-1" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                            {exercise.difficulty}
                        </span>
                    </div>
                </div>

                {/* Content Layer */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[#ccff00] text-[10px] font-black uppercase tracking-widest">{zoneName}</span>
                        <div className="flex items-center gap-1 text-white/40 text-[10px] font-mono">
                            <Timer size={12} /> {duration}m
                        </div>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-4 group-hover:text-[#ccff00] transition-colors">{name}</h3>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Flame size={14} className="text-orange-500" />
                                <span className="text-xs text-white/60 font-medium">{calories} cal</span>
                            </div>
                        </div>
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Info size={18} />
                        </button>
                    </div>
                </div>

                {/* Progress Trigger - Production Ready CTA */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: isHovered ? '0%' : '-100%' }}
                        className="h-full bg-[#ccff00]"
                    />
                </div>
            </motion.div>
        </Link>
    );
};
