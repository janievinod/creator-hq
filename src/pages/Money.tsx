import { useState } from 'react';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { DollarSign, Plus, Trash2, CheckCircle2, Target, CreditCard } from 'lucide-react';

export default function Money() {
    const {
        deals,
        payments,
        expenses,
        goal,
        setGoal,
        addExpense,
        addPayment,
        setDealStatus,
        deleteDeal
    } = useStore();

    // State for adding a new expense
    const [expenseNote, setExpenseNote] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id || '');

    // State for editing goal target
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newTarget, setNewTarget] = useState(goal.revenueTarget || 250000);

    // State for recording payment
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDealId, setPaymentDealId] = useState(deals[0]?.id || '');

    // Calculations derived from store state
    const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalAgreed = deals.reduce((acc, d) => acc + d.agreedFee, 0);
    const outstandingBalance = Math.max(0, totalAgreed - totalCollected);
    const netProfit = totalCollected - totalExpenses;

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseAmount || !expenseNote) return;
        const today = new Date().toISOString().split('T')[0];
        addExpense(selectedDealId || 'general', expenseNote, Number(expenseAmount), today);
        setExpenseNote('');
        setExpenseAmount('');
    };

    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentAmount) return;
        const today = new Date().toISOString().split('T')[0];
        addPayment(paymentDealId, Number(paymentAmount), today);
        setPaymentAmount('');
    };

    const handleSaveGoal = () => {
        setGoal({ revenueTarget: Number(newTarget) });
        setIsEditingGoal(false);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header & Goal Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">CFO & Money Hub</h1>
                    <p className="text-xs text-purple-300">Track revenue, record payments, and manage expenses.</p>
                </div>

                {/* Monthly Target Editor */}
                <div className="anime-glass p-4 rounded-2xl border border-purple-500/30 flex items-center gap-4">
                    <Target className="w-6 h-6 text-pink-400" />
                    <div>
                        <p className="text-[10px] uppercase font-bold text-pink-300">Monthly Target</p>
                        {isEditingGoal ? (
                            <div className="flex gap-2 items-center mt-1">
                                <input
                                    type="number"
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(Number(e.target.value))}
                                    className={`${inputCls} w-28 py-1`}
                                />
                                <button onClick={handleSaveGoal} className={btnCls}>Save</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-black text-white">₹{goal.revenueTarget.toLocaleString('en-IN')}</p>
                                <button
                                    onClick={() => setIsEditingGoal(true)}
                                    className="text-[10px] text-pink-400 underline font-semibold cursor-pointer"
                                >
                                    Edit Goal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Financial Summary Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Collected This Month</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-300/80 mt-1">✨ Real Bank Credits</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Total Outstanding</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">₹{outstandingBalance.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-amber-300/80 mt-1">⏳ Agreed deal fees pending</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Expenses Logged</p>
                    <p className="text-2xl font-black text-rose-400 mt-1">₹{totalExpenses.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-rose-300/80 mt-1">🧾 Gear, props & editing</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Net Profit Realized</p>
                    <p className="text-2xl font-black text-pink-400 mt-1">₹{netProfit.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-pink-300/80 mt-1">💎 Take home income</p>
                </div>
            </div>

            {/* Interactive Forms Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Form 1: Log Brand Payment Received */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/30">
                    <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-400" /> Record Payment Received
                    </h3>
                    <form onSubmit={handleRecordPayment} className="space-y-3">
                        <div>
                            <label className="text-[10px] text-purple-300 font-bold block mb-1">Select Active Deal</label>
                            <select
                                value={paymentDealId}
                                onChange={(e) => setPaymentDealId(e.target.value)}
                                className={inputCls}
                            >
                                {deals.map((d) => (
                                    <option key={d.id} value={d.id} className="bg-purple-950 text-white">
                                        {d.title} (₹{d.agreedFee.toLocaleString('en-IN')})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-purple-300 font-bold block mb-1">Amount Received (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 37500"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <button type="submit" className={`${btnCls} w-full flex items-center justify-center gap-2`}>
                            <Plus className="w-4 h-4" /> Add Payment Credit
                        </button>
                    </form>
                </div>

                {/* Form 2: Log Production Expense */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/30">
                    <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-rose-400" /> Log Production Expense
                    </h3>
                    <form onSubmit={handleAddExpense} className="space-y-3">
                        <div>
                            <label className="text-[10px] text-purple-300 font-bold block mb-1">Expense Description / Note</label>
                            <input
                                type="text"
                                placeholder="e.g. Ring light, props, vintage crystal"
                                value={expenseNote}
                                onChange={(e) => setExpenseNote(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-purple-300 font-bold block mb-1">Amount Spent (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 4800"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <button type="submit" className={`${btnCls} w-full flex items-center justify-center gap-2`}>
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </form>
                </div>

            </div>

            {/* Ledgers Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Payments History Ledger */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-sm font-extrabold text-white mb-3">Received Payments Ledger</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {payments.length === 0 ? (
                            <p className="text-xs text-purple-400">No payments logged yet.</p>
                        ) : (
                            payments.map((p) => {
                                const deal = deals.find((d) => d.id === p.dealId);
                                return (
                                    <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-purple-950/40 border border-purple-500/20">
                                        <div>
                                            <p className="text-xs font-bold text-white">{deal?.title || 'Brand Payment'}</p>
                                            <p className="text-[10px] text-pink-300">{p.date}</p>
                                        </div>
                                        <span className="text-xs font-black text-emerald-400">+₹{p.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Expense History Ledger */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-sm font-extrabold text-white mb-3">Recorded Expense Ledger</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {expenses.length === 0 ? (
                            <p className="text-xs text-purple-400">No expenses logged yet.</p>
                        ) : (
                            expenses.map((e) => (
                                <div key={e.id} className="flex justify-between items-center p-3 rounded-xl bg-purple-950/40 border border-purple-500/20">
                                    <div>
                                        <p className="text-xs font-bold text-white">{e.note}</p>
                                        <p className="text-[10px] text-pink-300">{e.date}</p>
                                    </div>
                                    <span className="text-xs font-black text-rose-400">-₹{e.amount.toLocaleString('en-IN')}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Active Deals Quick Status Manager */}
            <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                <h3 className="text-sm font-extrabold text-white mb-3">Manage Brand Deals & Statuses</h3>
                <div className="space-y-3">
                    {deals.map((deal) => (
                        <div key={deal.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 gap-3">
                            <div>
                                <p className="text-xs font-bold text-white">{deal.title}</p>
                                <p className="text-[10px] text-pink-300">Fee: ₹{deal.agreedFee.toLocaleString('en-IN')} | Due: {deal.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDealStatus(deal.id, deal.status === 'paid' ? 'confirmed' : 'paid')}
                                    className={`text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${deal.status === 'paid'
                                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                            : 'bg-purple-900/60 text-purple-200 border border-purple-500/30'
                                        }`}
                                >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {deal.status === 'paid' ? 'Paid' : 'Mark as Paid'}
                                </button>
                                <button
                                    onClick={() => deleteDeal(deal.id)}
                                    className="p-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                    title="Delete Deal"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}