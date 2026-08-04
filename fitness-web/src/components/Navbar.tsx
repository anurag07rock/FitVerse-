"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, Dumbbell, LayoutDashboard, Music2, Users, Wind, Zap, Search } from 'lucide-react';
import { SearchPortal } from './SearchPortal';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const Navbar = () => {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Studio', href: '/studio', icon: Dumbbell },
        { name: 'Yoga', href: '/yoga', icon: Wind },
        { name: 'Zumba', href: '/zumba', icon: Zap },
        { name: 'Progress', href: '/progress', icon: BarChart3 },
        { name: 'Community', href: '/community', icon: Users },
        { name: 'Music', href: '/music', icon: Music2 },
    ];


    return (
        <nav className="fixed top-0 left-0 w-full h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 z-[1000] px-8 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <Link href="/" className="text-2xl font-black uppercase tracking-tighter italic">
                    FitVerse <span className="text-[#ccff00]">AI</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                    isActive ? "text-[#ccff00]" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Search size={20} className="text-white/60" />
                </button>
                <div className="w-10 h-10 rounded-full border-2 border-[#ccff00] overflow-hidden cursor-pointer">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" />
                </div>
            </div>

            <SearchPortal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
};
