import { BarChart3, Calendar, DollarSign, Home, Inbox, Layout, User } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const items = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'collaborations', label: 'Collaborations', icon: Layout },
        { id: 'inbox', label: 'Inbox & DMs', icon: Inbox },
        { id: 'money', label: 'Money & CFO', icon: DollarSign },
        { id: 'content', label: 'Content Planner', icon: Calendar },
        { id: 'review', label: 'Monthly Review', icon: BarChart3 },
        { id: 'profile', label: 'Creator Profile', icon: User },
    ];

    return (
        <aside className="w-64 min-h-screen anime-glass border-r border-purple-500/20 flex flex-col justify-between p-5 select-none">
            <div>
                <div className="flex items-center gap-3 px-3 py-4 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30 text-white font-black text-base">
                        ✨
                    </div>
                    <div>
                        <h1 className="text-sm font-extrabold tracking-wide text-white">Creator HQ</h1>
                        <p className="text-[10px] text-pink-300 font-medium">Anime Night Edition 🌙</p>
                    </div>
                </div>

                <nav className="space-y-1.5">
                    {items.map(item => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all transform hover:translate-x-1 ${isActive
                                        ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/40 text-pink-200 border border-pink-500/40 shadow-lg shadow-purple-900/40'
                                        : 'text-purple-300 hover:bg-purple-900/30 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-purple-400'}`} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="pt-4 border-t border-purple-500/20 flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    JV
                </div>
                <div className="truncate">
                    <p className="text-xs font-bold text-white">Janie V</p>
                    <p className="text-[10px] text-pink-300 truncate">@janiev.ugc</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;