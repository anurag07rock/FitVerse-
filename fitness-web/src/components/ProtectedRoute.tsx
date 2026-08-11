"use client";

import React, { useEffect } from 'react';
import { useAuth } from './Providers';
import { useRouter, usePathname } from 'next/navigation';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoaded } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoaded && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isLoaded, isAuthenticated, pathname, router]);

    // Wait until auth state is hydrated from localStorage
    if (!isLoaded) return null;

    // Block protected pages until authenticated
    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }

    return <>{children}</>;
};
