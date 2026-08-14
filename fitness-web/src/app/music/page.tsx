"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music2, Disc, CheckCircle2,
    AlertCircle, Search, Play, Pause, SkipForward,
    SkipBack, Volume2, Info, Loader2, Zap, Flame, Wind, Sparkles, Activity
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { SpotifyService, Track } from '@/components/music/SpotifyService';

const CATEGORIES = [
    { name: 'Workout Energy', icon: Zap, color: '#ccff00', tag: 'workout energetic' },
    { name: 'Cardio Beats', icon: Flame, color: '#ff4757', tag: 'cardio energetic' },
    { name: 'Yoga Calm', icon: Wind, color: '#70a1ff', tag: 'yoga calm relaxing' },
    { name: 'Meditation', icon: Sparkles, color: '#a29bfe', tag: 'meditation ambient' },
];

async function fetchJamendoByTag(tag: string): Promise<Track[]> {
    const clientId = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID || '56d30cce';
    try {
        const url = new URL('https://api.jamendo.com/v3.0/tracks/');
        url.searchParams.set('client_id', clientId);

        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '12');
        url.searchParams.set('tags', tag);
        url.searchParams.set('audioformat', 'mp32');
        url.searchParams.set('order', 'popularity_week');
        const res = await fetch(url.toString());
        const data = await res.json();
        return (data.results || []).map((t: any): Track => ({
            id: String(t.id),
            title: t.name,
            artist: t.artist_name,
            albumImage: t.album_image || t.image || '',
            previewUrl: t.audio || null,
            externalUrl: t.shareurl,
            duration: t.duration * 1000,
            source: 'jamendo',
        }));
    } catch {
        return [];
    }
}

function MusicPageContent() {
    const searchParams = useSearchParams();
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.75);
    const [backupMessage, setBackupMessage] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(0);
    const [categoryLoading, setCategoryLoading] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Check status from Spotify OAuth callback
        const status = searchParams.get('status');
        if (status === 'connected') setIsConnected(true);

        loadCategory(0);
    }, []);

    const loadCategory = async (index: number) => {
        setActiveCategory(index);
        setCategoryLoading(true);
        setSearchResults([]); // Clear search when switching category
        try {
            if (index === 0) {
                // For the first category, try backend (may be Spotify)
                const response = await SpotifyService.getPlaylists();
                if (response.source === 'spotify') {
                    setIsConnected(true);
                    setTracks(response.items as Track[]);
                    setBackupMessage(null);
                } else {
                    // Jamendo fallback for category 0
                    const fetched = await fetchJamendoByTag(CATEGORIES[index].tag);
                    setTracks(fetched);
                    setBackupMessage('Streaming from Jamendo — free & legal workout tracks');
                }
            } else {
                // Always use Jamendo directly for specific categories
                const fetched = await fetchJamendoByTag(CATEGORIES[index].tag);
                setTracks(fetched);
                setBackupMessage('Streaming from Jamendo — free & legal workout tracks');
            }
        } catch {
            const fetched = await fetchJamendoByTag(CATEGORIES[index].tag);
            setTracks(fetched);
            setBackupMessage('Streaming from Jamendo — free & legal workout tracks');
        } finally {
            setLoading(false);
            setCategoryLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            await SpotifyService.connect();
        } catch {
            console.error('Connect failed');
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const results = await SpotifyService.search(searchQuery);
            setSearchResults(results);
        } catch {
            console.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    // ── Playback ─────────────────────────────────────────────────────────────

    const playTrack = useCallback((track: Track) => {
        if (!track.previewUrl) return;
        const audio = audioRef.current;
        if (!audio) return;
        audio.src = track.previewUrl;
        audio.volume = volume;
        audio.play().catch(console.error);
        setCurrentTrack(track);
        setIsPlaying(true);
        setProgress(0);
    }, [volume]);

    const handleSelectTrack = useCallback((track: Track) => {
        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play().catch(console.error);
                setIsPlaying(true);
            }
        } else {
            playTrack(track);
        }
    }, [currentTrack, isPlaying, playTrack]);

    const handleNext = useCallback(() => {
        const list = searchResults.length > 0 ? searchResults : tracks;
        if (!list.length) return;
        const idx = list.findIndex(t => t.id === currentTrack?.id);
        const next = list[(idx + 1) % list.length];
        playTrack(next);
    }, [searchResults, tracks, currentTrack, playTrack]);

    const handlePrev = useCallback(() => {
        const list = searchResults.length > 0 ? searchResults : tracks;
        if (!list.length) return;
        const idx = list.findIndex(t => t.id === currentTrack?.id);
        const prev = list[(idx - 1 + list.length) % list.length];
        playTrack(prev);
    }, [searchResults, tracks, currentTrack, playTrack]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const audio = audioRef.current;
        if (audio && audio.duration > 0) {
            audio.currentTime = ratio * audio.duration;
            setProgress(ratio);
        }
    };

    const displayList = searchResults.length > 0 ? searchResults : tracks;

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-40 px-6">
            <audio
                ref={audioRef}
                onEnded={handleNext}
                onTimeUpdate={() => {
                    const a = audioRef.current;
                    if (a && a.duration > 0) setProgress(a.currentTime / a.duration);
                }}
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#ccff00]/10 rounded-full border border-[#ccff00]/20 mb-6"
                        >
                            <div className="w-1.5 h-1.5 bg-[#ccff00] rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00]">Sonic Engine Active</span>
                        </motion.div>
                        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Sonic <span className="text-[#ccff00]">Sync.</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-medium">
                            Premium workout audio. Spotify-ready with Jamendo free-track fallback.
                        </p>
                    </div>

                    {!isConnected ? (
                        <div className="flex flex-col gap-3 items-end">
                            <button
                                onClick={handleConnect}
                                className="px-10 py-5 bg-[#1DB954] text-black font-black uppercase text-xs rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(29,185,84,0.3)]"
                            >
                                <Disc className="animate-spin-slow" /> Connect Spotify
                            </button>
                            {backupMessage && (
                                <p className="text-[9px] text-white/30 uppercase tracking-widest text-right max-w-[220px]">
                                    {backupMessage}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                            <CheckCircle2 className="text-[#1DB954]" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-white/40">Status</p>
                                <p className="text-xs font-bold text-white tracking-widest uppercase">Verified & Connected</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories */}
                <section className="mb-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => loadCategory(i)}
                                className={`p-7 rounded-[28px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all border ${
                                    activeCategory === i
                                        ? 'bg-white/10 border-white/20'
                                        : 'bg-white/5 border-white/5 hover:border-white/15'
                                }`}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5" style={{ color: cat.color }}>
                                    <cat.icon size={28} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest text-white/60">{cat.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Search */}
                <section className="mb-12">
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <input
                            type="text"
                            placeholder="SEARCH TRACKS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-8 pl-14 text-white text-sm font-bold tracking-widest focus:outline-none focus:border-[#ccff00]/50 transition-colors uppercase"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        {isSearching && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 text-[#ccff00] animate-spin" size={18} />}
                    </form>
                    {searchResults.length > 0 && (
                        <button
                            onClick={() => setSearchResults([])}
                            className="mt-3 text-[10px] text-white/30 uppercase font-black tracking-widest hover:text-white transition-colors"
                        >
                            ← Clear search
                        </button>
                    )}
                </section>

                {/* Track Grid */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Music2 className="text-[#ccff00]" size={22} />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                            {searchResults.length > 0 ? 'Search ' : CATEGORIES[activeCategory].name + ' '}<span className="text-[#ccff00]">Tracks</span>
                        </h2>
                        <span className="text-white/20 text-xs font-black uppercase tracking-widest">
                            {displayList.length} tracks
                        </span>
                    </div>

                    {loading || categoryLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : displayList.length === 0 ? (
                        <div className="text-center py-20">
                            <Music2 size={48} className="text-white/10 mx-auto mb-4" />
                            <p className="text-white/30 text-sm uppercase font-black tracking-widest">No tracks found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayList.map((track, i) => {
                                const isActive = currentTrack?.id === track.id;
                                const trackIsPlaying = isActive && isPlaying;
                                return (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={`p-4 rounded-2xl flex items-center gap-4 group transition-all border cursor-pointer ${
                                            isActive
                                                ? 'bg-[#ccff00]/10 border-[#ccff00]/20'
                                                : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/8'
                                        }`}
                                        onClick={() => handleSelectTrack(track)}
                                    >
                                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={track.albumImage} alt={track.title} className="w-full h-full object-cover" />
                                            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isActive || 'opacity-0 group-hover:opacity-100'}`}>
                                                {trackIsPlaying
                                                    ? <Activity size={18} className="text-[#ccff00]" />
                                                    : <Play size={18} fill="white" className="text-white ml-0.5" />
                                                }
                                            </div>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className={`font-bold text-sm truncate uppercase tracking-tight ${isActive ? 'text-[#ccff00]' : 'text-white'}`}>
                                                {track.title}
                                            </h4>
                                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest truncate">{track.artist}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {!track.previewUrl && (
                                                <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">No preview</span>
                                            )}
                                            <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/5 rounded-md text-white/30 tracking-tighter">
                                                {track.source}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            {/* Floating Player */}
            <AnimatePresence>
                {currentTrack && (
                    <motion.div
                        initial={{ y: 120, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 120, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-[#111]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[1000] overflow-hidden"
                    >
                        {/* Seekable progress at top */}
                        <div
                            className="h-1 bg-white/10 cursor-pointer group"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] transition-all duration-200"
                                style={{ width: `${Math.min(100, progress * 100)}%` }}
                            />
                        </div>

                        <div className="flex items-center gap-5 p-4">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src={currentTrack.albumImage} alt="" className="w-full h-full object-cover" />
                                {isPlaying && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <Activity size={14} className="text-[#ccff00]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h5 className="font-bold text-sm text-white truncate uppercase tracking-widest">{currentTrack.title}</h5>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest truncate">{currentTrack.artist}</p>
                            </div>
                            <div className="flex items-center gap-5 flex-shrink-0">
                                <button onClick={handlePrev} className="text-white/20 hover:text-white transition-colors">
                                    <SkipBack size={20} />
                                </button>
                                <button
                                    onClick={() => handleSelectTrack(currentTrack)}
                                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} className="ml-0.5" />}
                                </button>
                                <button onClick={handleNext} className="text-white/20 hover:text-white transition-colors">
                                    <SkipForward size={20} />
                                </button>
                                <div className="hidden md:flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
                                    <Volume2 size={16} className="text-white/30" />
                                    <input
                                        type="range"
                                        min={0} max={1} step={0.01}
                                        value={volume}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            setVolume(v);
                                            if (audioRef.current) audioRef.current.volume = v;
                                        }}
                                        className="w-20 h-1 accent-[#ccff00] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MusicPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="text-[#ccff00] animate-spin" size={48} />
            </div>
        }>
            <MusicPageContent />
        </React.Suspense>
    );
}
