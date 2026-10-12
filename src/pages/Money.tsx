import { useState } from 'react';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { Wallet, CheckCircle2, Plus, DollarSign, Target } from 'lucide-react';

export default function Money() {
    const { deals, payments, expenses, startingBankBalance, setStartingBankBalance, goal, setGoal, setDealStatus, addPayment, addExpense } = useStore();

    // Local state for editing initial balance & targets
    const [editingBalance, setEditingBalance] = useState(false);
    const [tempBankBalance, setTempBankBalance] = useState(startingBankBalance || 0);

    const [editingGoal, setEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState(goal?.revenueTarget || 0);

    const [expenseNote, setExpenseNote] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDealId, setPaymentDealId] = useState('');

    // Pure dynamic calculations starting from 0
    const totalCollected = payments ? payments.reduce((acc, p) => acc + (p.amount || 0), 0) : 0;
    const totalExpenses = expenses ? expenses.reduce((acc, e) => acc + (e.amount || 0), 0) : 0;

    const pendingPaymentDeals = deals ? deals.filter(d => d.status !== 'paid' && d.type === 'paid') : [];
    const totalOutstanding = pendingPaymentDeals.reduce((acc, d) => acc + (d.agreedFee || 0), 0);
    const netRealizedRevenue = totalCollected - totalExpenses;
    const currentTotalLiquid = (startingBankBalance || 0) + netRealizedRevenue;

    const handleSaveBalance = () => {
        setStartingBankBalance(Number(tempBankBalance));
        setEditingBalance(false);
    };

    const handleSaveGoal = () => {
        setGoal({ revenueTarget: Number(tempGoal) });
        setEditingGoal(false);
    };

    const handleLogExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseNote || !expenseAmount) return;
        addExpense('gen', expenseNote, Number(expenseAmount), new Date().toISOString().split('T')[0]);
        setExpenseNote('');
        setExpenseAmount('');
    };

    const handleMarkAsPaid = (dealId: string, fee: number) => {
        setDealStatus(dealId, 'paid');
        addPayment(dealId, fee, new Date().toISOString().split('T')[0]);
    };

    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentAmount || !paymentDealId) return;
        addPayment(paymentDealId, Number(paymentAmount), new Date().toISOString().split('T')[0]);
        setPaymentAmount('');
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-purple-100">
            {/* Treasury Header & Balance / Goal Controls */}
            <div className="anime-glass p-5 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-widest">Treasury Management</span>
                    <h1 className="text-3xl font-black text-white">Creator CFO & Treasury</h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Bank Balance Control */}
                    <div className="flex items-center gap-3 bg-purple-950/60 p-3 rounded-xl border border-purple-500/30">
                        <Wallet className="w-5 h-5 text-emerald-400" />
                        <div>
                            <p className="text-[10px] font-bold text-purple-300 uppercase">Starting Bank Balance</p>
                            {editingBalance ? (
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="number"
                                        value={tempBankBalance}
                                        onChange={(e) => setTempBankBalance(Number(e.target.value))}
                                        className={`${inputCls} w-24 py-1 text-xs`}
                                        placeholder="0"
                                    />
                                    <button onClick={handleSaveBalance} className={btnCls}>Save</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-black text-white">₹{(startingBankBalance || 0).toLocaleString('en-IN')}</p>
                                    <button onClick={() => setEditingBalance(true)} className="text-[10px] text-pink-400 underline font-bold cursor-pointer">
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Target Revenue Control */}
                    <div className="flex items-center gap-3 bg-purple-950/60 p-3 rounded-xl border border-purple-500/30">
                        <Target className="w-5 h-5 text-pink-400" />
                        <div>
                            <p className="text-[10px] font-bold text-purple-300 uppercase">Monthly Goal Target</p>
                            {editingGoal ? (
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="number"
                                        value={tempGoal}
                                        onChange={(e) => setTempGoal(Number(e.target.value))}
                                        className={`${inputCls} w-24 py-1 text-xs`}
                                        placeholder="0"
                                    />
                                    <button onClick={handleSaveGoal} className={btnCls}>Save</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-black text-white">₹{(goal?.revenueTarget || 0).toLocaleString('en-IN')}</p>
                                    <button onClick={() => setEditingGoal(true)} className="text-[10px] text-pink-400 underline font-bold cursor-pointer">
                                        Set Goal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Realtime Metrics Cards (Default ₹0) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Total Liquid Balance</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">₹{currentTotalLiquid.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-300/80 mt-1">✨ Bank + Collected Earnings</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Collected This Month</p>
                    <p className="text-2xl font-black text-pink-400 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-pink-300/80 mt-1">✨ Cleared Brand Payments</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Total Outstanding</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-amber-300/80 mt-1">⏳ Pending Brand Clearance</p>
                </div>

                <div className="anime-glass p-4 rounded-2xl border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase">Expenses Logged</p>
                    <p className="text-2xl font-black text-rose-400 mt-1">₹{totalExpenses.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-rose-300/80 mt-1">🧾 Production & Props</p>
                </div>
            </div>

            {/* Payment and Expense Input Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Record Payment Form */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" /> Record Brand Payment
                    </h3>
                    <form onSubmit={handleRecordPayment} className="space-y-3">
                        <select
                            value={paymentDealId}
                            onChange={(e) => setPaymentDealId(e.target.value)}
                            className={inputCls}
                        >
                            <option value="">Select active brand collaboration</option>
                            {deals && deals.map((d) => (
                                <option key={d.id} value={d.id} className="bg-purple-950 text-white">
                                    {d.title} (₹{d.agreedFee})
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Amount Received (₹)"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className={inputCls}
                        />
                        <button type="submit" className={`${btnCls} w-full flex items-center justify-center gap-1`}>
                            <Plus className="w-4 h-4" /> Add Payment Credit
                        </button>
                    </form>
                </div>

                {/* Log Expense Form */}
                <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-rose-400" /> Log Production Expense
                    </h3>
                    <form onSubmit={handleLogExpense} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Description (e.g. Vintage props, ring light)"
                            value={expenseNote}
                            onChange={(e) => setExpenseNote(e.target.value)}
                            className={inputCls}
                        />
                        <input
                            type="number"
                            placeholder="Amount Spent (₹)"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            className={inputCls}
                        />
                        <button type="submit" className={`${btnCls} w-full flex items-center justify-center gap-1`}>
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </form>
                </div>
            </div>

            {/* Active Deals Awaiting Payment Clearance */}
            <div className="anime-glass p-5 rounded-2xl border border-purple-500/20">
                <h3 className="text-sm font-extrabold text-white mb-3">Campaign Clearance Pipeline</h3>
                <div className="space-y-3">
                    {pendingPaymentDeals.length === 0 ? (
                        <p className="text-xs text-purple-400">No pending campaigns. Add collaborations in the Collaborations tab to track payments!</p>
                    ) : (
                        pendingPaymentDeals.map((deal) => (
                            <div key={deal.id} className="flex justify-between items-center p-3 rounded-xl bg-purple-950/40 border border-purple-500/20">
                                <div>
                                    <p className="text-xs font-bold text-white">{deal.title}</p>
                                    <p className="text-[10px] text-amber-300">Awaiting clearance: ₹{(deal.agreedFee || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <button
                                    onClick={() => handleMarkAsPaid(deal.id, deal.agreedFee)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-lg"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}