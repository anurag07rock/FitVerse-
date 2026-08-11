"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniPlayer } from './MiniPlayer';
import { ExpandedPlayer } from './ExpandedPlayer';
import { SpotifyService, Track } from './SpotifyService';
import { AlertCircle } from 'lucide-react';

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

export default function MusicPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [queue, setQueue] = useState<Track[]>([]);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.7);
    const [progress, setProgress] = useState(0); // 0-1

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerRef = useRef<any>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // ── Progress tracking for the HTML audio element ──────────────────────────
    const startProgressTracking = useCallback(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
            const audio = audioRef.current;
            if (audio && audio.duration > 0) {
                setProgress(audio.currentTime / audio.duration);
            }
        }, 500);
    }, []);

    const stopProgressTracking = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            // Always load Jamendo tracks immediately as the reliable default
            try {
                const data = await SpotifyService.getPlaylists();
                if (data.source === 'spotify') {
                    setPlaylists(data.items as any[]);
                    setIsConnected(true);
                    try {
                        const profile = await SpotifyService.getUserProfile();
                        setIsPremium(profile.product === 'premium');
                        if (profile.product === 'premium') loadSpotifySDK();
                    } catch {
                        // Profile fetch failed — non-premium flow
                    }
                } else {
                    // Jamendo fallback — set queue directly from items
                    const tracks = data.items;
                    setQueue(tracks);
                    if (tracks.length > 0) setCurrentTrack(tracks[0]);
                    setIsConnected(true);
                    setError(null);
                }
            } catch {
                // Last resort: show a non-blocking message, don't crash
                setError('Music service unavailable. Try again later.');
                setIsConnected(false);
            }
        };
        init();

        return () => {
            if (playerRef.current) playerRef.current.disconnect();
            stopProgressTracking();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stopProgressTracking]);

    // ── Spotify Premium SDK ───────────────────────────────────────────────────
    const loadSpotifySDK = () => {
        if (document.querySelector('script[src*="spotify-player"]')) return;
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'FitVerse AI Performance Player',
                getOAuthToken: async (cb: (token: string) => void) => {
                    try {
                        const token = await SpotifyService.getAccessToken();
                        cb(token);
                    } catch {
                        setError('Spotify auth failed');
                    }
                },
                volume,
            });

            player.addListener('ready', ({ device_id }: { device_id: string }) => {
                setDeviceId(device_id);
            });

            player.addListener('player_state_changed', (state: any) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setProgress(state.position / state.duration);
                const t = state.track_window.current_track;
                setCurrentTrack({
                    id: t.id,
                    title: t.name,
                    artist: t.artists[0].name,
                    albumImage: t.album.images[0]?.url || '',
                    previewUrl: null,
                    source: 'spotify',
                });
            });

            player.addListener('initialization_error', () => setError('Player init error'));
            player.addListener('authentication_error', () => setError('Auth error'));
            player.addListener('account_error', () => setError('Premium account required'));

            player.connect();
            playerRef.current = player;
        };
    };

    // ── HTML Audio helpers ────────────────────────────────────────────────────
    const playAudio = useCallback((url: string) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.src = url;
        audio.volume = volume;
        audio.play().catch(() => setError('Could not play audio'));
        setIsPlaying(true);
        setProgress(0);
        startProgressTracking();
    }, [volume, startProgressTracking]);

    const pauseAudio = useCallback(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        stopProgressTracking();
    }, [stopProgressTracking]);

    // ── Track selection ───────────────────────────────────────────────────────
    const handleSelectTrack = useCallback(async (track: Track) => {
        if (!track) return;

        // Same track → toggle
        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                if (isPremium && playerRef.current) {
                    playerRef.current.togglePlay();
                } else {
                    pauseAudio();
                }
            } else {
                if (isPremium && playerRef.current) {
                    playerRef.current.togglePlay();
                } else if (track.previewUrl) {
                    audioRef.current?.play().catch(() => setError('Could not resume'));
                    setIsPlaying(true);
                    startProgressTracking();
                }
            }
            return;
        }

        // New track
        setCurrentTrack(track);
        setError(null);

        if (isPremium && deviceId) {
            try {
                const token = await SpotifyService.getAccessToken();
                const response = await fetch(
                    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify({ uris: [`spotify:track:${track.id}`] }),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) throw new Error('SDK play failed');
                setIsPlaying(true);
                return;
            } catch {
                // Fall through to preview
            }
        }

        // Preview / Jamendo playback
        if (track.previewUrl) {
            playAudio(track.previewUrl);
        } else {
            setError('No preview available for this track');
            setIsPlaying(false);
        }
    }, [currentTrack, isPlaying, isPremium, deviceId, playAudio, pauseAudio, startProgressTracking]);

    // ── Toggle play/pause ─────────────────────────────────────────────────────
    const handleTogglePlay = useCallback(() => {
        if (!currentTrack) return;
        if (isPlaying) {
            if (isPremium && playerRef.current) {
                playerRef.current.togglePlay();
            } else {
                pauseAudio();
            }
        } else {
            if (isPremium && playerRef.current) {
                playerRef.current.togglePlay();
            } else if (currentTrack.previewUrl) {
                const audio = audioRef.current;
                if (audio && audio.src) {
                    audio.play().catch(() => setError('Could not resume'));
                    setIsPlaying(true);
                    startProgressTracking();
                } else {
                    playAudio(currentTrack.previewUrl);
                }
            } else {
                setError('No preview available');
            }
        }
    }, [currentTrack, isPlaying, isPremium, playAudio, pauseAudio, startProgressTracking]);

    // ── Next track ────────────────────────────────────────────────────────────
    const handleNext = useCallback(() => {
        if (isPremium && playerRef.current) {
            playerRef.current.nextTrack();
            return;
        }
        const trackList = searchResults.length > 0 ? searchResults : queue;
        if (trackList.length === 0) return;
        const currentIndex = trackList.findIndex(t => t.id === currentTrack?.id);
        const nextTrack = trackList[(currentIndex + 1) % trackList.length];
        handleSelectTrack(nextTrack);
    }, [isPremium, searchResults, queue, currentTrack, handleSelectTrack]);

    const handlePrev = useCallback(() => {
        if (isPremium && playerRef.current) {
            playerRef.current.previousTrack();
            return;
        }
        const trackList = searchResults.length > 0 ? searchResults : queue;
        if (trackList.length === 0) return;
        const currentIndex = trackList.findIndex(t => t.id === currentTrack?.id);
        const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
        handleSelectTrack(trackList[prevIndex]);
    }, [isPremium, searchResults, queue, currentTrack, handleSelectTrack]);

    // ── Search ────────────────────────────────────────────────────────────────
    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const results = await SpotifyService.search(query);
            setSearchResults(results);
        } catch {
            setError('Search failed');
        }
    }, []);

    // ── Volume ────────────────────────────────────────────────────────────────
    const handleVolumeChange = useCallback((vol: number) => {
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
        if (playerRef.current) playerRef.current.setVolume(vol);
    }, []);

    // ── Seek ──────────────────────────────────────────────────────────────────
    const handleSeek = useCallback((ratio: number) => {
        const audio = audioRef.current;
        if (audio && audio.duration > 0) {
            audio.currentTime = ratio * audio.duration;
            setProgress(ratio);
        }
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                onEnded={() => {
                    setIsPlaying(false);
                    stopProgressTracking();
                    setProgress(0);
                    // Auto-play next
                    handleNext();
                }}
                onTimeUpdate={() => {
                    const audio = audioRef.current;
                    if (audio && audio.duration > 0) {
                        setProgress(audio.currentTime / audio.duration);
                    }
                }}
            />

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-[140px] right-6 z-[1002] bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest"
                    >
                        <AlertCircle size={14} />
                        {error}
                        <button onClick={() => setError(null)} className="ml-2 opacity-50 hover:opacity-100">×</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    width: isExpanded ? '45%' : '40%',
                    height: isExpanded ? 400 : 110,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-6 right-6 z-[1001] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] min-w-[320px] max-w-[520px]"
            >
                {isExpanded ? (
                    <ExpandedPlayer
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        progress={progress}
                        volume={volume}
                        onTogglePlay={handleTogglePlay}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onMinimize={() => setIsExpanded(false)}
                        onSearch={handleSearch}
                        onSeek={handleSeek}
                        onVolumeChange={handleVolumeChange}
                        searchResults={searchResults}
                        playlists={playlists}
                        isConnected={isConnected}
                        onConnect={SpotifyService.connect}
                        onSelectTrack={handleSelectTrack}
                    />
                ) : (
                    <MiniPlayer
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        progress={progress}
                        onTogglePlay={handleTogglePlay}
                        onNext={handleNext}
                        onExpand={() => setIsExpanded(true)}
                        isConnected={isConnected}
                    />
                )}
            </motion.div>
        </>
    );
}
