"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Trophy, Calendar, ExternalLink } from 'lucide-react';

import api from '@/services/api';

export const ProfessionalDirectory = () => {
    const [profs, setProfs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfs = async () => {
            setLoading(true);
            try {
                const response = await api.get('/community/professionals');
                setProfs(response.data);
            } catch (error) {
                console.error("Error fetching professionals:", error);
                // Fallback
                setProfs([
                    { id: '1', name: 'Dr. Elena Vance', title: 'Strength Specialist', experience_years: 12, rating: 4.9, bio: 'Expert in rehabilitative strength training and Olympic weightlifting form.', avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80', specialization: 'Hypertrophy' },
                    { id: '2', name: 'Marcus Thorne', title: 'HIIT Performance Coach', experience_years: 8, rating: 5.0, bio: 'Specializing in explosive metabolic conditioning and athletic performance.', avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80', specialization: 'HIIT' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchProfs();
    }, []);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profs.map((pro) => (
                <motion.div
                    key={pro.id}
                    whileHover={{ y: -5 }}
                    className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl group"
                >
                    <div className="w-full md:w-48 h-64 md:h-auto relative">
                        <img src={pro.avatar_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                    </div>


                    <div className="p-8 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-white uppercase italic">{pro.name}</h3>
                                    <ShieldCheck size={18} className="text-[#ccff00]" />
                                </div>
                                <p className="text-[#ccff00] text-xs font-black uppercase tracking-widest">{pro.title}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                <Star size={14} fill="#ccff00" className="text-[#ccff00]" />
                                <span className="text-xs font-black">{pro.rating}</span>
                            </div>
                        </div>

                        <p className="text-white/50 text-xs leading-relaxed mb-6 line-clamp-2">{pro.bio}</p>

                        <div className="flex gap-4 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/30 uppercase font-black">Experience</span>
                                <span className="text-sm font-bold">{pro.experience_years} Years</span>
                            </div>

                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/30 uppercase font-black">Focus</span>
                                <span className="text-sm font-bold text-[#ccff00]">{pro.specialization}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 py-3 bg-white/5 hover:bg-[#ccff00] hover:text-black transition-all rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                <Calendar size={14} /> Book Session
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
