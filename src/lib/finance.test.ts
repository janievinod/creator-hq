import { describe, expect, it } from 'vitest';
import { cashReceivedInMonth, dealProfit, goalProgress, isCommittedPaidDeal, outstandingForDeal, overdueBalance, totalOutstanding, netRevenueCollected } from './finance';
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
        { id: 'e1', dealId: 'd1', title: 'Prop purchase', note: 'Prop purchase', amount: 1200, date: '2026-10-02', category: 'studio' }
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

    it('clears outstanding balance to zero when full payments are recorded', () => {
        const fullPayments: Payment[] = [{ id: 'p_full', dealId: 'd1', amount: 15000, date: '2026-10-05' }];
        expect(outstandingForDeal(sampleDeal, fullPayments)).toBe(0);
    });

    it('correctly aggregates all active/committed deal payouts pending collection in totalOutstanding', () => {
        expect(totalOutstanding([sampleDeal], samplePayments)).toBe(7000); // 15000 - 8000 = 7000
        expect(totalOutstanding([sampleDeal], [])).toBe(15000); // full 15000 pending collection when no payments
    });

    it('defaults cashReceivedInMonth to 0 when no explicit payments are logged', () => {
        expect(cashReceivedInMonth([sampleDeal], [])).toBe(0);
    });

    it('calculates overdueBalance for committed deals past due date based on outstanding amount', () => {
        const overdueDeal: Deal = {
            id: 'd_overdue',
            title: 'Overdue Collab',
            type: 'paid',
            status: 'posted',
            agreedFee: 10000,
            dueDate: '2026-10-01',
        };
        const today = new Date('2026-10-15');

        // Full fee is overdue when no payments received
        expect(overdueBalance([overdueDeal], [], today)).toBe(10000);

        // Clears to zero once payment received
        const paidPayment: Payment[] = [{ id: 'p_paid', dealId: 'd_overdue', amount: 10000, date: '2026-10-05' }];
        expect(overdueBalance([overdueDeal], paidPayment, today)).toBe(0);
    });

    it('calculates net revenue dynamically deducting expenses from collected payments', () => {
        const payments: Payment[] = [{ id: 'p1', dealId: 'd1', amount: 5000, date: '2026-10-05' }];
        const expenses: Expense[] = [{ id: 'e1', title: 'Props', amount: 200, date: '2026-10-10', category: 'studio' }];

        // Gross ₹5,000 - Expenses ₹200 = ₹4,800
        expect(netRevenueCollected([sampleDeal], payments, expenses)).toBe(4800);

        // When no payments collected, defaults cleanly to 0 (does not go negative)
        expect(netRevenueCollected([sampleDeal], [], expenses)).toBe(0);
    });

    it('correctly calculates total outstanding for all 13 active brand deals and defaults collected to 0', async () => {
        const { DEFAULT_DEALS } = await import('../context/store');
        expect(DEFAULT_DEALS.length).toBe(13);
        expect(cashReceivedInMonth(DEFAULT_DEALS, [])).toBe(0);
        expect(totalOutstanding(DEFAULT_DEALS, [])).toBe(30547);
    });
});