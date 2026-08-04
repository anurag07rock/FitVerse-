"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    TrendingUp,
    Zap,
    Clock,
    Trophy,
    ChevronRight,
    Activity,
    Calendar,
    Award
} from 'lucide-react';
import Link from 'next/link';
import { ExerciseCard } from '@/components/ExerciseCard';
import { exercises } from '@/data/exercises';

export default function DashboardPage() {
    const [featuredWorkouts, setFeaturedWorkouts] = useState<any[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

    useEffect(() => {
        // Use local dataset for "fully functional" standalone experience
        setFeaturedWorkouts(exercises.filter(e => e.difficulty === 'beginner').slice(0, 3));
        setRecentWorkouts(exercises.slice(10, 13));
    }, []);

    const weeklyStats = [
        { day: 'Mon', kcal: 400 },
        { day: 'Tue', kcal: 650 },
        { day: 'Wed', kcal: 300 },
        { day: 'Thu', kcal: 820 },
        { day: 'Fri', kcal: 450 },
        { day: 'Sat', kcal: 950 },
        { day: 'Sun', kcal: 200 }
    ];

    const maxKcal = Math.max(...weeklyStats.map(s => s.kcal));

    return (
        <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-20">
            {/* 1. Daily Suggestion Hero */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Daily <span className="text-[#ccff00]">Suggestion</span></h2>
                        <p className="text-white/40 text-sm font-medium">Specially picked for your beginner journey.</p>
                    </div>
                </div>

                <div className="relative h-[450px] rounded-[40px] overflow-hidden group">
                    <img
                        src={featuredWorkouts[0]?.thumbnail || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80"}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
                        alt="Daily Sug"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-end p-12">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="px-3 py-1 bg-[#ccff00] text-black text-[10px] font-black rounded-full mb-6 inline-block uppercase tracking-widest text-shadow-glow">Recommended for You</span>
                            <h1 className="text-7xl font-black mb-6 tracking-tighter uppercase italic leading-none">
                                {featuredWorkouts[0]?.title || "Morning Mobility"}
                            </h1>
                            <div className="flex gap-6 mb-8 text-white/60 font-medium">
                                <div className="flex items-center gap-2"><Clock size={18} className="text-[#ccff00]" /> {featuredWorkouts[0]?.duration || 20}m</div>
                                <div className="flex items-center gap-2"><Zap size={18} className="text-[#ccff00]" /> {featuredWorkouts[0]?.difficulty || 'Beginner'}</div>
                                <div className="flex items-center gap-2 text-[#ccff00]/60"><Award size={18} /> Pro Selection</div>
                            </div>
                            <Link
                                href={`/workout/${featuredWorkouts[0]?.id || 1}`}
                                className="px-10 py-5 bg-[#ccff00] text-black font-black uppercase text-xs rounded-2xl flex items-center gap-2 hover:scale-105 transition-all w-fit shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                            >
                                Start Training Now <Play size={16} fill="black" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Stats & Analytics Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Activity Chart */}
                <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-[40px] p-10 flex flex-col">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Weekly <span className="text-[#ccff00]">Activity</span></h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Calorie consumption trends</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">4.2k</span>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">TOTAL KCAL THIS WEEK</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-4 h-56">
                        {weeklyStats.map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="relative w-full flex-1 flex flex-col justify-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(stat.kcal / maxKcal) * 100}%` }}
                                        className="w-full bg-white/5 group-hover:bg-[#ccff00] rounded-2xl transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 bg-[#ccff00]/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#ccff00]">{stat.kcal}</div>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.day === 'Sat' ? 'text-[#ccff00]' : 'text-white/20'}`}>{stat.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Tracking Widget */}
                <div className="space-y-4">
                    {[
                        { label: 'Live Streak', val: '14 Days', icon: TrendingUp, color: '#ccff00' },
                        { label: 'Energy Burned', val: '12.4k', icon: Zap, color: '#ff4757' },
                        { label: 'Training Volume', val: '840m', icon: Clock, color: '#70a1ff' },
                        { label: 'Performance Rank', val: 'Elite I', icon: Trophy, color: '#ffa502' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#111] p-8 rounded-[32px] border border-white/5 flex items-center gap-8 group hover:border-[#ccff00]/20 transition-all">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110" style={{ color: stat.color }}>
                                <stat.icon size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black italic tracking-tighter">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Recent Workouts Widget */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Continual <span className="text-[#ccff00]">Performance</span></h2>
                        <p className="text-white/40 text-sm font-medium">Summary of your recently watched and completed sessions.</p>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
                    {recentWorkouts.map((workout) => (
                        <div key={workout.id} className="min-w-[340px] max-w-[340px]">
                            <ExerciseCard exercise={workout} />
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Top Performances (Recommended) */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Elite <span className="text-[#ccff00]">Library</span></h2>
                        <p className="text-white/40 text-sm font-medium">Curated high-performance sets based on beginner metrics.</p>
                    </div>
                    <Link href="/studio" className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4 hover:translate-x-2 transition-transform">
                        Enter Studio <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredWorkouts.map((workout) => (
                        <ExerciseCard key={workout.id} exercise={workout} />
                    ))}
                </div>
            </section>
        </div>
    );
}
