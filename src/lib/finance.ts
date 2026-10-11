import type { Deal, Expense, Payment } from '../types';

export function isCommittedPaidDeal(d: Deal) {
    return d.type === 'paid' && !['declined', 'lead'].includes(d.status);
}

export function receivedForDeal(deal: Deal, payments: Payment[]) {
    return payments.filter(p => p.dealId === deal.id).reduce((sum, p) => sum + p.amount, 0);
}

export function outstandingForDeal(deal: Deal, payments: Payment[]) {
    if (!isCommittedPaidDeal(deal)) return 0;
    return Math.max(0, deal.agreedFee - receivedForDeal(deal, payments));
}

export function totalOutstanding(deals: Deal[], payments: Payment[]) {
    return deals.reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function cashReceivedInMonth(_deals: Deal[], payments: Payment[], today: Date) {
    const y = today.getFullYear();
    const m = today.getMonth();
    return payments.filter(p => {
        const d = new Date(p.date);
        return d.getFullYear() === y && d.getMonth() === m;
    }).reduce((sum, p) => sum + p.amount, 0);
}

export function overdueBalance(deals: Deal[], payments: Payment[], today: Date) {
    const todayIso = today.toISOString().split('T')[0];
    return deals
        .filter(d => isCommittedPaidDeal(d) && d.dueDate && d.dueDate < todayIso)
        .reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

export function dealProfit(deal: Deal, expenses: Expense[]) {
    const exp = expenses.filter(e => e.dealId === deal.id).reduce((s, e) => s + e.amount, 0);
    return deal.agreedFee - exp;
}

export function goalProgress(current: number, target: number) {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
}