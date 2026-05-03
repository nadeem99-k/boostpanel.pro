"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  ListOrdered, 
  Wallet, 
  LogOut,
  Settings,
  UserCircle,
  Menu,
  X,
  Server,
  Layers,
  LifeBuoy,
  Code,
  Users,
  Zap,
  XCircle,
  Globe,
  Activity
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Order", href: "/dashboard/new-order", icon: ShoppingCart },
  { name: "Order History", href: "/dashboard/history", icon: ListOrdered },
  { name: "Add Funds", href: "/dashboard/funds", icon: Wallet },
  { name: "Services", href: "/dashboard/services", icon: Server },
  { name: "Mass Order", href: "/dashboard/mass-order", icon: Layers },
  { name: "Tickets", href: "/dashboard/tickets", icon: LifeBuoy },
  { name: "Affiliates", href: "/dashboard/affiliate", icon: Users },
  { name: "Child Panels", href: "/dashboard/child-panels", icon: Globe },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "API Docs", href: "/dashboard/api", icon: Code },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);
  const [initials, setInitials] = useState("U");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [broadcast, setBroadcast] = useState("");

  useEffect(() => {
    const load = () => {
      const b = localStorage.getItem("smm_balance");
      setBalance(b ? parseFloat(b) : 0);
      try {
        const user = JSON.parse(localStorage.getItem("smm_user") || "{}");
        const email = user.email || "";
        const label = user.name || email || "";
        setInitials(label ? label.charAt(0).toUpperCase() : "U");
        setIsAdmin(email === "nadeemalikalhoro310@gmail.com");
        setBroadcast(localStorage.getItem("smm_broadcast") || "");
      } catch { /* ignore */ }
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 border-r border-white/5 glass hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/5 gap-2">
          <div className="w-6 h-6 rounded-md overflow-hidden bg-purple-600/20 border border-purple-500/20">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 tracking-tight">
            Boost
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-0.5 h-7 bg-purple-500 rounded-r-full"
                  />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Admin Panel</span>
            </Link>
          )}
          <button
            onClick={() => {
            localStorage.clear();
            // Clear session cookie
            document.cookie = "smm_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            window.location.href = "/login";
          }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Broadcast Banner */}
        <AnimatePresence>
          {broadcast && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-purple-600 overflow-hidden relative"
            >
               <div className="py-2 px-4 flex items-center justify-center gap-6 animate-marquee whitespace-nowrap overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <Zap className="w-3 h-3 text-white fill-white shadow-2xl" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                          {broadcast}
                       </span>
                    </div>
                  ))}
               </div>
               <button onClick={() => setBroadcast("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  <XCircle className="w-4 h-4" />
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <header className="h-16 border-b border-white/5 glass flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 shrink-0">
          {/* Mobile: Logo and Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-neutral-400 hover:text-white transition-colors">
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
             <Link href="/" className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
               Boost
             </Link>
          </div>
          {/* Desktop: Page title derived from nav */}
          <h1 className="hidden md:block text-base font-semibold text-neutral-200">
            {NAV_ITEMS.find(n => n.href === pathname)?.name ?? "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2 justify-end">
                {isAdmin && (
                  <span className="text-[8px] font-black bg-primary/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-widest">
                    Admin
                  </span>
                )}
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Balance</span>
              </div>
              <span className="font-bold text-white text-sm">Rs. {balance.toFixed(2)}</span>
            </div>
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {initials}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </div>

        {/* ── Mobile Menu Overlay ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-3xl p-6 md:hidden flex flex-col"
            >
              <div className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-4 border-b border-white/5 text-lg font-bold text-neutral-200 hover:text-white"
                  >
                    <item.icon className="w-6 h-6 text-purple-400" /> {item.name}
                  </Link>
                ))}
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-4 border-b border-white/5 text-lg font-bold text-neutral-200 hover:text-white"
                  >
                    <Settings className="w-6 h-6 text-purple-400" /> Admin Panel
                  </Link>
                )}
              </div>

              <button
                onClick={() => {
                  localStorage.clear();
                  document.cookie = "smm_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                  window.location.href = "/login";
                }}
                className="flex items-center justify-center gap-3 w-full py-4 mt-auto rounded-2xl bg-red-500/10 text-red-500 font-bold"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 glass flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                isActive ? "text-purple-400" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
