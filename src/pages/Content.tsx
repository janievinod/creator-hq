import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { useStore } from '../context/store';
import { btnCls, inputCls } from '../lib/theme';
import type { IdeaStatus } from '../types';
import { Lightbulb, Sparkles, Video } from 'lucide-react';

const STEPS: { id: IdeaStatus; label: string; activeCls: string }[] = [
    { id: 'idea', label: '💡 Concept', activeCls: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(251,191,36,0.3)] font-bold' },
    { id: 'scripted', label: '✍️ Storyboarded', activeCls: 'bg-sky-950/80 text-sky-300 border-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.3)] font-bold' },
    { id: 'filmed', label: '🎬 In Production', activeCls: 'bg-purple-950/80 text-pink-300 border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)] font-bold' },
    { id: 'posted', label: '✅ Published', activeCls: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(52,211,153,0.3)] font-bold' },
];

export default function Content() {
    const { ideas, addIdea, setIdeaStatus } = useStore();
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');

    const add = () => {
        if (title.trim()) {
            addIdea(title.trim(), notes.trim() || undefined);
            setTitle('');
            setNotes('');
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <PageHeader
                title="Content Studio & Storyboards"
                subtitle="Capture anime reels, viral cosplay concepts, and visual production stages"
            />

            {/* Quick Idea Generator Form */}
            <div className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-pink-400" />
                    <h2 className="text-xs font-black text-pink-300 uppercase tracking-widest font-display">
                        New Creative Concept
                    </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <input
                        className={`${inputCls} flex-1 min-w-[240px]`}
                        placeholder="Reel hook, cosplay visual angle, or aesthetic audio concept…"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') add(); }}
                    />
                    <input
                        className={`${inputCls} flex-1 min-w-[200px]`}
                        placeholder="Storyboard notes, neon lighting setup, props (optional)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') add(); }}
                    />
                    <button className={btnCls} onClick={add}>
                        <Sparkles className="w-3.5 h-3.5" /> Save Concept
                    </button>
                </div>
            </div>

            {/* Content Pipeline Cards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-pink-400" />
                        <h2 className="text-sm font-black text-white uppercase tracking-widest font-display">
                            Production Pipeline
                        </h2>
                    </div>
                    <span className="text-xs text-purple-300 font-medium">{ideas.length} Saved Concepts</span>
                </div>

                {ideas.length === 0 ? (
                    <div className="rounded-3xl anime-glass border border-purple-500/30 p-12 text-center text-xs text-purple-300 shadow-xl">
                        <Lightbulb className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                        <p className="font-extrabold text-white text-base font-display">No concepts logged yet</p>
                        <p className="mt-1">Add your first video concept above to track its storyboard and production stages.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {ideas.map(i => (
                            <div
                                key={i.id}
                                className="rounded-3xl anime-glass border border-purple-500/30 p-6 shadow-xl hover:border-pink-500/50 hover:shadow-2xl transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="font-extrabold text-white text-base leading-snug font-display">{i.title}</h3>
                                    {i.notes && (
                                        <p className="mt-3 text-xs text-purple-200 bg-purple-950/40 p-3.5 rounded-2xl border border-purple-500/20 leading-relaxed font-normal">
                                            {i.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-purple-500/20">
                                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-2">Stage</span>
                                    <div className="flex flex-wrap gap-2">
                                        {STEPS.map(st => {
                                            const isActive = i.status === st.id;
                                            return (
                                                <button
                                                    key={st.id}
                                                    onClick={() => setIdeaStatus(i.id, st.id)}
                                                    className={`rounded-xl px-3.5 py-1.5 text-xs cursor-pointer transition-all border ${
                                                        isActive
                                                            ? st.activeCls
                                                            : 'bg-purple-950/40 text-purple-300 hover:text-white hover:bg-purple-900/40 border-purple-500/25'
                                                    }`}
                                                >
                                                    {st.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}