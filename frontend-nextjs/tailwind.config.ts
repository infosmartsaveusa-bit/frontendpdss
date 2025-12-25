import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
            fontSize: {
                'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
                'hero-sm': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                scan: 'scan 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            boxShadow: {
                'soft': '0 8px 32px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 12px 48px rgba(0, 0, 0, 0.08)',
            },
        },
    },
    plugins: [],
};

export default config;
