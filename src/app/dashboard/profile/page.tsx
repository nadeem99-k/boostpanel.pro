"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  // VIP Logic
  const getVipTier = (spent: number) => {
    if (spent >= 50000) return { name: "Enterprise", color: "text-red-400", hex: "bg-red-400", next: null };
    if (spent >= 10000) return { name: "Pro", color: "text-purple-400", hex: "bg-purple-400", next: 50000 };
    if (spent >= 5000) return { name: "Plus", color: "text-blue-400", hex: "bg-blue-400", next: 10000 };
    return { name: "Standard", color: "text-neutral-400", hex: "bg-neutral-400", next: 5000 };
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("smm_user") || "{}");
      setName(stored.name || "");
      setEmail(stored.email || "");

      // Calc spent
      const orders = JSON.parse(localStorage.getItem("smm_orders") || "[]");
      const spent = orders.reduce((acc: number, curr: any) => acc + (curr.status !== 'Cancelled' ? Number(curr.charge) : 0), 0);
      setTotalSpent(spent);
    } catch { /* ignore */ }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("smm_user", JSON.stringify({ name, email }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          Profile & Settings
        </h2>
        <p className="text-neutral-400 mt-1">Manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center gap-4"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-4xl font-black text-white">
            {name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="text-center">
            <p className="font-semibold text-white">{name || "User"}</p>
            <p className="text-sm text-neutral-500">{email || "—"}</p>
          </div>
          <div className="w-full pt-4 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Account Type</span>
              <span className={`${getVipTier(totalSpent).color} font-bold`}>{getVipTier(totalSpent).name}</span>
            </div>
            
            {getVipTier(totalSpent).next !== null && (
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-neutral-500 font-medium.">
                    <span>Next Tier Progress</span>
                    <span>Rs. {totalSpent.toFixed(0)} / {getVipTier(totalSpent).next}</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalSpent / getVipTier(totalSpent).next!) * 100}%` }}
                      className={`h-full ${getVipTier(totalSpent).hex}`}
                    />
                 </div>
              </div>
            )}

            <div className="flex justify-between text-sm text-neutral-400 pt-2 border-t border-white/5">
              <span>Member Since</span>
              <span className="text-neutral-300">{new Date().toLocaleDateString("en-PK", { month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 glass rounded-2xl p-6 border border-white/5"
        >
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="font-semibold text-white mb-6">Personal Information</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@panel.com"
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" /> New Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep unchanged"
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 h-12 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                {saved ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-red-500/10 bg-red-500/[0.02]"
      >
        <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Clear all local data (orders, balance, session). This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm("Are you absolutely sure? This will wipe all your local data.")) {
              localStorage.clear();
              document.cookie = "smm_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              window.location.href = "/login";
            }
          }}
          className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
        >
          Clear All Data & Sign Out
        </button>
      </motion.div>
    </div>
  );
}
