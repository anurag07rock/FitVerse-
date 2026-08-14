"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatarUrl: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoaded: boolean;
    login: (user: User, token?: string) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const hydrate = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/profile');
                    const profile = response.data;
                    const mappedUser: User = {
                        id: profile.id,
                        name: profile.full_name || 'FitVerse Athlete',
                        email: profile.email,
                        avatarUrl: profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.id}`,
                        createdAt: profile.createdAt || new Date().toISOString()
                    };
                    setUser(mappedUser);
                    localStorage.setItem('fitverse_user', JSON.stringify(mappedUser));
                } catch (e) {
                    console.error('Failed to validate profile session', e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('fitverse_user');
                    setUser(null);
                }
            } else {
                const storedUser = localStorage.getItem('fitverse_user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
            setIsLoaded(true);
        };
        hydrate();
    }, []);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        localStorage.setItem('fitverse_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
        router.push('/');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fitverse_user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    const updateUser = (data: Partial<User>) => {
        if (!user) return;
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('fitverse_user', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoaded, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
