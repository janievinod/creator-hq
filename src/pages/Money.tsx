import { useState } from 'react';
import CashChart from '../components/ui/CashChart';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import { useStore } from '../context/store';
import { cashReceivedInMonth, dealProfit, outstandingForDeal, overdueBalance, receivedForDeal, totalOutstanding } from '../lib/finance';
import { formatDate, formatINR, toISO } from '../lib/format';
import { btnCls, btnSecondaryCls, inputCls } from '../lib/theme';
import { useToday } from '../lib/useToday';
import type { Deal } from '../types';
import { PlusCircle, MinusCircle, Wallet, CheckCircle2 } from 'lucide-react';

function RecordRow({ deal }: { deal: Deal }) {
    const { addPayment, addExpense } = useStore();
    const today = useToday();
    const [mode, setMode] = useState<'payment' | 'expense' | null>(null);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(toISO(today));

    const save = () => {
        const n = Number(amount);
        if (!n || n <= 0) return;
        if (mode === 'payment') addPayment(deal.id, n, date);
        else addExpense(deal.id, note || 'Production Expense', n, date);
        setMode(null);
        setAmount('');
        setNote('');
    };

    return (
        <div className="mt-4 pt-4 border-t border-purple-500/20">
            <div className="flex gap-2">
                <button
                    onClick={() => setMode(mode === 'payment' ? null : 'payment')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                    <PlusCircle className="w-3.5 h-3.5" /> + Payment
                </button>
                <button
                    onClick={() => setMode(mode === 'expense' ? null : 'expense')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-950/70 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-colors cursor-pointer"
                >
                    <MinusCircle className="w-3.5 h-3.5" /> + Expense
                </button>
            </div>
            {mode && (
                <div className="mt-3 flex flex-wrap items-center gap-2 p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/30">
                    <input
                        type="number"
                        placeholder="₹ Amount"
                        className={`${inputCls} !w-32`}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    {mode === 'expense' && (
                        <input
                            placeholder="Expense Item / Equipment"
                            className={`${inputCls} !w-44`}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    )}
                    <input
                        type="date"
                        className={`${inputCls} !w-36`}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <button onClick={save} className={btnCls}>
                        Save {mode === 'payment' ? 'Payment' : 'Expense'}
                    </button>
                    <button
                        onClick={() => setMode(null)}
                        className={btnSecondaryCls}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Money() {
    const s = useStore();
    const today = useToday();
    const paid = s.deals.filter(d => d.type === 'paid');
    const brandName = (d: Deal) => s.brands.find(b => b.id === d.brandId)?.name;
    const totalExpenses = s.expenses.reduce((a, e) => a + e.amount, 0);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Creator CFO & Treasury"
                subtitle="High-ticket revenue realization, net profit margins, and production expense ledger"
            />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard emoji="💰" label="Collected This Month" value={formatINR(cashReceivedInMonth(s.deals, s.payments, today))} hint="Bank credits received" />
                <StatCard emoji="⏳" label="Total Outstanding" value={formatINR(totalOutstanding(s.deals, s.payments))} hint="Awaiting brand clearance" />
                <StatCard emoji="🚨" label="Overdue Balance" value={formatINR(overdueBalance(s.deals, s.payments, today))} hint={overdueBalance(s.deals, s.payments, today) > 0 ? 'Follow-up email advised' : 'All accounts settled'} />
                <StatCard emoji="🧾" label="Total Expenses Logged" value={formatINR(totalExpenses)} hint="Gear, props & editing" />
            </div>

            <section className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Historical Inflow Analytics
                    </h2>
                    <span className="text-xs text-pink-300 font-bold bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/40">
                        6-Month Realized Volume
                    </span>
                </div>
                <p className="text-xs text-purple-300/80 mb-3">Aggregated compensation receipts across anime, gaming & fashion sponsors</p>
                <CashChart deals={s.deals} payments={s.payments} today={today} />
            </section>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-pink-400" />
                    <h2 className="text-sm font-black text-white uppercase tracking-widest font-display">
                        Individual Partnership Ledgers
                    </h2>
                </div>

                {paid.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-10 text-center text-xs text-purple-300 shadow-xl">
                        No paid brand collaborations recorded yet.
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {paid.map(d => {
                            const received = receivedForDeal(d, s.payments);
                            const outstanding = outstandingForDeal(d, s.payments);
                            const profit = dealProfit(d, s.expenses);
                            const isFullyPaid = outstanding === 0;

                            return (
                                <div
                                    key={d.id}
                                    className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl hover:border-pink-500/50 hover:shadow-2xl transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-black text-white tracking-tight font-display">
                                                    {brandName(d)}
                                                </h3>
                                                <p className="text-xs text-purple-300 mt-0.5">{d.title}</p>
                                            </div>
                                            {isFullyPaid ? (
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fully Settled
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                                                    Payment Pending
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs">
                                            <div>
                                                <span className="text-[11px] text-purple-400 block font-medium">Agreed Fee</span>
                                                <span className="font-extrabold text-white">{formatINR(d.agreedFee)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-purple-400 block font-medium">Received</span>
                                                <span className="font-extrabold text-emerald-400">{formatINR(received)}</span>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-purple-400 block font-medium">Remaining</span>
                                                <span className={`font-extrabold ${outstanding > 0 ? 'text-amber-400' : 'text-purple-400'}`}>
                                                    {formatINR(outstanding)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-xs text-purple-300 px-1">
                                            <span>
                                                Net Margin: <strong className="text-pink-300 font-bold">{formatINR(profit)}</strong>
                                            </span>
                                            {d.dueDate && (
                                                <span>Settlement Due: {formatDate(d.dueDate)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <RecordRow deal={d} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}