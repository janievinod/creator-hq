import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { Plus, Sparkles, Filter, CheckCircle2, Tag, ExternalLink, Video, Clock, AlertTriangle, BellRing, Link2, Edit3 } from 'lucide-react';
import type { Deal } from '../types';

export default function Collaborations() {
    const { brands, deals, addDeal, updateDeal, setDealStatus, deleteDeal } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const isOverdueFilter = searchParams.get('filter') === 'overdue';

    const [selectedNiche, setSelectedNiche] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'pipeline' | 'directory'>('pipeline');

    // New Deal Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [dealTitle, setDealTitle] = useState('');
    const [dealType, setDealType] = useState<'paid' | 'barter' | 'hybrid'>('paid');
    const [agreedFee, setAgreedFee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paymentTimeline, setPaymentTimeline] = useState('30-45_biz_days');
    const [notes, setNotes] = useState('');
    const [brandNiche, setBrandNiche] = useState('Beauty');

    // Edit Campaign Modal State
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
    const [editBrandName, setEditBrandName] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editFee, setEditFee] = useState('');
    const [editType, setEditType] = useState<'paid' | 'barter' | 'hybrid'>('paid');
    const [editDueDate, setEditDueDate] = useState('');
    const [editTimeline, setEditTimeline] = useState('30-45_biz_days');
    const [editNotes, setEditNotes] = useState('');
    const [editNiche, setEditNiche] = useState('Beauty');

    // Upload Video Modal State
    const [uploadModalDeal, setUploadModalDeal] = useState<Deal | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [videoBrand, setVideoBrand] = useState('');
    const [videoNiche, setVideoNiche] = useState('Beauty');

    const nicheOptions = ['Beauty', 'Skincare', 'Fashion', 'Lifestyle', 'Education', 'Food', 'Vlog', 'College'];

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
                completedDate: dueDate || new Date().toISOString().split('T')[0],
                paymentTimeline: paymentTimeline || '30-45_biz_days',
                deliverableLinks: [],
                notes: notes || 'Manual entry / Backfilled collaboration',
            },
            brandName,
            brandNiche
        );

        setBrandName('');
        setDealTitle('');
        setAgreedFee('');
        setDueDate('');
        setPaymentTimeline('30-45_biz_days');
        setNotes('');
        setShowAddModal(false);
    };

    const handleOpenEditModal = (deal: Deal) => {
        const brand = brands.find((b) => b.id === deal.brandId);
        setEditingDeal(deal);
        setEditBrandName(brand?.name || '');
        setEditTitle(deal.title);
        setEditFee(deal.agreedFee ? deal.agreedFee.toString() : '0');
        setEditType(deal.type);
        setEditDueDate(deal.completedDate || deal.dueDate || new Date().toISOString().split('T')[0]);
        setEditTimeline(deal.paymentTimeline || '30-45_biz_days');
        setEditNotes(deal.notes || '');
        setEditNiche(brand?.niche || 'Beauty');
    };

    const handleSaveEditDeal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDeal) return;

        updateDeal(
            editingDeal.id,
            {
                title: editTitle,
                agreedFee: editType === 'barter' ? 0 : Number(editFee || 0),
                type: editType,
                dueDate: editDueDate,
                completedDate: editDueDate,
                paymentTimeline: editTimeline,
                notes: editNotes,
            },
            editBrandName,
            editNiche
        );

        setEditingDeal(null);
    };

    const handleOpenUploadModal = (deal: Deal) => {
        const brand = brands.find((b) => b.id === deal.brandId);
        setUploadModalDeal(deal);
        setVideoBrand(brand?.name || deal.title.split(' ')[0] || '');
        setVideoNiche(brand?.niche || 'Beauty');
        setVideoUrl('');
    };

    const handleSaveVideoDeliverable = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadModalDeal || !videoUrl) return;

        const currentLinks = uploadModalDeal.deliverableLinks ? [...uploadModalDeal.deliverableLinks] : [];
        currentLinks.push(videoUrl);

        let nextStatus = uploadModalDeal.status;
        if (nextStatus !== 'paid') {
            nextStatus = 'completed';
        }

        const completedDate = uploadModalDeal.completedDate || new Date().toISOString().split('T')[0];

        updateDeal(
            uploadModalDeal.id,
            {
                deliverableLinks: currentLinks,
                status: nextStatus,
                completedDate: completedDate,
            },
            videoBrand,
            videoNiche
        );

        setUploadModalDeal(null);
        setVideoUrl('');
    };

    const getTimelineNotification = (deal: Deal) => {
        if (deal.status === 'paid' || deal.type === 'barter') return null;

        const baseDateStr = deal.completedDate || deal.dueDate;
        if (!baseDateStr) return null;

        const timelineRaw = deal.paymentTimeline || '30-45_biz_days';
        let calendarDaysToWait = 30;

        if (timelineRaw === '5_days') calendarDaysToWait = 5;
        else if (timelineRaw === '7_days') calendarDaysToWait = 7;
        else if (timelineRaw === '15_days') calendarDaysToWait = 15;
        else if (timelineRaw === '30_days') calendarDaysToWait = 30;
        else if (timelineRaw === '45_days') calendarDaysToWait = 45;
        else if (timelineRaw === '60_days') calendarDaysToWait = 60;
        else if (timelineRaw === '30_biz_days') calendarDaysToWait = 42;
        else if (timelineRaw === '45_biz_days') calendarDaysToWait = 63;
        else if (timelineRaw === '30-45_biz_days') calendarDaysToWait = 50;

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

    const displayDeals = deals.filter((deal) => {
        if (!isOverdueFilter) return true;
        const notif = getTimelineNotification(deal);
        return notif?.type === 'overdue' || notif?.type === 'warning';
    });

    const niches = ['All', 'Beauty', 'Skincare', 'Fashion', 'Lifestyle', 'Education', 'Food', 'Vlog', 'College'];

    const filteredBrands = selectedNiche === 'All'
        ? brands
        : brands.filter((b) => (b.niche || 'Fashion') === selectedNiche);

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-purple-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-widest">Brand Growth & CRM</span>
                    <h1 className="text-3xl font-black text-white">Collaborations & Brand Directory</h1>
                    {isOverdueFilter && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-500/30 flex items-center gap-1">
                                🚨 Filtered: Showing Overdue & Payment Alert Deals Only
                            </span>
                            <button
                                onClick={() => setSearchParams({})}
                                className="text-xs text-purple-300 hover:text-white underline font-bold cursor-pointer"
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setActiveTab('pipeline'); setSearchParams({}); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'pipeline'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                                : 'anime-glass text-purple-300 hover:text-white'
                            }`}
                    >
                        📋 Active Pipeline
                    </button>
                    <button
                        onClick={() => { setActiveTab('directory'); setSearchParams({}); }}
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

            {/* POPUP 1: Edit Campaign Details Modal */}
            {editingDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
                    <div className="anime-glass p-6 rounded-3xl border border-purple-500/40 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-pink-400" /> Edit Campaign Details
                            </h3>
                            <button onClick={() => setEditingDeal(null)} className="text-purple-400 hover:text-white font-bold text-sm">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditDeal} className="space-y-3">
                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={editBrandName}
                                    onChange={(e) => setEditBrandName(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Campaign Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Category / Niche</label>
                                    <select
                                        value={editNiche}
                                        onChange={(e) => setEditNiche(e.target.value)}
                                        className={inputCls}
                                    >
                                        {nicheOptions.map((n) => (
                                            <option key={n} value={n} className="bg-purple-950 text-white">{n}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Deal Type</label>
                                    <select
                                        value={editType}
                                        onChange={(e: any) => setEditType(e.target.value)}
                                        className={inputCls}
                                    >
                                        <option value="paid" className="bg-purple-950 text-white">💰 Paid</option>
                                        <option value="barter" className="bg-purple-950 text-white">🎁 Barter</option>
                                        <option value="hybrid" className="bg-purple-950 text-white">✨ Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Agreed Fee (₹)</label>
                                    <input
                                        type="number"
                                        value={editType === 'barter' ? '' : editFee}
                                        disabled={editType === 'barter'}
                                        onChange={(e) => setEditFee(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Submitted On</label>
                                    <input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Payment Timeline</label>
                                <select
                                    value={editTimeline}
                                    onChange={(e) => setEditTimeline(e.target.value)}
                                    className={inputCls}
                                >
                                    <option value="5_days" className="bg-purple-950 text-white">5 Days Net</option>
                                    <option value="7_days" className="bg-purple-950 text-white">7 Days Net</option>
                                    <option value="15_days" className="bg-purple-950 text-white">15 Days Net</option>
                                    <option value="30-45_biz_days" className="bg-purple-950 text-white">30–45 Business Days</option>
                                    <option value="30_biz_days" className="bg-purple-950 text-white">30 Business Days</option>
                                    <option value="45_biz_days" className="bg-purple-950 text-white">45 Business Days</option>
                                    <option value="30_days" className="bg-purple-950 text-white">30 Days Net</option>
                                    <option value="45_days" className="bg-purple-950 text-white">45 Days Net</option>
                                    <option value="60_days" className="bg-purple-950 text-white">60 Days Net</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Deliverable Notes</label>
                                <textarea
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className={`${inputCls} h-16 resize-none`}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setEditingDeal(null)} className="w-1/2 py-2.5 text-xs font-bold text-purple-300 bg-purple-950/60 rounded-xl hover:bg-purple-900/60">
                                    Cancel
                                </button>
                                <button type="submit" className={`${btnCls} w-1/2`}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* POPUP 2: Upload Video Modal */}
            {uploadModalDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
                    <div className="anime-glass p-6 rounded-3xl border border-pink-500/40 max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <Video className="w-5 h-5 text-pink-400" /> Upload Deliverable Output
                            </h3>
                            <button onClick={() => setUploadModalDeal(null)} className="text-purple-400 hover:text-white font-bold text-sm">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveVideoDeliverable} className="space-y-3">
                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Reel / Video URL Link</label>
                                <div className="relative">
                                    <Link2 className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
                                    <input
                                        type="url"
                                        placeholder="https://www.instagram.com/reel/..."
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        className={`${inputCls} pl-9`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    list="brands-list"
                                    placeholder="e.g. Lakme, Meesho, Chanel"
                                    value={videoBrand}
                                    onChange={(e) => setVideoBrand(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                                <datalist id="brands-list">
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.name} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Category / Niche</label>
                                <select
                                    value={videoNiche}
                                    onChange={(e) => setVideoNiche(e.target.value)}
                                    className={inputCls}
                                >
                                    {nicheOptions.map((n) => (
                                        <option key={n} value={n} className="bg-purple-950 text-white">{n}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setUploadModalDeal(null)}
                                    className="w-1/2 py-2.5 text-xs font-bold text-purple-300 bg-purple-950/60 rounded-xl hover:bg-purple-900/60"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={`${btnCls} w-1/2`}>
                                    Save Video Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* POPUP 3: Add Collaboration Modal */}
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
                                    list="brands-list-modal"
                                    placeholder="e.g. Lakme, Chanel, Bang & Olufsen"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                                <datalist id="brands-list-modal">
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.name} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Campaign Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Plumping Lip Oil - 1 Reel"
                                    value={dealTitle}
                                    onChange={(e) => setDealTitle(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Category / Niche</label>
                                    <select
                                        value={brandNiche}
                                        onChange={(e) => setBrandNiche(e.target.value)}
                                        className={inputCls}
                                    >
                                        {nicheOptions.map((n) => (
                                            <option key={n} value={n} className="bg-purple-950 text-white">{n}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Deal Type</label>
                                    <select
                                        value={dealType}
                                        onChange={(e: any) => setDealType(e.target.value)}
                                        className={inputCls}
                                    >
                                        <option value="paid" className="bg-purple-950 text-white">💰 Paid</option>
                                        <option value="barter" className="bg-purple-950 text-white">🎁 Barter</option>
                                        <option value="hybrid" className="bg-purple-950 text-white">✨ Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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

                                <div>
                                    <label className="text-[10px] text-purple-300 font-bold block mb-1">Submission Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Payment Timeline Terms</label>
                                <select
                                    value={paymentTimeline}
                                    onChange={(e) => setPaymentTimeline(e.target.value)}
                                    className={inputCls}
                                >
                                    <option value="5_days" className="bg-purple-950 text-white">5 Days Net</option>
                                    <option value="7_days" className="bg-purple-950 text-white">7 Days Net</option>
                                    <option value="15_days" className="bg-purple-950 text-white">15 Days Net</option>
                                    <option value="30-45_biz_days" className="bg-purple-950 text-white">30 - 45 Business Days</option>
                                    <option value="30_biz_days" className="bg-purple-950 text-white">30 Business Days</option>
                                    <option value="45_biz_days" className="bg-purple-950 text-white">45 Business Days</option>
                                    <option value="30_days" className="bg-purple-950 text-white">30 Days Net</option>
                                    <option value="45_days" className="bg-purple-950 text-white">45 Days Net</option>
                                    <option value="60_days" className="bg-purple-950 text-white">60 Days Net</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] text-purple-300 font-bold block mb-1">Deliverable Notes</label>
                                <textarea
                                    placeholder="1 IG Reel + 2 Stories"
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

            {/* Active Pipeline Grid */}
            {activeTab === 'pipeline' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayDeals.length === 0 ? (
                            <div className="col-span-2 anime-glass p-8 rounded-2xl text-center text-purple-300">
                                {isOverdueFilter
                                    ? '🎉 Great news! You have no overdue payment invoices right now.'
                                    : 'No active collaborations yet. Click "+ Add / Backfill Deal" to log a deal!'}
                            </div>
                        ) : (
                            displayDeals.map((deal) => {
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
                                                    <p className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                                                        {brand?.name || 'Brand Partner'}
                                                        <span className="text-[9px] bg-purple-900/60 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/20">
                                                            {brand?.niche || 'Beauty'}
                                                        </span>
                                                    </p>
                                                    <h3 className="text-base font-extrabold text-white">{deal.title}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(deal)}
                                                    className="bg-purple-950/80 hover:bg-purple-900 text-purple-300 p-1.5 rounded-lg border border-purple-500/20 cursor-pointer transition-all flex items-center gap-1 text-[11px] font-bold px-2"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                                </button>
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
                                        </div>

                                        <p className="text-xs text-purple-200/80 bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/10">
                                            {deal.notes || 'Standard brand collaboration terms.'}
                                        </p>

                                        {/* Submission Date & Payment Timeline inline controls */}
                                        <div className="grid grid-cols-2 gap-2 bg-purple-950/50 p-2.5 rounded-xl border border-purple-500/15 text-xs">
                                            <div>
                                                <span className="text-[10px] text-purple-300 font-bold block mb-0.5">Submitted On</span>
                                                <input
                                                    type="date"
                                                    value={deal.completedDate || deal.dueDate || ''}
                                                    onChange={(e) => {
                                                        updateDeal(deal.id, { completedDate: e.target.value, dueDate: e.target.value });
                                                    }}
                                                    className={`${inputCls} py-1 text-[11px]`}
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-purple-300 font-bold block mb-0.5">Payment Timeline</span>
                                                <select
                                                    value={deal.paymentTimeline || '30-45_biz_days'}
                                                    onChange={(e) => {
                                                        updateDeal(deal.id, { paymentTimeline: e.target.value });
                                                    }}
                                                    className={`${inputCls} py-1 text-[11px]`}
                                                >
                                                    <option value="5_days" className="bg-purple-950 text-white">5 Days Net</option>
                                                    <option value="7_days" className="bg-purple-950 text-white">7 Days Net</option>
                                                    <option value="15_days" className="bg-purple-950 text-white">15 Days Net</option>
                                                    <option value="30-45_biz_days" className="bg-purple-950 text-white">30–45 Business Days</option>
                                                    <option value="30_biz_days" className="bg-purple-950 text-white">30 Business Days</option>
                                                    <option value="45_biz_days" className="bg-purple-950 text-white">45 Business Days</option>
                                                    <option value="30_days" className="bg-purple-950 text-white">30 Days Net</option>
                                                    <option value="45_days" className="bg-purple-950 text-white">45 Days Net</option>
                                                    <option value="60_days" className="bg-purple-950 text-white">60 Days Net</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Deliverables Video Links */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
                                                    <Video className="w-3.5 h-3.5 text-pink-400" /> Deliverables ({deal.deliverableLinks?.length || 0})
                                                </span>
                                                <button
                                                    onClick={() => handleOpenUploadModal(deal)}
                                                    className="bg-purple-900/80 hover:bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-purple-500/30"
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
                                                    onClick={() => handleOpenUploadModal(deal)}
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

            {/* Directory Tab */}
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
                        {filteredBrands.length === 0 ? (
                            <div className="col-span-3 anime-glass p-8 rounded-2xl text-center text-purple-300">
                                No active brands in this niche yet.
                            </div>
                        ) : (
                            filteredBrands.map((brand) => {
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
                                                {brand.niche || 'Fashion'}
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
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}