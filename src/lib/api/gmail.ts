import type { Message } from '../../types';

export interface GmailFetchResult {
    success: boolean;
    messages: Message[];
    error?: string;
}

/**
 * Builds the Google OAuth2 authorization URL for Gmail API with gmail.readonly scope.
 */
export function buildGoogleOAuthUrl(clientId: string, redirectUri: string): string {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        prompt: 'consent',
        include_granted_scopes: 'true',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Extracts sender name or brand name from standard email "From" header (e.g. "Prada Media <collab@prada.com>").
 */
function cleanSender(fromHeader: string): string {
    if (!fromHeader) return 'Brand Partner';
    const match = fromHeader.match(/^([^<]+)/);
    if (match && match[1].trim()) {
        return match[1].trim().replace(/^["']|["']$/g, '');
    }
    return fromHeader;
}

/**
 * Parses numeric compensation mentioned in email snippets.
 */
function extractRateFromText(text: string): number | undefined {
    const inrMatch = text.match(/(?:₹|INR|rs\.?)\s*([0-9,]+)/i);
    if (inrMatch) {
        return Number(inrMatch[1].replace(/,/g, ''));
    }
    const usdMatch = text.match(/(?:\$|USD)\s*([0-9,]+)/i);
    if (usdMatch) {
        return Number(usdMatch[1].replace(/,/g, '')) * 85;
    }
    return undefined;
}

/**
 * Real live fetch handler for Gmail API.
 * Queries messages matching sponsorship or collaboration terms and parses the threads.
 */
export async function fetchGmailLiveInquiries(
    accessToken: string
): Promise<GmailFetchResult> {
    if (!accessToken || !accessToken.trim()) {
        return {
            success: false,
            messages: [],
            error: 'No Gmail OAuth access token provided. Please connect your Google account or enter an access token in Creator Profile settings.',
        };
    }

    try {
        const query = encodeURIComponent('collaboration OR sponsorship OR "brand deal" OR "paid partnership" OR rates');
        const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=6`;

        const listRes = await fetch(listUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Accept': 'application/json',
            },
        });

        if (!listRes.ok) {
            const errData = await listRes.json().catch(() => null);
            const errMsg = errData?.error?.message || `Gmail API returned status ${listRes.status} (${listRes.statusText})`;
            return {
                success: false,
                messages: [],
                error: errMsg,
            };
        }

        const listData = await listRes.json();
        const msgItems: { id: string }[] = listData.messages || [];

        if (msgItems.length === 0) {
            return {
                success: true,
                messages: [],
            };
        }

        const parsedMessages: Message[] = [];

        // Fetch detail for each message
        for (const item of msgItems.slice(0, 5)) {
            try {
                const detailRes = await fetch(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken.trim()}`,
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!detailRes.ok) continue;

                const detail = await detailRes.json();
                const headers = detail.payload?.headers || [];
                const fromHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'from')?.value || 'Brand Partner';
                const subject = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'subject')?.value || 'Brand Collaboration Brief';
                const snippet = detail.snippet || subject;
                const fullText = `${subject}: ${snippet}`;

                const dateHeader = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === 'date')?.value;
                const dateIso = dateHeader ? new Date(dateHeader).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                const amount = extractRateFromText(fullText);

                parsedMessages.push({
                    id: `gm_${detail.id || Date.now()}`,
                    source: 'gmail',
                    from: cleanSender(fromHeader),
                    text: fullText,
                    receivedOn: dateIso,
                    kind: amount ? 'paid' : (snippet.toLowerCase().includes('gift') ? 'barter' : 'maybe'),
                    amount,
                    rawId: detail.id,
                });
            } catch {
                // Ignore individual message parse error
            }
        }

        return {
            success: true,
            messages: parsedMessages,
        };
    } catch (err) {
        return {
            success: false,
            messages: [],
            error: err instanceof Error ? err.message : 'Network error querying Gmail API',
        };
    }
}
