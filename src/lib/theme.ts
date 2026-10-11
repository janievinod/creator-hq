import type { DealStatus } from '../types';

export const STATUSES: DealStatus[] = [
    'lead', 'negotiating', 'confirmed', 'in_progress', 'posted', 'paid', 'completed', 'declined'
];

export const STATUS_META: Record<DealStatus, { label: string; cls: string }> = {
    lead: { label: 'New Lead', cls: 'bg-amber-950/60 text-amber-300 border-amber-500/30' },
    negotiating: { label: 'Negotiating', cls: 'bg-sky-950/60 text-sky-300 border-sky-500/30' },
    confirmed: { label: 'Confirmed', cls: 'bg-purple-950/60 text-purple-300 border-purple-500/30' },
    in_progress: { label: 'In Progress', cls: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30' },
    posted: { label: 'Content Posted', cls: 'bg-teal-950/60 text-teal-300 border-teal-500/30' },
    paid: { label: 'Payment Done', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' },
    completed: { label: 'Completed', cls: 'bg-slate-900 text-slate-300 border-slate-700' },
    declined: { label: 'Declined', cls: 'bg-rose-950/60 text-rose-300 border-rose-500/30' },
};

export const btnCls = 'rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';

export const inputCls = 'w-full rounded-xl bg-purple-950/40 border border-purple-500/30 px-3.5 py-2 text-xs text-purple-100 placeholder-purple-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 transition-all';

export const btnSecondaryCls = 'rounded-xl bg-purple-950/60 hover:bg-purple-900/80 px-4 py-2.5 text-xs font-bold text-purple-200 border border-purple-500/30 transition-all cursor-pointer hover:border-pink-500/50 shadow-sm';