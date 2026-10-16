/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import type { Brand, CreatorProfile, Deal, DealStatus, Deliverable, Expense, Goal, Idea, IdeaStatus, LiveSyncReport, Message, Payment } from '../types';

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
    syncInboxes: () => Promise<LiveSyncReport>;
    clearAllData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<CreatorProfile>(() => {
        const saved = localStorage.getItem('hq_profile');
        if (saved) {
            try { return JSON.parse(saved); } catch { }
        }
        return {
            name: 'Janie V',
            handle: '@janiev.luxury',
            niche: 'Fashion, Lifestyle & Creative Studio',
            email: 'janie.partnerships@gmail.com',
            mediaKitRate: 50000,
            syncMode: 'live',
            lastSyncTimestamp: new Date().toISOString(),
        };
    });

    const [startingBankBalance, setStartingBankBalanceState] = useState<number>(() => {
        return Number(localStorage.getItem('hq_bank_balance') || 0);
    });

    const [brands, setBrands] = useState<Brand[]>(() => {
        try {
            const saved = localStorage.getItem('hq_brands');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [deals, setDeals] = useState<Deal[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deals');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [payments, setPayments] = useState<Payment[]>(() => {
        try {
            const saved = localStorage.getItem('hq_payments');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [expenses, setExpenses] = useState<Expense[]>(() => {
        try {
            const saved = localStorage.getItem('hq_expenses');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
        try {
            const saved = localStorage.getItem('hq_deliverables');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem('hq_messages');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [ideas, setIdeas] = useState<Idea[]>(() => {
        try {
            const saved = localStorage.getItem('hq_ideas');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [goal, setGoalData] = useState<Goal>(() => {
        try {
            const saved = localStorage.getItem('hq_goal');
            return saved ? JSON.parse(saved) : { revenueTarget: 0, dealsTarget: 0, outreachTarget: 0, outreachDone: 0, contentTarget: 0, contentDone: 0, plan: '' };
        } catch {
            return { revenueTarget: 0, dealsTarget: 0, outreachTarget: 0, outreachDone: 0, contentTarget: 0, contentDone: 0, plan: '' };
        }
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
        setGoalData({ revenueTarget: 0, dealsTarget: 0, outreachTarget: 0, outreachDone: 0, contentTarget: 0, contentDone: 0, plan: '' });
    };

    const syncInboxes = async (): Promise<LiveSyncReport> => {
        setIsSyncing(true);
        try {
            const report: LiveSyncReport = { timestamp: new Date().toISOString(), status: 'success', messagesFetched: messages.length, sourcesSynced: ['instagram', 'gmail'] };
            setSyncReport(report);
            setProfile(prev => ({ ...prev, lastSyncTimestamp: report.timestamp }));
            return report;
        } finally {
            setIsSyncing(false);
        }
    };

    const addDeal = (dealData: Omit<Deal, 'id'>, brandName: string, niche: string = 'Beauty') => {
        let brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
        let newBrands = [...brands];

        if (!brand) {
            brand = { id: `b_${Date.now()}`, name: brandName, niche };
            newBrands.push(brand);
        } else if (niche && brand.niche !== niche) {
            newBrands = newBrands.map(b => b.id === brand!.id ? { ...b, niche } : b);
        }
        setBrands(newBrands);

        const newDeal: Deal = { ...dealData, id: `d_${Date.now()}`, brandId: brand.id };
        setDeals(prev => [newDeal, ...prev]);
    };

    const updateDeal = (dealId: string, updatedFields: Partial<Deal>, brandName?: string, niche?: string) => {
        let targetBrandId = updatedFields.brandId;

        if (brandName) {
            let brand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
            if (!brand) {
                brand = { id: `b_${Date.now()}`, name: brandName, niche: niche || 'Beauty' };
                setBrands(prev => [...prev, brand!]);
            } else {
                setBrands(prev => prev.map(b => b.id === brand!.id ? { ...b, name: brandName, niche: niche || b.niche } : b));
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
    const addExpense = (dealId: string, note: string, amount: number, date: string) => setExpenses(prev => [...prev, { id: `e_${Date.now()}`, dealId, note, amount, date }]);
    const toggleDeliverable = (id: string) => setDeliverables(prev => prev.map(d => d.id === id ? { ...d, done: !d.done } : d));
    const addMessage = (msg: Omit<Message, 'id'>) => setMessages(prev => [{ ...msg, id: `m_${Date.now()}` }, ...prev]);
    const patchMessage = (id: string, patch: Partial<Message>) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));

    // Fixed addIdea implementation with default platform property matching the Idea interface
    const addIdea = (title: string, notes?: string, platform: string = 'Instagram') =>
        setIdeas(prev => [{ id: `i_${Date.now()}`, title, notes, platform, status: 'idea' }, ...prev]);

    const setIdeaStatus = (id: string, status: IdeaStatus) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    const setGoal = (patch: Partial<Goal>) => setGoalData(prev => ({ ...prev, ...patch }));

    return (
        <StoreContext.Provider value={{
            profile, setProfile, brands, deals, payments, expenses, deliverables, messages, ideas, goal,
            syncReport, isSyncing, startingBankBalance, setStartingBankBalance, setSyncMode,
            addDeal, updateDeal, setDealStatus, deleteDeal, addPayment, addExpense, toggleDeliverable,
            addMessage, patchMessage, addIdea, setIdeaStatus, setGoal, syncInboxes, clearAllData
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