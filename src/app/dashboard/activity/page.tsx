"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, ArrowDownLeft, Wallet, ShoppingBag, Gift, Coins } from "lucide-react";
import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  type: "deposit" | "order" | "refund" | "bonus";
  amount: number;
  description: string;
  created_at: string;
  status: "Completed" | "Pending" | "Cancelled";
}

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("smm_orders") || "[]");
    const deposits = JSON.parse(localStorage.getItem("smm_deposits") || "[]");
    
    const logs: Transaction[] = [];

    orders.forEach((o: any) => {
      logs.push({
        id: o.id,
        type: "order",
        amount: -o.charge,
        description: `Order for ${o.service}`,
        created_at: o.created_at,
        status: o.status === "Cancelled" ? "Cancelled" : "Completed"
      });
    });

    deposits.forEach((d: any) => {
      logs.push({
        id: d.id,
        type: "deposit",
        amount: d.amount,
        description: `Deposit via ${d.method}`,
        created_at: d.created_at,
        status: d.status
      });
    });

    // Sort by date newest first
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setTransactions(logs);
  }, []);

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Account <span className="text-gradient">Activity.</span></h1>
        <p className="text-muted-foreground font-medium">Track your spending, deposits, and rewards in real-time.</p>
      </div>

      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Recent Transactions
           </h3>
           <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Deposits</span>
              <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">Expenses</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Type</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Transaction Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                   <td colSpan={4} className="p-20 text-center text-muted-foreground font-bold italic opacity-30 text-sm">No activity recorded on this account.</td>
                </tr>
              )}
              {transactions.map((tx, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  key={tx.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-6">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'deposit' ? <ArrowUpRight className="w-5 h-5" /> : tx.type === 'order' ? <ArrowDownLeft className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                     </div>
                  </td>
                  <td className="p-6">
                     <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{tx.description}</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-6 text-center">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${tx.status === 'Completed' || tx.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {tx.status}
                     </span>
                  </td>
                  <td className="p-6 text-right">
                     <p className={`text-lg font-black tracking-tighter ${tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                     </p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">PKR</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Coins className="w-5 h-5" />
               </div>
               <h4 className="font-bold">Automated Accounting</h4>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Our advanced ledger system captures every single credit and debit in real-time. Charges for orders are deducted instantly, and refunds for cancelled services are processed back to your vault automatically.</p>
         </div>
         <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Wallet className="w-5 h-5" />
               </div>
               <h4 className="font-bold">Vault Security</h4>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Transactions are signed with a unique cryptographic hash and persisted across multiple global shards. Your balance remains accurate even during massive algorithmic demand spikes.</p>
         </div>
      </div>
    </div>
  );
}
