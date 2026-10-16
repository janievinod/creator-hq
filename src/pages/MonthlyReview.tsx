import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { cashReceivedInMonth, goalProgress, isCommittedPaidDeal } from '../lib/finance';
import { formatINR } from '../lib/format';
import { inputCls } from '../lib/theme';
import { useToday } from '../lib/useToday';
import { Target, TrendingUp, Compass } from 'lucide-react';

function Bar({ label, pct, grad, right }: { label: string; pct: number; grad: string; right: string }) {
    return (
        <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white font-display text-sm">{label}</span>
                <span className="text-pink-300 font-bold">{right}</span>
            </div>
            <div className="mt-4 space-y-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-950/60 border border-purple-500/30 p-0.5">
                    <div className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(236,72,153,0.5)]`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-end text-[10px] font-bold text-purple-400">
                    {pct}% complete
                </div>
            </div>
        </div>
    );
}

export default function MonthlyReview() {
    const s = useStore();
    const today = useToday();
    const g = s.goal;
    const received = cashReceivedInMonth(s.deals, s.payments, today);
    const remaining = Math.max(0, g.revenueTarget - received);
    const paidDeals = s.deals.filter(isCommittedPaidDeal);
    const avg = paidDeals.length ? Math.round(paidDeals.reduce((a, d) => a + d.agreedFee, 0) / paidDeals.length) : 0;
    const num = (v: string) => Math.max(0, Number(v) || 0);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Monthly Review & Level Up"
                subtitle="Track monthly business milestones, gap analysis, and creative roadmap"
            />

            {/* Performance Bars */}
            <div className="grid gap-5 md:grid-cols-2">
                <Bar
                    label="💰 Revenue Realized"
                    pct={goalProgress(received, g.revenueTarget)}
                    grad="from-pink-500 via-purple-500 to-indigo-500"
                    right={`${formatINR(received)} / ${formatINR(g.revenueTarget)}`}
                />
                <Bar
                    label="🤝 Confirmed Partnerships"
                    pct={goalProgress(paidDeals.length, g.dealsTarget || 0)}
                    grad="from-purple-500 to-pink-500"
                    right={`${paidDeals.length} / ${g.dealsTarget || 0} deals`}
                />
                <Bar
                    label="📨 Brand Pitches & Outreach"
                    pct={goalProgress(g.outreachDone || 0, g.outreachTarget || 0)}
                    grad="from-sky-400 to-indigo-500"
                    right={`${g.outreachDone || 0} / ${g.outreachTarget || 0} pitches`}
                />
                <Bar
                    label="🎬 Content Published"
                    pct={goalProgress(g.contentDone || 0, g.contentTarget || 0)}
                    grad="from-amber-400 to-pink-500"
                    right={`${g.contentDone || 0} / ${g.contentTarget || 0} posts`}
                />
            </div>

            {/* Gap Analysis Card */}
            <section className="rounded-3xl anime-glass border border-pink-500/40 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    <h2 className="text-base font-black text-white font-display">Strategic Gap Analysis</h2>
                </div>
                <p className="mt-1 text-xs text-purple-200 leading-relaxed font-normal">
                    {remaining === 0 ? (
                        <span className="text-emerald-300 font-bold">
                            Monthly quest target achieved! 🎉 You have secured 100% of your earnings milestone.
                        </span>
                    ) : (
                        <span>
                            You need <strong className="text-pink-300 font-bold">{formatINR(remaining)}</strong> more to hit your monthly milestone.
                            {avg > 0 && ` At your average partnership rate of ${formatINR(avg)}, closing approximately ${Math.ceil(remaining / avg)} more brand deal(s) will meet the target.`}
                        </span>
                    )}
                </p>
            </section>

            {/* Edit Targets */}
            <section className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Adjust Target Benchmarks
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {([
                        ['Monthly Revenue Goal (₹)', 'revenueTarget'],
                        ['Closed Deals Target', 'dealsTarget'],
                        ['Brand Pitches Target', 'outreachTarget'],
                        ['Pitches Sent So Far', 'outreachDone'],
                        ['Published Content Goal', 'contentTarget'],
                        ['Published Posts So Far', 'contentDone'],
                    ] as const).map(([label, key]) => (
                        <label key={key} className="text-xs font-bold text-purple-200 flex flex-col gap-1.5">
                            {label}
                            <input
                                type="number"
                                min="0"
                                className={inputCls}
                                value={g[key] ?? 0}
                                onChange={e => s.setGoal({ [key]: num(e.target.value) })}
                            />
                        </label>
                    ))}
                </div>
            </section>

            {/* Strategic Notes */}
            <section className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Roadmap & Campaign Strategy
                    </h2>
                </div>
                <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Focus gaming/anime brands, upcoming conventions, sponsor rate adjustments..."
                    value={g.plan || ''}
                    onChange={e => s.setGoal({ plan: e.target.value })}
                />
            </section>
        </div>
    );
}