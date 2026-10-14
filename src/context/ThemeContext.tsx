import React, { createContext, useContext, useState, useEffect } from 'react';

export type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter';

export interface ThemeConfig {
    id: SeasonTheme;
    name: string;
    emoji: string;
    tagline: string;
    bgGradient: string;
    cardBg: string;
    borderColor: string;
    accentGlow: string;
    primaryText: string;
    accentText: string;
    badgeBg: string;
    particleColor: string;
}

export const THEMES: Record<SeasonTheme, ThemeConfig> = {
    spring: {
        id: 'spring',
        name: 'Neon Sakura Spring',
        emoji: '🌸',
        tagline: 'Gen-Z Soft Pink & Electric Mint Glow',
        bgGradient: 'from-pink-950 via-purple-950 to-emerald-950',
        cardBg: 'bg-pink-950/40 backdrop-blur-xl',
        borderColor: 'border-pink-500/30',
        accentGlow: 'shadow-[0_0_30px_rgba(244,114,182,0.35)]',
        primaryText: 'from-pink-300 via-rose-200 to-emerald-300',
        accentText: 'text-pink-400',
        badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
        particleColor: '#f472b6',
    },
    summer: {
        id: 'summer',
        name: 'Cyberpunk Summer',
        emoji: '☀️',
        tagline: 'Neon Cyan, Golden Yellow & Hot Sunset Pink',
        bgGradient: 'from-amber-950 via-rose-950 to-cyan-950',
        cardBg: 'bg-amber-950/40 backdrop-blur-xl',
        borderColor: 'border-amber-500/30',
        accentGlow: 'shadow-[0_0_30px_rgba(251,191,36,0.35)]',
        primaryText: 'from-amber-200 via-rose-300 to-cyan-300',
        accentText: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        particleColor: '#fbbf24',
    },
    autumn: {
        id: 'autumn',
        name: 'Synthwave Autumn',
        emoji: '🍁',
        tagline: 'Neon Orange, Deep Amber & Violet Sunset',
        bgGradient: 'from-orange-950 via-red-950 to-purple-950',
        cardBg: 'bg-orange-950/40 backdrop-blur-xl',
        borderColor: 'border-orange-500/30',
        accentGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.35)]',
        primaryText: 'from-orange-300 via-amber-200 to-purple-300',
        accentText: 'text-orange-400',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        particleColor: '#f97316',
    },
    winter: {
        id: 'winter',
        name: 'Aurora Borealis Winter',
        emoji: '❄️',
        tagline: 'Icy Cyan, Electric Violet & Frost White',
        bgGradient: 'from-cyan-950 via-slate-950 to-indigo-950',
        cardBg: 'bg-cyan-950/40 backdrop-blur-xl',
        borderColor: 'border-cyan-500/30',
        accentGlow: 'shadow-[0_0_30px_rgba(34,211,238,0.35)]',
        primaryText: 'from-cyan-200 via-blue-200 to-indigo-300',
        accentText: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        particleColor: '#22d3ee',
    },
};

interface ThemeContextType {
    currentTheme: SeasonTheme;
    themeConfig: ThemeConfig;
    setTheme: (theme: SeasonTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<SeasonTheme>(() => {
        return (localStorage.getItem('hq_season_theme') as SeasonTheme) || 'spring';
    });

    useEffect(() => {
        localStorage.setItem('hq_season_theme', currentTheme);
    }, [currentTheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, themeConfig: THEMES[currentTheme], setTheme: setCurrentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};