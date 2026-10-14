import { useTheme } from '../../context/ThemeContext';

export default function SeasonalMotionBg() {
    const { currentTheme } = useTheme();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Animated Glowing Orbs */}
            <div
                className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-40 animate-pulse transition-all duration-1000 ${currentTheme === 'spring'
                        ? 'bg-pink-500'
                        : currentTheme === 'summer'
                            ? 'bg-amber-400'
                            : currentTheme === 'autumn'
                                ? 'bg-orange-500'
                                : 'bg-cyan-400'
                    }`}
            />
            <div
                className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse transition-all duration-1000 delay-700 ${currentTheme === 'spring'
                        ? 'bg-emerald-500'
                        : currentTheme === 'summer'
                            ? 'bg-rose-500'
                            : currentTheme === 'autumn'
                                ? 'bg-purple-600'
                                : 'bg-indigo-500'
                    }`}
            />

            {/* Season-Specific Ambient Overlay */}
            {currentTheme === 'spring' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent" />
            )}
            {currentTheme === 'summer' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
            )}
            {currentTheme === 'autumn' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
            )}
            {currentTheme === 'winter' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
            )}
        </div>
    );
}