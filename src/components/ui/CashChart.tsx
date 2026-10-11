import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Deal, Payment } from '../../types';

interface CashChartProps {
    deals?: Deal[];
    payments: Payment[];
    today: Date;
}

export default function CashChart({ payments, today }: CashChartProps) {
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
        return {
            name: d.toLocaleString('en-US', { month: 'short' }),
            year: d.getFullYear(),
            month: d.getMonth(),
        };
    });

    const data = months.map(m => {
        const total = payments
            .filter(p => {
                const pd = new Date(p.date);
                return pd.getFullYear() === m.year && pd.getMonth() === m.month;
            })
            .reduce((sum, p) => sum + p.amount, 0);
        return { name: m.name, cash: total };
    });

    return (
        <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#c084fc" fontSize={11} tickLine={false} axisLine={false} dy={4} />
                    <YAxis stroke="#c084fc" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(24, 10, 42, 0.95)',
                            borderColor: 'rgba(236, 72, 153, 0.5)',
                            borderRadius: '16px',
                            color: '#f3e8ff',
                            fontSize: '12px',
                            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.25)',
                            backdropFilter: 'blur(12px)',
                            padding: '10px 14px',
                        }}
                        itemStyle={{ color: '#f472b6', fontWeight: 700 }}
                        formatter={(val) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, 'Cash Inflow']}
                    />
                    <Bar dataKey="cash" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}