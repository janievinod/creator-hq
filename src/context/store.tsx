/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import type { Brand, CreatorProfile, Deal, DealStatus, Deliverable, Expense, Goal, Idea, IdeaStatus, LiveSyncReport, Message, Payment, SyncMode } from '../types';
import { executeSync } from '../lib/api/syncService';

interface StoreContextType {
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
    syncReport: LiveSyncReport | null;
    isSyncing: boolean;
    addDeal: (deal: Omit<Deal, 'id'>, brandName: string) => void;
    setDealStatus: (id: string, status: DealStatus) => void;
    deleteDeal: (id: string) => void;
    addPayment: (dealId: string, amount: number, date: string) => void;
    addExpense: (dealId: string, note: string, amount: number, date: string) => void;
    toggleDeliverable: (id: string) => void;
    addMessage: (msg: Omit<Message, 'id'>) => void;
    patchMessage: (id: string, patch: Partial<Message>) => void;
    addIdea: (title: string, notes?: string) => void;
    setIdeaStatus: (id: string, status: IdeaStatus) => void;
    setGoal: (patch: Partial<Goal>) => void;
    setSyncMode: (mode: SyncMode) => void;
    syncInboxes: () => Promise<LiveSyncReport>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<CreatorProfile>(() => {
        const saved = localStorage.getItem('hq_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    syncMode: 'mock',
                    ...parsed,
                };
            } catch {
                // Ignore parse error
            }
        }
        return {
            name: 'Janie V',
            handle: '@janiev.luxury',
            niche: 'High Fashion, Fine Fragrance & Aesthetic Studio',
            email: 'janie.partnerships@gmail.com',
            instagramConnected: true,
            gmailConnected: true,
            mediaKitRate: 50000,
            syncMode: 'mock',
            lastSyncTimestamp: new Date().toISOString(),
        };
    });

    const [brands, setBrands] = useState<Brand[]>(() => JSON.parse(localStorage.getItem('hq_brands') || JSON.stringify([
        { id: 'b1', name: 'Chanel Beauty', instagram: '@chanel.beauty', email: 'press@chanel.com' },
        { id: 'b2', name: 'Bang & Olufsen', instagram: '@bangolufsen', email: 'collabs@bang-olufsen.com' },
        { id: 'b3', name: 'Dior Parfums', instagram: '@diorbeauty' }
    ])));

    const [deals, setDeals] = useState<Deal[]>(() => JSON.parse(localStorage.getItem('hq_deals') || JSON.stringify([
        { id: 'd1', brandId: 'b1', title: 'Sublimage Holiday Reel & Stories', type: 'paid', status: 'in_progress', agreedFee: 75000, dueDate: '2026-10-25', notes: 'Macro 4K texture shots, warm golden hour lighting' },
        { id: 'd2', brandId: 'b2', title: 'Studio Soundbar Architectural Review', type: 'paid', status: 'confirmed', agreedFee: 120000, dueDate: '2026-11-05', notes: 'Includes 60-day digital advertising whitelisting' },
    ])));

    const [payments, setPayments] = useState<Payment[]>(() => JSON.parse(localStorage.getItem('hq_payments') || JSON.stringify([
        { id: 'p1', dealId: 'd1', amount: 37500, date: '2026-10-08' }
    ])));

    const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem('hq_expenses') || JSON.stringify([
        { id: 'e1', dealId: 'd1', note: 'Silk velvet props & vintage crystal', amount: 4800, date: '2026-10-06' }
    ])));

    const [deliverables, setDeliverables] = useState<Deliverable[]>(() => JSON.parse(localStorage.getItem('hq_deliverables') || JSON.stringify([
        { id: 'del1', dealId: 'd1', title: 'Submit 4K Video Draft for Brand Approval', dueDate: '2026-10-20', done: false },
        { id: 'del2', dealId: 'd1', title: 'Publish Reel & Tag #ChanelBeauty', dueDate: '2026-10-25', done: false },
        { id: 'del3', dealId: 'd2', title: 'Send Moodboard & Sound Selection', dueDate: '2026-10-28', done: true },
    ])));

    const [messages, setMessages] = useState<Message[]>(() => JSON.parse(localStorage.getItem('hq_messages') || JSON.stringify([
        {
            id: 'm1',
            source: 'instagram',
            from: 'Chanel Beauty',
            text: 'Bonjour Janie! Loved your recent architectural studio reel. We would love to sponsor a dedicated reel for our Sublimage Le Soin launch. Rate offered: ₹75,000.',
            receivedOn: '2026-10-10',
            kind: 'paid',
            amount: 75000
        },
        {
            id: 'm2',
            source: 'gmail',
            from: 'Bang & Olufsen Partnerships',
            text: 'Hi Janie, proposing a campaign collaboration for Beosound Theatre soundbar. Budget allocated: ₹1,20,000 for 1 IG Reel + 60-day usage rights.',
            receivedOn: '2026-10-09',
            kind: 'paid',
            amount: 120000
        }
    ])));

    const [ideas, setIdeas] = useState<Idea[]>(() => JSON.parse(localStorage.getItem('hq_ideas') || JSON.stringify([
        { id: 'i1', title: 'Quiet Luxury Morning Ritual: Fragrance Layering', notes: 'Close up gold bottles, soft morning daylight, French jazz soundtrack', status: 'scripted' },
        { id: 'i2', title: 'High-Ticket Creator Studio Tour (Warm Minimalist)', notes: 'Focus on Bang & Olufsen audio, travertine pedestals, and lighting', status: 'filmed' },
    ])));

    const [goal, setGoalData] = useState<Goal>(() => JSON.parse(localStorage.getItem('hq_goal') || JSON.stringify({
        revenueTarget: 250000,
        dealsTarget: 4,
        outreachTarget: 10,
        outreachDone: 6,
        contentTarget: 8,
        contentDone: 5,
        plan: 'Focus on ultra-premium luxury brands (Chanel, Dior, B&O) and increase baseline reel package to ₹50k+.'
    })));

    const [syncReport, setSyncReport] = useState<LiveSyncReport | null>(() => {
        const saved = localStorage.getItem('hq_sync_report');
        return saved ? JSON.parse(saved) : null;
    });

    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    useEffect(() => { localStorage.setItem('hq_profile', JSON.stringify(profile)); }, [profile]);
    useEffect(() => { localStorage.setItem('hq_brands', JSON.stringify(brands)); }, [brands]);
    useEffect(() => { localStorage.setItem('hq_deals', JSON.stringify(deals)); }, [deals]);
    useEffect(() => { localStorage.setItem('hq_payments', JSON.stringify(payments)); }, [payments]);
    useEffect(() => { localStorage.setItem('hq_expenses', JSON.stringify(expenses)); }, [expenses]);
    useEffect(() => { localStorage.setItem('hq_deliverables', JSON.stringify(deliverables)); }, [deliverables]);
    useEffect(() => { localStorage.setItem('hq_messages', JSON.stringify(messages)); }, [messages]);
    useEffect(() => { localStorage.setItem('hq_ideas', JSON.stringify(ideas)); }, [ideas]);
    useEffect(() => { localStorage.setItem('hq_goal', JSON.stringify(goal)); }, [goal]);
    useEffect(() => {
        if (syncReport) localStorage.setItem('hq_sync_report', JSON.stringify(syncReport));
    }, [syncReport]);

    const setSyncMode = (mode: SyncMode) => {
        setProfile(prev => ({ ...prev, syncMode: mode }));
    };

    const syncInboxes = async (): Promise<LiveSyncReport> => {
        setIsSyncing(true);
        try {
            const { newMessages, report } = await executeSync(profile);
            
            if (newMessages.length > 0) {
                setMessages(prev => {
                    // Filter duplicates by text or rawId
                    const existingTexts = new Set(prev.map(m => m.text));
                    const fresh = newMessages.filter(m => !existingTexts.has(m.text));
                    return [...fresh, ...prev];
                });
            }

            setSyncReport(report);
            setProfile(prev => ({
                ...prev,
                lastSyncTimestamp: report.timestamp,
            }));
            return report;
        } finally {
            setIsSyncing(false);
        }
    };

    const addDeal = (dealData: Omit<Deal, 'id'>, brandName: string) => {
        let brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
        if (!brand) {
            brand = { id: `b_${Date.now()}`, name: brandName };
            setBrands(prev => [...prev, brand!]);
        }
        const newDeal: Deal = { ...dealData, id: `d_${Date.now()}`, brandId: brand.id };
        setDeals(prev => [newDeal, ...prev]);
    };

    const setDealStatus = (id: string, status: DealStatus) => {
        setDeals(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    };

    const deleteDeal = (id: string) => {
        setDeals(prev => prev.filter(d => d.id !== id));
    };

    const addPayment = (dealId: string, amount: number, date: string) => {
        setPayments(prev => [...prev, { id: `p_${Date.now()}`, dealId, amount, date }]);
    };

    const addExpense = (dealId: string, note: string, amount: number, date: string) => {
        setExpenses(prev => [...prev, { id: `e_${Date.now()}`, dealId, note, amount, date }]);
    };

    const toggleDeliverable = (id: string) => {
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
    };

    const addMessage = (msg: Omit<Message, 'id'>) => {
        setMessages(prev => [{ ...msg, id: `m_${Date.now()}` }, ...prev]);
    };

    const patchMessage = (id: string, patch: Partial<Message>) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
    };

    const addIdea = (title: string, notes?: string) => {
        setIdeas(prev => [{ id: `i_${Date.now()}`, title, notes, status: 'idea' }, ...prev]);
    };

    const setIdeaStatus = (id: string, status: IdeaStatus) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const setGoal = (patch: Partial<Goal>) => {
        setGoalData(prev => ({ ...prev, ...patch }));
    };

    return (
        <StoreContext.Provider value={{
            profile, setProfile, brands, deals, payments, expenses, deliverables, messages, ideas, goal,
            syncReport, isSyncing,
            addDeal, setDealStatus, deleteDeal, addPayment, addExpense, toggleDeliverable,
            addMessage, patchMessage, addIdea, setIdeaStatus, setGoal, setSyncMode, syncInboxes
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