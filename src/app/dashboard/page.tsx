"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingCart, 
  Wallet, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  ArrowRight,
  Zap,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    balance: 0,
    totalSpent: 0,
    activeOrders: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const orders = JSON.parse(localStorage.getItem("smm_orders") || "[]");
      const balance = parseFloat(localStorage.getItem("smm_balance") || "0");
      
      const spent = orders.reduce((acc: number, curr: any) => acc + (curr.status !== 'Cancelled' ? Number(curr.charge) : 0), 0);
      const active = orders.filter((o: any) => o.status === 'Pending' || o.status === 'In Progress').length;
      
      // Category Breakdown logic
      const cats: Record<string, number> = {};
      orders.forEach((o: any) => {
         const name = o.service.split(' ')[0] || "Other";
         const amt = Number(o.charge);
         cats[name] = (cats[name] || 0) + amt;
      });
      const topCats = Object.entries(cats)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 4)
         .map(([name, val]) => ({ name, val }));

      // XP/Level logic
      const totalXp = Math.floor(spent / 10);
      const level = Math.floor(totalXp / 100) + 1;
      const progress = totalXp % 100;

      setStats({
        balance,
        totalSpent: spent,
        activeOrders: active,
        totalOrders: orders.length,
        level,
        progress,
        topCats
      } as any);
      setRecentOrders(orders.slice(0, 3));
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Your <span className="text-gradient">Empire.</span></h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2 mt-2">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             System live and processing latest commands.
          </p>
        </div>

        <div className="glass p-4 px-6 rounded-3xl border border-primary/20 bg-primary/5 flex items-center gap-5">
           <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                 <span className="text-2xl font-black">L{(stats as any).level || 1}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Prestige Rank</p>
              <div className="w-32 md:w-48 h-2 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(stats as any).progress || 0}%` }}
                   className="h-full bg-primary shadow-[0_0_10px_#a855f7]" 
                 />
              </div>
              <p className="text-[9px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">{(stats as any).progress || 0} / 100 XP TO LEVEL UP</p>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Wallet, label: "Your Balance", value: `Rs. ${stats.balance.toFixed(2)}`, trend: "Primary Wallet", color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: TrendingUp, label: "Total Spent", value: `Rs. ${stats.totalSpent.toFixed(2)}`, trend: "Life-time", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { icon: ShoppingCart, label: "Active Orders", value: stats.activeOrders, trend: "In process now", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Clock, label: "Total Completed", value: stats.totalOrders - stats.activeOrders, trend: "Fulfillment history", color: "text-amber-500", bg: "bg-amber-500/10" }
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all"
          >
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${s.bg} border border-white/5 ${s.color}`}>
                   <s.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{s.label}</p>
             <p className="text-2xl md:text-3xl font-black mt-1 tracking-tighter">{s.value}</p>
             <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.trend}</span>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main CTA */}
        <div className="lg:col-span-2 space-y-4">
           <Link href="/dashboard/new-order" className="block group">
              <div className="relative p-10 md:p-12 rounded-[2.5rem] overflow-hidden bg-primary shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                 <div className="absolute top-0 right-0 p-12 opacity-20 group-hover:scale-110 transition-transform">
                    <Zap className="w-32 h-32 md:w-48 md:h-48 text-white" />
                 </div>
                 <div className="relative z-10 max-w-sm">
                    <h3 className="text-4xl font-black text-white leading-none mb-4">Start Growing <br /> Today.</h3>
                    <p className="text-white/80 font-medium mb-8 text-lg">Process your first order in under 20 seconds. Automated & Instant.</p>
                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:gap-2 transition-all">
                       <ArrowRight className="w-6 h-6" />
                    </div>
                 </div>
              </div>
           </Link>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/funds" className="flex items-center justify-between p-8 glass rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                 <div>
                    <h4 className="font-bold text-lg mb-1">Add Liquidity</h4>
                    <p className="text-xs text-muted-foreground font-medium">Automatic balance top-up.</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                 </div>
              </Link>
              <Link href="/dashboard/history" className="flex items-center justify-between p-8 glass rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                 <div>
                    <h4 className="font-bold text-lg mb-1">Track Orders</h4>
                    <p className="text-xs text-muted-foreground font-medium">View live fulfillment logs.</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                 </div>
              </Link>
           </div>
        </div>

        {/* Support Card */}
        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[100px]" />
           <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                 <Activity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">Latest Movements</h3>
              <div className="space-y-4 mb-10">
                 {recentOrders.length > 0 ? (
                    recentOrders.map((order, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                          <div className="min-w-0">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{order.service}</p>
                             <p className="text-xs font-bold text-foreground mt-0.5">Rs. {Number(order.charge).toFixed(2)}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${order.status === 'Pending' ? 'bg-amber-400' : 'bg-emerald-400'} shadow-[0_0_10px_rgba(34,197,94,0.5)]`} />
                       </div>
                    ))
                 ) : (
                    <p className="text-sm text-muted-foreground font-medium italic">No recent movements detected.</p>
                 )}
              </div>
           </div>
           <Link href="/dashboard/tickets" className="w-full flex items-center justify-center h-14 glass border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all text-foreground text-center">
              Request Support
           </Link>
        </div>

        {/* Spend Categories Summary */}
        <div className="lg:col-span-3">
           <div className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-10 opacity-5">
                 <Activity className="w-64 h-64 text-white" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                 <div className="max-w-md">
                    <h3 className="text-2xl font-black mb-4">Spend Analysis</h3>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">Your most active categories based on lifetime spending. Optimize your growth strategy by analyzing where your resources go.</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                    {((stats as any).topCats || []).length > 0 ? (stats as any).topCats.map((cat: any, i: number) => (
                       <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary">{cat.name}</p>
                             <p className="text-sm font-black">Rs. {cat.val.toFixed(0)}</p>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${Math.min(100, (cat.val / (stats.totalSpent || 1)) * 100)}%` }}
                               className="h-full bg-gradient-to-r from-primary to-blue-500" 
                             />
                          </div>
                       </div>
                    )) : (
                       <div className="col-span-4 py-6 text-center text-muted-foreground font-bold italic opacity-30">Waiting for data...</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
