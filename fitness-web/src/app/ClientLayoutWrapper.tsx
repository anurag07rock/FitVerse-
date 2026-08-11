"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/Navbar";
import MusicPanel from "@/components/music/ClientMusicPanel";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

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
