"use client";

import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface VideoLauncherProps {
    exerciseName: string;
    category?: string;
    label?: string;
    variant?: 'card' | 'detail' | 'schedule';
}

export default function VideoLauncher({ exerciseName, category, label, variant = 'card' }: VideoLauncherProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent event propagation and standard routing behavior
        e.stopPropagation();
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/youtube/search?exerciseName=${encodeURIComponent(exerciseName)}`);
            const data = await response.json();

            const videoList = data.videos || [];
            if (videoList.length === 0) {
                setError('No videos available');
                setLoading(false);
                return;
            }

            // Open the YouTube URL or fallback search redirect in a new tab
            window.open(videoList[0].youtubeUrl, '_blank');
        } catch (err) {
            setError('Unable to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const getButtonStyles = () => {
        if (variant === 'detail') {
            return "px-8 py-5 bg-[#ccff00] text-black font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(204,255,0,0.25)] min-h-[44px] w-full sm:w-auto";
        }
        if (variant === 'schedule') {
            return "w-full py-2 px-3 bg-white/5 border border-white/10 text-white/80 hover:text-[#ccff00] hover:border-[#ccff00]/40 font-bold uppercase text-[9px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[44px]";
        }
        // Default Card Button
        return "w-full py-2.5 px-4 bg-white/5 hover:bg-[#ccff00]/10 border border-white/10 hover:border-[#ccff00]/30 text-white/60 hover:text-[#ccff00] font-black uppercase text-[9px] tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px]";
    };

    return (
        <div className="flex flex-col gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className={getButtonStyles()}
            >
                {loading ? (
                    <>
                        <Loader2 size={12} className="animate-spin text-[#ccff00] flex-shrink-0" />
                        <span>Searching...</span>
                    </>
                ) : (
                    <>
                        <Play size={10} fill="currentColor" className="flex-shrink-0" />
                        <span>{label || 'Watch Tutorial'}</span>
                    </>
                )}
            </button>
            {error && (
                <p className="text-red-500/80 text-[8px] font-bold uppercase tracking-widest text-center mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
