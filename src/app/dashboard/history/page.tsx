"use client";

import { useEffect, useState } from "react";
import { Search, ListFilter, Eye, Clock, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  created_at: string;
}

const STATUS_STYLING = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem("smm_orders") || "[]");
      setOrders(saved.reverse()); // Newest first
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter(o => 
    o.service.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-white/5 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Order History
        </h2>
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Order ID or Service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-background border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center glass rounded-3xl border-dashed">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No orders found.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            
            {/* ── DESKTOP TABLE ── */}
            <div className="hidden lg:block overflow-hidden glass rounded-2xl border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">ID</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Service</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Amount</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((order) => (
                    <motion.tr layout key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-foreground leading-tight md:max-w-xs">{order.service}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[200px]">{order.link}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-black text-foreground">Rs. {order.charge.toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{order.quantity} units</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${STATUS_STYLING[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-muted-foreground font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="lg:hidden space-y-4">
              {filtered.map((order) => (
                <motion.div 
                  layout 
                  key={order.id} 
                  className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full opacity-50 ${STATUS_STYLING[order.status].split(' ')[1]}`} />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Order ID: {order.id.slice(0, 8)}</p>
                      <h3 className="font-bold text-base leading-tight mt-1">{order.service}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tighter shrink-0 ${STATUS_STYLING[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/5 pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest opacity-60">Charge</p>
                      <p className="text-lg font-black tracking-tighter">Rs. {order.charge.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest opacity-60">Date</p>
                       <p className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-50">Target URL</p>
                    <p className="text-xs text-primary truncate max-w-full font-medium">{order.link}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
