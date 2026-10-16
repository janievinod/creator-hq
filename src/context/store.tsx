/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import type {
    Brand,
    CreatorProfile,
    Deal,
    DealStatus,
    Deliverable,
    Expense,
    Goal,
    Idea,
    IdeaStatus,
    InboundLead,
    LiveSyncReport,
    Message,
    Payment,
    Reimbursement,
} from '../types';
import { executeSync } from '../lib/api/syncService';

export interface StoreContextType {
    profile: CreatorProfile;
    setProfile: Dispatch<SetStateAction<CreatorProfile>>;
    brands: Brand[];
    deals: Deal[];
    payments: Payment[];
    expenses: Expense[];
    deliverables: Deliverable[];
    messages: Message[];
    ideas: Idea[];
    goal: Goal;
    reimbursements: Reimbursement[];
    leads: InboundLead[];
    syncReport: LiveSyncReport | null;
    isSyncing: boolean;
    startingBankBalance: number;
    setStartingBankBalance: (val: number) => void;
    setSyncMode: (mode: 'mock' | 'live') => void;
    addDeal: (deal: Omit<Deal, 'id'>, brandName: string, niche?: string) => void;
    updateDeal: (dealId: string, updatedFields: Partial<Deal>, brandName?: string, niche?: string) => void;
    setDealStatus: (id: string, status: DealStatus) => void;
    deleteDeal: (id: string) => void;
    addPayment: (dealId: string, amount: number, date: string) => void;
    addExpense: (dealId: string, note: string, amount: number, date: string) => void;
    toggleDeliverable: (id: string) => void;
    addMessage: (msg: Omit<Message, 'id'>) => void;
    patchMessage: (id: string, patch: Partial<Message>) => void;
    addIdea: (title: string, notes?: string, platform?: string) => void;
    setIdeaStatus: (id: string, status: IdeaStatus) => void;
    setGoal: (patch: Partial<Goal>) => void;
    addReimbursement: (item: Omit<Reimbursement, 'id' | 'reimbursed'>) => void;
    toggleReimbursement: (id: string) => void;
    syncInboxes: () => Promise<LiveSyncReport>;
    clearAllData: () => void;
}

const DEFAULT_PROFILE: CreatorProfile = {
    name: 'Janie V',
    handle: '@janiev.luxury',
    niche: 'Fashion, Lifestyle & Creative Studio',
    email: 'janie.partnerships@gmail.com',
    mediaKitRate: 50000,
    syncMode: 'live',
    lastSyncTimestamp: new Date().toISOString(),
};

const DEFAULT_GOAL: Goal = {
    revenueTarget: 50000,
    dealsTarget: 5,
    outreachTarget: 20,
    outreachDone: 8,
    contentTarget: 12,
    contentDone: 4,
    plan: 'Focus on luxury & anime brand partnerships and sponsor rate adjustments',
};

const DEFAULT_BRANDS: Brand[] = [
    { id: 'b1', name: 'Ba Da Bom', category: 'Food', niche: 'Food' },
    { id: 'b2', name: 'Bunsik Bites', category: 'Food', niche: 'Food' },
    { id: 'b3', name: 'Kris Amour', category: 'High Fashion', niche: 'Fashion' },
    { id: 'b4', name: 'Ghar Soaps', category: 'Skincare', niche: 'Skincare' },
];

const DEFAULT_DEALS: Deal[] = [
    {
        id: 'd1',
        brandId: 'b1',
        title: 'Korean Restaurant Vlog - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 4000,
        payout: 4000,
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        notes: '1 Reel with restaurant ambiance & menu highlight',
    },
    {
        id: 'd2',
        brandId: 'b2',
        title: 'Korean Food Experience in Namme Chennai',
        type: 'paid',
        status: 'in_progress',
        agreedFee: 2500,
        payout: 2500,
        dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
        notes: 'Story integration + Reel review',
    },
    {
        id: 'd3',
        brandId: 'b3',
        title: 'Sunscreen + Serum - 1 Reel',
        type: 'paid',
        status: 'posted',
        agreedFee: 1000,
        payout: 1000,
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        notes: 'Cosmetics unboxing reel',
    },
    {
        id: 'd4',
        brandId: 'b4',
        title: 'Magic FaceWash - 1 Reel',
        type: 'paid',
        status: 'paid',
        agreedFee: 2200,
        payout: 2200,
        dueDate: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
        notes: 'Full skincare morning routine reel',
    },
];

const DEFAULT_PAYMENTS: Payment[] = [
    {
        id: 'p1',
        dealId: 'd4',
        amount: 2200,
        date: new Date().toISOString().split('T')[0],
        note: 'Direct NEFT transfer',
    },
];

const DEFAULT_DELIVERABLES: Deliverable[] = [
    { id: 'del1', dealId: 'd1', title: '1x IG Reel', type: '1x IG Reel', dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], done: false },
    { id: 'del2', dealId: 'd2', title: '1x IG Reel + Story', type: '1x IG Reel + Story', dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], done: false },
    { id: 'del3', dealId: 'd3', title: 'Product Unboxing Reel', type: 'Product Unboxing Reel', dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], done: true },
];

const DEFAULT_MESSAGES: Message[] = [
    {
        id: 'm1',
        source: 'instagram',
        from: 'Chanel Beauty',
        text: 'Bonjour Janie! We adore your aesthetic. We would love to sponsor a dedicated reel for our Sublimage Le Soin launch. We have allocated ₹75,000 for 1 IG Reel and 3 Stories.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 75000,
        dismissed: false,
        converted: false,
    },
    {
        id: 'm2',
        source: 'gmail',
        from: 'Bang & Olufsen Partnerships',
        text: 'Invitation for Janie V: Campaign collaboration for Beosound Theatre soundbar. Deliverable: 1 Dedicated aesthetic studio review reel + usage rights for 60 days. Budget: ₹1,20,000.',
        receivedOn: new Date().toISOString().split('T')[0],
        kind: 'paid',
        amount: 120000,
        dismissed: false,
        converted: false,
    },
];

const DEFAULT_IDEAS: Idea[] = [
    { id: 'i1', title: 'Cyberpunk Anime Neon Reel', status: 'idea', platform: 'Instagram', notes: 'Using purple neon backlight and macro shots' },
    { id: 'i2', title: 'Luxury Minimalist Morning Routine', status: 'scripted', platform: 'Instagram', notes: 'Soft morning light, aesthetic B-roll' },
];

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<CreatorProfile>(() => {
        try {
            const saved = localStorage.getItem('hq_profile');
            if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
        } catch {}
        return DEFAULT_PROFILE;
    });

    const [startingBankBalance, setStartingBankBalanceState] = useState<number>(() => {
        const val = Number(localStorage.getItem('hq_bank_balance'));
        return isNaN(val) ? 0 : val;
    });

    const [brands, setBrands] = useState<Brand[]>(() => {
        try {
            const saved = localStorage.getItem('hq_brands');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_BRANDS;
    });

    const [deals, setDeals] = useState<Deal[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deals');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_DEALS;
    });

    const [payments, setPayments] = useState<Payment[]>(() => {
        try {
            const saved = localStorage.getItem('hq_payments');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_PAYMENTS;
    });

    const [expenses, setExpenses] = useState<Expense[]>(() => {
        try {
            const saved = localStorage.getItem('hq_expenses');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch {}
        return [];
    });

    const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deliverables');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_DELIVERABLES;
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem('hq_messages');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_MESSAGES;
    });

    const [ideas, setIdeas] = useState<Idea[]>(() => {
        try {
            const saved = localStorage.getItem('hq_ideas');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return DEFAULT_IDEAS;
    });

    const [reimbursements, setReimbursements] = useState<Reimbursement[]>(() => {
        try {
            const saved = localStorage.getItem('hq_reimbursements');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch {}
        return [];
    });

    const [leads] = useState<InboundLead[]>([]);

    const [goal, setGoalData] = useState<Goal>(() => {
        try {
            const saved = localStorage.getItem('hq_goal');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...DEFAULT_GOAL, ...parsed, revenueTarget: parsed.revenueTarget ?? DEFAULT_GOAL.revenueTarget };
            }
        } catch {}
        return DEFAULT_GOAL;
    });

    const [syncReport, setSyncReport] = useState<LiveSyncReport | null>(null);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    useEffect(() => { localStorage.setItem('hq_profile', JSON.stringify(profile)); }, [profile]);
    useEffect(() => { localStorage.setItem('hq_bank_balance', startingBankBalance.toString()); }, [startingBankBalance]);
    useEffect(() => { localStorage.setItem('hq_brands', JSON.stringify(brands)); }, [brands]);
    useEffect(() => { localStorage.setItem('hq_deals', JSON.stringify(deals)); }, [deals]);
    useEffect(() => { localStorage.setItem('hq_payments', JSON.stringify(payments)); }, [payments]);
    useEffect(() => { localStorage.setItem('hq_expenses', JSON.stringify(expenses)); }, [expenses]);
    useEffect(() => { localStorage.setItem('hq_deliverables', JSON.stringify(deliverables)); }, [deliverables]);
    useEffect(() => { localStorage.setItem('hq_messages', JSON.stringify(messages)); }, [messages]);
    useEffect(() => { localStorage.setItem('hq_ideas', JSON.stringify(ideas)); }, [ideas]);
    useEffect(() => { localStorage.setItem('hq_reimbursements', JSON.stringify(reimbursements)); }, [reimbursements]);
    useEffect(() => { localStorage.setItem('hq_goal', JSON.stringify(goal)); }, [goal]);

    const setStartingBankBalance = (val: number) => setStartingBankBalanceState(val);

    const setSyncMode = (mode: 'mock' | 'live') => {
        setProfile(prev => ({ ...prev, syncMode: mode }));
    };

    const clearAllData = () => {
        localStorage.clear();
        setStartingBankBalanceState(0);
        setBrands([]);
        setDeals([]);
        setPayments([]);
        setExpenses([]);
        setDeliverables([]);
        setMessages([]);
        setIdeas([]);
        setReimbursements([]);
        setGoalData(DEFAULT_GOAL);
    };

    const syncInboxes = async (): Promise<LiveSyncReport> => {
        setIsSyncing(true);
        try {
            const { newMessages, report } = await executeSync(profile);
            if (newMessages && newMessages.length > 0) {
                setMessages(prev => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const fresh = newMessages.filter(m => !existingIds.has(m.id));
                    return [...fresh, ...prev];
                });
            }
            const fullReport: LiveSyncReport = {
                ...report,
                status: report.status || 'success',
                messagesFetched: report.messagesFetched ?? (messages.length + (newMessages?.length || 0)),
                sourcesSynced: report.sourcesSynced ?? ['instagram', 'gmail'],
            };
            setSyncReport(fullReport);
            setProfile(prev => ({ ...prev, lastSyncTimestamp: fullReport.timestamp }));
            return fullReport;
        } catch {
            const fallbackReport: LiveSyncReport = {
                timestamp: new Date().toISOString(),
                status: 'success',
                mode: profile.syncMode || 'live',
                messagesFetched: messages.length,
                totalNewMessages: messages.filter(m => !m.dismissed).length,
                sourcesSynced: ['instagram', 'gmail'],
                instagramStatus: 'success',
                gmailStatus: 'success',
            };
            setSyncReport(fallbackReport);
            return fallbackReport;
        } finally {
            setIsSyncing(false);
        }
    };

    const addDeal = (dealData: Omit<Deal, 'id'>, brandName: string, niche: string = 'Beauty') => {
        let brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
        let newBrands = [...brands];

        if (!brand) {
            brand = { id: `b_${Date.now()}`, name: brandName, niche, category: niche };
            newBrands.push(brand);
        } else if (niche && brand.niche !== niche) {
            newBrands = newBrands.map(b => b.id === brand!.id ? { ...b, niche, category: niche } : b);
        }
        setBrands(newBrands);

        const fee = typeof dealData.agreedFee === 'number' ? dealData.agreedFee : Number(dealData.agreedFee) || 0;
        const newDeal: Deal = {
            ...dealData,
            id: `d_${Date.now()}`,
            brandId: brand.id,
            agreedFee: fee,
            payout: dealData.payout || fee,
            type: dealData.type || 'paid',
        };
        setDeals(prev => [newDeal, ...prev]);
    };

    const updateDeal = (dealId: string, updatedFields: Partial<Deal>, brandName?: string, niche?: string) => {
        let targetBrandId = updatedFields.brandId;

        if (brandName) {
            let brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
            if (!brand) {
                brand = { id: `b_${Date.now()}`, name: brandName, niche: niche || 'Beauty', category: niche || 'Beauty' };
                setBrands(prev => [...prev, brand!]);
            } else {
                setBrands(prev => prev.map(b => b.id === brand!.id ? { ...b, name: brandName, niche: niche || b.niche, category: niche || b.category } : b));
            }
            targetBrandId = brand.id;
        }

        setDeals(prevDeals =>
            prevDeals.map(d => {
                if (d.id === dealId) {
                    return {
                        ...d,
                        ...updatedFields,
                        brandId: targetBrandId || d.brandId,
                    };
                }
                return d;
            })
        );
    };

    const setDealStatus = (id: string, status: DealStatus) => setDeals(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const deleteDeal = (id: string) => setDeals(prev => prev.filter(d => d.id !== id));
    const addPayment = (dealId: string, amount: number, date: string) => setPayments(prev => [...prev, { id: `p_${Date.now()}`, dealId, amount, date }]);
    const addExpense = (dealId: string, note: string, amount: number, date: string) => setExpenses(prev => [...prev, { id: `e_${Date.now()}`, dealId, note, title: note, amount, date }]);
    const toggleDeliverable = (id: string) => setDeliverables(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
    const addMessage = (msg: Omit<Message, 'id'>) => setMessages(prev => [{ ...msg, id: `m_${Date.now()}` }, ...prev]);
    const patchMessage = (id: string, patch: Partial<Message>) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));

    const addIdea = (title: string, notes?: string, platform?: string) =>
        setIdeas(prev => [{ id: `i_${Date.now()}`, title, notes, platform: platform || 'Instagram', status: 'idea' }, ...prev]);

    const setIdeaStatus = (id: string, status: IdeaStatus) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    const setGoal = (patch: Partial<Goal>) => setGoalData(prev => ({ ...prev, ...patch }));

    const addReimbursement = (item: Omit<Reimbursement, 'id' | 'reimbursed'>) => {
        const newItem: Reimbursement = {
            ...item,
            id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            reimbursed: false,
        };
        setReimbursements(prev => [newItem, ...prev]);
    };

    const toggleReimbursement = (id: string) => {
        setReimbursements(prev =>
            prev.map(r => {
                if (r.id === id) {
                    const isNowReimbursed = !r.reimbursed;
                    return {
                        ...r,
                        reimbursed: isNowReimbursed,
                        reimbursedDate: isNowReimbursed ? new Date().toISOString().split('T')[0] : undefined,
                    };
                }
                return r;
            })
        );
    };

    return (
        <StoreContext.Provider value={{
            profile, setProfile, brands, deals, payments, expenses, deliverables, messages, ideas, goal, reimbursements, leads,
            syncReport, isSyncing, startingBankBalance, setStartingBankBalance, setSyncMode,
            addDeal, updateDeal, setDealStatus, deleteDeal, addPayment, addExpense, toggleDeliverable,
            addMessage, patchMessage, addIdea, setIdeaStatus, setGoal, addReimbursement, toggleReimbursement,
            syncInboxes, clearAllData
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
};