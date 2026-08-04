import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    DEFAULT: "var(--fv-primary)",
                    bg: "var(--fv-bg)",
                },
            },
            fontFamily: {
                inter: ["var(--font-inter)", "sans-serif"],
                oswald: ["var(--font-oswald)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
