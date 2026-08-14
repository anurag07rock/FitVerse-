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
                    <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Weekly <span className="text-[#ccff00]">Energy Burn</span></h3>
                                <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Calorie tracking analytics</p>
                            </div>
                            <Calendar size={24} className="text-white/20" />
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-6 h-64">
                            {weeklyData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer">
                                    <div className="relative w-full flex-1 flex flex-col justify-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(d.kcal / maxKcal) * 100}%` }}
                                            className="w-full bg-white/5 group-hover:bg-[#ccff00] rounded-2xl transition-all relative overflow-hidden"
                                        >
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                                            {/* Glow effect on hover */}
                                            <div className="absolute inset-0 bg-[#ccff00]/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#ccff00]">
                                            {d.kcal}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${d.day === 'Sat' ? 'text-[#ccff00]' : 'text-white/20'}`}>
                                        {d.day}
                                    </span>
                                </div>
                            ))}
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
