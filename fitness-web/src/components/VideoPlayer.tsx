"use client";

import React from 'react';
import { Play, Maximize2, Volume2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
    videoId: string;
    title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => {
    return (
        <div className="relative group aspect-video bg-black/40 rounded-[32px] overflow-hidden border border-white/10 shadow-3xl">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-8 z-10 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Streaming 4K</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-white/40 hover:text-white transition-colors"><Maximize2 size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Embed Player */}
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-[#ccff00] hover:text-black transition-all">
                            <Play size={20} fill="currentColor" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">Analyzing Form...</span>
                            <span className="text-xs font-bold text-white uppercase">{title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                            <ShieldCheck size={14} className="text-[#ccff00]" />
                            <span className="text-[10px] font-black uppercase text-white/60">Verified Form</span>
                        </div>
                        <Volume2 size={20} className="text-white/40 hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        className="h-full bg-[#ccff00] shadow-[0_0_15px_#ccff00]"
                    />
                </div>
            </div>
        </div>
    );
};
