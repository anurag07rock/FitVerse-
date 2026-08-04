"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniPlayer } from './MiniPlayer';
import { ExpandedPlayer } from './ExpandedPlayer';
import { SpotifyService } from './SpotifyService';
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
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Initial connection check
                const data = await SpotifyService.getPlaylists();
                if (data.source === 'backup') {
                    setPlaylists(data.items);
                    setIsConnected(false);
                } else {
                    setPlaylists(data);
                    setIsConnected(true);

                    // 2. Check premium status
                    const profile = await SpotifyService.getUserProfile();
                    setIsPremium(profile.product === 'premium');

                    if (profile.product === 'premium') {
                        loadSpotifySDK();
                    }
                }
            } catch (err) {
                console.error('Spotify Init Failed:', err);
                setError('Music unavailable');
                try {
                    const fallback = await SpotifyService.getPlaylists('workout');
                    setPlaylists(fallback.items || []);
                } catch (e) { }
            }
        };
        init();

        return () => {
            if (playerRef.current) {
                playerRef.current.disconnect();
            }
        };
    }, []);

    const loadSpotifySDK = () => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'FitVerse AI Performance Player',
                getOAuthToken: async (cb: (token: string) => void) => {
                    const token = await SpotifyService.getAccessToken();
                    cb(token);
                },
                volume: 0.5
            });

            player.addListener('ready', ({ device_id }: { device_id: string }) => {
                console.log('Spotify Player Ready:', device_id);
                setDeviceId(device_id);
            });

            player.addListener('player_state_changed', (state: any) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setCurrentTrack({
                    id: state.track_window.current_track.id,
                    title: state.track_window.current_track.name,
                    artist: state.track_window.current_track.artists[0].name,
                    albumImage: state.track_window.current_track.album.images[0].url,
                    uri: state.track_window.current_track.uri
                });
            });

            player.addListener('initialization_error', ({ message }: { message: string }) => setError('Player init error'));
            player.addListener('authentication_error', ({ message }: { message: string }) => setError('Auth error'));
            player.addListener('account_error', ({ message }: { message: string }) => setError('Premium account required for full playback'));

            player.connect();
            playerRef.current = player;
        };
    };

    const handleTogglePlay = async () => {
        if (!currentTrack && !isPlaying) return;

        if (isPremium && playerRef.current) {
            playerRef.current.togglePlay();
        } else if (audioRef.current && currentTrack?.previewUrl) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSelectTrack = async (track: any) => {
        if (currentTrack?.id === track.id) {
            handleTogglePlay();
            return;
        }

        if (isPremium && deviceId) {
            try {
                const token = await SpotifyService.getAccessToken();
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [`spotify:track:${track.id}`] }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                setIsPlaying(true);
            } catch (err) {
                console.error('SDK Playback failed, trying preview:', err);
                fallbackToPreview(track);
            }
        } else {
            fallbackToPreview(track);
        }
    };

    const fallbackToPreview = (track: any) => {
        if (!track.previewUrl) {
            setError('Full playback requires Spotify Premium');
            return;
        }
        setCurrentTrack(track);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.src = track.previewUrl;
            audioRef.current.play();
        }
    };

    const handleSearch = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            const results = await SpotifyService.search(query);
            setSearchResults(results);
        } catch (err) {
            setError('Search failed');
        }
    };

    const handleNext = () => {
        if (isPremium && playerRef.current) {
            playerRef.current.nextTrack();
        } else if (searchResults.length > 0) {
            const currentIndex = searchResults.findIndex(t => t.id === currentTrack?.id);
            const nextTrack = searchResults[(currentIndex + 1) % searchResults.length];
            handleSelectTrack(nextTrack);
        }
    };

    return (
        <>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-[140px] right-6 z-[1002] bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest"
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
                    height: isExpanded ? 380 : 110,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-6 right-6 z-[1001] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] min-w-[320px] max-w-[500px]"
            >
                {isExpanded ? (
                    <ExpandedPlayer
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        onTogglePlay={handleTogglePlay}
                        onNext={handleNext}
                        onMinimize={() => setIsExpanded(false)}
                        onSearch={handleSearch}
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
