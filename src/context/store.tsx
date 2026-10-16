import React, { createContext, useContext, useState } from 'react';

// Types defined directly in store to prevent module resolution errors
export interface Brand {
    id: string;
    name: string;
    category: string;
}

export interface Deal {
    id: string;
    brandId: string;
    title: string;
    status: 'lead' | 'negotiation' | 'active' | 'content_review' | 'completed' | 'declined';
    payout: number;
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

interface StoreContextType {
    brands: Brand[];
    deals: Deal[];
    leads: InboundLead[];
    ideas: ContentIdea[];
    reimbursements: Reimbursement[];
    deliverables: Deliverable[];
    addReimbursement: (item: Omit<Reimbursement, 'id' | 'reimbursed'>) => void;
    toggleReimbursement: (id: string) => void;
    toggleDeliverable: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [brands] = useState<Brand[]>([
        { id: 'b1', name: 'Ba Da Bom', category: 'Food' },
        { id: 'b2', name: 'Bunsik Bites', category: 'Food' },
        { id: 'b3', name: 'Kris Amour', category: 'High Fashion' },
        { id: 'b4', name: 'Ghar Soaps', category: 'High Fashion' },
    ]);

    const [deals] = useState<Deal[]>([
        { id: 'd1', brandId: 'b1', title: 'Korean Restaurant Vlog - 1 Reel', status: 'active', payout: 4000 },
        { id: 'd2', brandId: 'b2', title: 'Korean Food Experience in Namme Chennai', status: 'active', payout: 2500 },
        { id: 'd3', brandId: 'b3', title: 'Sunscreen + Serum - 1 Reel', status: 'active', payout: 1000 },
        { id: 'd4', brandId: 'b4', title: 'Magic FaceWash - 1 Reel', status: 'active', payout: 2200 },
    ]);

    const [leads] = useState<InboundLead[]>([]);
    const [ideas] = useState<ContentIdea[]>([]);
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

    const [deliverables, setDeliverables] = useState<Deliverable[]>([
        { id: 'del1', dealId: 'd1', type: '1x IG Reel', dueDate: '2026-10-20', done: false },
        { id: 'del2', dealId: 'd2', type: '1x IG Reel + Story', dueDate: '2026-10-25', done: false },
        { id: 'del3', dealId: 'd3', type: 'Product Unboxing Reel', dueDate: '2026-10-18', done: true },
    ]);

    const addReimbursement = (item: Omit<Reimbursement, 'id' | 'reimbursed'>) => {
        const newItem: Reimbursement = {
            ...item,
            id: Date.now().toString(),
            reimbursed: false,
        };
        setReimbursements(prev => [newItem, ...prev]);
    };

    const toggleReimbursement = (id: string) => {
        setReimbursements(prev =>
            prev.map(r => (r.id === id ? { ...r, reimbursed: !r.reimbursed } : r))
        );
    };

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev =>
            prev.map(d => (d.id === id ? { ...d, done: !d.done } : d))
        );
    };

    return (
        <StoreContext.Provider
            value={{
                brands,
                deals,
                leads,
                ideas,
                reimbursements,
                deliverables,
                addReimbursement,
                toggleReimbursement,
                toggleDeliverable,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}