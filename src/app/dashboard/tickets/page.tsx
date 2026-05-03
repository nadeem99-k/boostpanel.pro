"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LifeBuoy, Plus, Clock, CheckCircle, MessageCircle, X, ChevronDown } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  orderId?: string;
  message: string;
  status: "Pending" | "Answered" | "Closed";
  created_at: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("Order Issue");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTickets = () => {
      const saved = JSON.parse(localStorage.getItem("smm_tickets") || "[]");
      setTickets(saved);
    };
    loadTickets();
    // Simulate updating tickets
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
      subject,
      orderId: orderId.trim() || undefined,
      message,
      status: "Pending",
      created_at: new Date().toISOString()
    };

    const updated = [newTicket, ...tickets];
    localStorage.setItem("smm_tickets", JSON.stringify(updated));
    setTickets(updated);
    
    setIsModalOpen(false);
    setSubject("Order Issue");
    setOrderId("");
    setMessage("");
  };

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "Pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Answered": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Closed": return "text-neutral-500 bg-neutral-500/10 border-neutral-500/20";
      default: return "";
    }
  };

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "Pending": return <Clock className="w-3 h-3" />;
      case "Answered": return <MessageCircle className="w-3 h-3" />;
      case "Closed": return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-primary" /> Support Tickets
          </h2>
          <p className="text-muted-foreground mt-1">Need help? Open a ticket and our support team will assist you.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 bg-primary hover:bg-primary/80 text-primary-foreground rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0"
        >
          <Plus className="w-5 h-5" /> New Ticket
        </button>
      </div>

      <div className="mt-8">
         {tickets.length === 0 ? (
            <div className="glass rounded-[2rem] border border-border flex flex-col items-center justify-center py-24 gap-4 text-center">
               <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mb-2">
                  <LifeBuoy className="w-8 h-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-bold text-foreground">No Tickets Found</h3>
               <p className="text-muted-foreground text-sm max-w-sm font-medium">You haven't opened any support tickets yet. If you have an issue, tap "New Ticket".</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={ticket.id} 
                  className="glass p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all flex flex-col"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className={`p-3 rounded-2xl border border-white/5 ${getStatusColor(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                         </div>
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{ticket.id}</span>
                            <h4 className="font-bold text-lg text-foreground leading-none mt-1">{ticket.subject}</h4>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                         {ticket.status}
                      </span>
                   </div>
                   
                   <div className="flex-1">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-neutral-300 leading-relaxed min-h-[80px]">
                         {ticket.message}
                      </div>
                      {ticket.orderId && (
                         <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Order Ref</span>
                            <span className="text-xs font-mono font-bold text-primary opacity-80">{ticket.orderId}</span>
                         </div>
                      )}
                   </div>

                   <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <Clock className="w-3 h-3" />
                         {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                         View Details <ChevronDown className="-rotate-90 w-3 h-3" />
                      </button>
                   </div>
                </motion.div>
              ))}
            </div>
         )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
           >
              <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg glass-crystal rounded-3xl border border-border p-6 md:p-8 shadow-2xl"
              >
                 <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-6 h-6" />
                 </button>
                 <h3 className="text-xl font-bold text-foreground mb-6">Create New Ticket</h3>
                 
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-foreground">Subject</label>
                       <div className="relative">
                          <select 
                             value={subject} 
                             onChange={e => setSubject(e.target.value)}
                             className="w-full h-12 bg-background border border-border rounded-xl px-4 appearance-none text-foreground text-sm focus:outline-none focus:border-primary/50"
                          >
                             <option value="Order Issue">Order Issue</option>
                             <option value="Payment Issue">Payment Issue</option>
                             <option value="API Support">API Support</option>
                             <option value="Bug Report">Bug Report</option>
                             <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-foreground">Order ID <span className="text-muted-foreground font-normal">(Optional)</span></label>
                       <input 
                          type="text"
                          value={orderId}
                          onChange={e => setOrderId(e.target.value)}
                          placeholder="e.g. 19e4a2... or mass string"
                          className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/30"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-foreground">Message</label>
                       <textarea 
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          required
                          placeholder="Describe your issue in detail..."
                          className="w-full h-32 bg-background border border-border rounded-xl p-4 text-foreground text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/30 resize-none"
                       ></textarea>
                    </div>

                    <button
                       type="submit"
                       className="w-full h-12 mt-4 bg-primary hover:bg-primary/80 text-primary-foreground rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                       Submit Ticket
                    </button>
                 </form>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
