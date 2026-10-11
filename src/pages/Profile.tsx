import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { btnCls, btnSecondaryCls, inputCls } from '../lib/theme';
import { Mail, CheckCircle, RefreshCw, User, Sparkles, Key, ExternalLink, Globe } from 'lucide-react';
import { Instagram } from '../components/icons/InstagramIcon';
import { buildInstagramOAuthUrl } from '../lib/api/instagram';
import { buildGoogleOAuthUrl } from '../lib/api/gmail';

export default function Profile() {
    const { profile, setProfile, syncInboxes, isSyncing, syncReport } = useStore();
    const [showKeySettings, setShowKeySettings] = useState(false);
    const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

    const handleSync = async () => {
        setSyncSuccessMsg(null);
        const report = await syncInboxes();
        if (report.mode === 'live') {
            setSyncSuccessMsg(`Live sync finished: ${report.totalNewMessages} leads retrieved.`);
        } else {
            setSyncSuccessMsg(`Simulation synced: ${report.totalNewMessages} incoming inquiries added.`);
        }
        setTimeout(() => setSyncSuccessMsg(null), 4000);
    };

    const handleInstagramOAuth = () => {
        const clientId = profile.instagramClientId || 'INSTAGRAM_APP_ID';
        const redirectUri = window.location.origin;
        const url = buildInstagramOAuthUrl(clientId, redirectUri);
        window.open(url, '_blank', 'width=600,height=700');
    };

    const handleGoogleOAuth = () => {
        const clientId = profile.gmailClientId || 'GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        const redirectUri = window.location.origin;
        const url = buildGoogleOAuthUrl(clientId, redirectUri);
        window.open(url, '_blank', 'width=600,height=700');
    };

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <PageHeader
                title="Creator Profile & APIs"
                subtitle="Configure creator identity, rates, and real Instagram & Gmail OAuth connections"
            />

            <div className="grid gap-6 md:grid-cols-3">
                {/* Media Kit Card */}
                <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4 md:col-span-1 text-center flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white text-3xl font-black flex items-center justify-center shadow-xl shadow-purple-900/50 border border-pink-400/50 font-display">
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white font-display">{profile.name}</h3>
                            <p className="text-xs text-pink-400 font-bold">{profile.handle}</p>
                            <p className="mt-1 text-xs text-purple-300 leading-normal">{profile.niche}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-purple-500/20 text-left space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-purple-400 font-medium">Standard Rate:</span>
                            <span className="font-extrabold text-white">₹{profile.mediaKitRate.toLocaleString('en-IN')} / reel</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-purple-400 font-medium">Contact Email:</span>
                            <span className="text-purple-200 font-medium truncate max-w-[150px]">{profile.email}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-purple-400 font-medium">Sync Mode:</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-300 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                                <Globe className="w-3 h-3 text-pink-400" /> {profile.syncMode === 'live' ? 'Live API Sync' : 'Demo Mode'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Settings & Connected Accounts */}
                <div className="rounded-3xl anime-glass border border-purple-500/30 p-7 shadow-xl space-y-6 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-pink-400" />
                            <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                                Profile Configuration
                            </h3>
                        </div>
                        <button
                            onClick={() => setShowKeySettings(!showKeySettings)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <Key className="w-3.5 h-3.5" />
                            {showKeySettings ? 'Hide API Keys' : 'Configure API Keys'}
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Creator Name</label>
                            <input
                                className={inputCls}
                                value={profile.name}
                                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Instagram Handle</label>
                            <input
                                className={inputCls}
                                value={profile.handle}
                                onChange={e => setProfile(prev => ({ ...prev, handle: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Content Niche / Cosplay Focus</label>
                            <input
                                className={inputCls}
                                value={profile.niche}
                                onChange={e => setProfile(prev => ({ ...prev, niche: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-200 block mb-1">Media Kit Base Fee (₹)</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={profile.mediaKitRate}
                                onChange={e => setProfile(prev => ({ ...prev, mediaKitRate: Number(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>

                    {/* Real API Token & OAuth Configuration */}
                    <div className="pt-5 border-t border-purple-500/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                                Inbound Integrations & OAuth
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-purple-300">Mode:</span>
                                <select
                                    className="rounded-xl bg-purple-950/80 border border-purple-500/40 px-3 py-1 text-xs font-bold text-pink-300 cursor-pointer"
                                    value={profile.syncMode}
                                    onChange={e => setProfile(prev => ({ ...prev, syncMode: e.target.value as 'mock' | 'live' }))}
                                >
                                    <option value="mock" className="bg-[#1a0b2e]">Demo Mode</option>
                                    <option value="live" className="bg-[#1a0b2e]">Live API Sync</option>
                                </select>
                            </div>
                        </div>

                        {/* Instagram Graph API */}
                        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
                                        <Instagram className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white font-display">Instagram Graph API ({profile.handle})</p>
                                        <p className="text-[10px] text-purple-300">Fetches incoming DMs and brand collaboration comments</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleInstagramOAuth}
                                        className={btnSecondaryCls}
                                        title="Initiate Instagram OAuth flow"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-pink-400" /> Connect OAuth
                                    </button>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Active
                                    </span>
                                </div>
                            </div>

                            {showKeySettings && (
                                <div className="pt-3 border-t border-purple-500/20 grid gap-3 sm:grid-cols-2 text-xs">
                                    <div>
                                        <label className="text-[10px] text-purple-300 block mb-1">Instagram Graph Access Token</label>
                                        <input
                                            type="password"
                                            placeholder="IGQVJ... (Paste Token)"
                                            className={inputCls}
                                            value={profile.instagramAccessToken || ''}
                                            onChange={e => setProfile(prev => ({ ...prev, instagramAccessToken: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-purple-300 block mb-1">Instagram App Client ID</label>
                                        <input
                                            placeholder="App ID from Meta Developer Portal"
                                            className={inputCls}
                                            value={profile.instagramClientId || ''}
                                            onChange={e => setProfile(prev => ({ ...prev, instagramClientId: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gmail API */}
                        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                        <Mail className="w-4 h-4 text-purple-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white font-display">Gmail API ({profile.email})</p>
                                        <p className="text-[10px] text-purple-300">Reads sponsorship proposals via Google Identity Services</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleGoogleOAuth}
                                        className={btnSecondaryCls}
                                        title="Initiate Google OAuth2 flow"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-pink-400" /> Connect OAuth
                                    </button>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Active
                                    </span>
                                </div>
                            </div>

                            {showKeySettings && (
                                <div className="pt-3 border-t border-purple-500/20 grid gap-3 sm:grid-cols-2 text-xs">
                                    <div>
                                        <label className="text-[10px] text-purple-300 block mb-1">Google OAuth Access Token</label>
                                        <input
                                            type="password"
                                            placeholder="ya29.a0... (Paste Bearer Token)"
                                            className={inputCls}
                                            value={profile.gmailAccessToken || ''}
                                            onChange={e => setProfile(prev => ({ ...prev, gmailAccessToken: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-purple-300 block mb-1">Google Client ID</label>
                                        <input
                                            placeholder="Client ID from Google Cloud Console"
                                            className={inputCls}
                                            value={profile.gmailClientId || ''}
                                            onChange={e => setProfile(prev => ({ ...prev, gmailClientId: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Test Sync Trigger & Feedback */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={btnCls}
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? 'Synchronizing Inbound Leads...' : 'Test & Sync Inbound Inboxes'}
                            </button>
                            {syncSuccessMsg && (
                                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 animate-in fade-in">
                                    <Sparkles className="w-3.5 h-3.5 text-pink-400" /> {syncSuccessMsg}
                                </span>
                            )}
                            {profile.lastSyncTimestamp && !syncSuccessMsg && (
                                <span className="text-[11px] text-purple-400 font-medium">
                                    Last synced: {new Date(profile.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        {syncReport && (
                            <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-500/30 text-[11px] text-purple-200 space-y-1">
                                <p className="font-extrabold text-white">Latest Inbound Sync Diagnostic:</p>
                                <p>• Instagram Status: <strong className="capitalize text-pink-300">{syncReport.instagramStatus}</strong> ({syncReport.instagramCount} leads) {syncReport.instagramError && <span className="text-purple-400">· Note: {syncReport.instagramError}</span>}</p>
                                <p>• Gmail Status: <strong className="capitalize text-pink-300">{syncReport.gmailStatus}</strong> ({syncReport.gmailCount} leads) {syncReport.gmailError && <span className="text-purple-400">· Note: {syncReport.gmailError}</span>}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}