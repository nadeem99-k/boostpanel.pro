"use client";

import { motion } from "framer-motion";
import { Globe, Server, ShieldCheck, Zap, ArrowRight, Wallet, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function ChildPanelsPage() {
  const [panelName, setPanelName] = useState("");
  const [domain, setDomain] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const requests = JSON.parse(localStorage.getItem("smm_child_requests") || "[]");
     const user = JSON.parse(localStorage.getItem("smm_user") || "{}");
     
     requests.push({
        id: `CP-${Date.now()}`,
        email: user.email,
        panelName,
        domain,
        status: "Pending",
        created_at: new Date().toISOString()
     });
     
     localStorage.setItem("smm_child_requests", JSON.stringify(requests));
     setSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-32 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Your Brand. <br/> <span className="text-gradient">Our Backend.</span></h1>
        <p className="text-muted-foreground font-medium max-w-xl">Start your own SMM business in minutes. Request a fully functional child panel and keep 100% of your profits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 rounded-[3.5rem] border border-emerald-500/20 bg-emerald-500/5 text-center">
                 <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h2 className="text-3xl font-black mb-3">Request Submitted!</h2>
                 <p className="text-muted-foreground font-medium mb-8">Our technical team will review your domain and setup your panel within 24 hours. You will be notified via ticket.</p>
                 <button onClick={() => setSubmitted(false)} className="px-10 h-14 glass border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-emerald-500/50 transition-all">Request Another</button>
              </motion.div>
           ) : (
              <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Panel Name</label>
                       <input 
                         required value={panelName} onChange={(e) => setPanelName(e.target.value)}
                         placeholder="e.g. MySMMStore" 
                         className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 outline-none focus:border-primary/50 transition-all font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Domain Name</label>
                       <input 
                         required value={domain} onChange={(e) => setDomain(e.target.value)}
                         placeholder="e.g. mysmm.com" 
                         className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 outline-none focus:border-primary/50 transition-all font-bold" 
                       />
                    </div>
                 </div>
                 
                 <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                          <Wallet className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="font-bold">Subscription Cost</p>
                          <p className="text-xs text-muted-foreground">Rs. 2500 / Month</p>
                       </div>
                    </div>
                    <button type="submit" className="w-full md:w-auto h-14 px-10 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                       Deploy Child Panel <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </form>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Globe, title: "Custom Domain", desc: "Use your own .com, .net or any TLD domain name." },
                { icon: Server, title: "Automated Sync", desc: "All our services & prices sync instantly to your panel." },
                { icon: Zap, title: "Fast Deployment", desc: "Get your business live in less than 24 hours." },
                { icon: ShieldCheck, title: "White Label", desc: "Our branding will be completely removed from your site." }
              ].map((f, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/10 transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <f.icon className="w-6 h-6" />
                   </div>
                   <h4 className="font-bold text-lg mb-2">{f.title}</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-primary/20 bg-primary/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[100px]" />
              <h3 className="text-2xl font-black mb-6">Pricing Plan</h3>
              <div className="space-y-6">
                 <div className="flex items-end gap-1">
                    <span className="text-4xl font-black tracking-tighter">Rs. 2500</span>
                    <span className="text-muted-foreground font-bold mb-1">/mo</span>
                 </div>
                 <ul className="space-y-4">
                    {["Unlimited Orders", "Free SSL Certificate", "24/7 Priority Support", "Custom Branding", "API Access"].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {item}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
