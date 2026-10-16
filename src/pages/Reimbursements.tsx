import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { formatINR } from '../lib/format';
import { btnCls, inputCls } from '../lib/theme';
import { ShoppingBag, CheckCircle2, Clock, Plus, Receipt } from 'lucide-react';

export default function Reimbursements() {
    const { reimbursements, addReimbursement, toggleReimbursement } = useStore();
    const [brandName, setBrandName] = useState('');
    const [productName, setProductName] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandName || !productName || !amountPaid) return;

        addReimbursement({
            brandName: brandName.trim(),
            productName: productName.trim(),
            amountPaid: Number(amountPaid) || 0,
            purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
            notes: notes.trim() || undefined,
        });

        setBrandName('');
        setProductName('');
        setAmountPaid('');
        setPurchaseDate('');
        setNotes('');
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
                subtitle="Track out-of-pocket product purchases awaiting brand refunds"
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

            {/* Entry Form */}
            <form onSubmit={handleAdd} className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Log Purchased Product
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                        className={inputCls}
                        placeholder="Brand Name (e.g. Nykaa, ZARA)"
                        value={brandName}
                        onChange={e => setBrandName(e.target.value)}
                        required
                    />
                    <input
                        className={inputCls}
                        placeholder="Product Name / Item"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        className={inputCls}
                        placeholder="Amount Paid (₹)"
                        value={amountPaid}
                        onChange={e => setAmountPaid(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        className={inputCls}
                        value={purchaseDate}
                        onChange={e => setPurchaseDate(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <input
                        className={inputCls}
                        placeholder="Optional notes (e.g. Order #, invoice receipt ref...)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                    <button type="submit" className={`${btnCls} shrink-0`}>
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </form>

            {/* List View */}
            <div className="space-y-4">
                {reimbursements.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-12 text-center text-xs text-purple-300 shadow-xl">
                        <ShoppingBag className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                        <p className="font-black text-white text-base font-display">No Product Reimbursements Logged</p>
                        <p className="mt-1">Add products you bought yourself for campaigns to track brand paybacks.</p>
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

                            <div className="flex items-center gap-6">
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}