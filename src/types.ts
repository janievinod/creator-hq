export interface Brand {
    id: string;
    name: string;
    category: string;
}

export interface Deal {
    id: string;
    brandId: string;
    title: string;
    type?: 'paid' | 'barter';
    status: 'lead' | 'negotiation' | 'active' | 'content_review' | 'completed' | 'declined';
    payout: number;
    agreedFee?: number;
    dueDate?: string;
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
    niche: string;
    notes?: string;
}

export interface Reimbursement {
    id: string;
    brandName: string;
    productName: string;
    amountPaid: number;
    purchaseDate: string;
    reimbursed: boolean;
    notes?: string;
}

export interface Deliverable {
    id: string;
    dealId: string;
    type: string;
    dueDate: string;
    done: boolean;
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
    amount: number;
    title: string;
}