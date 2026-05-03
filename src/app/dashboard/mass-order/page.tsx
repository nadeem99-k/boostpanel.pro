"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Layers, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface Service {
  id: string;
  category: string;
  name: string;
  rate: number;
  min: string;
  max: string;
}

export default function MassOrderPage() {
  const [inputText, setInputText] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{line: string, status: 'success' | 'error', message: string}[] | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services", { cache: "no-store", next: { revalidate: 0 } });
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchServices();
  }, []);

  const handleProcess = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResults(null);

    const lines = inputText.split("\n").filter(line => line.trim() !== "");
    const currentResults: typeof results = [];
    
    let totalCharge = 0;
    const ordersToProcess: any[] = [];

    // Parse loop
    for (const line of lines) {
       const parts = line.split("|").map(p => p.trim());
       if(parts.length !== 3) {
          currentResults.push({ line, status: 'error', message: 'Invalid format. Expected: service_id | link | quantity' });
          continue;
       }

       const [serviceId, link, qtyStr] = parts;
       const quantity = parseInt(qtyStr, 10);
       const service = services.find(s => s.id === serviceId);

       if(!service) {
          currentResults.push({ line, status: 'error', message: `Service ID ${serviceId} not found.` });
          continue;
       }
       if(isNaN(quantity) || quantity < parseInt(service.min) || quantity > parseInt(service.max)) {
          currentResults.push({ line, status: 'error', message: `Invalid quantity. Allowed: ${service.min}-${service.max}` });
          continue;
       }

       const charge = (service.rate / 1000) * quantity;
       totalCharge += charge;
       ordersToProcess.push({
          id: crypto.randomUUID(),
          service: service.name,
          service_id: serviceId,
          link,
          quantity,
          charge,
          status: "Pending",
          created_at: new Date().toISOString()
       });
    }

    const currentBalance = parseFloat(localStorage.getItem("smm_balance") || "0");

    if (totalCharge > currentBalance) {
       setResults([{ line: 'ALL', status: 'error', message: `Insufficient balance. Total charge: Rs. ${totalCharge.toFixed(2)}, Balance: Rs. ${currentBalance.toFixed(2)}` }]);
       setLoading(false);
       return;
    }

    if (ordersToProcess.length > 0) {
       // Deduct balance
       const newBalance = currentBalance - totalCharge;
       localStorage.setItem("smm_balance", newBalance.toFixed(2));
       
       // Save to orders
       const existing = JSON.parse(localStorage.getItem("smm_orders") || "[]");
       localStorage.setItem("smm_orders", JSON.stringify([...ordersToProcess, ...existing]));

       ordersToProcess.forEach(order => {
          currentResults.push({ line: `${order.service_id} | ${order.link} | ${order.quantity}`, status: 'success', message: `Order placed. Charge: Rs. ${order.charge.toFixed(2)}` });
       });
    }

    setResults(currentResults);
    if (!currentResults.some(r => r.status === 'error')) {
       setInputText("");
    }
    setLoading(false);
  };

  return (
      <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" /> Mass Order
        </h2>
        <p className="text-muted-foreground mt-1">Place multiple orders at once using the format below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="md:col-span-2 space-y-4"
        >
          <div className="glass rounded-2xl p-6 border border-border space-y-4 shadow-xl">
             <label className="text-sm font-bold text-foreground">One order per line in format: <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded ml-2">service_id | link | quantity</span></label>
             <textarea 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="ig-f-1 | https://instagram.com/p/... | 1000&#10;tk-v-1 | https://tiktok.com/... | 5000"
                className="w-full h-64 bg-background border border-border rounded-xl p-4 text-foreground font-mono focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 resize-none text-sm"
             ></textarea>
             
             <button
                onClick={handleProcess}
                disabled={loading || !inputText.trim()}
                className="w-full h-14 bg-primary disabled:opacity-50 hover:bg-primary/80 text-primary-foreground rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
             >
                {loading ? "Processing..." : "Submit Mass Order"}
             </button>
          </div>

          {results && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 border border-border space-y-4 shadow-xl mt-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>
                <div className="space-y-2">
                   {results.map((r, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex gap-3 ${r.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}>
                         {r.status === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                         <div>
                            <div className="font-mono text-xs opacity-70 mb-1">{r.line}</div>
                            <div className="text-sm font-semibold">{r.message}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
          )}

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-border h-fit bg-gradient-to-br from-primary/5 to-transparent space-y-6 shadow-xl"
        >
           <div className="flex items-center gap-2 text-primary font-bold">
              <Info className="w-5 h-5" /> Instructions
           </div>
           <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>You can find the <strong className="text-foreground">Service ID</strong> on the New Order page or the Services Catalog.</p>
              <p className="bg-foreground/5 p-3 rounded-lg border border-border font-mono text-xs">
                 Example:<br/>
                 ig-l-1 | https://inst... | 500<br/>
                 yt-v-2 | https://youtu... | 1000
              </p>
              <p>Make sure to use the exact pipe symbol (<span className="text-foreground font-bold">|</span>) to separate the inputs.</p>
              <p>Your balance will only be deducted for successful orders.</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
