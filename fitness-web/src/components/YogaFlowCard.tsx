"use client";

import React, { useState } from 'react';
import { Wind, Moon, Sun, Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import VideoLauncher from './VideoLauncher';

export const YogaFlowCard = ({ flow }: { flow: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const thumbnail = flow.hero_thumbnail_url || flow.thumbnail;
    const duration = flow.total_duration_min || flow.duration;

    return (
        <Link href={`/workout/${flow.id}`}>
            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
            >
                <motion.img
                    src={thumbnail}
                    alt={flow.title}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    className="w-full h-full object-cover transition-transform duration-1000"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f12] via-transparent to-transparent opacity-90" />

                {/* Zen Elements */}
                <div className="absolute top-6 right-6">
                    <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                        <Wind className="text-[#70a1ff]" size={20} />
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2 text-[#70a1ff] text-[10px] font-bold uppercase tracking-widest">
                        <Moon size={12} /> {flow.difficulty} Flow
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">{flow.title}</h3>
                    <p className="text-white/60 text-xs mb-6 line-clamp-2">{flow.description}</p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <span className="text-xl font-black text-white">{duration} <span className="text-xs font-normal opacity-40">MIN</span></span>
                        </div>
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                            className="px-6 py-3 bg-white text-black font-black uppercase text-xs rounded-full flex items-center gap-2"
                        >
                            Enter Zen <Play size={14} fill="black" />
                        </motion.button>
                    </div>

                    <div className="mt-4">
                        <VideoLauncher exerciseName={flow.title} />
                    </div>
                </div>

                {/* Subtle Aura Effect */}
                <motion.div
                    animate={{ opacity: isHovered ? 0.3 : 0 }}
                    className="absolute inset-0 bg-blue-500/20 mix-blend-screen pointer-events-none"
                />
            </motion.div>
        </Link>
    );
};
