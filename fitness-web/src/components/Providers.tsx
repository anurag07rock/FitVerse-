"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
    login: (user: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from localStorage
        const storedUser = localStorage.getItem('fitverse_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error(e);
            }
        }
        setIsLoaded(true);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('fitverse_user', JSON.stringify(userData));
        router.push('/');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fitverse_user');
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
