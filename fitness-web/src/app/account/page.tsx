"use client";

import React from 'react';
import { useAuth } from '@/components/Providers';
import { User, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AccountDetailsPage() {
    const { user } = useAuth();

    if (!user) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pb-20 pt-10">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                    Account <span className="text-[#ccff00]">Details</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1 bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl"
                >
                    <div className="w-32 h-32 rounded-full border-4 border-[#ccff00] overflow-hidden mb-6 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                        <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                    <p className="text-white/40 mb-6 flex items-center justify-center gap-2">
                        {user.email ? <><Mail size={14}/> {user.email}</> : <><Phone size={14}/> {user.phone}</>}
                    </p>
                    <div className="w-full h-px bg-white/10 mb-6"></div>
                    <div className="text-sm text-white/60 flex items-center gap-2">
                        <Calendar size={16} className="text-[#ccff00]" />
                        Member since: <span className="text-white font-bold">{formatDate(user.createdAt)}</span>
                    </div>
                </motion.div>

                {/* Details List Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 md:col-span-2 bg-[#111] border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col justify-center"
                >
                    <h3 className="text-xl font-bold uppercase tracking-widest text-white/40 mb-8 border-b border-white/5 pb-4">Personal Information</h3>
                    
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-white/60">
                                <User size={20} className="text-[#ccff00]" />
                                <span className="uppercase tracking-widest text-sm font-bold">Display Name</span>
                            </div>
                            <div className="text-lg font-medium">{user.name}</div>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-white/60">
                                <Mail size={20} className="text-[#ccff00]" />
                                <span className="uppercase tracking-widest text-sm font-bold">Email Address</span>
                            </div>
                            <div className="text-lg font-medium">{user.email || 'Not provided'}</div>
                        </div>

                        <div className="w-full h-px bg-white/5"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-white/60">
                                <Phone size={20} className="text-[#ccff00]" />
                                <span className="uppercase tracking-widest text-sm font-bold">Phone Number</span>
                            </div>
                            <div className="text-lg font-medium">{user.phone || 'Not provided'}</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
