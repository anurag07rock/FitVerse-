import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import MusicPanel from "@/components/music/ClientMusicPanel";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
    title: "FitVerse AI | Elite Performance Platform",
    description: "Next-generation AI-powered fitness ecosystem.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${oswald.variable} font-inter antialiased bg-background text-foreground selection:bg-brand selection:text-brand-bg`}>
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <MusicPanel />
            </body>
        </html>
    );
}
