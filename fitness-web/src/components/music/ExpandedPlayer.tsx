import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Disc, Heart, ListMusic,
    ChevronDown, Volume2, Mic2, Activity,
    Play, Pause, SkipForward
} from 'lucide-react';

interface ExpandedPlayerProps {
    currentTrack: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onMinimize: () => void;
    onSearch: (q: string) => void;
    searchResults: any[];
    playlists: any[];
    isConnected: boolean;
    onConnect: () => void;
    onSelectTrack: (track: any) => void;
}

export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
    currentTrack,
    isPlaying,
    onTogglePlay,
    onNext,
    onMinimize,
    onSearch,
    searchResults,
    playlists,
    isConnected,
    onConnect,
    onSelectTrack
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a]">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Performance Studio</span>
                </div>
                <button
                    onClick={onMinimize}
                    className="p-2 text-white/20 hover:text-white transition-colors"
                >
                    <ChevronDown size={20} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {!isConnected ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-[#ccff00]/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Disc size={40} className="text-white/20 animate-spin-slow" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic mb-2 font-black">Sync Spotify</h3>
                        <p className="text-white/40 text-xs mb-8 max-w-[240px]">Handshake required to stream your performance archives.</p>
                        <button
                            onClick={onConnect}
                            className="px-8 py-4 bg-[#1DB954] text-black font-black uppercase text-[10px] rounded-2xl shadow-[0_0_30px_rgba(29,185,84,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Authorize HANDSHAKE
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {/* Search Bar */}
                        <div className="p-4">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search performance tracks..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-10 text-xs font-bold text-white focus:outline-none focus:border-[#ccff00]/50 transition-colors uppercase tracking-widest"
                                />
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => { setQuery(''); onSearch(''); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Results / Discovery */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 custom-scrollbar">
                            {searchResults.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2 px-2">Search Results</p>
                                    {searchResults.map((track) => (
                                        <button
                                            key={track.id}
                                            onClick={() => onSelectTrack(track)}
                                            className="w-full p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3 group hover:border-[#ccff00]/30 transition-all text-left"
                                        >
                                            <img src={track.albumImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-[11px] font-bold text-white truncate uppercase">{track.title}</h5>
                                                <p className="text-[9px] text-white/40 font-black truncate uppercase">{track.artist}</p>
                                            </div>
                                            <Activity size={14} className="text-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2 px-2">Featured Playlists</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {playlists.map((pl) => (
                                            <div
                                                key={pl.id}
                                                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#ccff00]/40 transition-all"
                                            >
                                                <img src={pl.images?.[0]?.url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="" />
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                    <h6 className="text-[10px] font-black text-white uppercase truncate tracking-tight">{pl.name}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Now Playing Bar in Expanded */}
            <div className="p-6 bg-white/5 border-t border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <img src={currentTrack?.albumImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=100&q=80'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate uppercase">{currentTrack?.title || 'System Standby'}</h4>
                        <p className="text-[10px] text-[#ccff00] font-black uppercase tracking-widest truncate">{currentTrack?.artist || 'FitVerse AI'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onTogglePlay}
                            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                        </button>
                        <button
                            onClick={onNext}
                            className="text-white/20 hover:text-white"
                        >
                            <SkipForward size={20} />
                        </button>
                    </div>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isPlaying ? '100%' : '35%' }}
                        transition={{ duration: isPlaying ? 30 : 0.5 }}
                        className="h-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]"
                    />
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(204, 255, 0, 0.2);
                }
            `}</style>
        </div>
    );
};
