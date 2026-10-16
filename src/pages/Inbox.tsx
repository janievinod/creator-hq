import { useState } from 'react';
import NewDealModal from '../components/ui/NewDealModal';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { formatDate, formatINR, toISO } from '../lib/format';
import { btnCls, inputCls } from '../lib/theme';
import { useToday } from '../lib/useToday';
import type { DealForm, Message, MessageSource } from '../types';
import { RefreshCw, Mail, CheckCircle2, MessageSquarePlus, Sparkles, X, Globe, AlertCircle } from 'lucide-react';
import { Instagram } from '../components/icons/InstagramIcon';

const KIND: Record<string, { label: string; cls: string }> = {
    paid: { label: '💸 Paid Collab', cls: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' },
    barter: { label: '🎁 Gifted', cls: 'bg-amber-950/70 text-amber-300 border-amber-500/40' },
    inquiry: { label: '📩 Inquiry', cls: 'bg-blue-950/80 text-blue-300 border-blue-500/50' },
    maybe: { label: '🤔 Brand Pitch', cls: 'bg-purple-950/70 text-purple-300 border-purple-500/40' },
    none: { label: 'General Inquiry', cls: 'bg-slate-900/70 text-slate-300 border-slate-700' },
};

export default function Inbox() {
    const s = useStore();
    const today = useToday();
    const [source, setSource] = useState<MessageSource>('instagram');
    const [from, setFrom] = useState('');
    const [text, setText] = useState('');
    const [prefill, setPrefill] = useState<{ msg: Message; form: Partial<DealForm> } | null>(null);

    const handleSync = async () => {
        await s.syncInboxes();
    };

    const add = () => {
        if (!text.trim()) return;
        s.addMessage({ source, from: from.trim() || 'Brand Partner', text: text.trim(), receivedOn: toISO(today), kind: 'paid' });
        setText('');
        setFrom('');
    };

    const toDeal = (m: Message) => setPrefill({
        msg: m,
        form: {
            brandName: m.from || m.brandName || '',
            type: m.kind === 'barter' ? 'barter' : 'paid',
            status: 'negotiating',
            agreedFee: m.amount ? String(m.amount) : '',
            notes: m.text ? m.text.slice(0, 300) : ''
        },
    });

    const inbox = s.messages.filter(m => !m.dismissed);
    const isLive = s.profile.syncMode === 'live';

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header with Mode Switcher & Sync */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <PageHeader
                    title="Inbound Inquiries & DMs"
                    subtitle="Real-time Instagram Graph API & Gmail sync with automatic rate detection"
                />
                <div className="flex flex-wrap items-center gap-3">
                    {/* Live vs Demo Toggle Switch */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl anime-glass border border-purple-500/30">
                        <button
                            onClick={() => s.setSyncMode('mock')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${!isLive
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-900/50'
                                    : 'text-purple-300 hover:text-white'
                                }`}
                        >
                            ✨ Demo Simulation
                        </button>
                        <button
                            onClick={() => s.setSyncMode('live')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isLive
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-900/50'
                                    : 'text-purple-300 hover:text-white'
                                }`}
                        >
                            <Globe className="w-3.5 h-3.5" /> Live API Sync
                        </button>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={s.isSyncing}
                        className={btnCls}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${s.isSyncing ? 'animate-spin' : ''}`} />
                        {s.isSyncing ? 'Syncing...' : (isLive ? 'Sync Live APIs' : 'Fetch Demo Leads')}
                    </button>
                </div>
            </div>

            {/* Sync Status Banner */}
            {s.syncReport && (
                <div className="rounded-2xl anime-glass border border-pink-500/40 p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${s.syncReport.mode === 'live' ? 'bg-pink-400' : 'bg-purple-400'} animate-ping`} />
                        <div>
                            <p className="text-xs font-extrabold text-white">
                                {s.syncReport.mode === 'live' ? 'Live API Synchronization' : 'Demo Simulation'} Finished
                            </p>
                            <p className="text-[11px] text-purple-300">
                                Discovered {s.syncReport.totalNewMessages} new brand inquiry lead(s) · {new Date(s.syncReport.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    {isLive && (s.syncReport.instagramError || s.syncReport.gmailError) && (
                        <div className="text-[11px] text-pink-300 bg-purple-950/60 px-3 py-1.5 rounded-xl border border-pink-500/30 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-pink-400" />
                            <span>Add API Access Tokens in Creator Profile to unlock full live sync</span>
                        </div>
                    )}
                </div>
            )}

            {/* Manual Inquiry Logger */}
            <section className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                    <MessageSquarePlus className="w-4 h-4 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        Quick Lead Entry
                    </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <select
                        className={inputCls}
                        value={source}
                        onChange={e => setSource(e.target.value as MessageSource)}
                    >
                        <option value="instagram" className="bg-[#1a0b2e]">Instagram Direct Message (DM)</option>
                        <option value="gmail" className="bg-[#1a0b2e]">Gmail Brand Outreach</option>
                        <option value="whatsapp" className="bg-[#1a0b2e]">WhatsApp / Cosplay Sponsor</option>
                        <option value="other" className="bg-[#1a0b2e]">Talent Agency Inquiry</option>
                    </select>
                    <input
                        className={inputCls}
                        placeholder="Brand or Agency Representative"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                    />
                </div>
                <textarea
                    rows={2}
                    className={inputCls}
                    placeholder="Paste collaboration proposal, budget offer, or campaign brief…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className="flex justify-end">
                    <button onClick={add} className={btnCls}>
                        Log to Inbox
                    </button>
                </div>
            </section>

            {/* Inquiries Stream */}
            <div className="space-y-4">
                {inbox.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-12 text-center text-xs text-purple-300 shadow-xl">
                        <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-spin" />
                        <p className="font-black text-white text-base font-display">Inbox is Completely Clear</p>
                        <p className="mt-1">All incoming brand proposals have been converted to active partnerships or archived.</p>
                    </div>
                ) : (
                    inbox.map(m => (
                        <div
                            key={m.id}
                            className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl hover:border-pink-500/50 hover:shadow-2xl transition-all"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="p-2 rounded-xl bg-purple-900/60 border border-purple-500/40">
                                    {m.source === 'instagram' ? (
                                        <Instagram className="w-4 h-4 text-pink-400" />
                                    ) : (
                                        <Mail className="w-4 h-4 text-purple-300" />
                                    )}
                                </span>
                                <span className="font-extrabold text-white text-sm font-display">{m.from || m.brandName || 'Brand Lead'}</span>
                                <span className="text-[11px] text-purple-400 capitalize font-medium">
                                    {m.source} · {formatDate(m.receivedOn || '')}
                                </span>
                                <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-bold border ${KIND[m.kind]?.cls || KIND.none.cls}`}>
                                    {KIND[m.kind]?.label || 'Message'}{m.amount ? ` · ${formatINR(m.amount)}` : ''}
                                </span>
                            </div>

                            <p className="mt-4 text-xs text-purple-100 bg-purple-950/40 p-4 rounded-2xl border border-purple-500/20 leading-relaxed font-normal">
                                {m.text}
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                                {m.converted ? (
                                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Converted to active collaboration
                                    </span>
                                ) : (
                                    <button onClick={() => toDeal(m)} className={btnCls}>
                                        <Sparkles className="w-3.5 h-3.5" /> Convert to Deal
                                    </button>
                                )}
                                <button
                                    onClick={() => s.patchMessage(m.id, { dismissed: true })}
                                    className="text-xs font-bold text-purple-400 hover:text-white hover:bg-purple-900/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer ml-auto flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" /> Dismiss
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <NewDealModal
                key={prefill?.msg.id}
                open={!!prefill}
                prefill={prefill?.form}
                onSaved={() => prefill && s.patchMessage(prefill.msg.id, { converted: true })}
                onClose={() => setPrefill(null)}
            />
        </div>
    );
}