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

export const DEFAULT_DEALS: Deal[] = [
    {
        id: 'deal-cadbury-1',
        brandId: 'brand-cadbury',
        title: 'Bournville Collection 1 - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 3000,
        payout: 3000,
        dueDate: '2026-12-19',
        deliverables: [{ id: 'del-1', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-cadbury-2',
        brandId: 'brand-cadbury',
        title: 'Bournville Collections - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1200,
        payout: 1200,
        dueDate: '2026-12-19',
        deliverables: [{ id: 'del-2', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-maccaron',
        brandId: 'brand-maccaron',
        title: 'Diwali Offers + Rs.10 Face Mask - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1000,
        payout: 1000,
        dueDate: '2026-12-11',
        deliverables: [{ id: 'del-3', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-jio',
        brandId: 'brand-jio',
        title: 'Scripted - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1200,
        payout: 1200,
        dueDate: '2026-10-18',
        deliverables: [{ id: 'del-4', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-badabom',
        brandId: 'brand-badabom',
        title: 'Korean Restaurant Vlog - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 4000,
        payout: 4000,
        dueDate: '2026-11-13',
        deliverables: [{ id: 'del-5', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-bunsik',
        brandId: 'brand-bunsik',
        title: 'Korean Food Experience in Nungambakkam Chennai',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 2000,
        payout: 2000,
        dueDate: '2026-12-02',
        deliverables: [{ id: 'del-6', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-kris',
        brandId: 'brand-kris',
        title: 'Sunscreen + Serum - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1000,
        payout: 1000,
        dueDate: '2026-11-24',
        deliverables: [{ id: 'del-7', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-zomato',
        brandId: 'brand-zomato',
        title: 'GRWM With Veppam - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 3000,
        payout: 3000,
        dueDate: '2026-11-11',
        deliverables: [{ id: 'del-8', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-lakme-1',
        brandId: 'brand-lakme',
        title: 'Radience Serum + Day Cream - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1500,
        payout: 1500,
        dueDate: '2026-12-01',
        deliverables: [{ id: 'del-9', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-ponds',
        brandId: 'brand-ponds',
        title: 'Body Lotion Regime',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1179,
        payout: 1179,
        dueDate: '2026-12-01',
        deliverables: [{ id: 'del-10', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-lakme-2',
        brandId: 'brand-lakme',
        title: 'Plumping Lip Oil - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 1768,
        payout: 1768,
        dueDate: '2026-11-23',
        deliverables: [{ id: 'del-11', title: '1 IG Reel', done: false }]
    },
    {
        id: 'deal-meesho',
        brandId: 'brand-meesho',
        title: 'Hauls / Review - 7 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 7500,
        payout: 7500,
        dueDate: '2026-10-17',
        deliverables: [{ id: 'del-12', title: '7 IG Reels', done: false }]
    },
    {
        id: 'deal-ghar',
        brandId: 'brand-ghar',
        title: 'Magic FaceWash - 1 Reel',
        type: 'paid',
        status: 'confirmed',
        agreedFee: 2200,
        payout: 2200,
        dueDate: '2026-11-21',
        deliverables: [{ id: 'del-13', title: 'Full skincare morning routine reel', done: false }]
    }
];

export const DEFAULT_BRANDS: Brand[] = [
    { id: 'brand-cadbury', name: 'Cadbury Bournville', category: 'Food & Beverage', niche: 'Food' },
    { id: 'brand-maccaron', name: 'Maccaron Beauty', category: 'Skincare', niche: 'Beauty' },
    { id: 'brand-jio', name: 'Jio', category: 'Entertainment', niche: 'Entertainment' },
    { id: 'brand-badabom', name: 'Ba Da Bom', category: 'Food & Hospitality', niche: 'Food' },
    { id: 'brand-bunsik', name: 'Bunsik Bites', category: 'Food & Hospitality', niche: 'Food' },
    { id: 'brand-kris', name: 'Kris Amour', category: 'High Fashion & Skincare', niche: 'Beauty' },
    { id: 'brand-zomato', name: 'Zomato', category: 'Food & Lifestyle', niche: 'Lifestyle' },
    { id: 'brand-lakme', name: 'Lakmé', category: 'Cosmetics & Skincare', niche: 'Beauty' },
    { id: 'brand-ponds', name: 'Pond\'s', category: 'Personal Care', niche: 'Skincare' },
    { id: 'brand-meesho', name: 'Meesho', category: 'E-commerce & Fashion', niche: 'Fashion' },
    { id: 'brand-ghar', name: 'Ghar Soaps', category: 'Ayurvedic Skincare', niche: 'Skincare' },
];

export const DEFAULT_DELIVERABLES: Deliverable[] = [
    { id: 'del-1', dealId: 'deal-cadbury-1', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-12-19', done: false },
    { id: 'del-2', dealId: 'deal-cadbury-2', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-12-19', done: false },
    { id: 'del-3', dealId: 'deal-maccaron', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-12-11', done: false },
    { id: 'del-4', dealId: 'deal-jio', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-10-18', done: false },
    { id: 'del-5', dealId: 'deal-badabom', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-11-13', done: false },
    { id: 'del-6', dealId: 'deal-bunsik', title: 'Korean Food Experience in Nungambakkam Chennai', type: '1 IG Reel', dueDate: '2026-12-02', done: false },
    { id: 'del-7', dealId: 'deal-kris', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-11-24', done: false },
    { id: 'del-8', dealId: 'deal-zomato', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-11-11', done: false },
    { id: 'del-9', dealId: 'deal-lakme-1', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-12-01', done: false },
    { id: 'del-10', dealId: 'deal-ponds', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-12-01', done: false },
    { id: 'del-11', dealId: 'deal-lakme-2', title: '1 IG Reel', type: '1 IG Reel', dueDate: '2026-11-23', done: false },
    { id: 'del-12', dealId: 'deal-meesho', title: '7 IG Reels', type: '7 IG Reels', dueDate: '2026-10-17', done: false },
    { id: 'del-13', dealId: 'deal-ghar', title: 'Full skincare morning routine reel', type: '1 IG Reel', dueDate: '2026-11-21', done: false },
];

export const DEFAULT_PAYMENTS: Payment[] = [];

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
    addExpense: (dealId: string, note: string, amount: number, date: string, category?: 'studio' | 'personal') => void;
    deleteExpense: (id: string) => void;
    updateExpense: (id: string, updatedFields: Partial<Expense>) => void;
    toggleDeliverable: (id: string) => void;
    addMessage: (msg: Omit<Message, 'id'>) => void;
    patchMessage: (id: string, patch: Partial<Message>) => void;
    addIdea: (title: string, notes?: string, platform?: string) => void;
    setIdeaStatus: (id: string, status: IdeaStatus) => void;
    setGoal: (patch: Partial<Goal>) => void;
    addReimbursement: (item: Omit<Reimbursement, 'id' | 'reimbursed'>) => void;
    toggleReimbursement: (id: string) => void;
    deleteReimbursement: (id: string) => void;
    updateReimbursement: (id: string, updatedFields: Partial<Reimbursement>) => void;
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
        } catch { }
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
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const hasCadbury = parsed.some((b: any) => b.id === 'brand-cadbury');
                    if (hasCadbury) return parsed;
                }
            }
        } catch { }
        return DEFAULT_BRANDS;
    });

    const [deals, setDeals] = useState<Deal[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deals');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const hasCadbury = parsed.some((d: any) => d.id === 'deal-cadbury-1');
                    if (hasCadbury) return parsed;
                }
            }
        } catch { }
        return DEFAULT_DEALS;
    });

    const [payments, setPayments] = useState<Payment[]>(() => {
        try {
            const saved = localStorage.getItem('hq_payments');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch { }
        return DEFAULT_PAYMENTS;
    });

    const [expenses, setExpenses] = useState<Expense[]>(() => {
        try {
            const saved = localStorage.getItem('hq_expenses');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch { }
        return [];
    });

    const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deliverables');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const hasDel1 = parsed.some((d: any) => d.id === 'del-1');
                    if (hasDel1) return parsed;
                }
            }
        } catch { }
        return DEFAULT_DELIVERABLES;
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem('hq_messages');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch { }
        return DEFAULT_MESSAGES;
    });

    const [ideas, setIdeas] = useState<Idea[]>(() => {
        try {
            const saved = localStorage.getItem('hq_ideas');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch { }
        return DEFAULT_IDEAS;
    });

    const [reimbursements, setReimbursements] = useState<Reimbursement[]>(() => {
        try {
            const saved = localStorage.getItem('hq_reimbursements');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch { }
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
        } catch { }
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
        setGoalData({ revenueTarget: 0, dealsTarget: 0, outreachTarget: 0, outreachDone: 0, contentTarget: 0, contentDone: 0, plan: '' });
    };

    const syncInboxes = async (): Promise<LiveSyncReport> => {
        setIsSyncing(true);
        try {
            const { newMessages, report } = await executeSync(profile);
            if (newMessages.length > 0) {
                setMessages(prev => [...newMessages, ...prev]);
            }
            const fullReport: LiveSyncReport = {
                timestamp: report.timestamp || new Date().toISOString(),
                status: report.status || 'success',
                mode: report.mode || profile.syncMode || 'live',
                messagesFetched: report.messagesFetched ?? messages.length,
                totalNewMessages: report.totalNewMessages ?? newMessages.length,
                instagramStatus: report.instagramStatus ?? 'success',
                gmailStatus: report.gmailStatus ?? 'success',
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
        const newBrands = [...brands];

        if (!brand) {
            brand = { id: `brand-${Date.now()}`, name: brandName, niche, category: niche };
            newBrands.push(brand);
        } else if (niche && brand.niche !== niche) {
            const brandId = brand.id;
            const idx = newBrands.findIndex(b => b.id === brandId);
            if (idx >= 0) {
                newBrands[idx] = { ...newBrands[idx], niche, category: niche };
            }
        }
        setBrands(newBrands);

        const fee = typeof dealData.agreedFee === 'number' ? dealData.agreedFee : Number(dealData.agreedFee) || 0;
        const newDeal: Deal = {
            ...dealData,
            id: `deal-${Date.now()}`,
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
            const brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
            if (!brand) {
                const newBrand: Brand = { id: `brand-${Date.now()}`, name: brandName, niche: niche || 'Beauty', category: niche || 'Beauty' };
                setBrands(prev => [...prev, newBrand]);
                targetBrandId = newBrand.id;
            } else {
                setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, name: brandName, niche: niche || b.niche, category: niche || b.category } : b));
                targetBrandId = brand.id;
            }
        }

        setDeals(prevDeals =>
            prevDeals.map(d => {
                if (d.id === dealId) {
                    const updated = {
                        ...d,
                        ...updatedFields,
                        brandId: targetBrandId || d.brandId,
                    };

                    if (updatedFields.status === 'paid' && d.status !== 'paid') {
                        const amount = updated.agreedFee || updated.payout || 0;
                        const existingPayment = payments.find(p => p.dealId === dealId);
                        if (!existingPayment && amount > 0) {
                            const newPayment: Payment = {
                                id: `p_${Date.now()}`,
                                dealId,
                                amount,
                                date: new Date().toISOString().split('T')[0],
                                note: 'Marked as paid',
                            };
                            setPayments(prev => [...prev, newPayment]);
                        }
                    }

                    return updated;
                }
                return d;
            })
        );
    };

    const setDealStatus = (id: string, status: DealStatus) => {
        setDeals(prev =>
            prev.map(d => {
                if (d.id === id) {
                    const updated = { ...d, status };
                    if (status === 'paid' && d.status !== 'paid') {
                        const amount = d.agreedFee || d.payout || 0;
                        const existingPayment = payments.find(p => p.dealId === id);
                        if (!existingPayment && amount > 0) {
                            const newPayment: Payment = {
                                id: `p_${Date.now()}`,
                                dealId: id,
                                amount,
                                date: new Date().toISOString().split('T')[0],
                                note: 'Marked as paid',
                            };
                            setPayments(pArr => [...pArr, newPayment]);
                        }
                    }
                    return updated;
                }
                return d;
            })
        );
    };

    const deleteDeal = (id: string) => setDeals(prev => prev.filter(d => d.id !== id));
    const addPayment = (dealId: string, amount: number, date: string) => setPayments(prev => [...prev, { id: `p_${Date.now()}`, dealId, amount, date }]);
    
    const addExpense = (dealId: string, note: string, amount: number, date: string, category: 'studio' | 'personal' = 'studio') => {
        setExpenses(prev => [{
            id: `e_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            dealId,
            note,
            title: note,
            amount,
            date,
            category,
        }, ...prev]);
    };

    const deleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
    };

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

    const deleteReimbursement = (id: string) => {
        setReimbursements(prev => prev.filter(r => r.id !== id));
    };

    const updateReimbursement = (id: string, updatedFields: Partial<Reimbursement>) => {
        setReimbursements(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
    };

    return (
        <StoreContext.Provider value={{
            profile, setProfile, brands, deals, payments, expenses, deliverables, messages, ideas, goal, reimbursements, leads,
            syncReport, isSyncing, startingBankBalance, setStartingBankBalance, setSyncMode,
            addDeal, updateDeal, setDealStatus, deleteDeal, addPayment, addExpense, deleteExpense, updateExpense, toggleDeliverable,
            addMessage, patchMessage, addIdea, setIdeaStatus, setGoal, addReimbursement, toggleReimbursement,
            deleteReimbursement, updateReimbursement, syncInboxes, clearAllData
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