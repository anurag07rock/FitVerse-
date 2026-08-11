"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, Dumbbell, LayoutDashboard, Music2, Users, Wind, Zap, Search, User, Settings, LogOut, Key, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchPortal } from './SearchPortal';
import { useAuth } from './Providers';
import { EditProfileModal } from './profile/EditProfileModal';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const Navbar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
        <>
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

            <div className="flex items-center gap-4 relative">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Search size={20} className="text-white/60" />
                </button>
                
                {/* Profile Container */}
                <div className="relative">
                    <div 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-10 h-10 rounded-full border-2 border-[#ccff00] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-[#111]"
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} className="text-white/40" />
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                {/* Invisible overlay to handle click-away */}
                                <div 
                                    className="fixed inset-0 z-[1001]" 
                                    onClick={() => setIsProfileOpen(false)} 
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-14 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-[1002] overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5">
                                        <h4 className="text-white font-bold">{user?.name || 'Guest User'}</h4>
                                        <p className="text-white/40 text-xs">{user?.email || user?.phone || 'Not logged in'}</p>
                                    </div>
                                    <div className="p-2 flex flex-col gap-1">
                                        <button 
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <User size={16} /> Edit Profile
                                        </button>
                                        <button className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                            <Key size={16} /> Login Details
                                        </button>
                                        <Link href="/account" onClick={() => setIsProfileOpen(false)}>
                                            <button className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <FileText size={16} /> Account Details
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-white/5">
                                        <button 
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="flex items-center gap-3 w-full p-2 text-left text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <SearchPortal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
        <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
        </>
    );
};
