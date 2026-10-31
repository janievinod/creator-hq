import type { Deal, Expense, Payment } from '../types';

// Helper: Check if a deal is an active committed deal (not declined, lead, or cancelled)
export function isCommittedDeal(d: Deal) {
    return d.type === 'paid' && !['declined', 'lead'].includes(d.status);
}

// Alias kept for backward compatibility with MonthlyReview.tsx, finance.test.ts, etc.
export const isCommittedPaidDeal = isCommittedDeal;

// 1. Get received cash for a specific deal (ONLY from explicit payment logs)
export function receivedForDeal(deal: Deal, payments: Payment[] = []) {
    const safePayments = Array.isArray(payments) ? payments : [];
    return safePayments
        .filter(p => p.dealId === deal.id)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

// 2. Get outstanding balance for a single deal
export function outstandingForDeal(deal: Deal, payments: Payment[] = []) {
    if (!isCommittedDeal(deal)) return 0;
    const fee = Number(deal.agreedFee ?? deal.payout ?? 0);
    const received = receivedForDeal(deal, payments);
    return Math.max(0, fee - received);
}

// 3. Total Outstanding = Sum of remaining unpaid balances across all active deals
export function totalOutstanding(deals: Deal[] = [], payments: Payment[] = []) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    return safeDeals.reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

// 4. Cash Received In Month = ONLY sum explicit payments logged in payments array.
// MUST DEFAULT TO 0 WHEN NO PAYMENTS ARE LOGGED.
export function cashReceivedInMonth(_deals: Deal[] = [], payments: Payment[] = [], _today: Date = new Date()) {
    const safePayments = Array.isArray(payments) ? payments : [];
    return safePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

// 5. Overdue Balance = Sum of outstanding amounts for deals whose due date has passed
export function overdueBalance(deals: Deal[] = [], payments: Payment[] = [], today: Date = new Date()) {
    const safeDeals = Array.isArray(deals) ? deals : [];
    const todayIso = today.toISOString().split('T')[0];
    return safeDeals
        .filter(d => isCommittedDeal(d) && d.dueDate && d.dueDate < todayIso)
        .reduce((sum, d) => sum + outstandingForDeal(d, payments), 0);
}

// 6. Monthly Expenses
export function expensesInMonth(expenses: Expense[] = [], _today: Date = new Date()) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    return safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

// 7. Net Revenue Collected = Cash Received - Monthly Expenses
export function netRevenueCollected(deals: Deal[] = [], payments: Payment[] = [], expenses: Expense[] = [], today: Date = new Date()) {
    const collected = cashReceivedInMonth(deals, payments, today);
    const monthlyExp = expensesInMonth(expenses, today);
    return Math.max(0, collected - monthlyExp);
}

// Utilities kept for backward compatibility (Money.tsx, finance.test.ts)
export function totalExpenses(expenses: Expense[] = []) {
    const safeExpenses = Array.isArray(expenses) ? expenses : [];
    return safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
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