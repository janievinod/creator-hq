interface StatCardProps {
    emoji: string;
    label: string;
    value: string;
    hint?: string;
}

export default function StatCard({ emoji, label, value, hint }: StatCardProps) {
    return (
        <div className="anime-glass rounded-2xl border border-purple-500/30 p-5 transition-all duration-300 hover:scale-[1.03] hover:border-pink-500/60 shadow-xl shadow-purple-950/40 hover:shadow-pink-900/30 group">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-purple-300 tracking-wider uppercase">
                    {label}
                </span>
                <span className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-base shadow-[0_0_15px_rgba(216,137,255,0.2)] group-hover:scale-110 group-hover:border-pink-400 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">
                    {emoji}
                </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3 font-display drop-shadow-[0_2px_12px_rgba(244,114,182,0.3)]">
                {value}
            </div>
            {hint && (
                <p className="text-[11px] font-medium text-pink-300/80 mt-1 flex items-center gap-1">
                    ✨ {hint}
                </p>
            )}
        </div>
    );
}