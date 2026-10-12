import { useState } from 'react';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { Plus, Sparkles, Filter, CheckCircle2, Calendar, Tag } from 'lucide-react';

export default function Collaborations() {
    const { brands, deals, addDeal, setDealStatus, deleteDeal } = useStore();

    // Filter state for Brand Directory
    const [selectedNiche, setSelectedNiche] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'pipeline' | 'directory'>('pipeline');

    // New Deal / Backfill Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [dealTitle, setDealTitle] = useState('');
    const [dealType, setDealType] = useState<'paid' | 'barter' | 'hybrid'>('paid');
    const [agreedFee, setAgreedFee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleCreateDeal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandName || !dealTitle) return;

        addDeal(
            {
                title: dealTitle,
                type: dealType,
                status: dealType === 'barter' ? 'confirmed' : 'in_progress',
                agreedFee: dealType === 'barter' ? 0 : Number(agreedFee || 0),
                dueDate: dueDate || new Date().toISOString().split('T')[0],
                notes: notes || 'Manual entry / Backfilled collaboration',
            },
            brandName
        );

        // Reset Form
        setBrandName('');
        setDealTitle('');
        setAgreedFee('');
        setDueDate('');
        setNotes('');
        setShowAddModal(false);
    };

    const niches = ['All', 'High Fashion', 'Fine Fragrance', 'Beauty & Skincare', 'Tech & Audio', 'Lifestyle'];

    const filteredBrands = selectedNiche === 'All'
        ? brands
        : brands.filter((b) => (b.niche || 'High Fashion') === selectedNiche);

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-purple-100">
            {/* Top Header & Navigation Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-widest">Brand Growth & CRM</span>
                    <h1 className="text-3xl font-black text-white">Collaborations & Brand Directory</h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('pipeline')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'pipeline'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                            : 'anime-glass text-purple-300 hover:text-white'
                            }`}
                    >
                        📋 Active Pipeline
                    </button>
                    <button
                        onClick={() => setActiveTab('directory')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'directory'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                            : 'anime-glass text-purple-300 hover:text-white'
                            }`}
                    >
                        🏢 Brand Directory & LTV
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`${btnCls} text-xs flex items-center gap-1.5`}
                    >
                        <Plus className="w-4 h-4" /> Add / Backfill Deal
                    </button>
                </div>
            </div>

            {/* Backfill / Add Deal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="anime-glass p-6 rounded-3xl border border-purple-500/30 max-w-md w-full space-y-4">
                        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-pink-400" /> Log Collaboration
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-purple-400 hover:text-white text-sm font-bold">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateDeal} className="space-y-3">
                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chanel Beauty, Bang & Olufsen"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Campaign Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sublimage Launch Reel"
                                    value={dealTitle}
                                    onChange={(e) => setDealTitle(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Deal Type</label>
                                    <select
                                        value={dealType}
                                        onChange={(e: any) => setDealType(e.target.value)}
                                        className={inputCls}
                                    >
                                        <option value="paid" className="bg-purple-950 text-white">💰 Paid Campaign</option>
                                        <option value="barter" className="bg-purple-950 text-white">🎁 Barter / Gifted</option>
                                        <option value="hybrid" className="bg-purple-950 text-white">✨ Hybrid (Fee + Product)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Fee (₹)</label>
                                    <input
                                        type="number"
                                        placeholder={dealType === 'barter' ? '0 (Barter)' : '75000'}
                                        disabled={dealType === 'barter'}
                                        value={dealType === 'barter' ? '' : agreedFee}
                                        onChange={(e) => setAgreedFee(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Date / Target Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className={inputCls}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Deliverable Notes</label>
                                <textarea
                                    placeholder="1 IG Reel + 2 Stories, 4K aesthetic shot"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={`${inputCls} h-20 resize-none`}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="w-1/2 py-2 text-xs font-bold text-purple-300 bg-purple-950/60 rounded-xl hover:bg-purple-900/60">
                                    Cancel
                                </button>
                                <button type="submit" className={`${btnCls} w-1/2`}>
                                    Save Collaboration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 1: ACTIVE PIPELINE */}
            {activeTab === 'pipeline' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deals.length === 0 ? (
                            <div className="col-span-2 anime-glass p-8 rounded-2xl text-center text-purple-300">
                                No active collaborations yet. Click "+ Add / Backfill Deal" to add your first campaign!
                            </div>
                        ) : (
                            deals.map((deal) => {
                                const brand = brands.find((b) => b.id === deal.brandId);
                                return (
                                    <div key={deal.id} className="anime-glass p-5 rounded-2xl border border-purple-500/20 space-y-3 relative overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-pink-600 flex items-center justify-center font-black text-white text-base shadow-md">
                                                    {brand?.name ? brand.name.charAt(0) : 'B'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-pink-300">{brand?.name || 'Brand Partner'}</p>
                                                    <h3 className="text-base font-extrabold text-white">{deal.title}</h3>
                                                </div>
                                            </div>

                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${deal.type === 'barter'
                                                ? 'bg-purple-900/80 text-purple-300 border border-purple-500/30'
                                                : deal.status === 'paid'
                                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                                    : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                {deal.type === 'barter' ? '🎁 Barter' : `₹${deal.agreedFee.toLocaleString('en-IN')}`}
                                            </span>
                                        </div>

                                        <p className="text-xs text-purple-200/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/10">
                                            {deal.notes || 'Standard brand collaboration terms.'}
                                        </p>

                                        <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-pink-400" /> Due: {deal.dueDate}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setDealStatus(deal.id, deal.status === 'paid' ? 'confirmed' : 'paid')}
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${deal.status === 'paid'
                                                        ? 'bg-emerald-600 text-white shadow-md'
                                                        : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {deal.status === 'paid' ? 'Paid & Completed' : 'Mark Paid'}
                                                </button>
                                                <button
                                                    onClick={() => deleteDeal(deal.id)}
                                                    className="text-rose-400 hover:text-rose-300 text-xs font-bold px-1.5 py-1"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: BRAND DIRECTORY & LTV ANALYTICS */}
            {activeTab === 'directory' && (
                <div className="space-y-6">
                    {/* Niche Filter Bar */}
                    <div className="anime-glass p-3 rounded-2xl border border-purple-500/20 flex items-center gap-2 overflow-x-auto">
                        <Filter className="w-4 h-4 text-pink-400 ml-2" />
                        <span className="text-xs font-bold text-purple-300 mr-2">Filter Niche:</span>
                        {niches.map((niche) => (
                            <button
                                key={niche}
                                onClick={() => setSelectedNiche(niche)}
                                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${selectedNiche === niche
                                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                                    : 'bg-purple-950/50 text-purple-300 hover:text-white'
                                    }`}
                            >
                                {niche}
                            </button>
                        ))}
                    </div>

                    {/* Brands Directory Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredBrands.map((brand) => {
                            const brandDeals = deals.filter((d) => d.brandId === brand.id);
                            const paidDealsCount = brandDeals.filter((d) => d.type === 'paid').length;
                            const barterDealsCount = brandDeals.filter((d) => d.type === 'barter').length;
                            const totalLTV = brandDeals.reduce((acc, d) => acc + d.agreedFee, 0);

                            return (
                                <div key={brand.id} className="anime-glass p-5 rounded-2xl border border-purple-500/20 space-y-4">
                                    {/* Brand Header & Logo */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30">
                                            {brand.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-white">{brand.name}</h3>
                                            <p className="text-[10px] text-pink-300 font-medium">{brand.instagram || brand.email || 'Partner'}</p>
                                        </div>
                                    </div>

                                    {/* Niche Badge */}
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3 h-3 text-purple-400" />
                                        <span className="text-[10px] bg-purple-950/80 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-500/20">
                                            {brand.niche || 'High Fashion'}
                                        </span>
                                    </div>

                                    {/* Collaboration Stats */}
                                    <div className="grid grid-cols-2 gap-2 bg-purple-950/40 p-3 rounded-xl border border-purple-500/10 text-center">
                                        <div>
                                            <p className="text-[10px] text-purple-300 font-bold uppercase">Total Collabs</p>
                                            <p className="text-base font-black text-white">{brandDeals.length} Deals</p>
                                            <p className="text-[9px] text-purple-300">{paidDealsCount} Paid | {barterDealsCount} Barter</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-purple-300 font-bold uppercase">Lifetime Value</p>
                                            <p className="text-base font-black text-emerald-400">₹{totalLTV.toLocaleString('en-IN')}</p>
                                            <p className="text-[9px] text-emerald-300/80">Accumulated Earnings</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}