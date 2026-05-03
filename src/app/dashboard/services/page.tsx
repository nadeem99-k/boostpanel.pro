"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Server, Camera, Video, Users, MessageCircle, Briefcase, Music, Send, Headphones, Zap, Gamepad2, Phone, Ghost, AtSign, Pin, MessageSquare, Cloud, Globe } from "lucide-react";

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

        setServices(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const hidden = JSON.parse(localStorage.getItem("smm_hidden_services") || "[]");
    if (hidden.includes(s.id)) return false;

    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const categories = Array.from(new Set(filteredServices.map(s => s.category)));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Services Catalog
          </h2>
          <p className="text-muted-foreground mt-1">Browse our complete list of high-quality SMM services.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
           <p className="text-muted-foreground font-medium text-sm animate-pulse">Loading Services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center border border-border mt-8 text-center">
           <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mb-4">
              <Server className="w-8 h-8 text-muted-foreground" />
           </div>
           <h3 className="text-lg font-bold text-foreground">No services found</h3>
           <p className="text-muted-foreground text-sm max-w-sm mt-2">We couldn't find any services matching your search query. Try different keywords.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category, idx) => {
             const categoryServices = filteredServices.filter(s => s.category === category);
             const CatIcon = getCategoryIcon(category);
             
             return (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 key={category} 
                 className="glass rounded-2xl border border-border overflow-hidden"
               >
                  <div className="px-6 py-4 border-b border-border bg-foreground/5 flex items-center gap-3">
                     <CatIcon className="w-5 h-5 text-primary" />
                     <h3 className="text-lg font-bold text-foreground">{category}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-background/20 text-muted-foreground font-medium border-b border-border">
                          <tr>
                             <th className="px-6 py-4 font-semibold w-16">ID</th>
                             <th className="px-6 py-4 font-semibold w-[400px]">Service Name</th>
                             <th className="px-6 py-4 font-semibold text-right">Rate / 1k</th>
                             <th className="px-6 py-4 font-semibold text-center">Min / Max</th>
                             <th className="px-6 py-4 font-semibold w-full">Description</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border">
                          {categoryServices.map(service => (
                            <tr key={service.id} className="hover:bg-foreground/5 transition-colors group">
                               <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{service.id}</td>
                               <td className="px-6 py-4 font-bold text-foreground whitespace-normal min-w-[300px]">
                                 {service.name}
                               </td>
                               <td className="px-6 py-4 font-black text-primary text-right">
                                 Rs. {service.rate.toFixed(2)}
                               </td>
                               <td className="px-6 py-4 text-muted-foreground text-xs text-center font-medium">
                                 {service.min} - {service.max}
                               </td>
                               <td className="px-6 py-4 text-muted-foreground text-xs whitespace-normal max-w-sm leading-relaxed">
                                 {service.description}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </motion.div>
             )
          })}
        </div>
      )}
    </div>
  );
}
