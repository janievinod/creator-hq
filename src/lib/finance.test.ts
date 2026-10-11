import { describe, expect, it } from 'vitest';
import { cashReceivedInMonth, dealProfit, goalProgress, isCommittedPaidDeal, outstandingForDeal } from './finance';
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
});