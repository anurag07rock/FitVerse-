"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Check, Image as ImageIcon, File, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/Providers';

const AI_AVATARS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
];

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [showAIAvatars, setShowAIAvatars] = useState(false);
    
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const filesInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setSelectedAvatar(user.avatarUrl);
        }
    }, [user, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setSelectedAvatar(event.target.result as string);
                    setIsBottomSheetOpen(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUser({
            name,
            avatarUrl: selectedAvatar
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] overflow-y-auto">
                    {/* Backdrop - fixed so it always covers the whole screen */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Centering wrapper - min-h-full ensures vertical centering works even when scrollable */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Edit Profile</h3>
                                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 flex flex-col gap-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Profile Picture</label>
                                    
                                    <div className="flex flex-col items-center">
                                        <div 
                                            onClick={() => {
                                                setShowAIAvatars(false);
                                                setIsBottomSheetOpen(true);
                                            }}
                                            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#ccff00] cursor-pointer group hover:scale-105 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                        >
                                            <img src={selectedAvatar} alt="Current" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera size={24} className="text-white mb-1" />
                                                <span className="text-[10px] uppercase font-bold text-white tracking-wider">Change</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/40 mt-3">Tap to change profile picture</p>
                                    </div>
                                </div>

                                {/* Name Section */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ccff00] transition-colors"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl text-white/60 font-bold hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={!name.trim()}
                                    className="px-6 py-3 rounded-xl bg-[#ccff00] text-black font-black uppercase tracking-wider hover:bg-[#b3e600] transition-colors disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Sheet for Avatar Selection */}
                    <AnimatePresence>
                        {isBottomSheetOpen && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsBottomSheetOpen(false)}
                                    className="fixed inset-0 bg-black/60 z-[2001]"
                                />
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                    className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 rounded-t-3xl p-6 z-[2002] max-h-[80vh] overflow-y-auto"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">Change Profile Photo</h3>
                                        <button onClick={() => setIsBottomSheetOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {!showAIAvatars ? (
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => galleryInputRef.current?.click()} className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                                                <div className="p-3 bg-white/5 rounded-full"><ImageIcon size={20} className="text-[#ccff00]"/></div>
                                                <div className="flex-1"><div className="font-bold">Choose from Gallery</div><div className="text-xs text-white/40">Select an image from your photos</div></div>
                                            </button>
                                            <button onClick={() => filesInputRef.current?.click()} className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                                                <div className="p-3 bg-white/5 rounded-full"><File size={20} className="text-[#ccff00]"/></div>
                                                <div className="flex-1"><div className="font-bold">Browse Files</div><div className="text-xs text-white/40">Select an image from your files</div></div>
                                            </button>
                                            <button onClick={() => cameraInputRef.current?.click()} className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                                                <div className="p-3 bg-white/5 rounded-full"><Camera size={20} className="text-[#ccff00]"/></div>
                                                <div className="flex-1"><div className="font-bold">Take a Photo</div><div className="text-xs text-white/40">Use your camera</div></div>
                                            </button>
                                            <button onClick={() => setShowAIAvatars(true)} className="flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-xl transition-colors text-left">
                                                <div className="p-3 bg-[#ccff00]/10 rounded-full"><Sparkles size={20} className="text-[#ccff00]"/></div>
                                                <div className="flex-1"><div className="font-bold text-[#ccff00]">Use AI Avatar</div><div className="text-xs text-white/40">Choose a futuristic AI preset</div></div>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                            <button onClick={() => setShowAIAvatars(false)} className="text-sm text-white/40 hover:text-white mb-4">&larr; Back to options</button>
                                            <div className="grid grid-cols-3 gap-3">
                                                {AI_AVATARS.map((avatar, idx) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedAvatar(avatar);
                                                            setIsBottomSheetOpen(false);
                                                        }}
                                                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[#ccff00] transition-colors"
                                                    >
                                                        <img src={avatar} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hidden inputs */}
                                    <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <input type="file" ref={filesInputRef} onChange={handleFileChange} accept="*/*" className="hidden" />
                                    <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
};
