import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Inbox, DollarSign, Calendar, BarChart3, User, Award } from 'lucide-react';
import { useStore } from '../context/store';

export default function Sidebar() {
    const { profile } = useStore();

    const navItems = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/collaborations', label: 'Collaborations', icon: Briefcase },
        { to: '/brands', label: 'Brands I Worked With', icon: Award },
        { to: '/inbox', label: 'Inbox & DMs', icon: Inbox },
        { to: '/money', label: 'Money & CFO', icon: DollarSign },
        { to: '/content', label: 'Content Planner', icon: Calendar },
        { to: '/review', label: 'Monthly Review', icon: BarChart3 },
        { to: '/profile', label: 'Creator Profile', icon: User },
    ];

    return (
        <aside className="w-64 min-h-screen anime-glass border-r border-purple-500/20 p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-pink-500/30">
                        ✨
                    </div>
                    <div>
                        <h1 className="text-base font-black text-white leading-none">Creator HQ</h1>
                        <p className="text-[10px] text-pink-400 font-bold tracking-wider mt-0.5">Anime Night Edition 🌙</p>
                    </div>
                </div>

                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                                        ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-md shadow-pink-500/20 border border-pink-400/30'
                                        : 'text-purple-200/70 hover:text-white hover:bg-purple-950/40'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-purple-500/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/30 border border-pink-400/40 flex items-center justify-center font-bold text-xs text-pink-300">
                    {profile.name ? profile.name.charAt(0) : 'J'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{profile.name || 'Janie V'}</p>
                    <p className="text-[10px] text-purple-300/70 truncate">{profile.handle || '@janiev.ugc'}</p>
                </div>
            </div>
        </aside>
    );
}