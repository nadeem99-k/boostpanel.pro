"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, ListFilter, SlidersHorizontal, ArrowLeft, Globe, Zap, Clock } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  category: string;
  name: string;
  rate: number;
  min: string;
  max: string;
  description?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        setServices(data);
        const cats = Array.from(new Set(data.map((s: Service) => s.category)));
        setCategories(cats as string[]);
      });
  }, []);

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Boost
            </Link>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Services <span className="text-primary tracking-normal font-medium text-lg ml-2">{services.length} Online</span>
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sticky top-4 z-40 bg-background/80 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search services (Instagram, Likes, Followers...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            <button 
              onClick={() => setActiveCategory("All")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === "All" ? "bg-primary text-primary-foreground" : "glass border-white/10 text-muted-foreground hover:bg-white/5"}`}
            >
              All Services
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "glass border-white/10 text-muted-foreground hover:bg-white/5"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Display */}
        <div className="space-y-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-dashed">
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">No services found for your search.</p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-hidden glass rounded-3xl border border-white/5 shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Service Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price/1k</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Limit</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Speed</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-6 text-xs font-mono text-muted-foreground">#{s.id}</td>
                        <td className="px-6 py-6">
                           <p className="font-bold text-foreground mb-1">{s.name}</p>
                           {s.description && <p className="text-xs text-muted-foreground/70 max-w-sm leading-relaxed">{s.description}</p>}
                        </td>
                        <td className="px-6 py-6 font-black text-primary">Rs. {s.rate.toFixed(2)}</td>
                        <td className="px-6 py-6 text-xs text-muted-foreground font-bold">{s.min} / {s.max}</td>
                        <td className="px-6 py-6 text-xs font-medium text-muted-foreground opacity-60">~15m</td>
                        <td className="px-6 py-6">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Stable
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((s) => (
                  <motion.div 
                    layout 
                    key={s.id} 
                    className="glass p-6 rounded-3xl border border-white/5 space-y-4 hover:border-primary/20 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground/40 mb-1">SERVICE ID: {s.id}</p>
                        <h3 className="font-bold text-lg leading-tight">{s.name}</h3>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                         <span className="text-primary font-black text-lg tracking-tight">Rs.{s.rate.toFixed(2)}</span>
                         <span className="text-[9px] font-black uppercase text-muted-foreground opacity-50">per 1000 units</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Limits</p>
                          <p className="text-sm font-bold">{s.min} - {s.max}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Speed</p>
                          <p className="text-sm font-bold flex items-center justify-end gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Instant</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Live Now
                       </span>
                       <Link href="/dashboard/new-order" className="text-xs font-black text-primary hover:underline">Order Now</Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
