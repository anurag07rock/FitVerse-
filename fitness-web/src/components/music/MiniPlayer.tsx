import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, ChevronUp, Music2 } from 'lucide-react';
import { Track } from './SpotifyService';

interface MiniPlayerProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    progress: number; // 0-1
    onTogglePlay: () => void;
    onNext: () => void;
    onExpand: () => void;
    isConnected: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
    currentTrack,
    isPlaying,
    progress,
    onTogglePlay,
    onNext,
    onExpand,
    isConnected,
}) => {
    return (
        <div className="h-full flex flex-col">
            {/* Progress bar */}
            <div className="h-0.5 w-full bg-white/5 relative flex-shrink-0">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-[#ccff00] shadow-[0_0_8px_rgba(204,255,0,0.6)]"
                    style={{ width: `${Math.min(100, progress * 100)}%` }}
                />
            </div>

            <div className="flex-1 flex items-center justify-between px-6">
                {/* Album art + track info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                        {currentTrack?.albumImage ? (
                            <img
                                src={currentTrack.albumImage}
                                alt={currentTrack.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                <Music2 size={28} />
                            </div>
                        )}
                        {/* Spinning vinyl ring when playing */}
                        {isPlaying && currentTrack && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-[#ccff00]/30"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate uppercase tracking-tight">
                            {currentTrack?.title || (isConnected ? 'Nothing Playing' : 'Tap to load music')}
                        </h4>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest truncate">
                            {currentTrack?.artist || (isConnected ? 'Ready for beat sync' : 'Jamendo • Free Tracks')}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                        className="w-11 h-11 bg-[#ccff00] rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.25)]"
                    >
                        {isPlaying
                            ? <Pause size={18} fill="black" />
                            : <Play size={18} fill="black" className="ml-0.5" />
                        }
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="text-white/30 hover:text-white transition-colors"
                    >
                        <SkipForward size={18} />
                    </button>
                    <div className="w-px h-8 bg-white/10" />
                    <button
                        onClick={onExpand}
                        className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-[#ccff00] hover:bg-[#ccff00]/10 transition-all group"
                    >
                        <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
