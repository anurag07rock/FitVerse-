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
        <div className="pt-8 sm:pt-10 pb-32 px-6 max-w-7xl mx-auto space-y-20 relative">
            {/* Cinematic Gym Atmosphere Background */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-screen h-[620px] pointer-events-none -z-10 overflow-hidden select-none">
                {/* High-res dark gym weights & rack atmosphere */}
                <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80"
                    alt="Gym Atmosphere"
                    className="w-full h-full object-cover opacity-25 filter grayscale contrast-125 scale-105"
                />
                {/* Seamless ambient fades into page dark background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/90 via-[#060606]/40 to-[#060606]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-transparent to-[#060606]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060606_85%)]" />
                
                {/* Overhead gym arena spotlight beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-[#ccff00]/12 via-[#ccff00]/3 to-transparent blur-3xl" />
            </div>

            {/* Subtle Gym Typography Watermark */}
            <div className="absolute -top-6 left-0 right-0 flex justify-center pointer-events-none -z-10 select-none overflow-hidden opacity-[0.04]">
                <span className="text-[100px] sm:text-[160px] md:text-[200px] font-black uppercase italic tracking-tighter leading-none font-oswald text-white whitespace-nowrap">
                    IRON &bull; DISCIPLINE &bull; POWER
                </span>
            </div>

            {/* Ambient decorative background glows for the page */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#00f2fe]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#ccff00]/4 rounded-full blur-[120px] pointer-events-none -z-10" />

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
                <div className="relative overflow-hidden lg:col-span-2 bg-gradient-to-b from-[#181818]/95 via-[#111111]/95 to-[#090909] border border-white/10 rounded-[40px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(204,255,0,0.06)] backdrop-blur-xl">
                    {/* Top ambient shimmer */}
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ccff00]/60 to-transparent pointer-events-none" />

                    {/* Atmospheric neon glowing spheres in background */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ccff00]/15 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#00f2fe]/10 rounded-full blur-[90px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none" />

                    {/* Cyber tech grid texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

                    {/* Card Header */}
                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ccff00]"></span>
                                    </span>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Weekly <span className="text-[#ccff00]">Activity</span></h3>
                                </div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Calorie consumption trends • Target 3,500 kcal</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="flex items-baseline justify-end gap-1.5">
                                        <span className="text-4xl font-black text-white tracking-tight">4.2k</span>
                                        <span className="text-xs font-bold text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-full">+18%</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">TOTAL KCAL THIS WEEK</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Metric Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/70">🔥 Avg: 600 kcal/day</span>
                            <span className="px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[10px] font-bold text-[#ccff00]">⚡ 14-Day Streak</span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/70">🎯 Saturday Peak (950 kcal)</span>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="relative z-10 w-full h-72 flex flex-col justify-between pt-6 pb-2">
                        {/* Reference Grid Lines */}
                        <div className="absolute inset-x-0 top-6 bottom-12 flex flex-col justify-between pointer-events-none">
                            <div className="border-b border-dashed border-white/10 flex justify-between items-center text-[9px] text-white/40 font-mono pb-1">
                                <span className="flex items-center gap-2">
                                    <span>1000 kcal</span>
                                    <span className="text-[#ccff00] uppercase font-bold text-[8px] tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]">Target Goal</span>
                                </span>
                            </div>
                            <div className="border-b border-dashed border-white/5 flex justify-between items-center text-[9px] text-white/25 font-mono pb-1">
                                <span>500 kcal</span>
                            </div>
                            <div className="border-b border-white/10 flex justify-between items-center text-[9px] text-white/20 font-mono pb-1">
                                <span>0 kcal</span>
                            </div>
                        </div>

                        {/* Bars Row */}
                        <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                            {weeklyStats.map((stat, i) => {
                                const isPeak = stat.day === 'Sat';
                                const heightPercent = Math.max(16, Math.round((stat.kcal / 1000) * 100));

                                return (
                                    <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer">
                                        {/* Kcal Value */}
                                        <div className="mb-2 text-center transition-all duration-200 group-hover:-translate-y-1">
                                            <span className={`text-[11px] sm:text-xs font-black font-mono tracking-tight transition-colors ${
                                                isPeak ? 'text-[#ccff00]' : 'text-white/70 group-hover:text-[#ccff00]'
                                            }`}>
                                                {stat.kcal}
                                            </span>
                                        </div>

                                        {/* Bar Pillar Track */}
                                        <div className="relative w-full max-w-[46px] h-48 bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex flex-col justify-end group-hover:border-[#ccff00]/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] overflow-hidden">
                                            {/* Filled Bar */}
                                            <motion.div
                                                initial={{ height: "0%" }}
                                                animate={{ height: `${heightPercent}%` }}
                                                style={{ height: `${heightPercent}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                                                className={`w-full rounded-xl transition-all relative overflow-hidden ${
                                                    isPeak
                                                        ? 'bg-gradient-to-t from-[#ccff00] via-[#d4ff33] to-[#eeff99] shadow-[0_0_30px_rgba(204,255,0,0.6)]'
                                                        : 'bg-gradient-to-t from-[#ccff00]/40 via-[#ccff00]/70 to-[#ccff00] group-hover:from-[#ccff00]/80 group-hover:to-[#eeff99]'
                                                }`}
                                            >
                                                {/* Top cap highlight */}
                                                <div className="absolute top-0 inset-x-0 h-1.5 bg-white/90 rounded-full shadow-[0_0_8px_white]" />
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/20" />
                                            </motion.div>
                                        </div>

                                        {/* Day Label */}
                                        <div className="mt-3 flex flex-col items-center gap-1">
                                            <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                                                isPeak ? 'text-[#ccff00]' : 'text-white/40 group-hover:text-white'
                                            }`}>
                                                {stat.day}
                                            </span>
                                            {isPeak && <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
                        <div key={i} className="relative overflow-hidden bg-gradient-to-b from-[#181818]/90 to-[#0e0e0e] p-7 rounded-[32px] border border-white/10 flex items-center gap-6 group hover:border-[#ccff00]/40 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 transition-transform group-hover:scale-110 shadow-inner" style={{ color: stat.color }}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black italic tracking-tighter">{stat.val}</p>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
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
