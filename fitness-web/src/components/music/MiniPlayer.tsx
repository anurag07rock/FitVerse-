import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, ChevronUp, Music2 } from 'lucide-react';

interface MiniPlayerProps {
    currentTrack: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onExpand: () => void;
    isConnected: boolean;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
    currentTrack,
    isPlaying,
    onTogglePlay,
    onNext,
    onExpand,
    isConnected
}) => {
    return (
        <div className="h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                    {currentTrack?.albumImage ? (
                        <img src={currentTrack.albumImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                            <Music2 size={32} />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate uppercase tracking-tight">
                        {currentTrack?.title || (isConnected ? 'Nothing Playing' : 'Spotify Disconnected')}
                    </h4>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest truncate">
                        {currentTrack?.artist || 'Ready for beat sync'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                        className="w-12 h-12 bg-[#ccff00] rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                    >
                        {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="text-white/20 hover:text-white transition-colors"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>
                <div className="w-px h-10 bg-white/10 mx-2" />
                <button
                    onClick={onExpand}
                    className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-[#ccff00] hover:bg-[#ccff00]/10 transition-all group"
                >
                    <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
