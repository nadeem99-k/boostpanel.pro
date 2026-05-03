"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ArrowLeft, Terminal, Globe, Code2 } from "lucide-react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/services",
    desc: "Returns a full list of all available SMM services with IDs, rates, min/max quantities.",
    response: `[
  {
    "id": "ig-f-1",
    "category": "Instagram Followers",
    "name": "Instagram Followers [Bot / Fast]",
    "rate": 10.50,
    "min": "50",
    "max": "10000",
    "description": "Fast delivery, bot accounts."
  },
  ...
]`,
  },
  {
    method: "POST",
    path: "/api/orders",
    desc: "Creates a new order. Requires service_id, link, quantity, and charge in the request body.",
    body: `{
  "service_id": "ig-f-1",
  "service_name": "Instagram Followers [Bot / Fast]",
  "link": "https://instagram.com/yourprofile",
  "quantity": 1000,
  "charge": 10.50
}`,
    response: `{
  "success": true,
  "order": {
    "id": "uuid-here",
    "status": "Pending",
    "created_at": "2026-04-28T..."
  }
}`,
  },
  {
    method: "GET",
    path: "/api/user",
    desc: "Returns the current user's balance (requires Supabase session).",
    response: `{
  "balance": 1500.00
}`,
  },
];

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-neutral-300 overflow-x-auto font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
      </button>
    </div>
  );
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function ApiDocsPage() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://yourpanel.com";

  return (
    <div className="min-h-screen bg-background px-6 py-12 md:px-16">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-white">Reseller API</h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Integrate Boost services programmatically. All endpoints return JSON.
          </p>
        </div>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-white">Base URL</h2>
          </div>
          <CodeBlock code={baseUrl} lang="text" />
          <p className="text-xs text-neutral-500 mt-3">
            All API requests should be prefixed with this base URL.
          </p>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Endpoints</h2>
          </div>

          {ENDPOINTS.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/5 space-y-5"
            >
              {/* Method + Path */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono tracking-wider ${METHOD_COLORS[ep.method] ?? ""}`}>
                  {ep.method}
                </span>
                <code className="text-purple-300 font-mono text-sm">{ep.path}</code>
              </div>

              <p className="text-neutral-400 text-sm">{ep.desc}</p>

              {ep.body && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Request Body</p>
                  <CodeBlock code={ep.body} />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">Response</p>
                <CodeBlock code={ep.response} />
              </div>

              {/* Example curl */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">cURL Example</p>
                <CodeBlock
                  lang="bash"
                  code={
                    ep.method === "GET"
                      ? `curl ${baseUrl}${ep.path}`
                      : `curl -X POST ${baseUrl}${ep.path} \\\n  -H "Content-Type: application/json" \\\n  -d '${ep.body?.replace(/\n/g, "").replace(/\s+/g, " ")}'`
                  }
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div className="p-5 glass rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <p className="text-sm text-neutral-300 leading-relaxed">
            <span className="text-purple-400 font-semibold">Note: </span>
            Full server-side order management and authentication will be enabled once Supabase is connected.
            Currently orders are tracked client-side via localStorage for development.
          </p>
        </div>
      </div>
    </div>
  );
}
