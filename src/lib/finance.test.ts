import { describe, expect, it } from 'vitest';
import { cashReceivedInMonth, dealProfit, goalProgress, isCommittedPaidDeal, outstandingForDeal, overdueBalance, totalOutstanding } from './finance';
import type { Deal, Expense, Payment } from '../types';

describe('Finance Helpers', () => {
    const sampleDeal: Deal = {
        id: 'd1',
        brandId: 'b1',
        title: 'Summer Campaign',
        type: 'paid',
        status: 'in_progress',
        agreedFee: 15000,
        dueDate: '2026-10-20'
    };

    const samplePayments: Payment[] = [
        { id: 'p1', dealId: 'd1', amount: 5000, date: '2026-10-05' },
        { id: 'p2', dealId: 'd1', amount: 3000, date: '2026-10-10' }
    ];

    const sampleExpenses: Expense[] = [
        { id: 'e1', dealId: 'd1', note: 'Prop purchase', amount: 1200, date: '2026-10-02' }
    ];

    it('identifies committed paid deals correctly', () => {
        expect(isCommittedPaidDeal(sampleDeal)).toBe(true);
        expect(isCommittedPaidDeal({ ...sampleDeal, status: 'declined' })).toBe(false);
        expect(isCommittedPaidDeal({ ...sampleDeal, type: 'barter' })).toBe(false);
    });

    it('calculates remaining outstanding balance for a deal', () => {
        const outstanding = outstandingForDeal(sampleDeal, samplePayments);
        expect(outstanding).toBe(7000); // 15000 - 8000
    });

    it('calculates net deal profit after expenses', () => {
        const profit = dealProfit(sampleDeal, sampleExpenses);
        expect(profit).toBe(13800); // 15000 - 1200
    });

    it('calculates total cash received in current month', () => {
        const today = new Date('2026-10-11');
        const cash = cashReceivedInMonth([sampleDeal], samplePayments, today);
        expect(cash).toBe(8000);
    });

    it('calculates goal progress percentage correctly', () => {
        expect(goalProgress(30000, 60000)).toBe(50);
        expect(goalProgress(75000, 50000)).toBe(100); // capped at 100%
    });

    it('clears outstanding balance to zero when deal is marked paid', () => {
        const paidDeal: Deal = { ...sampleDeal, status: 'paid' };
        expect(outstandingForDeal(paidDeal, [])).toBe(0);
        expect(outstandingForDeal(paidDeal, samplePayments)).toBe(0);
    });

    it('clears totalOutstanding and overdueBalance to zero when deals are paid', () => {
        const overdueDeal: Deal = {
            id: 'd_overdue',
            title: 'Overdue Collab',
            type: 'paid',
            status: 'posted',
            agreedFee: 10000,
            dueDate: '2026-10-01',
        };
        const today = new Date('2026-10-15');

        // Before paying
        expect(overdueBalance([overdueDeal], [], today)).toBe(10000);

        // When marked paid
        const paidOverdueDeal: Deal = { ...overdueDeal, status: 'paid' };
        expect(overdueBalance([paidOverdueDeal], [], today)).toBe(0);
        expect(totalOutstanding([paidOverdueDeal], [])).toBe(0);
    });

    it('dynamically derives cashReceivedInMonth from paid deals without double counting payments', () => {
        const today = new Date('2026-10-15');
        const paidDeal: Deal = {
            id: 'd_paid',
            title: 'Paid Collab',
            type: 'paid',
            status: 'paid',
            agreedFee: 12000,
            completedDate: '2026-10-10',
        };

        // Case 1: Derived from deal marked paid when payments array has no entry
        expect(cashReceivedInMonth([paidDeal], [], today)).toBe(12000);

        // Case 2: Matching payment exists - should not double count
        const matchingPayment: Payment = {
            id: 'p_paid',
            dealId: 'd_paid',
            amount: 12000,
            date: '2026-10-10',
        };
        expect(cashReceivedInMonth([paidDeal], [matchingPayment], today)).toBe(12000);
    });
});