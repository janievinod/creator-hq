export type DealStatus =
    | 'lead'
    | 'negotiating'
    | 'negotiation'
    | 'confirmed'
    | 'in_progress'
    | 'active'
    | 'content_review'
    | 'posted'
    | 'paid'
    | 'completed'
    | 'declined';

export type DealType = 'paid' | 'barter' | 'hybrid';
export type MessageSource = 'instagram' | 'gmail' | 'manual' | 'whatsapp' | 'other';
export type IdeaStatus =
    | 'idea'
    | 'scripted'
    | 'filmed'
    | 'posted'
    | 'brainstorm'
    | 'scripting'
    | 'filming'
    | 'editing'
    | 'scheduled'
    | 'published';

export interface Deal {
    id: string;
    brandId?: string;
    title: string;
    type?: DealType;
    status: DealStatus;
    agreedFee: number;
    payout?: number;
    barterValue?: number;
    dueDate?: string;
    completedDate?: string;
    paymentTimeline?: string;
    deliverableLinks?: string[];
    notes?: string;
}

export interface DealForm {
    brandName?: string;
    title?: string;
    type: DealType;
    status: DealStatus;
    agreedFee: number | string;
    barterValue?: number | string;
    dueDate?: string;
    paymentTimeline?: string;
    notes?: string;
    niche?: string;
}

export interface Brand {
    id: string;
    name: string;
    niche?: string;
    category?: string;
    instagram?: string;
    email?: string;
    notes?: string;
}

export interface Message {
    id: string;
    brandName?: string;
    from?: string;
    source: MessageSource;
    snippet?: string;
    text?: string;
    date?: string;
    receivedOn?: string;
    kind: 'paid' | 'barter' | 'inquiry' | 'maybe' | 'none';
    amount?: number;
    dismissed?: boolean;
    converted?: boolean;
    rawId?: string;
}

export interface Deliverable {
    id: string;
    dealId: string;
    title?: string;
    type?: string;
    dueDate: string;
    done: boolean;
}

export interface Payment {
    id: string;
    dealId: string;
    amount: number;
    date: string;
    note?: string;
}

export interface Expense {
    id: string;
    dealId?: string;
    title?: string;
    amount: number;
    date?: string;
    category?: string;
    note?: string;
}

export interface Goal {
    revenueTarget: number;
    dealsTarget?: number;
    outreachTarget?: number;
    outreachDone?: number;
    contentTarget?: number;
    contentDone?: number;
    plan?: string;
}

export interface Idea {
    id: string;
    title: string;
    status: IdeaStatus;
    platform?: string;
    notes?: string;
}

export interface CreatorProfile {
    name: string;
    handle: string;
    mediaKitRate: number;
    niche?: string;
    email?: string;
    lastSyncTimestamp?: string;
    syncMode?: 'mock' | 'live';
    instagramAccessToken?: string;
    instagramClientId?: string;
    instagramUserId?: string;
    gmailAccessToken?: string;
    gmailClientId?: string;
}

export interface LiveSyncReport {
    mode?: 'mock' | 'live';
    status?: string;
    timestamp: string;
    totalNewMessages?: number;
    messagesFetched?: number;
    sourcesSynced?: string[];
    instagramStatus?: string;
    instagramCount?: number;
    instagramError?: string;
    gmailStatus?: string;
    gmailCount?: number;
    gmailError?: string;
}

export interface Reimbursement {
    id: string;
    brandName: string;
    productName: string;
    amountPaid: number;
    purchaseDate: string;
    reimbursed: boolean;
    reimbursedDate?: string;
    notes?: string;
}

export interface InboundLead {
    id: string;
    brandName: string;
    contactPerson: string;
    email: string;
    offeredBudget: number;
    platform: string;
    status: string;
}

export interface ContentIdea {
    id: string;
    title: string;
    niche?: string;
    notes?: string;
}