"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Zap,
    Clock,
    Trophy,
    Calendar,
    CheckCircle2,
    Activity,
    Target
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function ProgressPage() {
    const weeklyData = [
        { day: 'Mon', completed: 2, kcal: 400 },
        { day: 'Tue', completed: 3, kcal: 650 },
        { day: 'Wed', completed: 1, kcal: 300 },
        { day: 'Thu', completed: 4, kcal: 820 },
        { day: 'Fri', completed: 2, kcal: 450 },
        { day: 'Sat', completed: 5, kcal: 950 },
        { day: 'Sun', completed: 1, kcal: 200 }
    ];

    const stats = [
        { label: 'Workouts Completed', val: '18', sub: '+3 from last week', icon: CheckCircle2, color: '#ccff00' },
        { label: 'Calories Burned', val: '12,450', sub: 'Elite performance', icon: Zap, color: '#ff4757' },
        { label: 'Avg. Completion Rate', val: '94%', sub: 'Target: 95%', icon: Target, color: '#70a1ff' },
        { label: 'Current Streak', val: '14 Days', sub: 'Personal best!', icon: TrendingUp, color: '#ffa502' },
    ];

    const maxKcal = Math.max(...weeklyData.map(d => d.kcal));

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6">
            <Navbar />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-2xl mb-6 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
                        >
                            <Activity size={14} className="text-[#ccff00]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00]">Athletic Analytics</span>
                        </motion.div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Performance <span className="text-[#ccff00]">Data.</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-medium">
                            Visualizing your beginner-to-pro journey with high-fidelity tracking.
                        </p>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#111] p-8 rounded-[32px] border border-white/5 group hover:border-white/20 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 mb-6 transition-transform group-hover:scale-110" style={{ color: stat.color }}>
                                <stat.icon size={28} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{stat.label}</p>
                            <h3 className="text-2xl sm:text-4xl font-black mb-2 tracking-tighter">{stat.val}</h3>
                            <p className="text-[10px] font-bold text-[#ccff00] uppercase tracking-tighter">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Calories Burned Chart */}
                    <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 sm:p-10 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Weekly <span className="text-[#ccff00]">Energy Burn</span></h3>
                                </div>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Calorie tracking analytics</p>
                            </div>
                            <Calendar size={24} className="text-white/20" />
                        </div>

                        {/* Chart Container */}
                        <div className="relative w-full h-72 flex flex-col justify-between pt-6 pb-2">
                            {/* Reference Grid Lines */}
                            <div className="absolute inset-x-0 top-6 bottom-12 flex flex-col justify-between pointer-events-none">
                                <div className="border-b border-dashed border-white/10 flex justify-between items-center text-[9px] text-white/40 font-mono pb-1">
                                    <span className="flex items-center gap-2">
                                        <span>1000 kcal</span>
                                        <span className="text-[#ccff00] uppercase font-bold text-[8px] tracking-wider px-2 py-0.5 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]">Target Goal</span>
                                    </span>
                                </div>
                                <div className="border-b border-dashed border-white/5 flex justify-between items-center text-[9px] text-white/20 font-mono pb-1">
                                    <span>500 kcal</span>
                                </div>
                                <div className="border-b border-white/10 flex justify-between items-center text-[9px] text-white/20 font-mono pb-1">
                                    <span>0 kcal</span>
                                </div>
                            </div>

                            {/* Bars Row */}
                            <div className="relative z-10 w-full h-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                                {weeklyData.map((d, i) => {
                                    const isPeak = d.day === 'Sat';
                                    const heightPercent = Math.max(15, Math.round((d.kcal / 1000) * 100));

                                    return (
                                        <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer">
                                            {/* Kcal Value */}
                                            <div className="mb-2 text-center transition-all duration-200 group-hover:-translate-y-1">
                                                <span className={`text-[11px] sm:text-xs font-black font-mono tracking-tight ${
                                                    isPeak ? 'text-[#ccff00]' : 'text-white/60 group-hover:text-[#ccff00]'
                                                }`}>
                                                    {d.kcal}
                                                </span>
                                            </div>

                                            {/* Bar Pillar */}
                                            <div className="relative w-full max-w-[44px] h-48 bg-white/[0.04] border border-white/10 rounded-2xl p-1 flex flex-col justify-end group-hover:border-[#ccff00]/40 transition-all shadow-inner">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPercent}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                                                    className={`w-full rounded-xl transition-all relative overflow-hidden ${
                                                        isPeak
                                                            ? 'bg-gradient-to-t from-[#ccff00] via-[#d4ff33] to-[#eeff99] shadow-[0_0_25px_rgba(204,255,0,0.5)]'
                                                            : 'bg-gradient-to-t from-[#ccff00]/40 via-[#ccff00]/65 to-[#ccff00]/90 group-hover:from-[#ccff00] group-hover:to-[#eeff99]'
                                                    }`}
                                                >
                                                    {/* Top cap highlight */}
                                                    <div className="absolute top-0 inset-x-0 h-1 bg-white/70 rounded-full" />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                                </motion.div>
                                            </div>

                                            {/* Day Label */}
                                            <div className="mt-3 flex flex-col items-center gap-1">
                                                <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${
                                                    isPeak ? 'text-[#ccff00]' : 'text-white/40 group-hover:text-white'
                                                }`}>
                                                    {d.day}
                                                </span>
                                                {isPeak && <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Completion Rate Circle Chart (Custom SVG) */}
                    <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 flex flex-col overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Training <span className="text-[#ccff00]">Consistency</span></h3>
                            <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-12">Exercise completion efficiency</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center py-10 relative">
                            <svg className="w-full max-w-[240px] h-auto aspect-square transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="100"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <motion.circle
                                    cx="128"
                                    cy="128"
                                    r="100"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                    strokeDasharray="628"
                                    initial={{ strokeDashoffset: 628 }}
                                    animate={{ strokeDashoffset: 628 * (1 - 0.94) }}
                                    fill="transparent"
                                    strokeLinecap="round"
                                    className="text-[#ccff00]"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-6xl font-black tracking-tighter italic">94%</span>
                                <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Precision</span>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-[100px]" />
                    </div>
                </div>
            </div>

        </div>
    );
}
