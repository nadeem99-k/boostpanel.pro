"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Code, Key, Copy, CheckCircle, RefreshCcw, Terminal } from "lucide-react";

export default function ApiDeveloperPage() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let key = localStorage.getItem("smm_api_key");
    if (!key) {
      key = "sk_" + crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem("smm_api_key", key);
    }
    setApiKey(key);
  }, []);

  const handleGenerateNew = () => {
    const key = "sk_" + crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem("smm_api_key", key);
    setApiKey(key);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" /> Developer API
          </h2>
          <p className="text-muted-foreground mt-1">Integrate our services directly into your own app or SMM panel.</p>
        </div>
      </div>

      {/* API Key Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8 border border-border shadow-xl relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Key className="w-32 h-32" />
         </div>
         <h3 className="text-xl font-bold text-foreground mb-4">Your API Key</h3>
         <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <div className="flex-1 relative">
               <div className="w-full h-14 bg-background border border-border rounded-xl px-4 flex items-center text-foreground font-mono text-sm shadow-inner">
                  {apiKey}
               </div>
               <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-foreground/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
               >
                  {copied ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
               </button>
            </div>
            <button
               onClick={handleGenerateNew}
               className="h-14 px-6 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-sm shrink-0"
            >
               <RefreshCcw className="w-4 h-4" /> Generate New
            </button>
         </div>
         <p className="text-sm text-amber-500 mt-4 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 
            Keep your API key secret. Do not share it or expose it in client-side code.
         </p>
      </motion.div>

      {/* Documentation Section */}
      <div className="space-y-8">
         <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" /> API Documentation
         </h3>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Endpoint: Services */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-border overflow-hidden flex flex-col">
               <div className="bg-foreground/5 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Services List</h4>
                  <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded text-xs font-black">GET</span>
               </div>
               <div className="p-6 space-y-4 flex-1">
                  <div className="bg-background border border-border rounded-xl p-3 font-mono text-xs text-muted-foreground">
                     /api/v2?key=<span className="text-primary">YOUR_API_KEY</span>&action=services
                  </div>
                  <p className="text-sm text-muted-foreground">Returns a list of all available services, categories, pricing, and limits.</p>
                  <div className="bg-background border border-border rounded-xl p-4 font-mono text-xs text-foreground overflow-x-auto">
                     <pre>
{`[
  {
    "service": "ig-f-1",
    "name": "Instagram Followers",
    "type": "Default",
    "category": "Instagram",
    "rate": "15.00",
    "min": "100",
    "max": "10000"
  }
]`}
                     </pre>
                  </div>
               </div>
            </motion.div>

            {/* Endpoint: Add Order */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-border overflow-hidden flex flex-col">
               <div className="bg-foreground/5 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Add Order</h4>
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-black">POST</span>
               </div>
               <div className="p-6 space-y-4 flex-1">
                  <div className="bg-background border border-border rounded-xl p-3 font-mono text-xs text-muted-foreground">
                     /api/v2
                  </div>
                  <p className="text-sm text-muted-foreground">Create a new order. Pass parameters in the request body as JSON.</p>
                  <div className="bg-background border border-border rounded-xl p-4 font-mono text-xs text-foreground overflow-x-auto">
                     <pre>
{`// Request Body
{
  "key": "YOUR_API_KEY",
  "action": "add",
  "service": "ig-f-1",
  "link": "https://instagram.com/p/...",
  "quantity": 1000
}

// Response
{
  "order": 23512
}`}
                     </pre>
                  </div>
               </div>
            </motion.div>

            {/* Endpoint: Order Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl border border-border overflow-hidden flex flex-col">
               <div className="bg-foreground/5 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Order Status</h4>
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-black">POST</span>
               </div>
               <div className="p-6 space-y-4 flex-1">
                  <div className="bg-background border border-border rounded-xl p-3 font-mono text-xs text-muted-foreground">
                     /api/v2
                  </div>
                  <p className="text-sm text-muted-foreground">Check the current status of an existing order.</p>
                  <div className="bg-background border border-border rounded-xl p-4 font-mono text-xs text-foreground overflow-x-auto">
                     <pre>
{`// Request Body
{
  "key": "YOUR_API_KEY",
  "action": "status",
  "order": 23512
}

// Response
{
  "charge": "15.00",
  "start_count": "100",
  "status": "In progress",
  "remains": "900",
  "currency": "INR"
}`}
                     </pre>
                  </div>
               </div>
            </motion.div>

            {/* Endpoint: Balance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl border border-border overflow-hidden flex flex-col">
               <div className="bg-foreground/5 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h4 className="font-bold text-foreground">Account Balance</h4>
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded text-xs font-black">POST</span>
               </div>
               <div className="p-6 space-y-4 flex-1">
                  <div className="bg-background border border-border rounded-xl p-3 font-mono text-xs text-muted-foreground">
                     /api/v2
                  </div>
                  <p className="text-sm text-muted-foreground">Check your current account balance and currency.</p>
                  <div className="bg-background border border-border rounded-xl p-4 font-mono text-xs text-foreground overflow-x-auto">
                     <pre>
{`// Request Body
{
  "key": "YOUR_API_KEY",
  "action": "balance"
}

// Response
{
  "balance": "1543.20",
  "currency": "INR"
}`}
                     </pre>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
