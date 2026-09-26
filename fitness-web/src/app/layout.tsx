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
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                function isExtensionError(msg, stack, filename) {
                                    var str = (msg || '') + ' ' + (stack || '') + ' ' + (filename || '');
                                    return str.indexOf('chrome-extension://') !== -1 ||
                                           str.indexOf('chrome: call method') !== -1 ||
                                           str.indexOf('Window message') !== -1;
                                }
                                window.addEventListener('error', function(e) {
                                    if (isExtensionError(e.message, e.error && e.error.stack, e.filename)) {
                                        e.stopImmediatePropagation();
                                        e.preventDefault();
                                    }
                                }, true);
                                window.addEventListener('unhandledrejection', function(e) {
                                    var reason = e.reason;
                                    var msg = (reason && reason.message) || String(reason || '');
                                    var stack = (reason && reason.stack) || '';
                                    if (isExtensionError(msg, stack)) {
                                        e.stopImmediatePropagation();
                                        e.preventDefault();
                                    }
                                }, true);
                            })();
                        `,
                    }}
                />
            </head>
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
