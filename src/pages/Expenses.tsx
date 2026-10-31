import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { formatINR } from '../lib/format';
import { btnCls, inputCls } from '../lib/theme';
import { Receipt, Plus, Trash2, Edit3, X, Briefcase, User } from 'lucide-react';
import { cashReceivedInMonth } from '../lib/finance';
import type { Expense } from '../types';

export default function Expenses() {
    const { expenses, deals, payments, addExpense, deleteExpense, updateExpense } = useStore();

    // Form state
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<'studio' | 'personal'>('studio');
    const [selectedDealId, setSelectedDealId] = useState('');

    // Edit Modal State
    const [editingItem, setEditingItem] = useState<Expense | null>(null);
    const [editNote, setEditNote] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editCategory, setEditCategory] = useState<'studio' | 'personal'>('studio');

    const collectedThisMonth = cashReceivedInMonth(deals, payments);

    const studioTotal = expenses
        .filter(e => e.category === 'studio' || !e.category)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const personalTotal = expenses
        .filter(e => e.category === 'personal')
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const totalExpensesSum = studioTotal + personalTotal;
    const netProfitThisMonth = collectedThisMonth - totalExpensesSum;

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim() || Number(amount) <= 0) return;

        addExpense(selectedDealId || 'general', note.trim(), Number(amount), date, category);

        setNote('');
        setAmount('');
        setSelectedDealId('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleOpenEdit = (item: Expense) => {
        setEditingItem(item);
        setEditNote(item.note || item.title || '');
        setEditAmount(item.amount.toString());
        setEditDate(item.date || '');
        setEditCategory(item.category || 'studio');
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        updateExpense(editingItem.id, {
            note: editNote,
            title: editNote,
            amount: Number(editAmount),
            date: editDate,
            category: editCategory,
        });

        setEditingItem(null);
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Studio & Personal Expenses"
                subtitle="Track business investments and personal spending to monitor your net earnings"
            />

            {/* Financial Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-3xl anime-glass border border-emerald-500/30 p-5 shadow-xl">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Gross Revenue</p>
                    <h3 className="text-xl font-black text-white font-display mt-1">{formatINR(collectedThisMonth)}</h3>
                </div>

                <div className="rounded-3xl anime-glass border border-blue-500/30 p-5 shadow-xl">
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Studio Expenses</p>
                    <h3 className="text-xl font-black text-blue-400 font-display mt-1">-{formatINR(studioTotal)}</h3>
                </div>

                <div className="rounded-3xl anime-glass border border-pink-500/30 p-5 shadow-xl">
                    <p className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Personal Expenses</p>
                    <h3 className="text-xl font-black text-pink-400 font-display mt-1">-{formatINR(personalTotal)}</h3>
                </div>

                <div className="rounded-3xl anime-glass border border-purple-500/40 p-5 shadow-xl">
                    <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Net Cash Left</p>
                    <h3 className="text-xl font-black text-white font-display mt-1">{formatINR(netProfitThisMonth)}</h3>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="anime-glass p-6 rounded-3xl border border-purple-500/40 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-pink-400" /> Edit Expense
                            </h3>
                            <button onClick={() => setEditingItem(null)} className="text-purple-400 hover:text-white font-bold text-sm cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3">
                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditCategory('studio')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${editCategory === 'studio' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-purple-950/40 text-purple-400 border border-purple-500/20'
                                            }`}
                                    >
                                        <Briefcase className="w-3.5 h-3.5" /> Studio
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditCategory('personal')}
                                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${editCategory === 'personal' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'bg-purple-950/40 text-purple-400 border border-purple-500/20'
                                            }`}
                                    >
                                        <User className="w-3.5 h-3.5" /> Personal
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Description</label>
                                <input
                                    type="text"
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-pink-400">₹</span>
                                    <input
                                        type="number"
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(e.target.value)}
                                        className={`${inputCls} pl-7`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Date</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setEditingItem(null)} className="w-1/2 py-2.5 text-xs font-bold text-purple-300 bg-purple-950/60 rounded-xl hover:bg-purple-900/60 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" className={`${btnCls} w-1/2 cursor-pointer`}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Expense Logging Form */}
            <form onSubmit={handleAddExpense} className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-4 h-4 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Log New Expense
                    </h2>
                </div>

                {/* Category Selector Tabs */}
                <div>
                    <label className="block text-xs font-bold text-purple-300 mb-1.5">Expense Classification</label>
                    <div className="flex gap-3 max-w-xs">
                        <button
                            type="button"
                            onClick={() => setCategory('studio')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${category === 'studio' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg' : 'bg-purple-950/40 text-purple-400 border border-purple-500/20'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" /> Studio
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategory('personal')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${category === 'personal' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-lg' : 'bg-purple-950/40 text-purple-400 border border-purple-500/20'
                                }`}
                        >
                            <User className="w-4 h-4" /> Personal
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-purple-300 mb-1">Expense Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Ring light upgrade, Coffee, Outfit, Subscription"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-300 mb-1">Amount Spent (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-pink-400">₹</span>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`${inputCls} pl-7`}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-purple-300 mb-1">Expense Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={inputCls}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-300 mb-1">Link to Deal (Optional)</label>
                        <select
                            value={selectedDealId}
                            onChange={(e) => setSelectedDealId(e.target.value)}
                            className={inputCls}
                        >
                            <option value="">General Expense</option>
                            {deals.map(d => (
                                <option key={d.id} value={d.id}>{d.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className={btnCls}>
                    <Plus className="w-4 h-4" /> Save Expense
                </button>
            </form>

            {/* Expenses List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-purple-200">Expense History</h3>
                {expenses.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-8 text-center text-xs text-purple-300 shadow-xl">
                        No expenses logged yet. Add your studio or personal expenses above.
                    </div>
                ) : (
                    expenses.map(item => {
                        const isPersonal = item.category === 'personal';
                        return (
                            <div key={item.id} className="rounded-2xl anime-glass border border-purple-500/30 p-4 shadow-lg flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${isPersonal ? 'bg-pink-950/80 text-pink-300 border border-pink-500/30' : 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                                            }`}>
                                            {isPersonal ? <User className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                            {isPersonal ? 'Personal' : 'Studio'}
                                        </span>
                                        <h4 className="font-bold text-white text-sm">{item.note || item.title}</h4>
                                    </div>
                                    <p className="text-xs text-purple-300">{item.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-red-400 text-base font-display">
                                        - {formatINR(item.amount)}
                                    </span>

                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/80 transition-all cursor-pointer"
                                        title="Edit Expense"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => deleteExpense(item.id)}
                                        className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                        title="Delete Expense"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
