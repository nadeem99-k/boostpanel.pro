import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Expanded, comprehensive SMM services list
const SERVICES = [
  // ── Instagram Followers ──────────────────────────────────────────
  { id: "ig-f-1", category: "Instagram Followers", name: "Instagram Followers [Bot / Fast / Ultra Cheap]", rate: 25.00, min: "50", max: "10000", description: "Fast delivery, bot accounts. Best for quick boosts." },
  { id: "ig-f-2", category: "Instagram Followers", name: "Instagram Followers [Real / Non-Drop / Refill]", rate: 145.00, min: "100", max: "50000", description: "High quality real profiles with pictures. 30-day refill guarantee." },
  { id: "ig-f-3", category: "Instagram Followers", name: "Instagram Followers [USA Targeted]", rate: 450.00, min: "100", max: "10000", description: "USA-based, geo-targeted followers for local business growth." },
  { id: "ig-f-4", category: "Instagram Followers", name: "Instagram Followers [Arab Targeted]", rate: 380.00, min: "100", max: "20000", description: "Arab / Middle-East targeted followers." },
  { id: "ig-f-5", category: "Instagram Followers", name: "Instagram Followers [Pakistan Targeted]", rate: 250.00, min: "100", max: "30000", description: "Pakistan-based followers. Great for local businesses." },
  { id: "ig-geo-1", category: "Instagram Followers", name: "Instagram Followers [India / Hindi HQ]", rate: 220.00, min: "100", max: "100000", description: "100% Indian followers from active accounts." },
  { id: "ig-geo-2", category: "Instagram Followers", name: "Instagram Followers [Brazil HQ]", rate: 280.00, min: "100", max: "50000", description: "Brazilian specific geo-targeted followers." },

  // ── Instagram Likes ──────────────────────────────────────────────
  { id: "ig-l-1", category: "Instagram Likes", name: "Instagram Likes [Instant / Cheap Bots]", rate: 8.00, min: "20", max: "50000", description: "Instant delivery. Bot accounts. High speed." },
  { id: "ig-l-2", category: "Instagram Likes", name: "Instagram Likes [Real Accounts]", rate: 45.00, min: "50", max: "10000", description: "Likes from real, active accounts. Slow start." },
  { id: "ig-l-3", category: "Instagram Likes", name: "Instagram Likes [HQ Non-Drop]", rate: 65.00, min: "50", max: "20000", description: "Non-drop guaranteed. Refill available for 30 days." },
  { id: "ig-l-4", category: "Instagram Likes", name: "Instagram Auto Likes [10 Posts]", rate: 450.00, min: "100", max: "5000", description: "Auto-likes your last 10 posts instantly on each new upload." },

  // ── Instagram Views (Ultra Low) ──────────────────────────────────
  { id: "ig-v-1", category: "Instagram Views", name: "Instagram Reel Views [Instant / Ultra Low]", rate: 2.50, min: "100", max: "5000000", description: "Boost your reels in the algorithm with instant views." },
  { id: "ig-v-2", category: "Instagram Views", name: "Instagram Story Views", rate: 5.00, min: "100", max: "500000", description: "Story views from worldwide accounts." },
  { id: "ig-v-3", category: "Instagram Views", name: "Instagram Video Views [High Retention]", rate: 12.00, min: "500", max: "1000000", description: "High watch-time views. Great for monetization eligibility." },
  { id: "ig-v-4", category: "Instagram Views", name: "Instagram Live Views [30 min Stay]", rate: 350.00, min: "100", max: "10000", description: "Live viewers for 30 minutes. Good for trending." },

  // ── Instagram Misc ───────────────────────────────────────────────
  { id: "ig-c-1", category: "Instagram Comments", name: "Instagram Random Comments", rate: 250.00, min: "10", max: "500", description: "Random positive comments from real-looking accounts." },
  { id: "ig-c-2", category: "Instagram Comments", name: "Instagram Custom Comments", rate: 450.00, min: "10", max: "300", description: "You provide the comment list." },
  { id: "ig-s-1", category: "Instagram Saves & Reach", name: "Instagram Post Saves", rate: 15.00, min: "50", max: "50000", description: "Boosts save count, dramatically improves Explore reach." },
  { id: "ig-s-2", category: "Instagram Saves & Reach", name: "Instagram Profile Visits", rate: 8.00, min: "1000", max: "500000", description: "Real-looking profile visits to boost discovery." },
  { id: "ig-vip-1", category: "Instagram Verification & PR", name: "Instagram Blue Tick PR / Press Release", rate: 45000.00, min: "1", max: "1", description: "Guaranteed publication on 10 premium news outlets required for Instagram verification." },

  // ── TikTok ───────────────────────────────────────────────────────
  { id: "tk-f-1", category: "TikTok Followers", name: "TikTok Followers [HQ / Stable]", rate: 250.00, min: "100", max: "20000", description: "High quality TikTok followers. Stable and long-term." },
  { id: "tk-f-2", category: "TikTok Followers", name: "TikTok Followers [Fast / Very Cheap]", rate: 90.00, min: "100", max: "50000", description: "Fast delivery, cheaper quality bots." },
  { id: "tk-v-1", category: "TikTok Views", name: "TikTok Views [Instant / Ultra Low]", rate: 1.50, min: "1000", max: "5000000", description: "Super fast views. Very cheap per 1000." },
  { id: "tk-fyp-1", category: "TikTok Views [FYP Algorithm]", name: "TikTok FYP Trigger Views [High Retention + Shares]", rate: 120.00, min: "1000", max: "500000", description: "Optimized views combining 80%+ watch time and shares to force FYP algorithm placement." },
  { id: "tk-l-1", category: "TikTok Likes", name: "TikTok Likes [HQ]", rate: 110.00, min: "50", max: "50000", description: "High quality likes from active accounts." },
  { id: "tk-l-2", category: "TikTok Likes", name: "TikTok Likes [Cheap / Fast]", rate: 35.00, min: "100", max: "100000", description: "Instant delivery, bot likes." },
  { id: "tk-s-1", category: "TikTok Shares", name: "TikTok Shares", rate: 15.00, min: "100", max: "100000", description: "Increases share count significantly." },

  // ── YouTube ───────────────────────────────────────────────────────
  { id: "yt-s-1", category: "YouTube Subscribers", name: "YouTube Subscribers [Non-Drop / Real]", rate: 1800.00, min: "50", max: "5000", description: "Lifetime guarantee. Slow drip for natural growth." },
  { id: "yt-s-2", category: "YouTube Subscribers", name: "YouTube Subscribers [Cheap / Fast Drops]", rate: 450.00, min: "100", max: "20000", description: "Fast delivery. High drop rate." },
  { id: "yt-v-1", category: "YouTube Views", name: "YouTube Views [High Retention 60%+]", rate: 280.00, min: "1000", max: "100000", description: "High watch time. Best for monetization threshold." },
  { id: "yt-v-2", category: "YouTube Views", name: "YouTube Views [Cheap / Fast]", rate: 95.00, min: "1000", max: "500000", description: "Fast views. Lower retention." },
  { id: "yt-l-1", category: "YouTube Likes", name: "YouTube Likes [Real]", rate: 150.00, min: "20", max: "10000", description: "Likes from real YouTube accounts." },
  { id: "yt-h-1", category: "YouTube Hours", name: "YouTube Watch Hours [4000 Monetization Pack]", rate: 8500.00, min: "500", max: "4000", description: "Helps reach 4000 watch-hour monetization threshold." },
  { id: "yt-ls-1", category: "YouTube Livestream", name: "YouTube Concurrent Live Viewers [1 Hour]", rate: 1200.00, min: "100", max: "5000", description: "Stable concurrent live viewers for 1 full hour." },

  // ── Twitter / X ────────────────────────────────────────────────
  { id: "tw-f-1", category: "Twitter / X Followers", name: "Twitter Followers [Global]", rate: 280.00, min: "100", max: "50000", description: "Global Twitter/X followers." },
  { id: "tw-l-1", category: "Twitter / X Likes", name: "Twitter Likes [Fast]", rate: 140.00, min: "50", max: "20000", description: "Fast delivery likes from global accounts." },
  { id: "tw-r-1", category: "Twitter / X Retweets", name: "Twitter Retweets", rate: 160.00, min: "50", max: "20000", description: "Fast retweets to boost post reach." },
  { id: "tw-v-1", category: "Twitter / X Views", name: "Twitter Video / Post Views", rate: 10.00, min: "1000", max: "1000000", description: "Increase view count on Twitter/X." },
  { id: "tw-s-1", category: "Twitter / X Spaces", name: "Twitter Spaces Listeners [30 Min Stay]", rate: 800.00, min: "50", max: "2000", description: "Live listeners for your Twitter Space audio room." },

  // ── Facebook ─────────────────────────────────────────────────────
  { id: "fb-pl-1", category: "Facebook Page Likes", name: "Facebook Page Likes + Followers [HQ]", rate: 350.00, min: "100", max: "50000", description: "Combined page likes and follow. HQ accounts." },
  { id: "fb-l-1", category: "Facebook Post Likes", name: "Facebook Post Likes [Fast / Low]", rate: 80.00, min: "50", max: "20000", description: "Fast likes on any public Facebook post." },
  { id: "fb-v-1", category: "Facebook Views", name: "Facebook Video Views", rate: 45.00, min: "1000", max: "500000", description: "Video views. Good for Facebook monetization." },

  // ── Telegram ───────────────────────────────────────────────────
  { id: "tg-m-1", category: "Telegram", name: "Telegram Channel Members [Real Mix]", rate: 180.00, min: "100", max: "100000", description: "Real-looking Telegram members." },
  { id: "tg-m-2", category: "Telegram", name: "Telegram Zero-Drop Members [HQ]", rate: 350.00, min: "100", max: "50000", description: "High quality Telegram members that won't drop over time." },
  { id: "tg-v-1", category: "Telegram", name: "Telegram Post Views [Ultra Cheap]", rate: 4.00, min: "100", max: "100000", description: "Views on your Telegram posts instantly." },
  { id: "tg-c-1", category: "Telegram", name: "Telegram Members [Crypto / NFT Target]", rate: 850.00, min: "100", max: "50000", description: "Members scraped from Crypto/NFT groups." },

  // ── WhatsApp ───────────────────────────────────────────────────
  { id: "wa-m-1", category: "WhatsApp Channels", name: "WhatsApp Channel Followers [Global HQ]", rate: 450.00, min: "100", max: "50000", description: "High-quality, non-drop global followers for your WhatsApp Channel." },
  { id: "wa-r-1", category: "WhatsApp Channels", name: "WhatsApp Channel Reactions [Random]", rate: 150.00, min: "20", max: "5000", description: "Random positive reactions to a specific WhatsApp Channel post." },

  // ── Twitch & Discord ───────────────────────────────────────────
  { id: "twi-f-1", category: "Twitch", name: "Twitch Followers [HQ]", rate: 250.00, min: "100", max: "20000", description: "High quality Twitch channel followers." },
  { id: "dis-m-1", category: "Discord", name: "Discord Server Members [Online Mix]", rate: 350.00, min: "100", max: "10000", description: "Mix of online and offline Discord members." },
  { id: "dis-m-2", category: "Discord", name: "Discord Server Boosts [Level 1 / Low Drop]", rate: 3500.00, min: "2", max: "14", description: "Server nitro boosts for your community." },

  // ── Spotify & SoundCloud ───────────────────────────────────────
  { id: "sp-f-1", category: "Spotify Streams", name: "Spotify Plays [Premium Mix]", rate: 180.00, min: "1000", max: "1000000", description: "Premium streams. Royalty eligible." },
  { id: "sc-p-1", category: "SoundCloud", name: "SoundCloud Plays [Fast / Cheap]", rate: 12.00, min: "1000", max: "5000000", description: "Fast delivery SoundCloud plays to boost your track." },

  // ── Website Traffic / SEO ────────────────────────────────────────
  { id: "web-t-1", category: "Website Traffic", name: "Website Traffic [Ultra Cheap / Global]", rate: 25.00, min: "1000", max: "1000000", description: "Basic raw traffic for boosting stats." },
  { id: "web-t-2", category: "Website Traffic", name: "Website Traffic [Google Organic SEO HQ]", rate: 150.00, min: "1000", max: "1000000", description: "AdSense safe traffic appearing as Google organic searches in Google Analytics." },
];

export async function GET() {
  return NextResponse.json(SERVICES);
}
