"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Send, Plus, UserCheck } from 'lucide-react';
import api from '@/services/api';

export const CommunityFeed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<string | null>(null);
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/community/feed');
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching feed:", error);
            // Fallback
            setPosts([
                { id: '1', user: { full_name: 'Alex Rivers', avatar: 'https://i.pravatar.cc/150?u=1' }, content: 'Just crushed the Iron Core 2.0 session. 320 calories down! Who else is training today? 🔥', likes: Array(12).fill({}), comments: [], created_at: new Date().toISOString() },
                { id: '2', user: { full_name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' }, content: 'The new Yoga Flow for mobility is exactly what my recovery needed. Highly recommend for rest days! 🧘‍♀️', likes: Array(24).fill({}), comments: [], created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        if (!newPost.trim()) return;
        try {
            await api.post('/community/post', { content: newPost });
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await api.post('/community/like', { post_id: postId });
            fetchPosts(); // Refresh to get updated like count
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleComment = async (postId: string) => {
        const text = commentTexts[postId];
        if (!text || !text.trim()) return;
        try {
            await api.post('/community/comment', { post_id: postId, comment: text });
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
            fetchPosts(); // Refresh to show new comment
        } catch (error) {
            console.error("Comment failed", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post Area */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="flex gap-4 mb-4">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-12 h-12 rounded-full border-2 border-[#ccff00]" />
                    <textarea
                        placeholder="Share your progress or ask a question..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#ccff00] transition-colors resize-none"
                        rows={3}
                    />
                </div>
                <div className="flex justify-between items-center bg-[#1a1a1a] -m-6 mt-4 p-4 px-6">
                    <button className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold">
                        <Plus size={16} /> Add Media
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreatePost}
                        className="px-6 py-2 bg-[#ccff00] text-black font-black uppercase text-xs rounded-lg flex items-center gap-2"
                    >
                        Post Feed <Send size={14} />
                    </motion.button>
                </div>
            </div>

            {/* Feed List */}
            <AnimatePresence>
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={post.user?.avatar || `https://i.pravatar.cc/150?u=${post.id}`} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                                            {post.user?.full_name || 'FitVerse Elite'} <UserCheck size={14} className="text-[#ccff00]" />
                                        </h4>
                                        <p className="text-[10px] text-white/30 uppercase tracking-tighter">{new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/80 text-sm leading-relaxed mb-4">{post.content}</p>

                            {post.image_url && (
                                <div className="rounded-xl overflow-hidden mb-4 border border-white/5">
                                    <img src={post.image_url} className="w-full aspect-video object-cover" />
                                </div>
                            )}

                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors"
                                >
                                    <Heart size={18} fill={post.likes?.length > 0 ? '#ccff00' : 'none'} className={post.likes?.length > 0 ? 'text-[#ccff00]' : ''} />
                                    <span className="text-xs font-bold">{post.likes?.length || 0}</span>
                                </button>
                                <button
                                    onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                                    className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors"
                                >
                                    <MessageSquare size={18} className={expandedComments === post.id ? 'text-[#ccff00]' : ''} />
                                    <span className="text-xs font-bold">{post.comments?.length || 0}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors ml-auto">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <AnimatePresence>
                                {expandedComments === post.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 space-y-4">
                                            {post.comments && post.comments.map((comm: any) => (
                                                <div key={comm.id} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <img src={`https://i.pravatar.cc/150?u=${comm.user_id}`} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-[#ccff00] mb-0.5">{comm.user?.full_name || 'User'}</p>
                                                        <p className="text-xs text-white/70">{comm.comment}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex gap-2 pt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentTexts[post.id] || ''}
                                                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-[#ccff00]"
                                                />
                                                <button
                                                    onClick={() => handleComment(post.id)}
                                                    className="p-2 bg-[#ccff00] text-black rounded-lg hover:scale-105 transition-transform"
                                                >
                                                    <Send size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
