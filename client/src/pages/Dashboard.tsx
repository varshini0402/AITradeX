import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import {
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── TARIFF COST ANALYTICS DATA ───────────────────────────────────────────────
const tariffDataset = [
  { month: "Jan", country: "China",   category: "Electronics", unit: "Operations",    cost: 18000, duty: 1260 },
  { month: "Jan", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 10000, duty: 660  },
  { month: "Jan", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 8000,  duty: 560  },
  { month: "Jan", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 4000,  duty: 280  },
  { month: "Jan", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 5000,  duty: 440  },
  { month: "Feb", country: "China",   category: "Electronics", unit: "Operations",    cost: 20000, duty: 1400 },
  { month: "Feb", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 11000, duty: 770  },
  { month: "Feb", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 10000, duty: 700  },
  { month: "Feb", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 5000,  duty: 350  },
  { month: "Feb", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 6000,  duty: 540  },
  { month: "Mar", country: "China",   category: "Electronics", unit: "Operations",    cost: 17000, duty: 1190 },
  { month: "Mar", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 12000, duty: 840  },
  { month: "Mar", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 9000,  duty: 630  },
  { month: "Mar", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 5000,  duty: 350  },
  { month: "Mar", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 5000,  duty: 440  },
  { month: "Apr", country: "China",   category: "Electronics", unit: "Operations",    cost: 22000, duty: 1540 },
  { month: "Apr", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 15000, duty: 1050 },
  { month: "Apr", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 10000, duty: 700  },
  { month: "Apr", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 6000,  duty: 420  },
  { month: "Apr", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 8000,  duty: 720  },
  { month: "May", country: "China",   category: "Electronics", unit: "Operations",    cost: 20000, duty: 1400 },
  { month: "May", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 13000, duty: 910  },
  { month: "May", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 9000,  duty: 630  },
  { month: "May", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 6000,  duty: 420  },
  { month: "May", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 7000,  duty: 630  },
  { month: "Jun", country: "China",   category: "Electronics", unit: "Operations",    cost: 24000, duty: 1680 },
  { month: "Jun", country: "China",   category: "Textiles",    unit: "Supply Chain",  cost: 16000, duty: 1120 },
  { month: "Jun", country: "Japan",   category: "Electronics", unit: "Operations",    cost: 11000, duty: 770  },
  { month: "Jun", country: "Japan",   category: "Machinery",   unit: "Manufacturing", cost: 7000,  duty: 490  },
  { month: "Jun", country: "Vietnam", category: "Textiles",    unit: "Supply Chain",  cost: 9000,  duty: 810  },
];

// ─── TARIFF RATE ANALYSIS DATA ────────────────────────────────────────────────
const tariffRateDataset: Record<string, { month: string; Electronics: number; Agriculture: number; Automotive: number; Textiles: number }[]> = {
  "6M": [
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1,  Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4,  Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2,  Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1, Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5, Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3, Automotive: 22.4, Textiles: 10.8 },
  ],
  "1Y": [
    { month: "Jul", Electronics: 10.2, Agriculture: 5.4, Automotive: 8.2,  Textiles: 4.1  },
    { month: "Aug", Electronics: 11.4, Agriculture: 5.8, Automotive: 8.9,  Textiles: 4.3  },
    { month: "Sep", Electronics: 12.8, Agriculture: 6.2, Automotive: 9.5,  Textiles: 4.6  },
    { month: "Oct", Electronics: 14.1, Agriculture: 6.9, Automotive: 10.2, Textiles: 5.0  },
    { month: "Nov", Electronics: 15.5, Agriculture: 7.2, Automotive: 11.1, Textiles: 5.4  },
    { month: "Dec", Electronics: 16.9, Agriculture: 7.6, Automotive: 11.8, Textiles: 5.8  },
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1, Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4, Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2, Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1,Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5,Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3,Automotive: 22.4, Textiles: 10.8 },
  ],
  "YTD": [
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1,  Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4,  Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2,  Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1, Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5, Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3, Automotive: 22.4, Textiles: 10.8 },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#f0b429",
  Agriculture: "#2dd4bf",
  Automotive:  "#60a5fa",
  Textiles:    "#a78bfa",
};

const ALL_RATE_CATEGORIES = ["Electronics", "Agriculture", "Automotive", "Textiles"];
const ALL_RATE_COUNTRIES  = ["China", "Japan", "Vietnam"];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface RegUpdate {
  id?: number;
  title: string;
  summary?: string;
  severity: "urgent" | "warning" | "info";
  detected_at: string;
  source_url?: string;
}

// ─── RECENT ACTIVITY DATA ─────────────────────────────────────────────────────
const recentActivity = [
  { id: "JPN-1006", product: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",     value: "5,000",  compliance: "98%", status: "Approved" },
  { id: "JPN-1007", product: "BTIO-BTI-SMJ-BM4T2-15 Monitor Touch", value: "25,000", compliance: "98%", status: "Approved" },
  { id: "JPN-1008", product: "Industrial Temperature Sensor",        value: "8,500",  compliance: "92%", status: "Approved" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // ── existing cost-analytics filters ──
  const [selectedCountry,  setSelectedCountry]  = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit,     setSelectedUnit]     = useState("all");

  // ── tariff-rate chart filters ──
  const [timeRange,    setTimeRange]    = useState<"6M" | "1Y" | "YTD">("6M");
  const [rateCountry,  setRateCountry]  = useState("all");
  const [rateCategory, setRateCategory] = useState("all");

  // ── regulation updates state (mirrors index.html logic) ──
  const [regUpdates,    setRegUpdates]    = useState<RegUpdate[]>([]);
  const [urgentCount,   setUrgentCount]   = useState<number | null>(null);
  const [regLoading,    setRegLoading]    = useState(true);
  const [regError,      setRegError]      = useState(false);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [lastScrape,    setLastScrape]    = useState<string>("--");
  const [schedulesCount,setSchedulesCount]= useState<number | null>(null);

  // ── load regulation updates (mirrors loadUpdates() in index.html) ──
  const loadUpdates = useCallback(async () => {
    setRegLoading(true);
    setRegError(false);
    try {
      const [updatesRes, schedulesRes, logRes] = await Promise.all([
        fetch("/api/updates"),
        fetch("/api/schedules"),
        fetch("/api/scrape-log"),
      ]);
      const { updates }   = await updatesRes.json();
      const { schedules } = await schedulesRes.json();
      const { log }       = await logRes.json();

      setRegUpdates(updates ?? []);
      setUrgentCount((updates ?? []).filter((u: RegUpdate) => u.severity === "urgent").length);
      setSchedulesCount((schedules ?? []).length);

      if (log && log.length > 0) {
        const lastDate = new Date(log[0].scraped_at);
        const ago = Math.round((Date.now() - lastDate.getTime()) / 60000);
        setLastScrape(ago < 60 ? `${ago}m ago` : `${Math.round(ago / 60)}h ago`);
      }
    } catch {
      setRegError(true);
      // Auto-retry in 30s, same as index.html
      setTimeout(loadUpdates, 30000);
    } finally {
      setRegLoading(false);
    }
  }, []);

  // ── manual scrape (mirrors manualScrape() in index.html) ──
  const manualScrape = async () => {
    setScrapeLoading(true);
    try {
      await fetch("/api/scrape", { method: "POST" });
      await loadUpdates();
    } catch {
      console.error("Scrape error");
    } finally {
      setScrapeLoading(false);
    }
  };

  // Load on mount + auto-refresh every 5 min (same as index.html)
  useEffect(() => {
    loadUpdates();
    const interval = setInterval(loadUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadUpdates]);

  // ── filtered cost chart data ──
  const filteredChartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; cost: number; duty: number }> = {};
    tariffDataset.forEach((item) => {
      if (
        (selectedCountry  === "all" || item.country  === selectedCountry)  &&
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (selectedUnit     === "all" || item.unit     === selectedUnit)
      ) {
        if (!monthlyData[item.month]) monthlyData[item.month] = { month: item.month, cost: 0, duty: 0 };
        monthlyData[item.month].cost += item.cost;
        monthlyData[item.month].duty += item.duty;
      }
    });
    const order = ["Jan","Feb","Mar","Apr","May","Jun"];
    return Object.values(monthlyData).sort((a, b) => order.indexOf(a.month) - order.indexOf(b.month));
  }, [selectedCountry, selectedCategory, selectedUnit]);

  const hasData = filteredChartData.length > 0;
  const visibleCategories = rateCategory === "all" ? ALL_RATE_CATEGORIES : [rateCategory];

  // ── severity helpers ──
  const severityBg: Record<string, string> = {
    urgent:  "rgba(248,113,113,0.1)",
    warning: "rgba(240,180,41,0.12)",
    info:    "rgba(96,165,250,0.1)",
  };
  const severityColor: Record<string, string> = {
    urgent:  "#f87171",
    warning: "#f0b429",
    info:    "#60a5fa",
  };
  const severityBorder: Record<string, string> = {
    urgent:  "#f87171",
    warning: "#f0b429",
    info:    "#60a5fa",
  };
  const severityIcon: Record<string, string> = {
    urgent:  "🔴",
    warning: "🟡",
    info:    "🔵",
  };

  return (
    <div className="space-y-4">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good Day, Ahmad</h2>
          <p className="text-sm text-slate-600">You have 5 shipments pending review.</p>
        </div>
      </div>

      {/* ── ROW 1: Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Shipments This Month</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">148</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" /><span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Pending Review</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">5</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Action</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">AI Compliance</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">93.7%</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" /><span>+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Est. Duty</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">RM 18.4K</span>
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <TrendingDown className="w-3 h-3" /><span>-3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 2: Tariff Rate Analysis + Regulation Updates (WHITE background) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT: Tariff Rate Analysis */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              {/* Title + time toggle */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Tariff Rate Analysis</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Effective tariff rates by product category &amp; origin region (Malaysia)
                  </CardDescription>
                </div>
                {/* Time toggle */}
                <div className="flex gap-0.5 rounded-lg p-1 shrink-0 bg-slate-100">
                  {(["6M", "1Y", "YTD"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
                      style={{
                        background: timeRange === t ? "#ffffff" : "transparent",
                        color:      timeRange === t ? "#0f172a"  : "#64748b",
                        border:     timeRange === t ? "1px solid #e2e8f0" : "1px solid transparent",
                        boxShadow:  timeRange === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={rateCountry}
                  onChange={(e) => setRateCountry(e.target.value)}
                  className="rounded-md px-2 py-1 text-xs font-medium border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Countries</option>
                  {ALL_RATE_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={rateCategory}
                  onChange={(e) => setRateCategory(e.target.value)}
                  className="rounded-md px-2 py-1 text-xs font-medium border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {ALL_RATE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart
                data={tariffRateDataset[timeRange]}
                margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 45]}
                  ticks={[0, 10, 20, 30, 40]}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
                {visibleCategories.map((cat) => (
                  <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={CATEGORY_COLORS[cat]}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: CATEGORY_COLORS[cat], strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#ffffff" }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-100">
              {visibleCategories.map((cat) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[cat] }} />
                  <span className="text-xs text-slate-500">{cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Regulation Updates */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Regulation Updates</CardTitle>
              <div className="flex items-center gap-2">
                {/* Urgent badge — mirrors index.html urgentEl */}
                <Badge
                  className="text-xs font-semibold px-2 py-0.5"
                  style={{
                    background: urgentCount && urgentCount > 0
                      ? "rgba(248,113,113,0.12)"
                      : "rgba(45,212,191,0.12)",
                    color: urgentCount && urgentCount > 0 ? "#ef4444" : "#2dd4bf",
                    border: "none",
                  }}
                >
                  {urgentCount === null
                    ? "--"
                    : urgentCount > 0
                    ? `${urgentCount} Urgent`
                    : "Live"}
                </Badge>

                {/* Refresh button — mirrors manualScrape() */}
                <button
                  onClick={manualScrape}
                  disabled={scrapeLoading}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${scrapeLoading ? "animate-spin" : ""}`} />
                  {scrapeLoading ? "Scraping..." : "Refresh"}
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Loading state */}
            {regLoading && (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Loading regulation updates...</p>
              </div>
            )}

            {/* Error state — mirrors index.html error handler */}
            {!regLoading && regError && (
              <div className="text-center py-5">
                <p className="text-xs text-red-500 font-medium">Failed to load updates. Retrying in 30s...</p>
              </div>
            )}

            {/* Empty state — mirrors index.html empty handler */}
            {!regLoading && !regError && regUpdates.length === 0 && (
              <div className="text-center py-6">
                <p className="text-lg mb-2">✓</p>
                <p className="text-xs text-slate-400">All schedules monitored. No new changes detected yet.</p>
                {schedulesCount !== null && (
                  <p className="text-xs text-slate-300 mt-1">{schedulesCount} tariff schedules being tracked from JKDM HS Explorer</p>
                )}
              </div>
            )}

            {/* Notification list — mirrors listEl.innerHTML map in index.html */}
            {!regLoading && !regError && regUpdates.length > 0 && (
              <div className="flex flex-col gap-0">
                {regUpdates.map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    className="flex gap-3 py-3"
                    style={{
                      borderLeft: `2px solid ${severityBorder[item.severity] ?? "#60a5fa"}`,
                      paddingLeft: "10px",
                      borderBottom: idx < regUpdates.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    {/* Icon — mirrors notif-icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: severityBg[item.severity] ?? severityBg.info }}
                    >
                      {severityIcon[item.severity] ?? "🔵"}
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {/* Title */}
                      <p className="text-xs font-semibold leading-snug text-slate-800">{item.title}</p>

                      {/* Summary (optional) — mirrors notif-summary */}
                      {item.summary && (
                        <p className="text-xs text-slate-500 leading-relaxed">{item.summary}</p>
                      )}

                      {/* Meta row — mirrors notif-meta */}
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: severityBg[item.severity],
                            color: severityColor[item.severity],
                          }}
                        >
                          {item.severity.toUpperCase()}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(item.detected_at)}
                        </span>

                        {/* View Source link — mirrors source-link in index.html */}
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              background: "rgba(45,212,191,0.1)",
                              color: "#2dd4bf",
                              textDecoration: "none",
                            }}
                          >
                            View Source
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer — mirrors the JKDM footer in index.html */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">Source: JKDM HS Explorer</span>
              <a
                href="https://ezhs.customs.gov.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                style={{
                  background: "rgba(45,212,191,0.1)",
                  color: "#2dd4bf",
                  textDecoration: "none",
                }}
              >
                Visit Source
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ── ROW 3: Recent Activity ── */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
              <CardDescription className="text-xs">Latest shipment classifications</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View All →</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">ID</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Product</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Value</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Compliance</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-2 font-mono text-blue-600 text-xs">{item.id}</td>
                    <td className="py-2 px-2 text-slate-700 truncate text-xs">{item.product}</td>
                    <td className="py-2 px-2 text-slate-900 font-semibold text-xs">{item.value}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: item.compliance }} />
                        </div>
                        <span className="text-xs font-medium text-slate-700 w-8">{item.compliance}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Approved</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── System Status Footer ── */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="pt-3 pb-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">JKDM Connected</p>
                <p className="text-xs text-slate-600">Live sync active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Regulation Feed</p>
                <p className="text-xs text-slate-600">
                  {lastScrape !== "--" ? `Updated ${lastScrape}` : "Updated 2 min ago"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="text-xs font-semibold text-slate-900">AI Engine</p>
                <p className="text-xs text-slate-600">Processing active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}