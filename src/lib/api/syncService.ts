import type { CreatorProfile, LiveSyncReport, Message } from '../../types';
import { fetchInstagramLiveInquiries } from './instagram';
import { fetchGmailLiveInquiries } from './gmail';

const LUXURY_MOCK_LEADS: Omit<Message, 'id'>[] = [
    {
        source: 'instagram',
        from: 'Chanel Beauty',
        text: 'Bonjour Janie! We adore your aesthetic. We would love to sponsor a dedicated reel for our Sublimage Le Soin launch. We have allocated ₹75,000 for 1 IG Reel and 3 Stories.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 75000,
    },
    {
        source: 'gmail',
        from: 'Bang & Olufsen Partnerships',
        text: 'Invitation for Janie V: Campaign collaboration for Beosound Theatre soundbar. Deliverable: 1 Dedicated aesthetic studio review reel + usage rights for 60 days. Budget: ₹1,20,000.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 120000,
    },
    {
        source: 'instagram',
        from: 'Dior Parfums',
        text: 'Hello! Exclusive gifting + paid content invite for Miss Dior Parfum collection. Proposed fee: ₹45,000 with gifted luxury fragrance wardrobe included.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 45000,
    },
    {
        source: 'gmail',
        from: 'LVMH Hospitality',
        text: 'Private creator experience proposal: 2 nights at luxury property in Udaipur + ₹60,000 honorarium for 1 YouTube Short and 2 Instagram carousel posts.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 60000,
    },
];

export async function executeSync(profile: CreatorProfile): Promise<{
    newMessages: Message[];
    report: LiveSyncReport;
}> {
    const timestamp = new Date().toISOString();

    if (profile.syncMode === 'mock') {
        // Pick 2 random luxury mock leads to simulate fresh incoming offers
        const sampleIndex = Math.floor(Math.random() * (LUXURY_MOCK_LEADS.length - 1));
        const selected = LUXURY_MOCK_LEADS.slice(sampleIndex, sampleIndex + 2);
        const newMessages: Message[] = selected.map((lead, i) => ({
            ...lead,
            id: `lead_${Date.now()}_${i}`,
            receivedOn: new Date().toISOString().split('T')[0],
        }));

        const report: LiveSyncReport = {
            timestamp,
            mode: 'mock',
            instagramStatus: 'success',
            instagramCount: newMessages.filter(m => m.source === 'instagram').length,
            gmailStatus: 'success',
            gmailCount: newMessages.filter(m => m.source === 'gmail').length,
            totalNewMessages: newMessages.length,
        };

        return { newMessages, report };
    }

    // Real Live API Sync
    const newMessages: Message[] = [];
    let igStatus: 'success' | 'skipped' | 'error';
    let igError: string | undefined;
    let igCount = 0;

    let gmStatus: 'success' | 'skipped' | 'error';
    let gmError: string | undefined;
    let gmCount = 0;

    // 1. Sync Instagram Graph API if token is provided
    if (profile.instagramAccessToken && profile.instagramAccessToken.trim()) {
        const igResult = await fetchInstagramLiveInquiries(
            profile.instagramAccessToken,
            profile.instagramUserId
        );
        if (igResult.success) {
            igStatus = 'success';
            igCount = igResult.messages.length;
            newMessages.push(...igResult.messages);
        } else {
            igStatus = 'error';
            igError = igResult.error;
        }
    } else {
        igStatus = 'skipped';
        igError = 'Instagram access token not configured in Profile settings';
    }

    // 2. Sync Gmail API if token is provided
    if (profile.gmailAccessToken && profile.gmailAccessToken.trim()) {
        const gmResult = await fetchGmailLiveInquiries(profile.gmailAccessToken);
        if (gmResult.success) {
            gmStatus = 'success';
            gmCount = gmResult.messages.length;
            newMessages.push(...gmResult.messages);
        } else {
            gmStatus = 'error';
            gmError = gmResult.error;
        }
    } else {
        gmStatus = 'skipped';
        gmError = 'Gmail OAuth access token not configured in Profile settings';
    }

    const report: LiveSyncReport = {
        timestamp,
        mode: 'live',
        instagramStatus: igStatus,
        instagramCount: igCount,
        instagramError: igError,
        gmailStatus: gmStatus,
        gmailCount: gmCount,
        gmailError: gmError,
        totalNewMessages: newMessages.length,
    };

    return { newMessages, report };
}
