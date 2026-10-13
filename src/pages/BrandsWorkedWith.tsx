import { useStore } from '../context/store';
import { ExternalLink, Tag, Video, Award } from 'lucide-react';

export default function BrandsWorkedWith() {
    const { brands, deals } = useStore();

    // Filter out any brands that have 0 deals attached to them
    const activeBrands = brands.filter((brand) => {
        const brandDeals = deals.filter((d) => d.brandId === brand.id);
        return brandDeals.length > 0;
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-purple-100">
            {/* Header */}
            <div className="anime-glass p-6 rounded-3xl border border-purple-500/30 flex justify-between items-center">
                <div>
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-widest flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Portfolio Directory
                    </span>
                    <h1 className="text-3xl font-black text-white mt-1">Brands I Worked With</h1>
                    <p className="text-xs text-purple-300/80 mt-1">Detailed directory of brand partnerships, campaigns, payouts, and live output links.</p>
                </div>
            </div>

            {/* Grid of Brands */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeBrands.length === 0 ? (
                    <div className="col-span-2 anime-glass p-8 rounded-2xl text-center text-purple-300">
                        No brand collaborations logged yet. Add your deals in Collaborations to see them here!
                    </div>
                ) : (
                    activeBrands.map((brand) => {
                        const brandDeals = deals.filter((d) => d.brandId === brand.id);
                        const totalEarned = brandDeals.reduce((acc, d) => acc + (d.agreedFee || 0), 0);
                        const allLinks = brandDeals.flatMap((d) => d.deliverableLinks || []);

                        return (
                            <div key={brand.id} className="anime-glass p-6 rounded-3xl border border-purple-500/20 space-y-4 relative overflow-hidden">
                                {/* Brand Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-500/20">
                                            {brand.name ? brand.name.charAt(0) : 'B'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white">{brand.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] bg-purple-950/80 text-pink-300 px-2 py-0.5 rounded-md font-semibold border border-purple-500/20 flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {brand.niche || 'Beauty'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] text-purple-300 font-bold uppercase">Total Revenue</p>
                                        <p className="text-lg font-black text-emerald-400">₹{totalEarned.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Metrics Summary */}
                                <div className="grid grid-cols-2 gap-3 bg-purple-950/40 p-3 rounded-2xl border border-purple-500/10 text-center">
                                    <div>
                                        <p className="text-[10px] text-purple-300 font-bold uppercase">Campaigns Executed</p>
                                        <p className="text-sm font-black text-white">{brandDeals.length} Deals</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-purple-300 font-bold uppercase">Live Deliverables</p>
                                        <p className="text-sm font-black text-pink-400">{allLinks.length} Published Videos</p>
                                    </div>
                                </div>

                                {/* Campaign Breakdown & Output Links */}
                                <div className="space-y-2 pt-1">
                                    <p className="text-xs font-extrabold text-white flex items-center gap-1">
                                        <Video className="w-3.5 h-3.5 text-pink-400" /> Deliverables & Output Links
                                    </p>

                                    {brandDeals.map((deal) => (
                                        <div key={deal.id} className="bg-purple-950/60 p-3 rounded-xl border border-purple-500/20 space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-white">{deal.title}</span>
                                                <span className="text-emerald-400 font-black">₹{(deal.agreedFee || 0).toLocaleString('en-IN')}</span>
                                            </div>

                                            {deal.deliverableLinks && deal.deliverableLinks.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {deal.deliverableLinks.map((link, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-pink-950/50 hover:bg-pink-900/60 text-pink-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-pink-500/30 flex items-center gap-1 transition-all"
                                                        >
                                                            Reel #{idx + 1} <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-purple-400 italic">No output link uploaded yet.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}