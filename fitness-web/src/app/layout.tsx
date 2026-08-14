import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/Providers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
    title: "FitVerse AI | Elite Performance Platform",
    description: "Next-generation AI-powered fitness ecosystem.",
    metadataBase: new URL('https://fitverse.ai'),
    openGraph: {
        title: "FitVerse AI | Elite Performance Platform",
        description: "Next-generation AI-powered fitness ecosystem.",
        type: "website",
        siteName: "FitVerse AI",
    },
    twitter: {
        card: "summary_large_image",
        title: "FitVerse AI | Elite Performance Platform",
        description: "Next-generation AI-powered fitness ecosystem.",
    },
    alternates: {
        canonical: '/',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${oswald.variable} font-inter antialiased bg-background text-foreground selection:bg-brand selection:text-brand-bg`}>
                <AuthProvider>
                    <ClientLayoutWrapper>
                        <ProtectedRoute>
                            {children}
                        </ProtectedRoute>
                    </ClientLayoutWrapper>
                </AuthProvider>
            </body>
        </html>
    );
}
