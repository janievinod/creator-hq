import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';

export default function Calendar() {
    const { deliverables, toggleDeliverable, deals, brands } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const formatDateKey = (dayNum: number) => {
        const m = String(month + 1).padStart(2, '0');
        const d = String(dayNum).padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const activeMonthDeliverables = deliverables.filter(item => {
        const itemDate = new Date(item.dueDate);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
    });

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Deliverables Calendar"
                subtitle="Track upcoming reel deadlines, story posts, and content deliverables"
            />

            {/* Calendar Controls */}
            <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-pink-400" />
                    <h2 className="text-xl font-black text-white font-display">
                        {monthNames[month]} {year}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-900/40 border border-purple-500/30 hover:text-white transition-all cursor-pointer"
                    >
                        Today
                    </button>
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-xl text-purple-300 bg-purple-900/40 border border-purple-500/30 hover:text-white transition-all cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-xl text-purple-300 bg-purple-900/40 border border-purple-500/30 hover:text-white transition-all cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-black uppercase tracking-widest text-pink-400/80 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[120px] rounded-2xl bg-purple-950/10 border border-purple-500/10 opacity-30" />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateKey = formatDateKey(dayNum);
                        const isToday = dateKey === todayStr;
                        const dayDeliverables = deliverables.filter(d => d.dueDate === dateKey);

                        return (
                            <div
                                key={dateKey}
                                className={`min-h-[120px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${isToday
                                        ? 'border-pink-500 bg-pink-950/30 shadow-lg shadow-pink-950/40'
                                        : 'border-purple-500/20 bg-purple-950/20 hover:border-purple-500/40'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`text-xs font-black rounded-lg px-2 py-0.5 ${isToday ? 'bg-pink-500 text-white' : 'text-purple-300'
                                            }`}
                                    >
                                        {dayNum}
                                    </span>
                                    {dayDeliverables.length > 0 && (
                                        <span className="text-[10px] font-extrabold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded-md">
                                            {dayDeliverables.length} due
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 my-2 flex-1 overflow-y-auto max-h-[100px]">
                                    {dayDeliverables.map(item => {
                                        const targetDeal = deals.find(d => d.id === item.dealId);
                                        const brand = targetDeal ? brands.find(b => b.id === targetDeal.brandId) : null;
                                        const isOverdue = !item.done && item.dueDate < todayStr;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleDeliverable(item.id)}
                                                className={`p-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all border flex items-center justify-between gap-1 ${item.done
                                                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 line-through opacity-60'
                                                        : isOverdue
                                                            ? 'bg-red-950/50 text-red-300 border-red-500/40'
                                                            : 'bg-purple-900/60 text-purple-200 border-purple-500/30 hover:border-pink-500/50'
                                                    }`}
                                            >
                                                <span className="truncate">
                                                    {brand ? `[${brand.name}] ` : ''}{item.type}
                                                </span>
                                                {item.done ? (
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                                ) : isOverdue ? (
                                                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                                                ) : (
                                                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Agenda Timeline */}
            <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-black text-white font-display uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400" /> Month Agenda Timeline
                </h3>

                {activeMonthDeliverables.length === 0 ? (
                    <p className="text-xs text-purple-300/70 italic">No deliverables scheduled for this month.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeMonthDeliverables.map(item => {
                            const targetDeal = deals.find(d => d.id === item.dealId);
                            const brand = targetDeal ? brands.find(b => b.id === targetDeal.brandId) : null;
                            const isOverdue = !item.done && item.dueDate < todayStr;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleDeliverable(item.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${item.done
                                            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                                            : isOverdue
                                                ? 'border-red-500/40 bg-red-950/20 text-red-300'
                                                : 'border-purple-500/30 bg-purple-950/30 hover:border-pink-500/40 text-white'
                                        }`}
                                >
                                    <div>
                                        <p className="text-xs font-extrabold">{item.type}</p>
                                        <p className="text-[10px] text-purple-300 mt-0.5">
                                            {brand?.name || 'Collaboration'} · Due: {item.dueDate}
                                        </p>
                                    </div>

                                    <button className="shrink-0 p-1.5 rounded-lg bg-purple-900/50 border border-purple-500/30">
                                        <CheckCircle2 className={`w-4 h-4 ${item.done ? 'text-emerald-400' : 'text-purple-400'}`} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}