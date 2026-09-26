"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/Navbar";
import MusicPanel from "@/components/music/ClientMusicPanel";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    useEffect(() => {
        const handleRejection = (e: PromiseRejectionEvent) => {
            const reason = e.reason;
            const msg = typeof reason === 'string' ? reason : reason?.message || '';
            const stack = reason?.stack || '';
            if (
                msg.includes('chrome: call method') ||
                msg.includes('Window message') ||
                stack.includes('chrome-extension://')
            ) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };

        const handleError = (e: ErrorEvent) => {
            const msg = e.message || '';
            const filename = e.filename || '';
            const stack = e.error?.stack || '';
            if (
                filename.includes('chrome-extension://') ||
                msg.includes('chrome: call method') ||
                msg.includes('Window message') ||
                stack.includes('chrome-extension://')
            ) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };

        window.addEventListener('unhandledrejection', handleRejection, true);
        window.addEventListener('error', handleError, true);

        return () => {
            window.removeEventListener('unhandledrejection', handleRejection, true);
            window.removeEventListener('error', handleError, true);
        };
    }, []);

    return (
        <>
            {!isLogin && <Navbar />}
            <main className={!isLogin ? "min-h-screen pt-20" : "min-h-screen flex items-center justify-center bg-[#050505] p-6"}>
                {children}
            </main>
            {!isLogin && <MusicPanel />}
        </>
    );
}
