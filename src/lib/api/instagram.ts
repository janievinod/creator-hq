import type { Message } from '../../types';

export interface InstagramFetchResult {
    success: boolean;
    messages: Message[];
    error?: string;
}

/**
 * Builds the Instagram OAuth authorization URL.
 */
export function buildInstagramOAuthUrl(clientId: string, redirectUri: string): string {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'user_profile,user_media,instagram_graph_user_profile',
        response_type: 'code',
    });
    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
}

/**
 * Parses numeric budget mentions like "₹25,000" or "$3,000" from message text.
 */
function extractRateFromText(text: string): number | undefined {
    const inrMatch = text.match(/(?:₹|INR|rs\.?)\s*([0-9,]+)/i);
    if (inrMatch) {
        return Number(inrMatch[1].replace(/,/g, ''));
    }
    const usdMatch = text.match(/(?:\$|USD)\s*([0-9,]+)/i);
    if (usdMatch) {
        return Number(usdMatch[1].replace(/,/g, '')) * 85; // Approximate INR conversion
    }
    return undefined;
}

/**
 * Real fetch handler for Instagram Graph API.
 * Calls the Instagram Graph API endpoints to retrieve user messages or media comments.
 */
export async function fetchInstagramLiveInquiries(
    accessToken: string,
    userId?: string
): Promise<InstagramFetchResult> {
    if (!accessToken || !accessToken.trim()) {
        return {
            success: false,
            messages: [],
            error: 'No Instagram Graph API access token provided. Please connect your account or enter a valid access token in Creator Profile settings.',
        };
    }

    try {
        const targetId = userId && userId.trim() ? userId.trim() : 'me';
        // Try fetching Instagram conversations / comments
        const url = `https://graph.instagram.com/v19.0/${targetId}/conversations?fields=id,messages{id,message,from,created_time}&access_token=${encodeURIComponent(accessToken.trim())}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => null);
            const errMsg = errData?.error?.message || `Instagram API returned status ${response.status} (${response.statusText})`;
            return {
                success: false,
                messages: [],
                error: errMsg,
            };
        }

        const data = await response.json();
        const incomingMessages: Message[] = [];
        const items = data?.data || [];

        for (const item of items) {
            const latestMsg = item.messages?.data?.[0];
            if (latestMsg && latestMsg.message) {
                const text = latestMsg.message;
                const from = latestMsg.from?.username || latestMsg.from?.name || 'Instagram Partner';
                const createdOn = latestMsg.created_time
                    ? latestMsg.created_time.split('T')[0]
                    : new Date().toISOString().split('T')[0];
                const amount = extractRateFromText(text);

                incomingMessages.push({
                    id: `ig_${latestMsg.id || Date.now()}`,
                    source: 'instagram',
                    from,
                    text,
                    receivedOn: createdOn,
                    kind: amount ? 'paid' : (text.toLowerCase().includes('gift') ? 'barter' : 'maybe'),
                    amount,
                    rawId: latestMsg.id,
                });
            }
        }

        return {
            success: true,
            messages: incomingMessages,
        };
    } catch (err) {
        return {
            success: false,
            messages: [],
            error: err instanceof Error ? err.message : 'Network error connecting to Instagram Graph API',
        };
    }
}
