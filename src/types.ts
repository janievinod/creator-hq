export type DealStatus = 'in_progress' | 'confirmed' | 'completed' | 'paid' | 'declined';
export type DealType = 'paid' | 'barter' | 'hybrid';
export type IdeaStatus = 'idea' | 'scripted' | 'filmed' | 'edited' | 'posted';

export interface CreatorProfile {
    name: string;
    handle: string;
    niche: string;
    email: string;
    instagramConnected: boolean;
    gmailConnected: boolean;
    mediaKitRate: number;
    lastSyncTimestamp?: string;
}

export interface Brand {
    id: string;
    name: string;
    instagram?: string;
    email?: string;
    logoUrl?: string;
    niche?: string;
}

export interface Deal {
    id: string;
    brandId: string;
    title: string;
    type: DealType;
    status: DealStatus;
    agreedFee: number;
    dueDate: string;
    completedDate?: string;
    paymentTimeline?: string; // e.g., '30_days', '45_days', '60_days', 'custom'
    notes?: string;
    deliverableLinks?: string[]; // Multiple video / Reel links
    monthYear?: string;
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

export interface Deliverable {
    id: string;
    dealId: string;
    title: string;
    dueDate: string;
    done: boolean;
}

export interface Message {
    id: string;
    source: 'instagram' | 'gmail';
    from: string;
    text: string;
    receivedOn: string;
    kind: 'paid' | 'barter' | 'inquiry';
    amount?: number;
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

export interface LiveSyncReport {
    timestamp: string;
    status: 'success' | 'error';
    messagesFetched: number;
    sourcesSynced: string[];
}