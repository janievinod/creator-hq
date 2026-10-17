import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { formatINR } from '../lib/format';
import { btnCls, inputCls } from '../lib/theme';
import { ShoppingBag, CheckCircle2, Clock, Plus, Receipt, Trash2, Edit3, X } from 'lucide-react';
import type { Reimbursement } from '../types';

interface ProductEntry {
    productName: string;
    amountPaid: string;
}

export default function Reimbursements() {
    const { reimbursements, addReimbursement, toggleReimbursement, deleteReimbursement, updateReimbursement, deals, brands } = useStore();

    // Form state
    const [selectedDealId, setSelectedDealId] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [notes, setNotes] = useState('');

    // Dynamic products list
    const [products, setProducts] = useState<ProductEntry[]>([
        { productName: '', amountPaid: '' }
    ]);

    // Edit Modal State
    const [editingItem, setEditingItem] = useState<Reimbursement | null>(null);
    const [editProductName, setEditProductName] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editNotes, setEditNotes] = useState('');

    const activeDeals = deals.filter(d => d.status !== 'completed' && d.status !== 'declined');

    const handleProductChange = (index: number, field: keyof ProductEntry, value: string) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const addProductField = () => {
        setProducts(prev => [...prev, { productName: '', amountPaid: '' }]);
    };

    const removeProductField = (index: number) => {
        if (products.length === 1) return;
        setProducts(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddBatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDealId) return;

        const targetDeal = deals.find(d => d.id === selectedDealId);
        const brandObj = brands.find(b => b.id === targetDeal?.brandId);
        const brandName = brandObj ? brandObj.name : 'Brand Collaboration';

        products.forEach(p => {
            if (p.productName.trim() && Number(p.amountPaid) > 0) {
                addReimbursement({
                    brandName,
                    productName: p.productName.trim(),
                    amountPaid: Number(p.amountPaid),
                    purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
                    notes: notes.trim() || undefined,
                });
            }
        });

        setSelectedDealId('');
        setProducts([{ productName: '', amountPaid: '' }]);
        setPurchaseDate('');
        setNotes('');
    };

    const handleOpenEdit = (item: Reimbursement) => {
        setEditingItem(item);
        setEditProductName(item.productName);
        setEditAmount(item.amountPaid.toString());
        setEditDate(item.purchaseDate);
        setEditNotes(item.notes || '');
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        updateReimbursement(editingItem.id, {
            productName: editProductName,
            amountPaid: Number(editAmount),
            purchaseDate: editDate,
            notes: editNotes || undefined,
        });

        setEditingItem(null);
    };

    const pendingTotal = reimbursements
        .filter(r => !r.reimbursed)
        .reduce((sum, r) => sum + r.amountPaid, 0);

    const reimbursedTotal = reimbursements
        .filter(r => r.reimbursed)
        .reduce((sum, r) => sum + r.amountPaid, 0);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Product Reimbursements"
                subtitle="Select active collaborations and log out-of-pocket product expenses"
            />

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-3xl anime-glass border border-amber-500/30 p-6 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Awaiting Reimbursement</p>
                        <h3 className="text-2xl font-black text-white font-display mt-1">{formatINR(pendingTotal)}</h3>
                    </div>
                    <Clock className="w-8 h-8 text-amber-400 opacity-80" />
                </div>

                <div className="rounded-3xl anime-glass border border-emerald-500/30 p-6 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Recovered Funds</p>
                        <h3 className="text-2xl font-black text-white font-display mt-1">{formatINR(reimbursedTotal)}</h3>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="anime-glass p-6 rounded-3xl border border-purple-500/40 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-pink-400" /> Edit Reimbursement
                            </h3>
                            <button onClick={() => setEditingItem(null)} className="text-purple-400 hover:text-white font-bold text-sm cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3">
                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={editProductName}
                                    onChange={(e) => setEditProductName(e.target.value)}
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
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Purchase Date</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Notes / Info</label>
                                <input
                                    type="text"
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className={inputCls}
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

            {/* Entry Form */}
            <form onSubmit={handleAddBatch} className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-6">
                <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Log Collaboration Expenses
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-purple-300 mb-1.5">Select Active Collaboration</label>
                        <select
                            className={inputCls}
                            value={selectedDealId}
                            onChange={e => setSelectedDealId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Live Collaboration --</option>
                            {activeDeals.map(deal => {
                                const brand = brands.find(b => b.id === deal.brandId);
                                return (
                                    <option key={deal.id} value={deal.id}>
                                        {brand ? brand.name : 'Unknown Brand'} — {deal.title} ({deal.status})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-purple-300 mb-1.5">Purchase Date</label>
                        <input
                            type="date"
                            className={inputCls}
                            value={purchaseDate}
                            onChange={e => setPurchaseDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-purple-300">Products Purchased for this Collab</label>
                        <button
                            type="button"
                            onClick={addProductField}
                            className="text-xs font-extrabold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer bg-pink-500/10 px-3 py-1 rounded-xl border border-pink-500/30 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Another Product
                        </button>
                    </div>

                    {products.map((prod, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                className={`${inputCls} flex-1`}
                                placeholder={`Product ${index + 1} Name (e.g. Lipstick, Serum)`}
                                value={prod.productName}
                                onChange={e => handleProductChange(index, 'productName', e.target.value)}
                                required
                            />
                            <div className="relative w-44 shrink-0">
                                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-pink-400">₹</span>
                                <input
                                    type="number"
                                    className={`${inputCls} pl-7`}
                                    placeholder="Amount"
                                    value={prod.amountPaid}
                                    onChange={e => handleProductChange(index, 'amountPaid', e.target.value)}
                                    required
                                />
                            </div>
                            {products.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProductField(index)}
                                    className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-purple-300 mb-1.5">Optional Notes / Receipt Info</label>
                    <input
                        className={inputCls}
                        placeholder="e.g. Order #, courier tracking, brand manager approval reference..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>

                <button type="submit" className={btnCls}>
                    <Plus className="w-4 h-4" /> Save Reimbursement Items
                </button>
            </form>

            {/* List View with Edit & Delete */}
            <div className="space-y-4">
                {reimbursements.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-12 text-center text-xs text-purple-300 shadow-xl">
                        <ShoppingBag className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                        <p className="font-black text-white text-base font-display">No Product Reimbursements Logged</p>
                        <p className="mt-1">Select an active collaboration above and log products you bought yourself.</p>
                    </div>
                ) : (
                    reimbursements.map(item => (
                        <div
                            key={item.id}
                            className={`rounded-3xl anime-glass border p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 transition-all ${item.reimbursed ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-purple-500/30 hover:border-pink-500/40'
                                }`}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-white text-base font-display">{item.productName}</span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-medium">
                                        {item.brandName}
                                    </span>
                                </div>
                                <p className="text-xs text-purple-300">
                                    Purchased on {item.purchaseDate} {item.notes ? `· ${item.notes}` : ''}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-white font-display">
                                    {formatINR(item.amountPaid)}
                                </span>

                                <button
                                    onClick={() => toggleReimbursement(item.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${item.reimbursed
                                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60'
                                        }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {item.reimbursed ? 'Reimbursed & Added' : 'Mark Reimbursed'}
                                </button>

                                <button
                                    onClick={() => handleOpenEdit(item)}
                                    className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/80 transition-all cursor-pointer"
                                    title="Edit Item"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => deleteReimbursement(item.id)}
                                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                    title="Delete Item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}