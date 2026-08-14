"use client";

import React, { useState } from 'react';
import { useAuth } from '@/components/Providers';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, ArrowRight, Activity } from 'lucide-react';
import api from '@/services/api';

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', {
                email,
                password_hash: password // API matches password_hash parameter
            });
            const { user, token } = response.data;
            const mappedUser = {
                id: user.id,
                name: user.full_name || 'FitVerse Athlete',
                email: user.email,
                avatarUrl: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`,
                createdAt: user.createdAt || new Date().toISOString()
            };
            login(mappedUser, token);
        } catch (err: any) {
            console.error('Login error', err);
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOtp = () => {
        setIsLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setIsLoading(false);
        }, 800);
    };

    const handlePhoneLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            login({
                id: '456',
                name: 'FitVerse User',
                phone: phone,
                avatarUrl: 'https://i.pravatar.cc/150?u=phone',
                createdAt: new Date().toISOString()
            });
        }, 1000);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center mb-6">
                    <Activity size={48} className="text-[#ccff00]" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
                    FitVerse <span className="text-[#ccff00]">AI</span>
                </h1>
                <p className="text-white/40 font-medium">Log in to access your elite performance platform.</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="flex gap-2 p-1 bg-black rounded-xl mb-8">
                    <button 
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${loginMethod === 'email' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                    >
                        Email
                    </button>
                    <button 
                        onClick={() => setLoginMethod('phone')}
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${loginMethod === 'phone' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                    >
                        Phone OTP
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {loginMethod === 'email' ? (
                        <motion.form 
                            key="email-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleEmailLogin}
                            className="flex flex-col gap-4"
                        >
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    required
                                    autoComplete="email"
                                    inputMode="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ccff00] transition-colors"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ccff00] transition-colors"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                                    Forgot password? <span className="text-[9px] text-white/20">(coming soon)</span>
                                </button>
                            </div>
                            {error && (
                                <div className="text-red-500 text-xs font-black uppercase tracking-wider text-center mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    {error}
                                </div>
                            )}
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="mt-4 w-full bg-[#ccff00] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={20} />
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form 
                            key="phone-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handlePhoneLogin}
                            className="flex flex-col gap-4"
                        >
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input 
                                    type="tel" 
                                    placeholder="Phone Number (+1 234...)" 
                                    required
                                    autoComplete="tel"
                                    inputMode="tel"
                                    disabled={otpSent}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ccff00] transition-colors disabled:opacity-50"
                                />
                            </div>
                            
                            <AnimatePresence>
                                {otpSent && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="relative mt-2"
                                    >
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit OTP" 
                                            required
                                            maxLength={6}
                                            autoComplete="one-time-code"
                                            inputMode="numeric"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-black border border-[#ccff00]/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ccff00] transition-colors text-center font-mono tracking-widest text-lg"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!otpSent ? (
                                <button 
                                    type="button" 
                                    onClick={handleSendOtp}
                                    disabled={!phone || isLoading}
                                    className="mt-4 w-full bg-white/10 text-white font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send OTP Code'}
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={!otp || isLoading}
                                    className="mt-4 w-full bg-[#ccff00] text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify & Login'} <ArrowRight size={20} />
                                </button>
                            )}
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
