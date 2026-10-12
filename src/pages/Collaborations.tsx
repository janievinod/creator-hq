import { useState } from 'react';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { Plus, Sparkles, Filter, CheckCircle2, Calendar, Tag, ExternalLink, Video, Clock, AlertTriangle, BellRing } from 'lucide-react';
import type { Deal } from '../types';

export default function Collaborations() {
    const { brands, deals, addDeal, setDealStatus, deleteDeal } = useStore();

    const [selectedNiche, setSelectedNiche] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'pipeline' | 'directory'>('pipeline');

    // Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [dealTitle, setDealTitle] = useState('');
    const [dealType, setDealType] = useState<'paid' | 'barter' | 'hybrid'>('paid');
    const [agreedFee, setAgreedFee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paymentTimeline, setPaymentTimeline] = useState('30-45_biz_days');
    const [notes, setNotes] = useState('');

    const handleCreateDeal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brandName || !dealTitle) return;

        addDeal(
            {
                title: dealTitle,
                type: dealType,
                status: dealType === 'barter' ? 'completed' : 'in_progress',
                agreedFee: dealType === 'barter' ? 0 : Number(agreedFee || 0),
                dueDate: dueDate || new Date().toISOString().split('T')[0],
                completedDate: new Date().toISOString().split('T')[0],
                paymentTimeline: paymentTimeline || '30-45_biz_days',
                deliverableLinks: [],
                notes: notes || 'Manual entry / Backfilled collaboration',
            },
            brandName
        );

        setBrandName('');
        setDealTitle('');
        setAgreedFee('');
        setDueDate('');
        setPaymentTimeline('30-45_biz_days');
        setNotes('');
        setShowAddModal(false);
    };

    const handleAddDeliverableLink = (deal: Deal) => {
        const link = prompt(`Enter URL for video / Reel #${(deal.deliverableLinks?.length || 0) + 1}:`);
        if (link) {
            if (!deal.deliverableLinks) deal.deliverableLinks = [];
            deal.deliverableLinks.push(link);
            if (deal.status !== 'paid') {
                deal.status = 'completed';
                if (!deal.completedDate) {
                    deal.completedDate = new Date().toISOString().split('T')[0];
                }
            }
            setDealStatus(deal.id, deal.status);
        }
    };

    // Timeline Notification Engine considering Business Days
    const getTimelineNotification = (deal: Deal) => {
        if (deal.status === 'paid' || deal.type === 'barter') return null;

        const baseDateStr = deal.completedDate || deal.dueDate;
        if (!baseDateStr) return null;

        const timelineRaw = deal.paymentTimeline || '30-45_biz_days';
        let calendarDaysToWait = 30;

        if (timelineRaw === '15_days') calendarDaysToWait = 15;
        else if (timelineRaw === '30_days') calendarDaysToWait = 30;
        else if (timelineRaw === '45_days') calendarDaysToWait = 45;
        else if (timelineRaw === '60_days') calendarDaysToWait = 60;
        else if (timelineRaw === '30_biz_days') calendarDaysToWait = 42; // ~30 business days
        else if (timelineRaw === '45_biz_days') calendarDaysToWait = 63; // ~45 business days
        else if (timelineRaw === '30-45_biz_days') calendarDaysToWait = 50; // Average target for 30-45 business days

        const baseDate = new Date(baseDateStr);
        const targetDueDate = new Date(baseDate);
        targetDueDate.setDate(targetDueDate.getDate() + calendarDaysToWait);

        const today = new Date();
        const diffTime = targetDueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const formattedTimelineLabel = timelineRaw.replace(/_/g, ' ');

        if (diffDays <= 7 && diffDays >= 0) {
            return {
                type: 'warning',
                message: `⚡ Payment due in ${diffDays === 0 ? 'today' : `${diffDays} days`} (${formattedTimelineLabel} from submission). Time to connect with Brand POC!`,
            };
        } else if (diffDays < 0) {
            return {
                type: 'overdue',
                message: `🚨 Payment overdue by ${Math.abs(diffDays)} days (${formattedTimelineLabel})! Send follow-up email to Brand POC immediately.`,
            };
        }

        return {
            type: 'info',
            message: `Expected payout date: ~${targetDueDate.toISOString().split('T')[0]} (${formattedTimelineLabel})`,
        };
    };

    const niches = ['All', 'High Fashion', 'Fine Fragrance', 'Beauty & Skincare', 'Tech & Audio', 'Lifestyle'];

    const filteredBrands = selectedNiche === 'All'
        ? brands
        : brands.filter((b) => (b.niche || 'High Fashion') === selectedNiche);

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-purple-100">
            {/* Header */}
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

            {/* Add Deal Modal */}
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
                                    placeholder="e.g. Sublimage Launch - 2 Reels"
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

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Post / Submission Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Payment Timeline Terms</label>
                                    <select
                                        value={paymentTimeline}
                                        onChange={(e) => setPaymentTimeline(e.target.value)}
                                        className={inputCls}
                                    >
                                        <option value="30-45_biz_days" className="bg-purple-950 text-white">30 - 45 Business Days</option>
                                        <option value="30_biz_days" className="bg-purple-950 text-white">30 Business Days</option>
                                        <option value="45_biz_days" className="bg-purple-950 text-white">45 Business Days</option>
                                        <option value="30_days" className="bg-purple-950 text-white">30 Days Net</option>
                                        <option value="45_days" className="bg-purple-950 text-white">45 Days Net</option>
                                        <option value="60_days" className="bg-purple-950 text-white">60 Days Net</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Deliverable Notes</label>
                                <textarea
                                    placeholder="2 IG Reels + 4 Stories"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={`${inputCls} h-16 resize-none`}
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

            {/* Active Pipeline */}
            {activeTab === 'pipeline' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deals.length === 0 ? (
                            <div className="col-span-2 anime-glass p-8 rounded-2xl text-center text-purple-300">
                                No active collaborations yet. Click "+ Add / Backfill Deal" to log a deal!
                            </div>
                        ) : (
                            deals.map((deal) => {
                                const brand = brands.find((b) => b.id === deal.brandId);
                                const fee = deal.agreedFee || 0;
                                const notification = getTimelineNotification(deal);

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
                                                        : deal.status === 'completed'
                                                            ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                                                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                {deal.type === 'barter' ? '🎁 Barter' : `₹${fee.toLocaleString('en-IN')}`}
                                            </span>
                                        </div>

                                        <p className="text-xs text-purple-200/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/10">
                                            {deal.notes || 'Standard brand collaboration terms.'}
                                        </p>

                                        {/* Submission Date & Editable Payment Timeline Bar */}
                                        <div className="grid grid-cols-2 gap-2 bg-purple-950/50 p-2.5 rounded-xl border border-purple-500/15 text-xs">
                                            <div>
                                                <span className="text-[10px] text-purple-300 font-bold block mb-0.5">Submitted On</span>
                                                <input
                                                    type="date"
                                                    value={deal.completedDate || deal.dueDate || ''}
                                                    onChange={(e) => {
                                                        deal.completedDate = e.target.value;
                                                        setDealStatus(deal.id, deal.status);
                                                    }}
                                                    className={`${inputCls} py-1 text-[11px]`}
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-purple-300 font-bold block mb-0.5">Payment Timeline</span>
                                                <select
                                                    value={deal.paymentTimeline || '30-45_biz_days'}
                                                    onChange={(e) => {
                                                        deal.paymentTimeline = e.target.value;
                                                        setDealStatus(deal.id, deal.status);
                                                    }}
                                                    className={`${inputCls} py-1 text-[11px]`}
                                                >
                                                    <option value="30-45_biz_days" className="bg-purple-950 text-white">30–45 Business Days</option>
                                                    <option value="30_biz_days" className="bg-purple-950 text-white">30 Business Days</option>
                                                    <option value="45_biz_days" className="bg-purple-950 text-white">45 Business Days</option>
                                                    <option value="30_days" className="bg-purple-950 text-white">30 Days Net</option>
                                                    <option value="45_days" className="bg-purple-950 text-white">45 Days Net</option>
                                                    <option value="60_days" className="bg-purple-950 text-white">60 Days Net</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Deliverable Video Links Section with (+) Add Button */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                                                    <Video className="w-3.5 h-3.5 text-pink-400" /> Deliverables ({deal.deliverableLinks?.length || 0})
                                                </span>
                                                <button
                                                    onClick={() => handleAddDeliverableLink(deal)}
                                                    className="bg-purple-900/80 hover:bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-purple-500/30"
                                                    title="Add video link"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Link
                                                </button>
                                            </div>

                                            {deal.deliverableLinks && deal.deliverableLinks.length > 0 && (
                                                <div className="flex flex-col gap-1.5">
                                                    {deal.deliverableLinks.map((link, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-pink-950/30 px-3 py-1.5 rounded-xl border border-pink-500/20 text-xs">
                                                            <span className="text-pink-200 font-medium truncate max-w-[200px]">Video #{idx + 1}</span>
                                                            <a
                                                                href={link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-pink-400 hover:underline flex items-center gap-1 font-bold"
                                                            >
                                                                View Link <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Timeline Notification Warning Banner */}
                                        {notification && (
                                            <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-[11px] font-bold ${notification.type === 'overdue'
                                                    ? 'bg-rose-950/80 border-rose-500/40 text-rose-300 animate-pulse'
                                                    : notification.type === 'warning'
                                                        ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                                                        : 'bg-purple-950/40 border-purple-500/20 text-purple-300'
                                                }`}>
                                                {notification.type === 'overdue' ? (
                                                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                                ) : (
                                                    <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                                                )}
                                                <span>{notification.message}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-purple-400" /> Terms: {deal.paymentTimeline?.replace(/_/g, ' ') || '30-45 biz days'}
                                            </span>

                                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                                <button
                                                    onClick={() => handleAddDeliverableLink(deal)}
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${deal.status === 'completed' || deal.status === 'paid'
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                                                        }`}
                                                >
                                                    <Video className="w-3 h-3" />
                                                    {deal.status === 'completed' ? 'Completed ✓' : 'Mark Completed'}
                                                </button>

                                                <button
                                                    onClick={() => setDealStatus(deal.id, deal.status === 'paid' ? 'completed' : 'paid')}
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${deal.status === 'paid'
                                                            ? 'bg-emerald-600 text-white shadow-md'
                                                            : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {deal.status === 'paid' ? 'Paid & Cleared' : 'Mark Paid'}
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

            {/* Brand Directory */}
            {activeTab === 'directory' && (
                <div className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredBrands.map((brand) => {
                            const brandDeals = deals.filter((d) => d.brandId === brand.id);
                            const paidDealsCount = brandDeals.filter((d) => d.type === 'paid').length;
                            const barterDealsCount = brandDeals.filter((d) => d.type === 'barter').length;
                            const totalLTV = brandDeals.reduce((acc, d) => acc + (d.agreedFee || 0), 0);

                            return (
                                <div key={brand.id} className="anime-glass p-5 rounded-2xl border border-purple-500/20 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30">
                                            {brand.name ? brand.name.charAt(0) : 'B'}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-extrabold text-white">{brand.name}</h3>
                                            <p className="text-[10px] text-pink-300 font-medium">{brand.instagram || brand.email || 'Partner'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Tag className="w-3 h-3 text-purple-400" />
                                        <span className="text-[10px] bg-purple-950/80 text-purple-200 px-2.5 py-0.5 rounded-md font-semibold border border-purple-500/20">
                                            {brand.niche || 'High Fashion'}
                                        </span>
                                    </div>

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