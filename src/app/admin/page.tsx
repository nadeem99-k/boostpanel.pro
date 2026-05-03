"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, Clock, XCircle, Users, ShoppingBag, Wallet, 
  TrendingUp, DollarSign, Copy, ExternalLink, HelpCircle, ArrowRight,
  Filter, Search, RefreshCw, Plus, Edit2, Trash2, Shield, Settings2, Activity, Globe
} from "lucide-react";

interface Order {
  id: string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  created_at: string;
}

interface Deposit {
  id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  orderId?: string;
  message: string;
  status: "Pending" | "Answered" | "Closed";
  created_at: string;
}

interface Service {
  id: string;
  category: string;
  name: string;
  rate: number;
  min: string;
  max: string;
  description: string;
}

interface User {
  email: string;
  created_at: string;
  balance: number;
  status: "Active" | "Banned";
}

interface ChildRequest {
  id: string;
  email: string;
  panelName: string;
  domain: string;
  status: "Pending" | "Approved" | "Active";
  created_at: string;
}

const STATUS_STYLING: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 1 });
  const [topupAmount, setTopupAmount] = useState(0);
  const [topupMsg, setTopupMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "deposits" | "tickets" | "services" | "users" | "child" | "system">("orders");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [broadcast, setBroadcast] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [childRequests, setChildRequests] = useState<ChildRequest[]>([]);
  
  // System Config
  const [autoProcess, setAutoProcess] = useState(false);
  const [simSpeed, setSimSpeed] = useState(10); // seconds per step

  // Service Editor State
  const [isEditingService, setIsEditingService] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("smm_user") || "{}");
        if (user.email === "nadeemalikalhoro310@gmail.com") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          return;
        }
      } catch {
        setAuthorized(false);
        return;
      }

      const o = JSON.parse(localStorage.getItem("smm_orders") || "[]");
      const d = JSON.parse(localStorage.getItem("smm_deposits") || "[]");
      const t = JSON.parse(localStorage.getItem("smm_tickets") || "[]");
      const h = JSON.parse(localStorage.getItem("smm_hidden_services") || "[]");
      const b = localStorage.getItem("smm_broadcast") || "";
      const u = JSON.parse(localStorage.getItem("smm_all_users") || "[]");
      const cr = JSON.parse(localStorage.getItem("smm_child_requests") || "[]");
      const cfg = JSON.parse(localStorage.getItem("smm_system_config") || "{}");
      
      setOrders([...o].reverse());
      setDeposits([...d].reverse());
      setTickets([...t].reverse());
      setHiddenIds(h);
      setBroadcast(b);
      setUsers(u);
      setChildRequests([...cr].reverse());
      setAutoProcess(cfg.autoProcess || false);
      setSimSpeed(cfg.simSpeed || 10);
      
      const rev = o.reduce((acc: number, curr: Order) => acc + (curr.status === 'Completed' ? Number(curr.charge) : 0), 0);
      setStats({ revenue: rev, orders: o.length, users: u.length || 1 });

      try {
        const res = await fetch("/api/services");
        const apiServices = await res.json();
        const customServices = JSON.parse(localStorage.getItem("smm_custom_services") || "[]");
        const merged = [...apiServices];
        customServices.forEach((cs: Service) => {
           const idx = merged.findIndex(s => s.id === cs.id);
           if (idx > -1) merged[idx] = cs;
           else merged.push(cs);
        });
        setServices(merged);
      } catch { /* ignore */ }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulation Logic Effect
  useEffect(() => {
    if (!autoProcess) return;
    const interval = setInterval(() => {
       const o = JSON.parse(localStorage.getItem("smm_orders") || "[]");
       let changed = false;
       const updated = o.map((order: Order) => {
          if (order.status === "Pending") {
             changed = true;
             return { ...order, status: "In Progress" };
          }
          if (order.status === "In Progress") {
             changed = true;
             return { ...order, status: "Completed" };
          }
          return order;
       });
       if (changed) {
          localStorage.setItem("smm_orders", JSON.stringify(updated));
       }
    }, simSpeed * 1000);
    return () => clearInterval(interval);
  }, [autoProcess, simSpeed]);

  const updateConfig = (key: string, val: any) => {
     const cfg = JSON.parse(localStorage.getItem("smm_system_config") || "{}");
     cfg[key] = val;
     localStorage.setItem("smm_system_config", JSON.stringify(cfg));
     if (key === "autoProcess") setAutoProcess(val);
     if (key === "simSpeed") setSimSpeed(val);
  };

  const updateBroadcast = (msg: string) => {
    localStorage.setItem("smm_broadcast", msg);
    setBroadcast(msg);
  };

  const toggleServiceVisibility = (id: string) => {
    const h = JSON.parse(localStorage.getItem("smm_hidden_services") || "[]");
    let updated;
    if (h.includes(id)) {
      updated = h.filter((x: string) => x !== id);
    } else {
      updated = [...h, id];
    }
    localStorage.setItem("smm_hidden_services", JSON.stringify(updated));
    setHiddenIds(updated);
  };

  const saveService = () => {
     if (!editingService.name || !editingService.category) return;
     const custom = JSON.parse(localStorage.getItem("smm_custom_services") || "[]");
     const newService = {
        ...editingService,
        id: editingService.id || `custom-${Date.now()}`,
        rate: Number(editingService.rate) || 0
     } as Service;
     const idx = custom.findIndex((s: Service) => s.id === newService.id);
     if (idx > -1) custom[idx] = newService;
     else custom.push(newService);
     localStorage.setItem("smm_custom_services", JSON.stringify(custom));
     setIsEditingService(false);
     setEditingService({});
  };

  const deleteService = (id: string) => {
     const custom = JSON.parse(localStorage.getItem("smm_custom_services") || "[]");
     const updated = custom.filter((s: Service) => s.id !== id);
     localStorage.setItem("smm_custom_services", JSON.stringify(updated));
     const h = JSON.parse(localStorage.getItem("smm_hidden_services") || "[]");
     localStorage.setItem("smm_hidden_services", JSON.stringify(h.filter((x: string) => x !== id)));
  };

  const updateOrderStatus = (id: string, status: string) => {
    const o = JSON.parse(localStorage.getItem("smm_orders") || "[]");
    const updated = o.map((order: Order) => order.id === id ? { ...order, status } : order);
    localStorage.setItem("smm_orders", JSON.stringify(updated));
  };

  const approveDeposit = (id: string) => {
    const d = JSON.parse(localStorage.getItem("smm_deposits") || "[]");
    const dep = d.find((x: Deposit) => x.id === id);
    if (!dep || dep.status === "Approved") return;
    const updated = d.map((x: Deposit) => x.id === id ? { ...x, status: "Approved" } : x);
    localStorage.setItem("smm_deposits", JSON.stringify(updated));
    const balance = parseFloat(localStorage.getItem("smm_balance") || "0");
    localStorage.setItem("smm_balance", (balance + dep.amount).toString());
  };

  const updateUserBalance = (email: string, amt: number) => {
     const u = JSON.parse(localStorage.getItem("smm_all_users") || "[]");
     const updated = u.map((user: User) => user.email === email ? { ...user, balance: user.balance + amt } : user);
     localStorage.setItem("smm_all_users", JSON.stringify(updated));
     const currentUser = JSON.parse(localStorage.getItem("smm_user") || "{}");
     if (currentUser.email === email) {
        const b = parseFloat(localStorage.getItem("smm_balance") || "0");
        localStorage.setItem("smm_balance", (b + amt).toString());
     }
  };

  const approveChildRequest = (id: string) => {
     const cr = JSON.parse(localStorage.getItem("smm_child_requests") || "[]");
     const updated = cr.map((req: ChildRequest) => req.id === id ? { ...req, status: "Active" } : req);
     localStorage.setItem("smm_child_requests", JSON.stringify(updated));
  };

  const updateTicketStatus = (id: string, status: Ticket["status"]) => {
    const t = JSON.parse(localStorage.getItem("smm_tickets") || "[]");
    const updated = t.map((ticket: Ticket) => ticket.id === id ? { ...ticket, status } : ticket);
    localStorage.setItem("smm_tickets", JSON.stringify(updated));
    setTickets([...updated].reverse());
  };

  const handleManualTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(localStorage.getItem("smm_balance") || "0");
    localStorage.setItem("smm_balance", (b + topupAmount).toString());
    setTopupMsg(`Successfully added Rs. ${topupAmount}`);
    setTopupAmount(0);
    setTimeout(() => setTopupMsg(""), 3000);
  };

  if (authorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-[3rem] border border-red-500/10 text-center max-w-md">
           <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
           <h2 className="text-3xl font-black tracking-tighter mb-4">Access Denied</h2>
           <p className="text-muted-foreground font-medium mb-8">Unauthorized access attempt logged. Whitelist required.</p>
           <button onClick={() => window.location.href = "/dashboard"} className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest">Return to Base</button>
        </motion.div>
      </div>
    );
  }

  if (authorized === null) return null;

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Admin <span className="text-primary italic">Control</span></h1>
           <p className="text-muted-foreground font-medium mt-2">Manage your SMM business from any device.</p>
        </div>
        <div className="flex items-center gap-3 glass p-2 rounded-2xl border-white/10">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><RefreshCw className="w-5 h-5 animate-spin-slow" /></div>
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Sync<br/><span className="text-emerald-500">Active</span></span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: TrendingUp, label: "Revenue", value: `Rs. ${stats.revenue.toFixed(2)}`, color: "text-emerald-500" },
          { icon: ShoppingBag, label: "Total Orders", value: stats.orders, color: "text-blue-500" },
          { icon: Users, label: "Total Users", value: stats.users, color: "text-purple-500" },
          { icon: DollarSign, label: "Pending Deposits", value: deposits.filter(d => d.status === "Pending").length, color: "text-amber-500" }
        ].map((s, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="glass p-5 md:p-6 rounded-3xl border border-white/5 group hover:border-primary/20 transition-all">
             <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${s.color} w-fit mb-4`}>
                <s.icon className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">{s.label}</p>
             <p className="text-xl md:text-3xl font-black tracking-tight mt-1 truncate">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
              {["orders", "deposits", "child", "tickets", "services", "users", "system"].map((tab) => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 px-4 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab ? "bg-white/10 text-white shadow-xl" : "text-muted-foreground"}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="orders" className="space-y-4">
                   <div className="glass p-5 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Activity className="w-5 h-5 text-blue-400" />
                         <p className="text-xs font-bold text-blue-200">Auto Fulfillment is {autoProcess ? "ENABLED" : "DISABLED"}</p>
                      </div>
                      <button onClick={() => updateConfig("autoProcess", !autoProcess)} className={`h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${autoProcess ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>{autoProcess ? "Stop Auto" : "Start Auto"}</button>
                   </div>
                   {orders.map((order) => (
                     <div key={order.id} className="glass p-5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[9px] font-black uppercase text-muted-foreground opacity-50 mb-1">ID: {order.id.slice(0, 8)}</p>
                              <h4 className="font-bold text-base leading-tight">{order.service}</h4>
                           </div>
                           <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${STATUS_STYLING[order.status]}`}>{order.status}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                           <div className="flex gap-2">
                              <p className="text-xs font-black tracking-tight text-emerald-400 font-mono">Rs. {Number(order.charge).toFixed(2)}</p>
                           </div>
                           <div className="flex gap-2">
                              {["Completed", "In Progress", "Cancelled"].map(s => (
                                <button key={s} onClick={() => updateOrderStatus(order.id, s)} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${s === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-black' : s === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500 hover:text-white' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'}`}>
                                   {s === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : s === 'In Progress' ? <RefreshCw className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </motion.div>
              )}

              {activeTab === "child" && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key="child" className="space-y-4">
                    <div className="glass p-5 rounded-3xl border border-white/5 bg-primary/5 flex items-center justify-between">
                       <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Child Panel Requests</p>
                    </div>
                    {childRequests.length === 0 && <p className="text-center py-20 text-muted-foreground font-bold italic opacity-30">No requests yet.</p>}
                    {childRequests.map((req) => (
                       <div key={req.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary"><Globe className="w-6 h-6" /></div>
                                <div>
                                   <h4 className="font-bold text-lg leading-none">{req.panelName}</h4>
                                   <p className="text-xs text-muted-foreground mt-1">{req.domain}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${req.status === 'Active' ? 'bg-emerald-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>{req.status}</span>
                                {req.status === "Pending" && (
                                   <button onClick={() => approveChildRequest(req.id)} className="h-10 px-6 bg-emerald-500 text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">Approve Setup</button>
                                )}
                             </div>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Requested by {req.email} on {new Date(req.created_at).toLocaleDateString()}</p>
                       </div>
                    ))}
                 </motion.div>
              )}

              {/* Other tabs maintained (deposits, tickets, services, users, system) */}
              {activeTab === "deposits" && (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="deposits" className="space-y-4">
                    {deposits.map((dep) => (
                      <div key={dep.id} className="glass p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{dep.method} - {new Date(dep.created_at).toLocaleDateString()}</p>
                            <p className="text-2xl font-black tracking-tighter">Rs. {dep.amount}</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${dep.status === 'Approved' ? 'bg-emerald-500 text-black' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>{dep.status}</span>
                            {dep.status === "Pending" && <button onClick={() => approveDeposit(dep.id)} className="p-3 bg-emerald-500 text-black rounded-xl hover:scale-105 transition-all"><CheckCircle2 className="w-5 h-5" /></button>}
                         </div>
                      </div>
                    ))}
                 </motion.div>
              )}

              {activeTab === "tickets" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="tickets" className="space-y-4">
                     {tickets.map((t) => (
                        <div key={t.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                           <div className="flex justify-between items-start">
                              <div><h4 className="font-bold text-lg">{t.subject}</h4><p className="text-xs text-muted-foreground mt-1">Ref ID: <span className="text-primary font-mono">{t.orderId || "General"}</span></p></div>
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${t.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{t.status}</span>
                           </div>
                           <p className="p-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-neutral-300 italic">"{t.message}"</p>
                           <div className="flex gap-3 justify-end">
                              {t.status === "Pending" && <button onClick={() => updateTicketStatus(t.id, "Answered")} className="h-10 px-6 bg-emerald-500 text-black rounded-xl font-bold text-xs uppercase tracking-widest">Mark Answered</button>}
                              {t.status !== "Closed" && <button onClick={() => updateTicketStatus(t.id, "Closed")} className="h-10 px-6 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs">Close</button>}
                           </div>
                        </div>
                     ))}
                  </motion.div>
              )}

              {activeTab === "services" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="services" className="space-y-4">
                     <div className="glass p-5 rounded-3xl border border-white/5 bg-primary/5 flex justify-between items-center"><p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Service Inventory</p><button onClick={() => { setEditingService({}); setIsEditingService(true); }} className="h-10 px-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Add</button></div>
                     {services.map((s) => (
                        <div key={s.id} className="glass p-4 rounded-3xl border border-white/5 flex items-center justify-between gap-4 transition-all hover:bg-white/[0.02]">
                           <div className="min-w-0"><p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">{s.category}</p><h4 className="font-bold text-sm truncate">{s.name}</h4><p className="text-[10px] font-bold text-emerald-500 mt-0.5">Rs. {s.rate} / 1000</p></div>
                           <div className="flex items-center gap-2">
                             <button onClick={() => { setEditingService(s); setIsEditingService(true); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => deleteService(s.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                             <button onClick={() => toggleServiceVisibility(s.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${hiddenIds.includes(s.id) ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}>{hiddenIds.includes(s.id) ? "Hidden" : "Live"}</button>
                           </div>
                        </div>
                     ))}
                  </motion.div>
              )}

              {activeTab === "users" && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="users" className="space-y-4">
                    {users.map((u) => (
                       <div key={u.email} className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xl">{u.email.charAt(0)}</div>
                             <div><h4 className="font-bold text-base">{u.email}</h4><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</p></div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="text-right"><p className="text-xl font-black text-emerald-500">Rs. {(u.balance || 0).toFixed(2)}</p></div>
                             <button onClick={() => updateUserBalance(u.email, 500)} className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black animate-pulse">+</button>
                             <button onClick={() => updateUserBalance(u.email, -500)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-black">-</button>
                          </div>
                       </div>
                    ))}
                 </motion.div>
              )}

              {activeTab === "system" && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key="system" className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                       <h3 className="text-xl font-black flex items-center gap-2"><Settings2 className="w-6 h-6 text-blue-400" /> Automation Engine</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl">
                             <p className="font-bold">Auto-Fulfillment Simulation</p>
                             <button onClick={() => updateConfig("autoProcess", !autoProcess)} className={`w-14 h-8 rounded-full p-1 transition-all ${autoProcess ? 'bg-primary' : 'bg-white/10'}`}><div className={`w-6 h-6 rounded-full bg-white transition-all ${autoProcess ? 'translate-x-6' : 'translate-x-0'}`} /></button>
                          </div>
                          <div className="p-6 bg-white/5 rounded-3xl space-y-4">
                             <div className="flex justify-between"><span>Step Interval</span><span className="font-black text-primary">{simSpeed}s</span></div>
                             <input type="range" min="1" max="60" value={simSpeed} onChange={(e) => updateConfig("simSpeed", Number(e.target.value))} className="w-full accent-primary" />
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Manual Adjustment</h3>
              <form onSubmit={handleManualTopup} className="space-y-4">
                <input type="number" value={topupAmount} onChange={(e) => setTopupAmount(Number(e.target.value))} placeholder="Rs. amount..." className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none" />
                <button type="submit" className="w-full h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest">Process Credit</button>
              </form>
           </div>
           <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-auto">System Broadcast</h3>
              <textarea value={broadcast} onChange={(e) => updateBroadcast(e.target.value)} className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-xs resize-none" placeholder="Enter marquee message..." />
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditingService && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <div className="absolute inset-0" onClick={() => setIsEditingService(false)} />
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass p-8 rounded-[3rem] border border-white/10 w-full max-w-xl relative space-y-6">
                <h3 className="text-2xl font-black">Configure Service</h3>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={editingService.category || ""} onChange={(e) => setEditingService({...editingService, category: e.target.value})} className="col-span-2 h-14 bg-black/40 border border-white/5 rounded-2xl px-6 outline-none font-bold" placeholder="Category" />
                   <input type="text" value={editingService.name || ""} onChange={(e) => setEditingService({...editingService, name: e.target.value})} className="col-span-2 h-14 bg-black/40 border border-white/5 rounded-2xl px-6 outline-none font-bold" placeholder="Service Name" />
                   <input type="number" value={editingService.rate || ""} onChange={(e) => setEditingService({...editingService, rate: Number(e.target.value)})} className="h-14 bg-black/40 border border-white/5 rounded-2xl px-6 font-bold" placeholder="Rate / 1k" />
                </div>
                <button onClick={saveService} className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase shadow-xl hover:scale-105 transition-all">Submit Service</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
