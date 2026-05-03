"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md"
      >
        <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-500 mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 h-11 inline-flex items-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 h-11 inline-flex items-center rounded-xl glass border border-white/10 hover:bg-white/5 text-white font-medium text-sm transition-all"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
