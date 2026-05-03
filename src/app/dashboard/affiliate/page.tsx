"use client";

import { motion } from "framer-motion";
import { Users, Link as LinkIcon, DollarSign, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const [refLink, setRefLink] = useState("");
  const [stats, setStats] = useState({ clicks: 124, referrals: 18, earned: 4500 });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("smm_user") || "{}");
    const domain = window.location.origin;
    setRefLink(`${domain}/resgister?ref=${user.email || "user"}`);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Affiliate <span className="text-gradient">Engine.</span></h1>
        <p className="text-muted-foreground font-medium">Refer others and earn 5% recurring commission on every deposit they make.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: LinkIcon, label: "Total Clicks", value: stats.clicks, color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Users, label: "Referrals", value: stats.referrals, color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: DollarSign, label: "Total Earned", value: `Rs. ${stats.earned}`, color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group"
          >
             <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-6 border border-white/5 ${s.color}`}>
                <s.icon className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{s.label}</p>
             <p className="text-3xl font-black mt-1 tracking-tighter">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
           <div>
              <h3 className="text-2xl font-black mb-4">Your Referral Link</h3>
              <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">Share this link with your audience. Every user who registers using this link becomes your lifetime referral.</p>
              
              <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 rounded-2xl">
                 <input 
                   readOnly 
                   value={refLink} 
                   className="flex-1 bg-transparent border-none outline-none px-4 text-xs font-mono text-primary font-bold overflow-hidden text-ellipsis" 
                 />
                 <button 
                   onClick={handleCopy}
                   className={`h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500 text-black' : 'bg-primary text-white'}`}
                 >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Link"}
                 </button>
              </div>
           </div>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-primary/20 bg-primary/5 flex flex-col justify-center">
           <h3 className="text-2xl font-black mb-4">How it works?</h3>
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">01</div>
                 <p className="text-sm text-neutral-300 font-medium leading-relaxed">Share your unique referral link on social media groups like Facebook, WhatsApp or Telegram.</p>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">02</div>
                 <p className="text-sm text-neutral-300 font-medium leading-relaxed">Users register and start using our premium SMM services to grow their social presence.</p>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">03</div>
                 <p className="text-sm text-neutral-300 font-medium leading-relaxed">You instantly receive 5% of their deposit amount credited to your balance forever.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
