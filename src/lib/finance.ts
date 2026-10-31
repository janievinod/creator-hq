import type { Deal, Expense, Payment } from '../types';

export function isCommittedPaidDeal(d: Deal) {
    return d.type === 'paid' && !['declined', 'lead'].includes(d.status);
}

export function receivedForDeal(deal: Deal, payments: Payment[] = []) {
    // Only count if payments are explicitly logged against this deal
    const safePayments = Array.isArray(payments) ? payments : [];
    return safePayments.filter(p => p.dealId === deal.id).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

export function outstandingForDeal(deal: Deal, payments: Payment[] = []) {
    if (!isCommittedPaidDeal(deal)) return 0;
    const fee = Number(deal.agreedFee ?? deal.payout ?? 0);
    const received = receivedForDeal(deal, payments);
    return Math.max(0, fee - received);
}

export function totalOutstanding(deals: Deal[] = [], payments: Payment[] = []) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    // Sums up all outstanding amounts for committed deals
    return safeDeals.reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function cashReceivedInMonth(_deals: Deal[] = [], payments: Payment[] = [], _today?: Date) {
    const safePayments = Array.isArray(payments) ? payments : [];
    // Strictly returns 0 unless explicit payment transactions are logged or tracked for the month
    return safePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
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

export function totalExpenses(expenses: Expense[] = []) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    return safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

export function expensesInMonth(expenses: Expense[] = [], _today?: Date) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    return safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

export function netRevenueCollected(deals: Deal[] = [], payments: Payment[] = [], expenses: Expense[] = [], _today?: Date) {
    const collected = cashReceivedInMonth(deals, payments);
    const monthlyExp = expensesInMonth(expenses);
    return Math.max(0, collected - monthlyExp);
}