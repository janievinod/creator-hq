import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-6 pb-2">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-pink-400 text-xs font-black tracking-widest uppercase bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/30 shadow-[0_0_12px_rgba(244,114,182,0.3)]">
                        ✨ Midnight Studio
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(236,72,153,0.45)] font-display">
                    {title}
                </h1>
                <p className="text-xs sm:text-sm text-purple-300 font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(168,85,247,0.25)]">
                    {subtitle}
                </p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}