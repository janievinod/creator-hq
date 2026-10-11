export type DealStatus = 'lead' | 'negotiating' | 'confirmed' | 'in_progress' | 'posted' | 'paid' | 'completed' | 'declined';
export type DealType = 'paid' | 'barter';
export type MessageSource = 'instagram' | 'gmail' | 'whatsapp' | 'other';
export type MessageKind = 'paid' | 'barter' | 'maybe' | 'none';
export type IdeaStatus = 'idea' | 'scripted' | 'filmed' | 'posted';
export type SyncMode = 'mock' | 'live';

export interface CreatorProfile {
    name: string;
    handle: string;
    niche: string;
    email: string;
    instagramConnected: boolean;
    gmailConnected: boolean;
    mediaKitRate: number;
    instagramAccessToken?: string;
    instagramUserId?: string;
    instagramClientId?: string;
    gmailAccessToken?: string;
    gmailClientId?: string;
    syncMode: SyncMode;
    lastSyncTimestamp?: string;
}

export interface Brand {
    id: string;
    name: string;
    instagram?: string;
    email?: string;
}

export interface Payment {
    id: string;
    dealId: string;
    amount: number;
    date: string;
}

export interface Expense {
    id: string;
    dealId: string;
    note: string;
    amount: number;
    date: string;
}

export interface Deal {
    id: string;
    brandId: string;
    title: string;
    type: DealType;
    status: DealStatus;
    agreedFee: number;
    barterValue?: number;
    dueDate?: string;
    notes?: string;
}

export interface Deliverable {
    id: string;
    dealId: string;
    title: string;
    dueDate: string;
    done: boolean;
}

export interface Message {
    id: string;
    source: MessageSource;
    from: string;
    text: string;
    receivedOn: string;
    kind: MessageKind;
    amount?: number;
    dismissed?: boolean;
    converted?: boolean;
    rawId?: string;
}

export interface Idea {
    id: string;
    title: string;
    notes?: string;
    status: IdeaStatus;
}

export interface Goal {
    revenueTarget: number;
    dealsTarget: number;
    outreachTarget: number;
    outreachDone: number;
    contentTarget: number;
    contentDone: number;
    plan: string;
}

export interface DealForm {
    brandName: string;
    type: DealType;
    status: DealStatus;
    agreedFee: string;
    barterValue: string;
    dueDate: string;
    notes: string;
}

export interface LiveSyncReport {
    timestamp: string;
    mode: SyncMode;
    instagramStatus: 'success' | 'skipped' | 'error';
    instagramCount: number;
    instagramError?: string;
    gmailStatus: 'success' | 'skipped' | 'error';
    gmailCount: number;
    gmailError?: string;
    totalNewMessages: number;
}