import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, DollarSign, Calendar, Lightbulb, Receipt, Settings, ShoppingBag } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Inbound Leads', path: '/inbox', icon: Inbox },
    { label: 'Collaborations', path: '/collaborations', icon: DollarSign },
    { label: 'Reimbursements', path: '/reimbursements', icon: ShoppingBag },
    { label: 'Deliverables Calendar', path: '/calendar', icon: Calendar },
    { label: 'Content Ideas', path: '/ideas', icon: Lightbulb },
    { label: 'Monthly Review', path: '/review', icon: Receipt },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-purple-500/20 bg-[#0d0417]/80 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0 min-h-screen">
            <div className="space-y-8">
                <div>
                    <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 font-display tracking-tight">
                        Creator-HQ
                    </h1>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-pink-400/80 mt-0.5">
                        Brand Partnerships Studio
                    </p>
                </div>

                <nav className="space-y-1.5">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${isActive
                                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/30 text-white border border-pink-500/40 shadow-lg shadow-purple-950/50'
                                        : 'text-purple-300/70 hover:text-white hover:bg-purple-900/30'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4 text-pink-400" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}