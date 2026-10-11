// Add these helper actions inside your StoreContext provider in src/context/store.tsx:

const setMonthlyGoal = (target: number) => {
    setStore(prev => {
        const updated = { ...prev, monthlyTarget: target };
        localStorage.setItem('creator_hq_store', JSON.stringify(updated));
        return updated;
    });
};

const addExpense = (title: string, amount: number, category: string) => {
    const newExpense = { id: Date.now().toString(), title, amount, category, date: new Date().toISOString() };
    setStore(prev => {
        const updated = { ...prev, expenses: [...prev.expenses, newExpense] };
        localStorage.setItem('creator_hq_store', JSON.stringify(updated));
        return updated;
    });
};

const togglePaid = (dealId: string) => {
    setStore(prev => {
        const updatedDeals = prev.deals.map(deal =>
            deal.id === dealId ? { ...deal, status: (deal.status === 'paid' ? 'confirmed' : 'paid') as any } : deal
        );
        const updated = { ...prev, deals: updatedDeals };
        localStorage.setItem('creator_hq_store', JSON.stringify(updated));
        return updated;
    });
};