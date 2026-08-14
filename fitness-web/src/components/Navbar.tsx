"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, Dumbbell, LayoutDashboard, Music2, Users, Wind, Zap, Search, User, Settings, LogOut, Key, FileText, Menu, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [pathname]);

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
        <nav className="fixed top-0 left-0 w-full h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 z-[1000] px-4 md:px-8 flex items-center justify-between">
            {/* Left: Logo + Desktop Nav */}
            <div className="flex items-center gap-8 lg:gap-12">
                <Link href="/" className="text-xl md:text-2xl font-black uppercase tracking-tighter italic flex-shrink-0">
                    FitVerse <span className="text-[#ccff00]">AI</span>
                </Link>

                {/* Desktop nav items — hidden on mobile */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

            {/* Right: Search + Profile + Hamburger */}
            <div className="flex items-center gap-3 relative">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                    <Search size={20} className="text-white/60" />
                </button>
                
                {/* Profile Container — desktop only */}
                <div className="relative hidden md:block">
                    <div 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        role="button"
                        aria-label="Open profile menu"
                        aria-expanded={isProfileOpen}
                        className="w-10 h-10 rounded-full border-2 border-[#ccff00] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-[#111]"
                    >
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile avatar" />
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
                                    className="absolute right-0 top-14 w-64 max-w-[calc(100vw-2rem)] bg-[#111] border border-white/10 rounded-xl shadow-2xl z-[1002] overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5">
                                        <h4 className="text-white font-bold truncate">{user?.name || 'Guest User'}</h4>
                                        <p className="text-white/40 text-xs truncate">{user?.email || user?.phone || 'Not logged in'}</p>
                                    </div>
                                    <div className="p-2 flex flex-col gap-1">
                                        <button 
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            <User size={16} /> Edit Profile
                                        </button>
                                        <button className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors min-h-[44px]">
                                            <Key size={16} /> Login Details
                                        </button>
                                        <Link href="/account" onClick={() => setIsProfileOpen(false)}>
                                            <button className="flex items-center gap-3 w-full p-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors min-h-[44px]">
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
                                            className="flex items-center gap-3 w-full p-2 text-left text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Hamburger — mobile only */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open navigation menu"
                    className="md:hidden p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                    <Menu size={22} className="text-white/80" />
                </button>
            </div>

            <SearchPortal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1100]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-[280px] bg-[#0a0a0a] border-l border-white/10 z-[1101] flex flex-col overflow-y-auto"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 flex-shrink-0">
                            <span className="text-lg font-black uppercase italic tracking-tighter">
                                FitVerse <span className="text-[#ccff00]">AI</span>
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close navigation menu"
                                className="p-2 text-white/40 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Profile summary */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-[#ccff00] overflow-hidden flex-shrink-0 bg-[#111] flex items-center justify-center">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <User size={20} className="text-white/40" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{user?.name || 'Guest User'}</p>
                                <p className="text-white/40 text-xs truncate">{user?.email || user?.phone || ''}</p>
                            </div>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all min-h-[44px]",
                                            isActive
                                                ? "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20"
                                                : "text-white/50 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom actions */}
                        <div className="px-4 py-4 border-t border-white/5 space-y-1">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsEditModalOpen(true);
                                }}
                                className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors min-h-[44px] font-bold uppercase tracking-widest"
                            >
                                <User size={18} /> Edit Profile
                            </button>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    logout();
                                }}
                                className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors min-h-[44px] font-bold uppercase tracking-widest"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

        <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
        </>
    );
};
