export function formatINR(val: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

export function formatDate(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function daysLeft(dueDateStr: string, todayIso: Date | string): number {
    const target = new Date(dueDateStr).getTime();
    const today = new Date(todayIso).getTime();
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function toISO(d: Date): string {
    return d.toISOString().split('T')[0];
}