import { useState, type FormEvent } from 'react';
import { useStore } from '../../context/store';
import { btnCls, btnSecondaryCls, inputCls, STATUSES, STATUS_META } from '../../lib/theme';
import type { DealForm, DealStatus, DealType } from '../../types';
import { X, Sparkles } from 'lucide-react';

interface NewDealModalProps {
    open: boolean;
    onClose: () => void;
    prefill?: Partial<DealForm>;
    onSaved?: () => void;
}

export default function NewDealModal({ open, onClose, prefill, onSaved }: NewDealModalProps) {
    const { addDeal } = useStore();
    const [form, setForm] = useState<DealForm>({
        brandName: prefill?.brandName || '',
        title: prefill?.title || '',
        type: prefill?.type || 'paid',
        status: prefill?.status || 'negotiating',
        agreedFee: prefill?.agreedFee ?? '',
        barterValue: prefill?.barterValue ?? '',
        dueDate: prefill?.dueDate || '',
        paymentTimeline: prefill?.paymentTimeline || '',
        notes: prefill?.notes || '',
        niche: prefill?.niche || '',
    });

    if (!open) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const brandName = form.brandName?.trim();
        if (!brandName) return;

        addDeal({
            brandId: '',
            title: form.title?.trim() || `${form.type === 'paid' ? 'Campaign Partnership' : 'Anime Gifting'}`,
            type: form.type as DealType,
            status: form.status as DealStatus,
            agreedFee: Number(form.agreedFee) || 0,
            barterValue: Number(form.barterValue) || 0,
            dueDate: form.dueDate ? form.dueDate : undefined,
            notes: form.notes ? form.notes : undefined,
        }, brandName);

        if (onSaved) onSaved();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl anime-glass border border-pink-500/40 p-6 shadow-2xl shadow-purple-950/80 space-y-4">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                            <h3 className="text-lg font-black text-white font-display">New Brand Collab</h3>
                        </div>
                        <p className="text-xs text-purple-300 mt-0.5">Establish sponsor terms & compensation</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-1.5 text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                        <label className="text-xs font-bold text-purple-200 block mb-1">Brand or Fashion House</label>
                        <input
                            className={inputCls}
                            placeholder="e.g. Cyberpunk Gear, Crunchyroll, Sony Music"
                            value={form.brandName}
                            onChange={e => setForm({ ...form, brandName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Collab Type</label>
                            <select
                                className={inputCls}
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value as DealType })}
                            >
                                <option value="paid" className="bg-[#1a0b2e]">Paid Collab</option>
                                <option value="barter" className="bg-[#1a0b2e]">Gifted / Barter</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Contract Status</label>
                            <select
                                className={inputCls}
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value as DealStatus })}
                            >
                                {STATUSES.map(st => (
                                    <option key={st} value={st} className="bg-[#1a0b2e]">{STATUS_META[st].label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {form.type === 'paid' ? (
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Agreed Fee (₹)</label>
                            <input
                                type="number"
                                className={inputCls}
                                placeholder="50000"
                                value={form.agreedFee}
                                onChange={e => setForm({ ...form, agreedFee: e.target.value })}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Est. Product Value (₹)</label>
                            <input
                                type="number"
                                className={inputCls}
                                placeholder="15000"
                                value={form.barterValue}
                                onChange={e => setForm({ ...form, barterValue: e.target.value })}
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-purple-200 block mb-1">Deliverable Due Date</label>
                        <input
                            type="date"
                            className={inputCls}
                            value={form.dueDate || ''}
                            onChange={e => setForm({ ...form, dueDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-purple-200 block mb-1">Deliverable Notes</label>
                        <textarea
                            rows={2}
                            className={inputCls}
                            placeholder="Reel requirements, character cosplay notes, tags..."
                            value={form.notes || ''}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-3 flex gap-2 justify-end border-t border-purple-500/20">
                        <button
                            type="button"
                            onClick={onClose}
                            className={btnSecondaryCls}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={btnCls}>
                            Save Partnership
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}