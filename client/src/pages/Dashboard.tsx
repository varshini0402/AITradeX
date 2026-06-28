import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, ExternalLink,
  ArrowRight, ArrowUpRight, CheckCircle,
  FolderOpen, Scale, BarChart3, Globe2,
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine,
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface ShipmentMetric {
  shipmentId: string;
  partNumber: string;
  description: string;
  countryOfOrigin: string;
  htsCode: string;
  declaredValue: number;
  tariffRate: number;
  estimatedDuty: number;
  aiScore: number;
  sapTarget: string;
  status: "Approved" | "Pending Review";
}

interface RateChange {
  old: string;
  new: string;
}

interface RegulatoryUpdate {
  id: string;
  agency: string;
  type: "FTA Rule Change" | "Tariff Rate Shift" | "Policy Revision";
  title: string;
  summary: string;
  impact: string;
  date: string;
  badgeColor: string;
  rateChange?: RateChange;
}

// ─── REGULATION MOCK DATA ────────────────────────────────────────────────────
const INITIAL_REGULATORY_DATA: RegulatoryUpdate[] = [
  {
    id: "REG-2026-042",
    agency: "MITI Malaysia",
    type: "FTA Rule Change",
    title: "MOCFTA Rule of Origin Revision for Semiconductor Modules",
    summary:
      "The threshold for Regional Value Content (RVC) under the Malaysia-Oceania agreement has shifted from a flat 40% Build-Down calculation to an explicit 45% Net Cost method calculation.",
    impact:
      "High Impact — Affects 14 active electronics supplier SKUs originating from partner facilities.",
    date: "Effective Jul 01, 2026",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60",
  },
  {
    id: "REG-2026-039",
    agency: "US International Trade Commission (USITC)",
    type: "Tariff Rate Shift",
    title: "Section 301 Ad Valorem Tariff Hike on Lithium-Ion Battery Components",
    summary:
      "Standard Most-Favored-Nation (MFN) rates for HS Subheading 8507.60.00 are scheduled to rise. Tariff rate moving from 7.5% up to 25.0% due to trade policy adjustments.",
    impact:
      "Critical — Immediate duty recalculation required on incoming JPN-series shipments.",
    date: "Effective Aug 15, 2026",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/60",
    rateChange: { old: "7.5%", new: "25.0%" },
  },
];

// ─── TARIFF COST DATA ────────────────────────────────────────────────────────
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

// ─── TARIFF RATE DATA ────────────────────────────────────────────────────────
type TimeRange = "6M" | "1Y" | "YTD";

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
  YTD: [
    { month: "Jan", Electronics: 18.2, Agriculture: 8.1,  Automotive: 12.5, Textiles: 6.2  },
    { month: "Feb", Electronics: 19.5, Agriculture: 8.4,  Automotive: 13.1, Textiles: 6.8  },
    { month: "Mar", Electronics: 22.1, Agriculture: 9.2,  Automotive: 14.8, Textiles: 7.1  },
    { month: "Apr", Electronics: 25.8, Agriculture: 10.1, Automotive: 16.2, Textiles: 8.4  },
    { month: "May", Electronics: 30.2, Agriculture: 11.5, Automotive: 18.9, Textiles: 9.2  },
    { month: "Jun", Electronics: 35.4, Agriculture: 12.3, Automotive: 22.4, Textiles: 10.8 },
  ],
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#3b82f6",
  Agriculture: "#10b981",
  Automotive:  "#f59e0b",
  Textiles:    "#8b5cf6",
};

const ALL_RATE_CATEGORIES = ["Electronics", "Agriculture", "Automotive", "Textiles"];
const ALL_RATE_COUNTRIES  = ["China", "Japan", "Vietnam"];

// ─── RECENT ACTIVITY ─────────────────────────────────────────────────────────
const recentActivity = [
  { id: "JPN-1006", product: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",     value: "5,000",  compliance: 98, status: "Approved" },
  { id: "JPN-1007", product: "BTIO-BTI-SMJ-BM4T2-15 Monitor Touch", value: "25,000", compliance: 98, status: "Approved" },
  { id: "JPN-1008", product: "Industrial Temperature Sensor",        value: "8,500",  compliance: 92, status: "Approved" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getStatusColor(status: string) {
  return status === "Approved"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";
}

// ─── CUSTOM TOOLTIP FOR BAR CHART ─────────────────────────────────────────────
interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs font-bold text-slate-800 mb-2">{label} 2025</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
            <span className="text-[11px] text-slate-600">{entry.dataKey}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-800">{entry.value}%</span>
        </div>
      ))}
      <div className="border-t border-slate-100 mt-2 pt-2">
        <p className="text-[10px] text-slate-400">Effective tariff rate · Malaysia</p>
      </div>
    </div>
  );
}

// ─── REGULATION TRACKER COMPONENT ────────────────────────────────────────────
function RegulationTracker() {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>(INITIAL_REGULATORY_DATA);
  const [dismissingIds, setDismissingIds] = useState<string[]>([]);

  const handleMarkAsRead = (id: string) => {
    setDismissingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setUpdates((prev) => prev.filter((item) => item.id !== id));
      setDismissingIds((prev) => prev.filter((dId) => dId !== id));
    }, 300);
  };

  return (
    <div className="w-full h-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Regulatory Watch & Legal Updates
          </h2>
        </div>
        {updates.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 font-bold rounded-full transition-all">
            {updates.length} Pending Review
          </span>
        )}
      </div>

      {/* Notification Card Feed */}
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {updates.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
            <FolderOpen className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium">All updates caught up!</p>
            <p className="text-xs text-slate-400 mt-0.5">
              No pending regulatory trade adjustments found.
            </p>
          </div>
        ) : (
          updates.map((item) => {
            const isDismissing = dismissingIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 hover:bg-slate-50/40 space-y-3 transition-all duration-300 transform origin-top ${
                  isDismissing
                    ? "opacity-0 -translate-y-4 max-h-0 !p-0 !border-none overflow-hidden"
                    : "opacity-100 translate-y-0"
                }`}
              >
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">{item.agency}</span>
                    <span className="text-slate-300">•</span>
                    <span
                      className={`px-2 py-0.5 font-semibold rounded-md border text-[11px] ${item.badgeColor}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">{item.date}</span>
                </div>

                {/* Headline */}
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Summary Callout */}
                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {item.summary}
                </p>

                {/* Tariff Rate Change Sub-Element */}
                {item.rateChange && (
                  <div className="flex items-center gap-3 bg-rose-50/40 border border-rose-100 p-2.5 rounded-lg w-fit">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Tariff Shift:
                    </span>
                    <span className="font-mono text-xs line-through text-slate-400">
                      {item.rateChange.old}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-xs font-bold text-rose-600 flex items-center">
                      {item.rateChange.new} <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                )}

                {/* Impact Notice */}
                <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 pt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-sm" />
                  <span>{item.impact}</span>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <CheckCircle className="w-4 h-4 text-slate-400" />
                    Mark as Read
                  </button>
                  <a
                    href="https://miti.gov.my"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    View Official Gazette Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selectedCountry, setSelectedCountry]   = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit, setSelectedUnit]         = useState("all");

  const [timeRange, setTimeRange]     = useState<TimeRange>("6M");
  const [rateCountry, setRateCountry] = useState("all");
  const [rateCategory, setRateCategory] = useState("all");

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const filteredChartData = useMemo(() => {
    const monthly: Record<string, { month: string; cost: number; duty: number }> = {};
    tariffDataset.forEach((item) => {
      if (
        (selectedCountry  === "all" || item.country  === selectedCountry) &&
        (selectedCategory === "all" || item.category === selectedCategory) &&
        (selectedUnit     === "all" || item.unit     === selectedUnit)
      ) {
        if (!monthly[item.month]) monthly[item.month] = { month: item.month, cost: 0, duty: 0 };
        monthly[item.month].cost += item.cost;
        monthly[item.month].duty += item.duty;
      }
    });
    const order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return Object.values(monthly).sort(
      (a, b) => order.indexOf(a.month) - order.indexOf(b.month)
    );
  }, [selectedCountry, selectedCategory, selectedUnit]);

  const hasData = filteredChartData.length > 0;
  const visibleCategories = rateCategory === "all" ? ALL_RATE_CATEGORIES : [rateCategory];

  // ── Compute rate data + deltas for the bar chart ──
  const rateData = tariffRateDataset[timeRange];
  const rateDeltas = useMemo(() => {
    if (rateData.length < 2) return {};
    const first = rateData[0];
    const last = rateData[rateData.length - 1];
    const deltas: Record<string, number> = {};
    ALL_RATE_CATEGORIES.forEach((cat) => {
      deltas[cat] = (last[cat as keyof typeof last] as number) - (first[cat as keyof typeof first] as number);
    });
    return deltas;
  }, [rateData]);

  return (
    <div className="space-y-4 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good day, Ahmad</h2>
          <p className="text-sm text-slate-500 pt-2">You have 5 shipments pending review.</p>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
              Shipments This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">148</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">5</span>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
              >
                Action needed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
              AI Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">93.7%</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
              Est. Duty
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">RM 18.4K</span>
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <TrendingDown className="w-3 h-3" />
                <span>-3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Tariff Rate Chart + Regulation Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

        {/* ── Tariff Rate Analysis — Grouped Bar Chart ── */}
        <Card className="border-slate-200 h-full lg:col-span-6">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-bold pb-2 text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Tariff Rate Analysis
                  </CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Effective tariff rates by product category — Grouped comparison
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
                        background: timeRange === t ? "#ffffff" : "transparent",
                        color:      timeRange === t ? "#0f172a" : "#64748b",
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
                  <option value="all">All countries</option>
                  {ALL_RATE_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={rateCategory}
                  onChange={(e) => setRateCategory(e.target.value)}
                  className="rounded-md px-2 py-1 text-xs font-medium border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All categories</option>
                  {ALL_RATE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={rateData}
                margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
                barCategoryGap="20%"
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
                  domain={[0, 40]}
                  ticks={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: "rgba(241,245,249,0.5)" }}
                />
                <ReferenceLine
                  y={20}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  label={{ value: "MFN Avg", position: "right", fontSize: 9, fill: "#94a3b8" }}
                />
                {visibleCategories.map((cat) => (
                  <Bar
                    key={cat}
                    dataKey={cat}
                    fill={CATEGORY_COLORS[cat]}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>

            {/* Legend + deltas */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex flex-wrap gap-3">
                {visibleCategories.map((cat) => {
                  const delta = rateDeltas[cat];
                  return (
                    <div key={cat} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ background: CATEGORY_COLORS[cat] }}
                      />
                      <span className="text-xs text-slate-500">{cat}</span>
                      {delta !== undefined && (
                        <span className={`text-[10px] font-bold ${delta > 0 ? "text-red-500" : "text-emerald-500"}`}>
                          {delta > 0 ? "+" : ""}{delta.toFixed(1)}pp
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Country label badge */}
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1"
                style={{
                  background:    rateCountry === "all" ? "#f1f5f9" : "rgba(37,99,235,0.08)",
                  color:         rateCountry === "all" ? "#64748b"  : "#1d4ed8",
                  borderColor:   rateCountry === "all" ? "#e2e8f0" : "rgba(37,99,235,0.25)",
                }}
              >
                <Globe2 className="w-3 h-3" />
                {rateCountry === "all" ? "All origins" : rateCountry}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Regulation Tracker */}
        <div className="lg:col-span-4 h-full">
          <RegulationTracker />
        </div>
      </div>

      {/* Row 3: Recent Activity */}
      <Card className="border-slate-200 overflow-hidden pb-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-bold text-slate-900 pb-2">Recent activity</CardTitle>
              <CardDescription className="text-sm">
                Latest shipment classifications
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View all →
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm p-0">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-600">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">AI Compliance</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-[#3466E6] hover:underline">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[240px] truncate">
                    {item.product}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.compliance}%`,
                            background: item.compliance >= 95 ? "#10b981" : item.compliance >= 90 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <span className="font-medium text-slate-700">
                        {item.compliance}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    RM {item.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* System Status Footer */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="pt-3 pb-3">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "JKDM connected", sub: "Live sync active" },
              { label: "MNTR feed",      sub: "Updated just now" },
              { label: "AI engine",      sub: "Processing active" },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
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
