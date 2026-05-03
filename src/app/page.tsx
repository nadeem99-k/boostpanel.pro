"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Sparkles, LayoutDashboard, Database, Activity, Moon, Sun, CheckCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 rounded-[2rem] glass-crystal border border-foreground/5 relative group overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110 duration-300">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-2xl font-bold mb-3 relative z-10 text-foreground">{title}</h3>
    <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
  </motion.div>
);

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("smm_theme") as "dark" | "light";
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    
    // Check if user is logged in
    const user = localStorage.getItem("smm_user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("smm_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden font-sans transition-colors duration-500">
      <div className="noise-overlay" />
      
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[150px] gradient-mix" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/30 blur-[150px] gradient-mix" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/5 backdrop-blur-2xl bg-background/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-[2px] shadow-lg shadow-primary/20">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain scale-110 group-hover:scale-125 transition-transform duration-500" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Boost<span className="text-primary">.</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            <Link href="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">API</Link>
            <div className="w-[1px] h-4 bg-border mx-2" />
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-foreground/5 rounded-full">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isLoggedIn ? (
              <Link href="/dashboard" className="h-10 px-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-foreground hover:text-primary transition-colors">Login</Link>
                <Link href="/register" className="h-10 px-6 rounded-full bg-foreground text-background flex items-center justify-center font-semibold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-2">
               {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground p-2 -mr-2">
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-xl font-bold">
              <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors border-b border-border pb-4">Features</Link>
              <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors border-b border-border pb-4">Services</Link>
              <Link href="/api-docs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors border-b border-border pb-4">API Documentation</Link>
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="h-14 mt-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors border-b border-border pb-4">Login</Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="h-14 mt-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[95vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Version 2.0 Now Live</span>
            </motion.div>
            <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter leading-[1.05] mb-6 text-foreground">
              Scale Your Growth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">On Autopilot.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl font-medium">
              The premier platform for agencies and creators. Access high-quality services, instant delivery, and a powerful API to turbocharge your social presence globally.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href={isLoggedIn ? "/dashboard" : "/register"} className="h-14 px-8 rounded-full bg-primary text-primary-foreground flex items-center gap-2 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                {isLoggedIn ? "Go to Dashboard" : "Start Growing Now"} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="h-14 px-8 rounded-full border border-border bg-foreground/5 flex items-center justify-center font-bold text-lg hover:bg-foreground/10 active:scale-95 transition-all backdrop-blur-md text-foreground">
                View Pricing
              </Link>
            </div>
            
            <div className="mt-14 flex items-center gap-8 text-sm text-muted-foreground font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Instant Setup
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Developer API
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> 24/7 Support
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-blue-500/40 rounded-[3rem] blur-3xl animate-pulse gradient-mix" style={{ animationDuration: '4s' }} />
            <div className="relative w-full max-w-lg rounded-[2.5rem] glass-crystal p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-foreground/20 z-10 blob">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-70" />
              <img src="/feature-1.png" alt="Dashboard Preview" className="w-full h-auto rounded-[2rem] shadow-sm border border-foreground/10" />
            </div>
            
            {/* Decorative elements */}
            <motion.div 
               animate={{ y: [0, -20, 0] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -left-10 w-32 h-32 rounded-2xl glass-crystal p-4 border border-foreground/10 hidden md:block z-20"
            >
               <img src="/logo.png" className="w-full h-full object-contain drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-foreground/5 bg-foreground/[0.02] relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Active Users", value: "25K+" },
              { label: "Orders Monthly", value: "3.2M" },
              { label: "Uptime", value: "99.9%" },
              { label: "Avg Delivery", value: "< 2s" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="space-y-3"
              >
                <div className="text-4xl md:text-6xl font-black bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-sm">{stat.value}</div>
                <div className="text-sm font-bold text-primary uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-foreground"
            >
              Built to help you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">dominate.</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              We developed the most advanced logistics network in the industry, delivering unmatched speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast"
              description="Orders process through our neural network instantly. No waiting, no delays, purely instant execution."
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield}
              title="Secure & Private"
              description="Enterprise-grade encryption and strictly anonymous processing. Your growth strategies remain your secret."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity}
              title="Scale Infinitely"
              description="Whether you need 100 or 1,000,000 interactions, our infrastructure dynamically scales to meet your exact demand."
              delay={0.3}
            />
          </div>

          {/* Zig-Zag 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 relative group"
            >
               <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-50 rounded-full group-hover:opacity-80 transition-opacity duration-500" />
               <div className="glass-crystal p-3 rounded-[2.5rem] relative z-10 transform group-hover:scale-[1.02] transition-transform duration-500">
                  <img src="/ultra-1.png" alt="Infrastructure" className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
               </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Quantum Architecture.</h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Connect your own applications, resell our services seamlessly, and fully automate your business with our developer-friendly, ultra-low latency REST API.
              </p>
              <ul className="space-y-5 pt-4">
                {["Comprehensive Documentation", "Unlimited Endpoint Access", "Real-time Webhook Sync"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-foreground font-semibold text-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                       <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                 <Link href="/api-docs" className="text-primary font-bold text-lg inline-flex items-center gap-2 hover:gap-4 transition-all">
                    Read the Docs <ArrowRight className="w-5 h-5" />
                 </Link>
              </div>
            </motion.div>
          </div>

          {/* Zig-Zag 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <LayoutDashboard className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Command Center.</h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Manage your funds, track precise order status, and discover entirely new service categories effortlessly inside our meticulously crafted dashboard focused on velocity.
              </p>
              <Link href="/register" className="inline-flex h-14 px-8 items-center justify-center rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 active:scale-95 transition-all mt-4">
                Start Exploring
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative group lg:ml-auto"
            >
               <div className="absolute -inset-4 bg-purple-500/20 blur-3xl opacity-50 rounded-full group-hover:opacity-80 transition-opacity duration-500" />
               <div className="glass-crystal p-3 rounded-[2.5rem] relative z-10 transform group-hover:scale-[1.02] transition-transform duration-500">
                  <img src="/feature-2.png" alt="Dashboard Hub" className="relative w-full max-w-xl h-auto rounded-[2rem] shadow-2xl" />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden flex justify-center mt-20">
        <div className="absolute inset-0 bg-primary/5 border-y border-foreground/10 backdrop-blur-md" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 blur-[200px] rounded-full pointer-events-none gradient-mix" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-5xl mx-auto text-center glass-crystal p-12 md:p-24 rounded-[3.5rem] shadow-[0_0_100px_rgba(168,85,247,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-[1.1]">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">supercharge</span><br />
            your presence?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of modern agencies and top-tier creators who trust our infrastructure to deliver exceptional results every single day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link href={isLoggedIn ? "/dashboard" : "/register"} className="w-full sm:w-auto h-16 px-12 rounded-full bg-primary text-primary-foreground font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(168,85,247,0.6)] flex items-center justify-center">
               {isLoggedIn ? "Access Dashboard" : "Create Free Account"}
             </Link>
             <Link href="/services" className="w-full sm:w-auto h-16 px-12 rounded-full bg-foreground/5 border border-foreground/10 text-foreground font-bold text-xl hover:bg-foreground/10 active:scale-95 transition-all flex items-center justify-center">
               Explore Services
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
               <Link href="/" className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-[2px]">
                   <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                     <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                   </div>
                 </div>
                 <span className="text-2xl font-black tracking-tight text-foreground">Boost<span className="text-primary">.</span></span>
               </Link>
               <p className="text-muted-foreground font-medium max-w-sm">
                 The enterprise-grade social logistics network designed for unparalleled scale and reliability.
               </p>
            </div>
            
            <div>
               <h4 className="font-bold text-foreground mb-6">Platform</h4>
               <ul className="space-y-4 text-muted-foreground font-medium">
                  <li><Link href="/services" className="hover:text-primary transition-colors">Services Directory</Link></li>
                  <li><Link href="/api-docs" className="hover:text-primary transition-colors">Developer API</Link></li>
                  <li><Link href={isLoggedIn ? "/dashboard" : "/register"} className="hover:text-primary transition-colors">{isLoggedIn ? "Go to Dashboard" : "Create Account"}</Link></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold text-foreground mb-6">Support</h4>
               <ul className="space-y-4 text-muted-foreground font-medium">
                  <li><Link href={isLoggedIn ? "/dashboard" : "/login"} className="hover:text-primary transition-colors">{isLoggedIn ? "Dashboard Home" : "Login to Dashboard"}</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
               </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-sm font-medium text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
             <p>© {new Date().getFullYear()} Boost International. All rights reserved.</p>
             <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">All Systems Nominal</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
