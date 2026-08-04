"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Clock,
    Zap,
    ChevronLeft,
    Play,
    ArrowRight,
    AlertCircle,
    ShieldCheck,
    Trophy,
    Dumbbell,
    Target,
    ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { exercises } from '@/data/exercises';

export default function WorkoutDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [exercise, setExercise] = useState<any>(null);

    useEffect(() => {
        const ex = exercises.find(e => e.id === params.id);
        if (ex) {
            setExercise(ex);
        } else {
            // Fallback to first exercise if not found for demo
            setExercise(exercises[0]);
        }
    }, [params.id]);

    if (!exercise) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                {/* 1. Navigation & Header */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors font-black uppercase text-[10px] tracking-widest mb-12"
                >
                    <ChevronLeft size={16} /> Back to Studio
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    {/* Left: Video Player Section */}
                    <div className="space-y-8">
                        <VideoPlayer videoId={exercise.videoId} title={exercise.title} />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Duration', val: `${exercise.duration}m`, icon: Clock },
                                { label: 'Calories', val: exercise.caloriesBurned, icon: Zap },
                                { label: 'Difficulty', val: exercise.difficulty, icon: Trophy },
                                { label: 'Equipment', val: exercise.equipment, icon: Dumbbell },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <stat.icon size={18} className="text-[#ccff00]" />
                                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">{stat.label}</span>
                                    <span className="text-sm font-bold uppercase">{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Exercise Info Section */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full mb-6 w-fit"
                        >
                            <Target size={12} className="text-[#ccff00]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Muscle Group: {exercise.muscleGroup}</span>
                        </motion.div>

                        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
                            {exercise.title.split(' ')[0]} <span className="text-[#ccff00]">{exercise.title.split(' ').slice(1).join(' ')}</span>
                        </h1>

                        <p className="text-white/60 text-lg leading-relaxed mb-10">
                            {exercise.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-10 py-5 bg-[#ccff00] text-black font-black uppercase text-xs rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                                Start Session <Play size={16} fill="black" />
                            </button>
                            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-xs rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all">
                                Add to Routine +
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Step-by-Step Guidance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-[#ccff00] pl-6">
                            Step-By-Step <span className="text-[#ccff00]">Execution.</span>
                        </h2>

                        <div className="grid gap-6">
                            {exercise.steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-start gap-8 bg-white/5 border border-white/5 p-8 rounded-[32px] hover:border-[#ccff00]/20 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ccff00] text-black font-black flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-lg font-bold uppercase tracking-tight group-hover:text-[#ccff00] transition-colors mb-2">
                                            {step.split(':')[0]}
                                        </p>
                                        <p className="text-white/40 font-medium">
                                            {step.includes(':') ? step.split(':').slice(1).join(':') : step}
                                        </p>
                                    </div>
                                    <ChevronRight className="text-white/10 mt-2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Sections */}
                    <div className="space-y-12">
                        {/* Common Mistakes */}
                        <div className="bg-[#ff4757]/5 border border-[#ff4757]/20 p-8 rounded-[32px]">
                            <h3 className="flex items-center gap-3 text-[#ff4757] font-black uppercase text-xs tracking-widest mb-6">
                                <AlertCircle size={20} /> Common Mistakes
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Arching the lower back during movements",
                                    "Using momentum instead of controlled muscle contraction",
                                    "Incomplete range of motion"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                                        <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[#ff4757]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 p-8 rounded-[32px]">
                            <h3 className="flex items-center gap-3 text-[#ccff00] font-black uppercase text-xs tracking-widest mb-6">
                                <ShieldCheck size={20} /> Safety Protocol
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Always warm up for 5-10 minutes before starting",
                                    "Keep your core engaged throughout the movement",
                                    "Stop immediately if you feel sharp, localized pain"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                                        <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[#ccff00]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
