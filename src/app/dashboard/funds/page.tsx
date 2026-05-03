"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Wallet, ArrowRight, Building2, Smartphone, CheckCircle } from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const METHODS = [
  { name: "Easypaisa", icon: Smartphone, color: "text-green-400", bg: "bg-green-500/10", number: "0300-1234567" },
  { name: "JazzCash", icon: Smartphone, color: "text-orange-400", bg: "bg-orange-500/10", number: "0311-7654321" },
  { name: "Bank Transfer", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10", number: "HBL: 1234-5678-9012" },
  { name: "Crypto (USDT)", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10", number: "TRC20: TXxx...xxxx" },
];

export default function AddFundsPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("Easypaisa");
  const [submitted, setSubmitted] = useState(false);

  const selectedMethod = METHODS.find((m) => m.name === method)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (amount as number) < 500) return;

    // Log the deposit request in localStorage (admin can view later)
    const request = {
      id: crypto.randomUUID(),
      amount: amount as number,
      method,
      status: "Pending",
      created_at: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("smm_deposits") || "[]");
    localStorage.setItem("smm_deposits", JSON.stringify([request, ...existing]));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-white mb-2">Deposit Request Sent!</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Please send <span className="text-white font-bold">Rs. {amount}</span> via{" "}
            <span className="text-purple-400 font-medium">{method}</span> to:
          </p>
          <div className="mt-4 p-4 glass rounded-xl border border-white/10">
            <p className="font-mono text-lg text-white">{selectedMethod.number}</p>
            <p className="text-xs text-neutral-500 mt-1">Use your registered email as the payment reference</p>
          </div>
          <p className="text-neutral-500 text-xs mt-4">
            After sending the payment, the admin will verify and credit your account within 5–15 minutes.
          </p>
        </motion.div>
        <button
          onClick={() => { setSubmitted(false); setAmount(""); }}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-all text-sm"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Add Funds</h2>
        <p className="text-neutral-400 mt-1">Deposit balance to your account to place new orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 border border-white/5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Method Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map((m) => (
                  <div
                    key={m.name}
                    onClick={() => setMethod(m.name)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      method === m.name
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.bg} ${m.color} shrink-0`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-300">Quick Select</label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                      amount === p
                        ? "bg-purple-600/20 border-purple-500/50 text-purple-400"
                        : "border-white/10 text-neutral-400 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Amount (Rs.)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">Rs.</div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min="500"
                  placeholder="1000"
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <p className="text-xs text-neutral-500">Minimum deposit is Rs. 500</p>
            </div>

            <button
              type="submit"
              disabled={!amount || (amount as number) < 500}
              className="w-full h-12 bg-purple-600 disabled:opacity-40 hover:bg-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              Generate Deposit Request <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Info Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/5 h-fit space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">How It Works</h3>
              <p className="text-sm text-neutral-400">Manual approval by admin</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "Select Method & Amount", desc: "Choose your preferred payment method and how much you want to deposit." },
              { step: "2", title: "Send the Payment", desc: `Transfer the amount to our ${method} account provided after submission.` },
              { step: "3", title: "Admin Verification", desc: "Our admin will verify your payment and credit your balance within 5–15 minutes." },
              { step: "4", title: "Start Ordering!", desc: "Once credited, start placing orders instantly without any delays." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
