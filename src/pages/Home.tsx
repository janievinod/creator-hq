import { useState } from 'react';
import CashChart from '../components/ui/CashChart';
import NewDealModal from '../components/ui/NewDealModal';
import StatCard from '../components/ui/StatCard';
import { useStore } from '../context/store';
import { useTheme, THEMES, type SeasonTheme } from '../context/ThemeContext';
import { cashReceivedInMonth, goalProgress, overdueBalance, totalOutstanding } from '../lib/finance';
import { daysLeft, formatDate, formatINR } from '../lib/format';
import { btnCls } from '../lib/theme';
import { useToday } from '../lib/useToday';
import { ArrowRight, Plus, Sparkles, CheckCircle2, Palette } from 'lucide-react';

export default function Home({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const s = useStore();
    const today = useToday();
    const { currentTheme, themeConfig, setTheme } = useTheme();

    const [open, setOpen] = useState(false);
    const received = cashReceivedInMonth(s.deals, s.payments, today);
    const overdue = overdueBalance(s.deals, s.payments, today);
    const progress = goalProgress(received, s.goal.revenueTarget);
    const active = s.deals.filter(d => ['confirmed', 'in_progress', 'posted'].includes(d.status)).length;
    const leads = s.messages.filter(m => !m.dismissed && !m.converted && m.kind !== 'none').length;
    const upcoming = s.deliverables.filter(x => !x.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6);
    const dealName = (id: string) => s.brands.find(b => b.id === s.deals.find(d => d.id === id)?.brandId)?.name ?? '';

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">

            {/* Gen-Z 4-Seasons Theme Switcher Bar */}
            <div className={`p-4 rounded-3xl border ${themeConfig.borderColor} ${themeConfig.cardBg} flex flex-wrap items-center justify-between gap-4 shadow-xl`}>
                <div className="flex items-center gap-2">
                    <Palette className={`w-5 h-5 ${themeConfig.accentText}`} />
                    <span className="text-xs font-black text-white uppercase tracking-wider font-display">
                        Seasonal Vibe OS
                    </span>
                    <span className="text-[11px] text-purple-300/80 hidden sm:inline">
                        — {themeConfig.tagline}
                    </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {(Object.keys(THEMES) as SeasonTheme[]).map((themeKey) => {
                        const t = THEMES[themeKey];
                        const isActive = currentTheme === themeKey;
                        return (
                            <button
                                key={themeKey}
                                onClick={() => setTheme(themeKey)}
                                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isActive
                                        ? `${t.badgeBg} shadow-lg scale-105 border`
                                        : 'bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/20'
                                    }`}
                            >
                                <span>{t.emoji}</span>
                                <span>{t.name.split(' ')[2] || t.name.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hero Section */}
            <div className={`rounded-3xl p-8 border ${themeConfig.borderColor} ${themeConfig.cardBg} ${themeConfig.accentGlow} relative overflow-hidden transition-all duration-500`}>
                <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${themeConfig.badgeBg}`}>
                                <Sparkles className="w-3.5 h-3.5" /> {themeConfig.name} {themeConfig.emoji}
                            </span>
                        </div>
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r ${themeConfig.primaryText} bg-clip-text text-transparent font-display`}>
                            Welcome back, {s.profile.name} 🌙
                        </h1>
                        <p className="text-xs sm:text-sm text-purple-300 font-medium">
                            {formatINR(received)} collected this month · Monthly quest target {formatINR(s.goal.revenueTarget)}
                        </p>
                    </div>

                    <button onClick={() => setOpen(true)} className={btnCls}>
                        <Plus className="w-4 h-4" /> New Collab Quest
                    </button>
                </div>

                <div className="mt-8 space-y-2 relative z-10">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-purple-300">Revenue Quest Progress</span>
                        <span className={`${themeConfig.accentText}`}>{progress}% Achieved</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-purple-950/60 border border-purple-500/30 p-0.5">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${themeConfig.primaryText} transition-all duration-700`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Glowing Stat Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard emoji="💰" label="Collected This Month" value={formatINR(received)} hint="Real bank credits" />
                <StatCard emoji="⏳" label="Total Outstanding" value={formatINR(totalOutstanding(s.deals, s.payments))} hint="Committed deal fees" />

                {/* Clickable Overdue Invoices Card Container */}
                <div
                    onClick={() => onNavigate('collaborations')}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <StatCard
                        emoji="🚨"
                        label="Overdue Invoices"
                        value={formatINR(overdue)}
                        hint={overdue > 0 ? 'Follow-up needed →' : 'All clear on time'}
                    />
                </div>

                <StatCard emoji="🤝" label="Active Collaborations" value={String(active)} hint="In production or posted" />
            </div>

            {/* Sponsor Leads Banner */}
            {leads > 0 && (
                <button
                    onClick={() => onNavigate('inbox')}
                    className={`w-full text-left flex items-center justify-between rounded-2xl p-5 shadow-xl transition-all cursor-pointer group ${themeConfig.cardBg} border ${themeConfig.borderColor}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="w-3 h-3 rounded-full bg-pink-400 animate-ping" />
                        <div>
                            <span className="text-sm font-extrabold text-white block font-display">
                                You have {leads} pending sponsor inquiry lead{leads > 1 ? 's' : ''} in your inbox!
                            </span>
                            <span className={`text-xs ${themeConfig.accentText} font-medium`}>
                                Review live messages from Instagram & Gmail to convert directly into paid deals →
                            </span>
                        </div>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${themeConfig.accentText} group-hover:translate-x-1.5 transition-transform shrink-0`} />
                </button>
            )}

            {/* Charts & Deliverables */}
            <div className="grid gap-6 lg:grid-cols-2">
                <section className={`rounded-3xl border ${themeConfig.borderColor} ${themeConfig.cardBg} p-6 shadow-xl flex flex-col justify-between`}>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h2 className={`text-xs font-black ${themeConfig.accentText} uppercase tracking-widest font-display`}>
                                Cash Flow Horizon
                            </h2>
                            <span className="text-[11px] text-purple-400 font-medium">Last 6 Months</span>
                        </div>
                        <p className="text-xs text-purple-300/80 mb-3">Realized creator revenue across all sponsorship deals</p>
                    </div>
                    <CashChart deals={s.deals} payments={s.payments} today={today} />
                </section>

                <section className={`rounded-3xl border ${themeConfig.borderColor} ${themeConfig.cardBg} p-6 shadow-xl`}>
                    <div className="flex items-center justify-between mb-1">
                        <h2 className={`text-xs font-black ${themeConfig.accentText} uppercase tracking-widest font-display`}>
                            Upcoming Deadlines
                        </h2>
                        <span className={`text-[11px] font-bold ${themeConfig.badgeBg} px-2.5 py-0.5 rounded-full border`}>
                            {upcoming.length} Pending
                        </span>
                    </div>
                    <p className="text-xs text-purple-300/80 mb-4">Contract deliverables and draft submission due dates</p>

                    {upcoming.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-purple-950/30 border border-dashed border-purple-500/30 text-xs text-purple-300">
                            <CheckCircle2 className={`w-6 h-6 ${themeConfig.accentText} mx-auto mb-2`} />
                            No pending deliverables. You are completely caught up!
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {upcoming.map(x => {
                                const left = daysLeft(x.dueDate, today);
                                return (
                                    <li key={x.id} className="flex items-center gap-3 rounded-2xl bg-purple-950/40 border border-purple-500/25 px-4 py-3 text-xs hover:border-pink-500/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={x.done}
                                            onChange={() => s.toggleDeliverable(x.id)}
                                            className="h-4 w-4 rounded border-purple-500 text-pink-500 focus:ring-pink-400 cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-bold text-white block truncate">{x.title}</span>
                                            <span className="text-purple-400 text-[11px] font-medium">{dealName(x.dealId)}</span>
                                        </div>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${left < 0
                                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                                            : left <= 3
                                                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                                : 'bg-purple-900/60 text-purple-200 border-purple-500/30'
                                            }`}>
                                            {formatDate(x.dueDate)} · {left < 0 ? `${-left}d overdue` : `${left}d left`}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>

            <NewDealModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
}