import type { Deal, Expense, Payment } from '../types';

export function isCommittedPaidDeal(d: Deal) {
    return d.type === 'paid' && !['declined', 'lead'].includes(d.status);
}

export function receivedForDeal(deal: Deal, payments: Payment[] = []) {
    if (deal.status !== 'paid') return 0;
    const safePayments = Array.isArray(payments) ? payments : [];
    const fromPayments = safePayments.filter(p => p.dealId === deal.id).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const dealFee = Number(deal.agreedFee ?? deal.payout ?? 0);
    return Math.max(fromPayments, dealFee);
}

export function outstandingForDeal(deal: Deal, payments: Payment[] = []) {
    if (!isCommittedPaidDeal(deal) || deal.status === 'paid') return 0;
    const fee = Number(deal.agreedFee ?? deal.payout ?? 0);
    const safePayments = Array.isArray(payments) ? payments : [];
    const received = safePayments.filter(p => p.dealId === deal.id).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return Math.max(0, fee - received);
}

export function totalOutstanding(deals: Deal[] = [], payments: Payment[] = []) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    return safeDeals.reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function cashReceivedInMonth(deals: Deal[] = [], payments: Payment[] = []) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    // Directly sum agreed fees of deals strictly marked as 'paid'
    return safeDeals
        .filter(d => d.status === 'paid')
        .reduce((sum, d) => sum + (Number(d.agreedFee ?? d.payout ?? 0)), 0);
}

export function overdueBalance(deals: Deal[] = [], payments: Payment[] = [], today: Date = new Date()) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    const todayIso = today.toISOString().split('T')[0];
    return safeDeals
        .filter(d => isCommittedPaidDeal(d) && d.status !== 'paid' && d.dueDate && d.dueDate < todayIso)
        .reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function dealProfit(deal: Deal, expenses: Expense[] = []) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    const exp = safeExpenses
        .filter(e => e.dealId === deal.id)
        .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const fee = Number(deal.agreedFee ?? deal.payout ?? 0);
    return fee - exp;
}

export function goalProgress(current: number, target: number) {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
}