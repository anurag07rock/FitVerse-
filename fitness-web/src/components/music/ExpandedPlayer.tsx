import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Disc, Activity,
    ChevronDown, Volume2,
    Play, Pause, SkipForward, SkipBack
} from 'lucide-react';
import { Track } from './SpotifyService';

interface ExpandedPlayerProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    progress: number; // 0-1
    volume: number;   // 0-1
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
    onMinimize: () => void;
    onSearch: (q: string) => void;
    onSeek: (ratio: number) => void;
    onVolumeChange: (vol: number) => void;
    searchResults: Track[];
    playlists: Track[]; // unified track list (Jamendo or Spotify tracks)
    isConnected: boolean;
    onConnect: () => void;
    onSelectTrack: (track: Track) => void;
}

export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
    currentTrack,
    isPlaying,
    progress,
    volume,
    onTogglePlay,
    onNext,
    onPrev,
    onMinimize,
    onSearch,
    onSeek,
    onVolumeChange,
    searchResults,
    playlists,
    isConnected,
    onConnect,
    onSelectTrack,
}) => {
    const [query, setQuery] = useState('');
    const progressRef = useRef<HTMLDivElement>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onSeek(ratio);
    };

    // Determine if a playlist item is directly playable (Jamendo track shape)
    const isPlayableItem = (item: any): item is Track =>
        item && typeof item.previewUrl !== 'undefined';

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a]">
            {/* Header */}
            <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">
                        Performance Studio
                    </span>
                    {!isConnected && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-2">
                            • Jamendo Mode
                        </span>
                    )}
                </div>
                <button
                    onClick={onMinimize}
                    className="p-1.5 text-white/20 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                    <ChevronDown size={18} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {!isConnected && playlists.length === 0 ? (
                    // Spotify connect CTA
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Disc size={32} className="text-white/20 animate-spin-slow" />
                        </div>
                        <h3 className="text-lg font-black uppercase italic mb-1">Sync Spotify</h3>
                        <p className="text-white/40 text-xs mb-6 max-w-[220px]">
                            Connect for full library access, or search tracks below.
                        </p>
                        <button
                            onClick={onConnect}
                            className="px-6 py-3 bg-[#1DB954] text-black font-black uppercase text-[10px] rounded-2xl shadow-[0_0_20px_rgba(29,185,84,0.25)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Authorize Handshake
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Search */}
                        <div className="px-4 pt-3 pb-2 flex-shrink-0">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search tracks..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-9 text-xs font-bold text-white focus:outline-none focus:border-[#ccff00]/40 transition-colors uppercase tracking-widest"
                                />
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => { setQuery(''); onSearch(''); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Track List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-1 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(204,255,0,0.15) transparent' }}>
                            {searchResults.length > 0 ? (
                                <>
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2 px-1">Search Results ({searchResults.length})</p>
                                    {searchResults.map((track) => (
                                        <TrackRow
                                            key={track.id}
                                            track={track}
                                            isActive={currentTrack?.id === track.id}
                                            isPlaying={isPlaying && currentTrack?.id === track.id}
                                            onClick={() => onSelectTrack(track)}
                                        />
                                    ))}
                                </>
                            ) : playlists.length > 0 ? (
                                <>
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2 px-1">
                                        Workout Tracks ({playlists.length})
                                    </p>
                                    {playlists.map((track) => (
                                        <TrackRow
                                            key={track.id}
                                            track={track}
                                            isActive={currentTrack?.id === track.id}
                                            isPlaying={isPlaying && currentTrack?.id === track.id}
                                            onClick={() => onSelectTrack(track)}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Loading tracks...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Now Playing Controls */}
            <div className="flex-shrink-0 px-5 pt-3 pb-4 bg-white/[0.03] border-t border-white/5">
                {/* Track Info */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                        {currentTrack?.albumImage && (
                            <img src={currentTrack.albumImage} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate uppercase tracking-tight">
                            {currentTrack?.title || 'System Standby'}
                        </h4>
                        <p className="text-[9px] text-[#ccff00] font-black uppercase tracking-widest truncate">
                            {currentTrack?.artist || 'FitVerse AI'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onPrev} className="text-white/20 hover:text-white transition-colors">
                            <SkipBack size={16} />
                        </button>
                        <button
                            onClick={onTogglePlay}
                            className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying
                                ? <Pause size={15} fill="black" />
                                : <Play size={15} fill="black" className="ml-0.5" />
                            }
                        </button>
                        <button onClick={onNext} className="text-white/20 hover:text-white transition-colors">
                            <SkipForward size={16} />
                        </button>
                    </div>
                </div>

                {/* Seekable Progress */}
                <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer mb-3 group"
                >
                    <div
                        className="h-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] transition-all duration-200 relative"
                        style={{ width: `${Math.min(100, progress * 100)}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                    <Volume2 size={12} className="text-white/20 flex-shrink-0" />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-1 accent-[#ccff00] cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

// ── Reusable track row ──────────────────────────────────────────────────────
const TrackRow: React.FC<{
    track: Track;
    isActive: boolean;
    isPlaying: boolean;
    onClick: () => void;
}> = ({ track, isActive, isPlaying, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full p-2 rounded-xl flex items-center gap-3 group text-left transition-all ${
            isActive
                ? 'bg-[#ccff00]/10 border border-[#ccff00]/20'
                : 'hover:bg-white/5 border border-transparent'
        }`}
    >
        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
            <img src={track.albumImage} alt="" className="w-full h-full object-cover" />
            {isActive && isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Activity size={12} className="text-[#ccff00]" />
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-bold truncate uppercase ${isActive ? 'text-[#ccff00]' : 'text-white'}`}>
                {track.title}
            </p>
            <p className="text-[9px] text-white/40 font-black truncate uppercase">{track.artist}</p>
        </div>
        {!track.previewUrl && (
            <span className="text-[7px] text-white/20 uppercase tracking-widest">No preview</span>
        )}
    </button>
);
