import { useState } from 'react';
import NewDealModal from '../components/ui/NewDealModal';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { receivedForDeal } from '../lib/finance';
import { daysLeft, formatDate, formatINR } from '../lib/format';
import { btnCls, inputCls, STATUSES, STATUS_META } from '../lib/theme';
import { useToday } from '../lib/useToday';
import type { DealStatus } from '../types';
import { Plus, Trash2, Calendar, FileText } from 'lucide-react';

export default function Collaborations() {
    const s = useStore();
    const today = useToday();
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | DealStatus>('all');
    const shown = s.deals.filter(d => filter === 'all' || d.status === filter);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Active Collaborations"
                subtitle="Track brand deals, cosplay partnerships, sponsor deliverables, and payments"
                action={
                    <button className={btnCls} onClick={() => setOpen(true)}>
                        <Plus className="w-3.5 h-3.5" /> New Collaboration
                    </button>
                }
            />

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2.5">
                {(['all', ...STATUSES] as const).map(f => {
                    const count = f === 'all' ? s.deals.length : s.deals.filter(d => d.status === f).length;
                    const isActive = filter === f;
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 transform hover:-translate-y-0.5 ${
                                isActive
                                    ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 border border-pink-400/40'
                                    : 'anime-glass text-purple-300 hover:text-white hover:border-pink-500/40'
                            }`}
                        >
                            <span>{f === 'all' ? 'All Quests' : STATUS_META[f].label}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                isActive ? 'bg-white/20 text-white' : 'bg-purple-900/60 text-purple-300'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Empty State */}
            {shown.length === 0 && (
                <div className="rounded-3xl anime-glass border border-purple-500/30 p-12 text-center shadow-xl">
                    <FileText className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white font-display">No collaborations in this stage</h3>
                    <p className="mt-1 text-xs text-purple-300">Create a brand deal to begin tracking deliverables.</p>
                    <button onClick={() => setOpen(true)} className={`${btnCls} mt-4`}>
                        <Plus className="w-3.5 h-3.5" /> Start a Brand Deal
                    </button>
                </div>
            )}

            {/* Deals Grid */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {shown.map(d => {
                    const brand = s.brands.find(b => b.id === d.brandId);
                    const got = receivedForDeal(d, s.payments);
                    const pct = d.agreedFee ? Math.min(100, Math.round((got / d.agreedFee) * 100)) : 0;
                    const left = d.dueDate ? daysLeft(d.dueDate, today) : null;

                    return (
                        <div
                            key={d.id}
                            className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl hover:border-pink-500/50 hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-tight leading-tight font-display group-hover:text-pink-300 transition-colors">
                                            {brand?.name}
                                        </h3>
                                        <p className="text-xs text-purple-400 mt-0.5">
                                            {brand?.instagram || brand?.email || 'Direct Brand Partner'}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold border shrink-0 ${
                                        d.type === 'paid'
                                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                            : 'bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                                    }`}>
                                        {d.type === 'paid' ? '💸 Paid Collab' : '🎁 Gifted'}
                                    </span>
                                </div>

                                <p className="mt-3 text-xs font-bold text-purple-200">{d.title}</p>

                                {d.type === 'paid' ? (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-purple-300">Payment Unlocked</span>
                                            <span className="font-bold text-white">
                                                {formatINR(got)} <span className="text-purple-400 font-normal">/ {formatINR(d.agreedFee)}</span>
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-purple-950/60 border border-purple-500/30">
                                            <div
                                                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        {d.dueDate && (
                                            <div className="flex items-center gap-1.5 text-xs text-purple-300 pt-1">
                                                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                                                <span className={left !== null && left < 0 && pct < 100 ? 'text-rose-400 font-bold' : ''}>
                                                    Due {formatDate(d.dueDate)} {left !== null && `(${left < 0 ? `${-left}d overdue` : `${left}d remaining`})`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 text-xs text-purple-200 bg-purple-950/50 p-3 rounded-2xl border border-purple-500/30">
                                        Product worth estimated at <strong className="text-pink-300">{formatINR(d.barterValue ?? 0)}</strong>
                                    </div>
                                )}

                                {d.notes && (
                                    <p className="mt-4 text-xs text-purple-300 bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20 leading-relaxed italic">
                                        {d.notes}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between gap-3">
                                <select
                                    className={`${inputCls} !w-auto flex-1 font-bold ${STATUS_META[d.status].cls}`}
                                    value={d.status}
                                    onChange={e => s.setDealStatus(d.id, e.target.value as DealStatus)}
                                >
                                    {STATUSES.map(st => (
                                        <option key={st} value={st} className="bg-[#1a0b2e] text-purple-100">
                                            {STATUS_META[st].label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Delete this collaboration?')) {
                                            s.deleteDeal(d.id);
                                        }
                                    }}
                                    className="p-2 text-purple-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                                    title="Delete collaboration"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <NewDealModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
}