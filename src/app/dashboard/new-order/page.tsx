"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Link2, LayoutTemplate, CopyPlus, CheckCircle, 
  ChevronDown, Camera, Video, Users, 
  MessageCircle, Briefcase, Music, Send, Headphones, Zap, Star, Phone,
  Gamepad2, AtSign, Pin, Ghost, MessageSquare, Globe, Cloud
} from "lucide-react";

interface Service {
  id: string;
  category: string;
  name: string;
  rate: number;
  min: string;
  max: string;
  description: string;
}

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("instagram")) return Camera;
  if (n.includes("youtube")) return Video;
  if (n.includes("facebook")) return Users;
  if (n.includes("twitter") || n.includes("x")) return MessageCircle;
  if (n.includes("linkedin")) return Briefcase;
  if (n.includes("tiktok")) return Music;
  if (n.includes("telegram")) return Send;
  if (n.includes("spotify")) return Headphones;
  if (n.includes("whatsapp")) return Phone;
  if (n.includes("twitch")) return Gamepad2;
  if (n.includes("discord")) return MessageSquare;
  if (n.includes("threads")) return AtSign;
  if (n.includes("pinterest")) return Pin;
  if (n.includes("snapchat")) return Ghost;
  if (n.includes("reddit")) return MessageSquare;
  if (n.includes("soundcloud")) return Cloud;
  if (n.includes("website") || n.includes("traffic")) return Globe;
  return Zap;
}

const CustomSelect = ({ value, onChange, options, placeholder }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div ref={ref} className={`relative ${open ? 'z-50' : 'z-10'}`}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full min-h-[3rem] bg-background border border-border rounded-xl px-4 py-2 text-foreground focus-within:outline-none focus-within:border-primary/50 transition-all cursor-pointer flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          {selectedOption ? (
            <>
               {selectedOption.icon && <selectedOption.icon className="w-5 h-5 text-primary" />}
               <span className="text-sm font-bold truncate max-w-[250px] md:max-w-md">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground/50 text-sm font-bold">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="absolute left-0 right-0 top-[110%] p-2 max-h-[500px] overflow-y-auto overscroll-contain glass-crystal rounded-xl shadow-2xl flex flex-col gap-1 border border-border"
           >
              {options.length === 0 && <div className="p-3 text-sm text-muted-foreground font-medium">No options available</div>}
              {options.map((opt: any) => (
                 <div
                   key={opt.value}
                   onClick={() => { onChange(opt.value); setOpen(false); }}
                   className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${value === opt.value ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-foreground/5 text-foreground font-medium'}`}
                 >
                    {opt.icon && <opt.icon className="w-5 h-5 shrink-0" />}
                    <span className="text-sm leading-snug">{opt.label}</span>
                 </div>
              ))}
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function NewOrderPage() {
  const [category, setCategory] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isDripFeed, setIsDripFeed] = useState(false);
  const [runs, setRuns] = useState<number | "">("");
  const [intervalTime, setIntervalTime] = useState<number | "">("");

  // Load services from local API
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services", { cache: "no-store", next: { revalidate: 0 } });
        const data: Service[] = await res.json();
        
        const custom = JSON.parse(localStorage.getItem("smm_custom_services") || "[]");
        const merged = [...data];
        custom.forEach((cs: Service) => {
           const idx = merged.findIndex(s => s.id === cs.id);
           if (idx > -1) merged[idx] = cs;
           else merged.push(cs);
        });

        const hidden = JSON.parse(localStorage.getItem("smm_hidden_services") || "[]");
        const filtered = merged.filter(s => !hidden.includes(s.id));
        
        setServices(filtered);
        if (filtered.length > 0) setCategory("All Services");
      } catch (err) {
        console.error(err);
      }
    }
    fetchServices();

    // Load balance from localStorage
    const storedBalance = localStorage.getItem("smm_balance");
    setBalance(storedBalance ? parseFloat(storedBalance) : 0);
  }, []);

  const categories = ["All Services", ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = category === "All Services" ? services : services.filter((s) => s.category === category);
  const selectedService = services.find((s) => s.id === serviceId);

  const calculateCharge = () => {
    if (!selectedService || !quantity) return 0;
    const cfg = JSON.parse(localStorage.getItem("smm_system_config") || "{}");
    const margin = (cfg.margin || 20) / 100;
    return (selectedService.rate * (1 + margin) / 1000) * (quantity as number);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const totalRuns = isDripFeed ? Number(runs || 1) : 1;
    const charge = calculateCharge() * totalRuns;

    if (balance < charge) {
      setError("Insufficient balance. Please add funds to your account.");
      setLoading(false);
      return;
    }

    if (!selectedService) {
      setError("Please select a service.");
      setLoading(false);
      return;
    }

    // Build order object
    const newOrder = {
      id: crypto.randomUUID(),
      service: selectedService.name,
      service_id: serviceId,
      link,
      quantity: quantity as number,
      charge,
      status: "Pending",
      created_at: new Date().toISOString(),
      dripfeed: isDripFeed ? { runs: Number(runs), interval: Number(intervalTime), current_run: 1 } : null
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("smm_orders") || "[]");
    localStorage.setItem("smm_orders", JSON.stringify([newOrder, ...existing]));

    // Deduct balance
    const newBalance = balance - charge;
    localStorage.setItem("smm_balance", newBalance.toFixed(2));
    setBalance(newBalance);

    setSuccess(true);
    setLink("");
    setQuantity("");
    setServiceId("");
    setLoading(false);
  };

  const categoryOptions = categories.map(c => ({
     label: c,
     value: c,
     icon: getCategoryIcon(c)
  }));

  const serviceOptions = filteredServices.map(s => {
     const cfg = JSON.parse(localStorage.getItem("smm_system_config") || "{}");
     const margin = (cfg.margin || 20) / 100;
     const finalRate = s.rate * (1 + margin);
     return {
        label: `${s.name} — Rs. ${finalRate.toFixed(2)} / 1000`,
        value: s.id,
        icon: getCategoryIcon(s.category)
     };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          New Order
        </h2>
        <p className="text-muted-foreground mt-1">Select a service and place a new order.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 glass rounded-2xl p-6 border border-border"
        >
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Order Placed!</h3>
              <p className="text-muted-foreground text-sm text-center">
                Your order has been submitted successfully and is now Pending.
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/80 rounded-xl text-primary-foreground text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                  Place Another Order
                </button>
                <a
                  href="/dashboard/history"
                  className="px-5 py-2.5 glass border border-border hover:bg-foreground/5 text-foreground rounded-xl text-sm font-bold transition-all"
                >
                  View Order History
                </a>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-6">
              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-primary" /> Category
                </label>
                <CustomSelect 
                   value={category}
                   onChange={(val: string) => { setCategory(val); setServiceId(""); }}
                   options={categoryOptions}
                   placeholder="Select a category"
                />
              </div>

              {/* Service */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CopyPlus className="w-4 h-4 text-primary" /> Service
                </label>
                <CustomSelect 
                   value={serviceId}
                   onChange={setServiceId}
                   options={serviceOptions}
                   placeholder="Select a specific service"
                />
              </div>

              {/* Link */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" /> Link
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  placeholder=""
                  className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>

              {/* Drip-Feed Toggle */}
              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                       <input 
                         type="checkbox" 
                         checked={isDripFeed} 
                         onChange={(e) => setIsDripFeed(e.target.checked)}
                         className="sr-only peer"
                       />
                       <div className="w-10 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-all" />
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Enable Drip-Feed</span>
                 </label>

                 <AnimatePresence>
                    {isDripFeed && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="grid grid-cols-2 gap-4 overflow-hidden"
                       >
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Runs</label>
                             <input 
                               type="number" 
                               value={runs} 
                               onChange={(e) => setRuns(Number(e.target.value))}
                               placeholder="e.g. 5"
                               className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Interval (min)</label>
                             <input 
                               type="number" 
                               value={intervalTime} 
                               onChange={(e) => setIntervalTime(Number(e.target.value))}
                               placeholder="e.g. 30"
                               className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50"
                             />
                          </div>
                          <p className="col-span-2 text-[10px] text-muted-foreground font-medium italic">
                             Total Quantity: {(Number(quantity || 0) * Number(runs || 0)).toLocaleString()} units
                          </p>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  min={selectedService ? parseInt(selectedService.min) : 1}
                  max={selectedService ? parseInt(selectedService.max) : 1000000}
                  placeholder={
                    selectedService
                      ? `Min: ${selectedService.min} — Max: ${selectedService.max}`
                      : "Select a service first"
                  }
                  className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedService}
                className="w-full h-14 bg-primary disabled:opacity-50 hover:bg-primary/80 text-primary-foreground rounded-2xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] mt-4"
              >
                {loading ? "Processing..." : "Submit Order"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-border h-fit bg-gradient-to-br from-primary/5 to-transparent space-y-6"
        >
          <h3 className="text-lg font-bold text-foreground">Order Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground text-sm font-semibold">Your Balance</span>
              <span className="font-bold text-emerald-500">Rs. {balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground text-sm font-semibold">Rate / 1000</span>
              <span className="font-bold text-foreground">
                {selectedService ? `Rs. ${selectedService.rate.toFixed(2)}` : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground text-sm font-semibold">Total Quantity</span>
              <span className="font-bold text-foreground">{(Number(quantity || 0) * (isDripFeed ? Number(runs || 1) : 1)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-foreground font-bold">Total Charge</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-sm">
                Rs. {calculateCharge().toFixed(2)}
              </span>
            </div>
          </div>

          {selectedService && (
            <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <h4 className="text-primary text-sm font-bold mb-2">About this service</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                {selectedService.description}
              </p>
            </div>
          )}

          {balance === 0 && (
            <a
              href="/dashboard/funds"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-all text-sm font-bold shadow-sm"
            >
              Add Funds →
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
