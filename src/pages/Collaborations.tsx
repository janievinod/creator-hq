import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import { Plus, Sparkles, Filter, CheckCircle2, Tag, ExternalLink, Video, Clock, AlertTriangle, BellRing, Link2, Edit3, Trash2 } from 'lucide-react';
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
        setEditType(deal.type || 'paid');
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

            {/* MAIN CONTENT AREA */}
            {activeTab === 'pipeline' ? (
                <div className="space-y-4">
                    {displayDeals.length === 0 ? (
                        <div className="anime-glass p-12 text-center rounded-3xl border border-purple-500/30">
                            <p className="text-purple-300 font-bold">No collaborations found in this view.</p>
                        </div>
                    ) : (
                        displayDeals.map((deal) => {
                            const brand = brands.find((b) => b.id === deal.brandId);
                            const timelineNotif = getTimelineNotification(deal);

                            return (
                                <div key={deal.id} className="anime-glass p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-xl hover:border-pink-500/40 transition-all">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                                    {brand ? brand.name : 'Brand'}
                                                </span>
                                                <span className="text-xs text-purple-300 font-semibold">• {deal.type?.toUpperCase()}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-white">{deal.title}</h3>
                                            <p className="text-xs text-purple-300">{deal.notes}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">Agreed Payout</p>
                                                <p className="text-xl font-black text-white">₹{(deal.agreedFee || deal.payout || 0).toLocaleString('en-IN')}</p>
                                            </div>

                                            {/* Status Dropdown / Marker */}
                                            <select
                                                value={deal.status}
                                                onChange={(e) => setDealStatus(deal.id, e.target.value as any)}
                                                className={`text-xs font-bold px-3 py-2 rounded-xl border outline-none cursor-pointer ${deal.status === 'paid'
                                                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                                        : deal.status === 'completed'
                                                            ? 'bg-purple-900/60 text-purple-200 border-purple-500/40'
                                                            : 'bg-pink-950/80 text-pink-300 border-pink-500/40'
                                                    }`}
                                            >
                                                <option value="lead" className="bg-purple-950 text-white">Lead</option>
                                                <option value="negotiation" className="bg-purple-950 text-white">Negotiation</option>
                                                <option value="confirmed" className="bg-purple-950 text-white">Confirmed</option>
                                                <option value="in_progress" className="bg-purple-950 text-white">In Progress</option>
                                                <option value="posted" className="bg-purple-950 text-white">Posted</option>
                                                <option value="completed" className="bg-purple-950 text-white">Completed</option>
                                                <option value="paid" className="bg-emerald-950 text-emerald-300">💰 PAID</option>
                                                <option value="declined" className="bg-purple-950 text-white">Declined</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Timeline Notification Banner */}
                                    {timelineNotif && (
                                        <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${timelineNotif.type === 'overdue'
                                                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                                : timelineNotif.type === 'warning'
                                                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                                    : 'bg-purple-950/40 border-purple-500/20 text-purple-300'
                                            }`}>
                                            {timelineNotif.type === 'overdue' ? <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> : <Clock className="w-4 h-4 text-amber-400 shrink-0" />}
                                            <span>{timelineNotif.message}</span>
                                        </div>
                                    )}

                                    {/* Footer Actions & Deliverable Links */}
                                    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-purple-500/20">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenUploadModal(deal)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Video className="w-3.5 h-3.5" /> Upload Video Reel
                                            </button>

                                            {deal.deliverableLinks && deal.deliverableLinks.map((link, idx) => (
                                                <a
                                                    key={idx}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-900/50 text-purple-200 border border-purple-500/30 flex items-center gap-1 hover:text-white"
                                                >
                                                    <ExternalLink className="w-3 h-3 text-pink-400" /> Link #{idx + 1}
                                                </a>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(deal)}
                                                className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/50 transition-all cursor-pointer"
                                                title="Edit Campaign"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteDeal(deal.id)}
                                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-all cursor-pointer"
                                                title="Delete Deal"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                /* Directory Tab */
                <div className="space-y-6">
                    {/* Niche Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {niches.map((n) => (
                            <button
                                key={n}
                                onClick={() => setSelectedNiche(n)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedNiche === n
                                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                                        : 'anime-glass text-purple-300 hover:text-white'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBrands.map((brand) => {
                            const brandDeals = deals.filter((d) => d.brandId === brand.id);
                            const totalLtv = brandDeals.reduce((sum, d) => sum + (d.agreedFee || d.payout || 0), 0);

                            return (
                                <div key={brand.id} className="anime-glass p-6 rounded-3xl border border-purple-500/30 space-y-4 shadow-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">{brand.niche || brand.category}</span>
                                            <h3 className="text-xl font-black text-white">{brand.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-purple-400">Lifetime Value</p>
                                            <p className="text-lg font-black text-emerald-400">₹{totalLtv.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-purple-500/20">
                                        <p className="text-xs font-bold text-purple-300">Campaigns ({brandDeals.length}):</p>
                                        {brandDeals.length === 0 ? (
                                            <p className="text-xs text-purple-400 italic">No campaigns logged yet.</p>
                                        ) : (
                                            brandDeals.map((d) => (
                                                <div key={d.id} className="text-xs bg-purple-950/60 p-2.5 rounded-xl flex justify-between items-center border border-purple-500/20">
                                                    <span className="font-bold text-white truncate max-w-[160px]">{d.title}</span>
                                                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${d.status === 'paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-pink-950 text-pink-300'}`}>
                                                        {d.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            ))
                                        )}
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