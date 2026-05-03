"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Bell, CheckCircle2, ShoppingBag, LifeBuoy, AlertCircle, Trash2, Calendar } from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "ticket" | "system" | "deposit";
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const load = () => {
      const notes = JSON.parse(localStorage.getItem("smm_notifications") || "[]");
      setNotifications(notes.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    };
    load();
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("smm_notifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    localStorage.setItem("smm_notifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case "ticket": return <LifeBuoy className="w-5 h-5 text-purple-400" />;
      case "deposit": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default: return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black tracking-tighter">Notifications.</h1>
           <p className="text-muted-foreground font-medium">Stay updated with your account activity.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass p-20 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-600">
                <Bell className="w-8 h-8" />
             </div>
             <p className="text-muted-foreground font-bold italic opacity-40">Your notification feed is empty.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((note) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={note.id} 
                className={`glass p-5 rounded-[2rem] border border-white/5 flex items-start gap-4 transition-all group ${!note.read ? 'bg-white/[0.03] border-primary/20 shadow-xl shadow-primary/5' : ''}`}
              >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!note.read ? 'bg-primary/20' : 'bg-white/5 opacity-50'}`}>
                    {getIcon(note.type)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className={`font-bold text-sm ${!note.read ? 'text-white' : 'text-neutral-400'}`}>{note.title}</h4>
                       {!note.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{note.message}</p>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                          <Calendar className="w-3 h-3" />
                          {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => deleteNote(note.id)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
