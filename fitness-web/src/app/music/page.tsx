"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music2, Radio, Disc, Mic2, Star, CheckCircle2,
    AlertCircle, Search, Play, Pause, SkipForward,
    SkipBack, Volume2, Info, Loader2, Zap, Flame, Wind, Sparkles
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';

function MusicPageContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [backupMessage, setBackupMessage] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const response = await api.get('/music/playlists');
            if (response.data.source === 'backup') {
                setPlaylists(response.data.items);
                setBackupMessage(response.data.message);
            } else {
                setPlaylists(response.data);
                setIsConnected(true);
            }
        } catch (error) {
            setIsConnected(false);
            // If completely failed, try to get fallback playlists anyway
            try {
                const response = await api.get('/music/playlists?fallback=true');
                setPlaylists(response.data.items || []);
                setBackupMessage('Using backup music engine');
            } catch (e) { }
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            const response = await api.get('/music/connect');
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Failed to get auth URL', error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await api.get(`/music/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(response.data);
            if (response.data.some((t: any) => t.source === 'backup')) {
                setBackupMessage('Search using backup source');
            }
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const togglePlayPreview = (track: any) => {
        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                audioRef.current?.pause();
                setIsPlaying(false);
            } else {
                audioRef.current?.play();
                setIsPlaying(true);
            }
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
            if (audioRef.current) {
                audioRef.current.src = track.previewUrl;
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-40 px-6">
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

            <div className="max-w-7xl mx-auto">
                {/* 1. Header Section */}
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
                            Premium workout audio synchronization. Spotify-ready with intelligent fallback architecture.
                        </p>
                    </div>

                    {!isConnected && !backupMessage ? (
                        <button
                            onClick={handleConnect}
                            className="px-10 py-5 bg-[#1DB954] text-black font-black uppercase text-xs rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(29,185,84,0.3)]"
                        >
                            <Disc className="animate-spin-slow" /> Connect Spotify Account
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                            {isConnected ? <CheckCircle2 className="text-[#1DB954]" /> : <Info className="text-[#ccff00]" />}
                            <div>
                                <p className="text-[10px] font-black uppercase text-white/40">Status</p>
                                <p className="text-xs font-bold text-white tracking-widest uppercase">
                                    {isConnected ? 'Verified & Connected' : 'Backup Mode Active'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Backup Message Alert */}
                <AnimatePresence>
                    {backupMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 p-4 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-2xl flex items-center gap-3 text-[#ccff00] text-xs font-bold uppercase tracking-widest"
                        >
                            <AlertCircle size={16} />
                            {backupMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. Music Categories */}
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <Star className="text-[#ccff00]" size={24} />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Sonic <span className="text-[#ccff00]">Environments</span></h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Workout Energy', icon: Zap, color: '#ccff00' },
                            { name: 'Cardio Beats', icon: Flame, color: '#ff4757' },
                            { name: 'Yoga Calm Music', icon: Wind, color: '#70a1ff' },
                            { name: 'Meditation & Zen', icon: Sparkles, color: '#a29bfe' }
                        ].map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                className="p-8 bg-white/5 border border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-white/20 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 group-hover:bg-white/10" style={{ color: cat.color }}>
                                    <cat.icon size={32} />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{cat.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. Search Section */}
                <section className="mb-20">
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <input
                            type="text"
                            placeholder="SEARCH TRACKS FOR YOUR BEAT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 pl-16 text-white text-sm font-bold tracking-widest focus:outline-none focus:border-[#ccff00]/50 transition-colors uppercase"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        {isSearching && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 text-[#ccff00] animate-spin" size={20} />}
                    </form>

                    {searchResults.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((track) => (
                                <div
                                    key={track.id}
                                    className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-[#ccff00]/30 transition-all"
                                >
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={track.albumImage} alt={track.title} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => togglePlayPreview(track)}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {isPlaying && currentTrack?.id === track.id ? <Pause fill="white" /> : <Play fill="white" />}
                                        </button>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</h4>
                                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest truncate">{track.artist}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/5 rounded-md text-white/30 tracking-tighter">
                                            {track.source}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 3. Playlist Grid */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <Music2 className="text-[#ccff00]" size={24} />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Performance <span className="text-[#ccff00]">Playlists</span></h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square bg-white/5 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {playlists.map((pl, i) => (
                                <motion.div
                                    key={pl.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative cursor-pointer"
                                >
                                    <div className="aspect-square rounded-3xl overflow-hidden mb-4 border border-white/5 group-hover:border-[#ccff00]/40 transition-all duration-500">
                                        <img src={pl.images?.[0]?.url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=60"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 bg-[#ccff00] rounded-full flex items-center justify-center text-black shadow-2xl">
                                                <Play fill="black" size={20} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm truncate uppercase">{pl.name}</h4>
                                    <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-1">
                                        {pl.tracks?.total || 12} Tracks • {pl.source || 'Spotify'}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Floating Player Controls */}
            {currentTrack && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000]"
                >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={currentTrack.albumImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <h5 className="font-bold text-sm text-white truncate uppercase tracking-widest">{currentTrack.title}</h5>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest truncate">{currentTrack.artist}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-white/20 hover:text-white transition-colors"><SkipBack size={20} /></button>
                        <button
                            onClick={() => togglePlayPreview(currentTrack)}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} className="ml-0.5" />}
                        </button>
                        <button className="text-white/20 hover:text-white transition-colors"><SkipForward size={20} /></button>
                        <div className="hidden md:flex items-center gap-3 ml-4 border-l border-white/10 pl-6">
                            <Volume2 size={18} className="text-white/40" />
                            <div className="w-24 h-1 bg-white/10 rounded-full relative">
                                <div className="absolute inset-0 bg-[#ccff00] rounded-full w-2/3 shadow-[0_0_10px_#ccff00]" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
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
