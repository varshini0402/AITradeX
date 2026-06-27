import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, AlertCircle, RefreshCw, ExternalLink,
  AlertTriangle, Info, CheckCircle2, Eye, EyeOff, ChevronDown,
  ChevronUp, Search, Shield, Clock, Package, FileCheck, DollarSign,
} from "lucide-react";
import {
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Severity = "urgent" | "warning" | "info";
type FilterType = "all" | Severity;
type TimeRange = "6M" | "1Y" | "YTD";

interface Citation {
  label: string;
  url: string;
  type: "mntr" | "jkdm" | "tariff";
}

interface RegUpdate {
  id: number;
  title: string;
  summary: string;
  severity: Severity;
  offsetMins: number;
  detectedAt: Date;
  citations: Citation[];
  readAt: Date | null;
  expanded: boolean;
}

// ─── SOURCE URLs ──────────────────────────────────────────────────────────────
const MNTR_URL    = "https://www.customs.gov.my/en/business/facilitation/malaysia-national-trade-repository-mntr";
const JKDM_URL    = "https://www.customs.gov.my/en/trade/hs-explorer";
const TARIFF_URL  = "https://www.customs.gov.my/en/trade/tariff";

// ─── REGULATION DATA ──────────────────────────────────────────────────────────
const BASE_UPDATES: Omit<RegUpdate, "detectedAt" | "readAt" | "expanded">[] = [
  {
    id: 1,
    title: "PDK 2025 — Perintah Duti Kastam 2025 (Customs Duties Order 2025)",
    summary:
      "New comprehensive customs duties order effective 1 Jan 2025 published via MNTR. Covers revised HS codes for electronics, automotive parts, and agricultural goods. Replaces PDK 2017 amendments.",
    severity: "urgent",
    offsetMins: 2,
    citations: [
      { label: "MNTR", url: MNTR_URL, type: "mntr" },
      { label: "Malaysia Customs Tariff 2025", url: TARIFF_URL, type: "tariff" },
    ],
  },
  {
    id: 2,
    title: "ACFTA — ASEAN–China Free Trade Agreement (Revised Schedule 2024)",
    summary:
      "Updated preferential tariff schedule under ACFTA published. Affects import duties for goods originating from China under HS Chapters 84–90 (machinery & electronics). Effective from 1 Apr 2025.",
    severity: "urgent",
    offsetMins: 18,
    citations: [
      { label: "MNTR", url: MNTR_URL, type: "mntr" },
      { label: "JKDM HS Explorer", url: JKDM_URL, type: "jkdm" },
    ],
  },
  {
    id: 3,
    title: "ATIGA — ASEAN Trade in Goods Agreement (2025 Annex Update)",
    summary:
      "ASEAN Trade in Goods Agreement annex updated to reflect intra-ASEAN tariff eliminations for 2025. Zero-duty treatment extended to additional product lines including textiles and plastics.",
    severity: "warning",
    offsetMins: 120,
    citations: [
      { label: "MNTR", url: MNTR_URL, type: "mntr" },
    ],
  },
  {
    id: 4,
    title: "RCEP — Regional Comprehensive Economic Partnership (MY Schedule Year 3)",
    summary:
      "Malaysia's Year 3 tariff reduction schedule under RCEP now live on MNTR. Covers staged reductions for 15 RCEP member countries across agriculture, textiles, and industrial goods.",
    severity: "warning",
    offsetMins: 300,
    citations: [
      { label: "MNTR", url: MNTR_URL, type: "mntr" },
      { label: "Malaysia Customs Tariff 2025", url: TARIFF_URL, type: "tariff" },
    ],
  },
  {
    id: 5,
    title: "MNZFTA — Malaysia–New Zealand Free Trade Agreement (Amendment)",
    summary:
      "Minor schedule amendment published for MNZFTA covering dairy and processed food categories (HS Chapter 4 & 21). No duty rate changes; clarification on origin criteria only.",
    severity: "info",
    offsetMins: 1440,
    citations: [
      { label: "MNTR", url: MNTR_URL, type: "mntr" },
      { label: "JKDM HS Explorer", url: JKDM_URL, type: "jkdm" },
    ],
  },
];

function buildUpdates(existing?: RegUpdate[]): RegUpdate[] {
  return BASE_UPDATES.map((u) => ({
    ...u,
    detectedAt: new Date(Date.now() - u.offsetMins * 60_000),
    readAt:     existing?.find((x) => x.id === u.id)?.readAt ?? null,
    expanded:   existing?.find((x) => x.id === u.id)?.expanded ?? false,
  }));
}

// ─── TARIFF COST DATA ─────────────────────────────────────────────────────────
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

// ─── TARIFF RATE DATA ─────────────────────────────────────────────────────────
const tariffRateDataset: Record<TimeRange, { month: string; Electronics: number; Agriculture: number; Automotive: number; Textiles: number }[]> = {
  "6M": [
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1,  Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4,  Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2,  Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1, Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5, Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3, Automotive: 22.4, Textiles: 10.8 },
  ],
  "1Y": [
    { month: "Jul", Electronics: 10.2, Agriculture: 5.4,  Automotive: 8.2,  Textiles: 4.1  },
    { month: "Aug", Electronics: 11.4, Agriculture: 5.8,  Automotive: 8.9,  Textiles: 4.3  },
    { month: "Sep", Electronics: 12.8, Agriculture: 6.2,  Automotive: 9.5,  Textiles: 4.6  },
    { month: "Oct", Electronics: 14.1, Agriculture: 6.9,  Automotive: 10.2, Textiles: 5.0  },
    { month: "Nov", Electronics: 15.5, Agriculture: 7.2,  Automotive: 11.1, Textiles: 5.4  },
    { month: "Dec", Electronics: 16.9, Agriculture: 7.6,  Automotive: 11.8, Textiles: 5.8  },
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1,  Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4,  Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2,  Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1, Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5, Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3, Automotive: 22.4, Textiles: 10.8 },
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

// ─── RECENT ACTIVITY ──────────────────────────────────────────────────────────
const recentActivity = [
  { id: "JPN-1006", product: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",     value: "5,000",  compliance: 98, status: "Approved" },
  { id: "JPN-1007", product: "BTIO-BTI-SMJ-BM4T2-15 Monitor Touch", value: "25,000", compliance: 98, status: "Approved" },
  { id: "JPN-1008", product: "Industrial Temperature Sensor",        value: "8,500",  compliance: 92, status: "Approved" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const mins = Math.round((Date.now() - date.getTime()) / 60_000);
  if (mins < 1)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

// ─── CITATION BADGE ───────────────────────────────────────────────────────────
const citationStyles: Record<Citation["type"], React.CSSProperties> = {
  mntr:   { background: "rgba(16,185,129,0.1)", color: "#059669", border: "0.5px solid rgba(16,185,129,0.3)" },
  jkdm:   { background: "rgba(59,130,246,0.1)", color: "#2563eb", border: "0.5px solid rgba(59,130,246,0.3)" },
  tariff: { background: "rgba(139,92,246,0.1)", color: "#7c3aed", border: "0.5px solid rgba(139,92,246,0.3)" },
};

function CitationLink({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded no-underline"
      style={citationStyles[citation.type]}
    >
      <ExternalLink className="w-2.5 h-2.5" />
      {citation.label}
    </a>
  );
}

// ─── SEVERITY CONFIG ──────────────────────────────────────────────────────────
const SEV_CONFIG: Record<Severity, {
  bg: string; text: string; border: string; barColor: string;
  icon: React.ReactNode; label: string;
  filterActiveBg: string; filterActiveText: string; filterActiveBorder: string;
}> = {
  urgent: {
    bg: "rgba(239,68,68,0.08)", text: "#dc2626", border: "rgba(239,68,68,0.35)",
    barColor: "#ef4444",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: "Urgent",
    filterActiveBg: "rgba(239,68,68,0.1)", filterActiveText: "#dc2626", filterActiveBorder: "rgba(239,68,68,0.4)",
  },
  warning: {
    bg: "rgba(234,179,8,0.08)", text: "#ca8a04", border: "rgba(234,179,8,0.35)",
    barColor: "#eab308",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "Warning",
    filterActiveBg: "rgba(234,179,8,0.1)", filterActiveText: "#ca8a04", filterActiveBorder: "rgba(234,179,8,0.4)",
  },
  info: {
    bg: "rgba(59,130,246,0.08)", text: "#2563eb", border: "rgba(59,130,246,0.35)",
    barColor: "#3b82f6",
    icon: <Info className="w-3.5 h-3.5" />,
    label: "Info",
    filterActiveBg: "rgba(59,130,246,0.1)", filterActiveText: "#2563eb", filterActiveBorder: "rgba(59,130,246,0.4)",
  },
};

// ─── REGULATION TRACKER COMPONENT ────────────────────────────────────────────
function RegulationTracker() {
  const [updates,      setUpdates]      = useState<RegUpdate[]>(() => buildUpdates());
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshing,   setRefreshing]   = useState(false);
  const [filter,       setFilter]       = useState<FilterType>("all");
  const [search,       setSearch]       = useState("");
  const [, setTick] = useState(0);

  // Tick every minute to keep relative timestamps fresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUpdates((prev) => buildUpdates(prev));
    setLastRefreshed(new Date());
    setRefreshing(false);
  }, [refreshing]);

  const toggleExpand = useCallback((id: number) => {
    setUpdates((prev) => prev.map((u) => u.id === id ? { ...u, expanded: !u.expanded } : u));
  }, []);

  const toggleRead = useCallback((id: number) => {
    setUpdates((prev) => prev.map((u) => u.id === id ? { ...u, readAt: u.readAt ? null : new Date() } : u));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return updates.filter((u) => {
      const matchFilter = filter === "all" || u.severity === filter;
      const matchSearch = !q || u.title.toLowerCase().includes(q) || u.summary.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [updates, filter, search]);

  const unread     = updates.filter((u) => !u.readAt);
  const urgentCount  = unread.filter((u) => u.severity === "urgent").length;
  const warningCount = unread.filter((u) => u.severity === "warning").length;
  const infoCount    = unread.filter((u) => u.severity === "info").length;
  const allClear     = urgentCount === 0 && warningCount === 0 && infoCount === 0;

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all",     label: "All"     },
    { key: "urgent",  label: "Urgent"  },
    { key: "warning", label: "Warning" },
    { key: "info",    label: "Info"    },
  ];

  return (
    <Card className="border-slate-200 flex flex-col h-full">
      <CardHeader className="pb-3">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Regulation updates</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: allClear ? "#22c55e" : "#ef4444" }}
              />
              Last checked: {timeAgo(lastRefreshed)} · Sources: MNTR · JKDM · Customs Tariff 2025
            </p>
          </div>

          {/* Summary dots */}
          {allClear ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
              <CheckCircle2 className="w-3 h-3" /> All clear
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {urgentCount  > 0 && <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />{urgentCount} urgent</span>}
              {warningCount > 0 && <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(234,179,8,0.1)", color: "#ca8a04" }}><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />{warningCount} warning</span>}
              {infoCount    > 0 && <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#2563eb" }}><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />{infoCount} info</span>}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search regulations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400"
          />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {filterButtons.map(({ key, label }) => {
            const isActive = filter === key;
            const cfg = key !== "all" ? SEV_CONFIG[key as Severity] : null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="text-xs font-semibold px-2.5 py-1 rounded-md border transition-all"
                style={
                  isActive && cfg
                    ? { background: cfg.filterActiveBg, color: cfg.filterActiveText, borderColor: cfg.filterActiveBorder }
                    : isActive
                    ? { background: "#f1f5f9", color: "#0f172a", borderColor: "#cbd5e1" }
                    : { background: "white", color: "#64748b", borderColor: "#e2e8f0" }
                }
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-auto flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-50 transition-all bg-white"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Checking…" : "Check"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-y-auto flex-1" style={{ maxHeight: "300px" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
              <Search className="w-6 h-6" />
              <p className="text-xs">No regulations match your filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const cfg = SEV_CONFIG[item.severity];
              const isRead = !!item.readAt;
              return (
                <div
                  key={item.id}
                  className="transition-opacity"
                  style={{ opacity: isRead ? 0.45 : 1 }}
                >
                  <div className="flex gap-2.5 p-3">
                    {/* Left severity bar */}
                    <div
                      className="w-0.5 rounded-full flex-shrink-0 self-stretch"
                      style={{ background: cfg.barColor }}
                    />

                    {/* Icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      {/* Title + badge */}
                      <div className="flex items-start gap-2 justify-between">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{item.title}</p>
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 capitalize"
                          style={{ background: cfg.bg, color: cfg.text }}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      {/* Summary */}
                      <p
                        className="text-xs text-slate-500 leading-relaxed mt-1"
                        style={item.expanded ? {} : {
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                        }}
                      >
                        {item.summary}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.detectedAt)}
                        </span>

                        {/* Citation links */}
                        {item.citations.map((c) => (
                          <CitationLink key={c.label} citation={c} />
                        ))}

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {item.expanded
                              ? <><ChevronUp className="w-3 h-3" />Less</>
                              : <><ChevronDown className="w-3 h-3" />More</>
                            }
                          </button>
                          <button
                            onClick={() => toggleRead(item.id)}
                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
                          >
                            {isRead
                              ? <><EyeOff className="w-3 h-3" />Unread</>
                              : <><Eye className="w-3 h-3" />Done</>
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Malaysia National Trade Repository
          </span>
          <a
            href={MNTR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded no-underline"
            style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}
          >
            Visit MNTR <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  // Cost analytics filters
  const [selectedCountry,  setSelectedCountry]  = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit,     setSelectedUnit]     = useState("all");

  // Tariff rate chart filters
  const [timeRange,    setTimeRange]    = useState<TimeRange>("6M");
  const [rateCountry,  setRateCountry]  = useState("all");
  const [rateCategory, setRateCategory] = useState("all");

  // Ticker for "last updated" label on cost card
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Filtered cost chart data
  const filteredChartData = useMemo(() => {
    const monthly: Record<string, { month: string; cost: number; duty: number }> = {};
    tariffDataset.forEach((item) => {
      if (
        (selectedCountry  === "all" || item.country  === selectedCountry)  &&
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (selectedUnit     === "all" || item.unit     === selectedUnit)
      ) {
        if (!monthly[item.month]) monthly[item.month] = { month: item.month, cost: 0, duty: 0 };
        monthly[item.month].cost += item.cost;
        monthly[item.month].duty += item.duty;
      }
    });
    const order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return Object.values(monthly).sort((a, b) => order.indexOf(a.month) - order.indexOf(b.month));
  }, [selectedCountry, selectedCategory, selectedUnit]);

  const hasData = filteredChartData.length > 0;
  const visibleCategories = rateCategory === "all" ? ALL_RATE_CATEGORIES : [rateCategory];

  return (
    <div className="space-y-4">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good day, Ahmad</h2>
          <p className="text-sm text-slate-500">You have 5 shipments pending review.</p>
        </div>
      </div>

      {/* ── ROW 1: KPI CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Shipments this month
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">148</span>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp className="w-3 h-3" /><span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Pending review
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">5</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                Action needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> AI compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">93.7%</span>
              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                <TrendingUp className="w-3 h-3" /><span>+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Est. duty
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">RM 18.4K</span>
              <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                <TrendingDown className="w-3 h-3" /><span>-3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 2: TARIFF RATE CHART + REGULATION TRACKER (equal halves) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

        {/* Tariff Rate Analysis */}
        <Card className="border-slate-200 h-full lg:col-span-6">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Tariff rate analysis</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Effective tariff rates by product category &amp; origin (Malaysia)
                  </CardDescription>
                </div>
                {/* Time range toggle */}
                <div className="flex gap-0.5 rounded-lg p-1 shrink-0 bg-slate-100">
                  {(["6M", "1Y", "YTD"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeRange(t)}
                      className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
                      style={{
                        background:  timeRange === t ? "#ffffff"   : "transparent",
                        color:       timeRange === t ? "#0f172a"   : "#64748b",
                        border:      timeRange === t ? "1px solid #e2e8f0" : "1px solid transparent",
                        boxShadow:   timeRange === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
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
                  <option value="all">All countries</option>
                  {ALL_RATE_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={rateCategory}
                  onChange={(e) => setRateCategory(e.target.value)}
                  className="rounded-md px-2 py-1 text-xs font-medium border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All categories</option>
                  {ALL_RATE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={tariffRateDataset[timeRange]} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
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
                  labelFormatter={(label) =>
                    rateCountry === "all"
                      ? `${label} · All countries`
                      : `${label} · ${rateCountry}`
                  }
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

            {/* Legend — categories + active country label */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex flex-wrap gap-3">
                {visibleCategories.map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[cat] }} />
                    <span className="text-xs text-slate-500">{cat}</span>
                  </div>
                ))}
              </div>
              {/* Country label badge */}
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1"
                style={{
                  background: rateCountry === "all" ? "#f1f5f9" : "rgba(37,99,235,0.08)",
                  color:      rateCountry === "all" ? "#64748b"  : "#1d4ed8",
                  borderColor: rateCountry === "all" ? "#e2e8f0" : "rgba(37,99,235,0.25)",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="4" cy="4" r="3" fill={rateCountry === "all" ? "#94a3b8" : "#2563eb"} />
                </svg>
                {rateCountry === "all" ? "All countries" : rateCountry}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Regulation Tracker */}
        <div className="lg:col-span-4 h-full">
        <RegulationTracker />
        </div>
      </div>

      {/* ── ROW 3: RECENT ACTIVITY ── */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">Recent activity</CardTitle>
              <CardDescription className="text-xs">Latest shipment classifications</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View all →</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 font-semibold text-slate-600">ID</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600">Product</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600">Value (RM)</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600">Compliance</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-mono text-blue-600">{item.id}</td>
                    <td className="py-2 px-2 text-slate-700 max-w-[200px] truncate">{item.product}</td>
                    <td className="py-2 px-2 font-semibold text-slate-900">{item.value}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${item.compliance}%` }}
                          />
                        </div>
                        <span className="text-slate-600 w-7">{item.compliance}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── SYSTEM STATUS FOOTER ── */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="pt-3 pb-3">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "JKDM connected", sub: "Live sync active" },
              { label: "MNTR feed", sub: "Updated just now" },
              { label: "AI engine", sub: "Processing active" },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}