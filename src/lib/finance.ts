import type { Deal, Expense, Payment } from '../types';

export function isCommittedPaidDeal(d: Deal) {
    return d.type === 'paid' && !['declined', 'lead'].includes(d.status);
}

export function receivedForDeal(deal: Deal, payments: Payment[] = []) {
    const safePayments = Array.isArray(payments) ? payments : [];
    return safePayments.filter(p => p.dealId === deal.id).reduce((sum, p) => sum + p.amount, 0);
}

export function outstandingForDeal(deal: Deal, payments: Payment[] = []) {
    if (!isCommittedPaidDeal(deal)) return 0;
    return Math.max(0, (deal.agreedFee || deal.payout || 0) - receivedForDeal(deal, payments));
}

export function totalOutstanding(deals: Deal[] = [], payments: Payment[] = []) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    return safeDeals.reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function cashReceivedInMonth(_deals: Deal[] = [], payments: Payment[] = [], today: Date = new Date()) {
    const safePayments = Array.isArray(payments) ? payments : [];
    const y = today.getFullYear();
    const m = today.getMonth();
    return safePayments.filter(p => {
        if (!p.date) return false;
        const d = new Date(p.date);
        return d.getFullYear() === y && d.getMonth() === m;
    }).reduce((sum, p) => sum + p.amount, 0);
}

export function overdueBalance(deals: Deal[] = [], payments: Payment[] = [], today: Date = new Date()) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    const todayIso = today.toISOString().split('T')[0];
    return safeDeals
        .filter(d => isCommittedPaidDeal(d) && d.dueDate && d.dueDate < todayIso)
        .reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function dealProfit(deal: Deal, expenses: Expense[] = []) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const exp = safeExpenses.filter(e => e.dealId === deal.id).reduce((s, e) => s + e.amount, 0);
    return (deal.agreedFee || deal.payout || 0) - exp;
}

export function goalProgress(current: number, target: number) {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
}