import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ---------------- DATA ---------------- */

const recommendations = [
  {
    id: "JPN-1006",
    title: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",
    description: "Electrical transient voltage suppressor",
    confidence: 100,
    status: "Pending",
    attention: false,
  },
  {
    id: "JPN-1007",
    title: "Touch LCD Module",
    description: "Monitor display component classification",
    confidence: 88,
    status: "Pending",
    attention: true,
  },
  {
    id: "JPN-1001",
    title: "Industrial Temperature Sensor",
    description: "Thermal measurement device",
    confidence: 92,
    status: "Approved",
    attention: false,
  },
  {
    id: "JPN-1002",
    title: "PCB Assembly Module",
    description: "Electronics board assembly",
    confidence: 95,
    status: "Approved",
    attention: false,
  },
];

/* ---------------- HELPERS ---------------- */

function getStatusColor(status: string) {
  return status === "Approved"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";
}

/* ---------------- MAIN ---------------- */

export default function RecommendationsMain() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const pending = recommendations.filter((r) => r.status === "Pending");
  const approved = recommendations.filter((r) => r.status === "Approved");

  const highConfidence =
    recommendations.filter((r) => r.confidence >= 90);

  const attentionItem = recommendations.find((r) => r.attention);

  const avgConfidence =
    recommendations.reduce((a, b) => a + b.confidence, 0) /
    recommendations.length;

  const filtered = recommendations.filter((item) => {
  const matchSearch =
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.title.toLowerCase().includes(search.toLowerCase());

  const matchStatus =
    statusFilter === "All" || item.status === statusFilter;

  return matchSearch && matchStatus;
});

  return (
    <div className="space-y-6 pb-10 px-2">

      {/* HEADER */}
      <div>
        <p className="text-slate-500">
          Monitor AI classification results and pending reviews
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 1. Pending */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-slate-500">PENDING ITEMS</p>
            <h2 className="text-3xl font-bold mt-2">
              {pending.length}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Require classification review
            </p>
          </CardContent>
        </Card>

        {/* 2. High confidence */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-slate-500">HIGH CONFIDENCE</p>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-3xl font-bold">
                {highConfidence.length}
              </h2>

              <span className="text-green-600 text-sm font-semibold">
                {Math.round(
                  (highConfidence.length / recommendations.length) * 100
                )}
                %
              </span>
            </div>

            {/* simple bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${
                    (highConfidence.length / recommendations.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Attention */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-slate-500">REQUIRES ATTENTION</p>

            {attentionItem ? (
              <>
                <h2 className="text-lg font-bold mt-2">
                  {attentionItem.id}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {attentionItem.title}
                </p>

                <div className="flex items-center gap-2 text-red-600 mt-2 text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Manual review needed
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 mt-3">
                No urgent items
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-[#3466E6]" />
              Classification Accuracy Trend
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">

              {[85, 88, 90, 92, 94].map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-10">
                    W{i + 1}
                  </span>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${v}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold w-10">
                    {v}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-4 h-4 text-[#3466E6]" />
              AI Compliance Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              • 12 shipments auto-classified with high confidence
            </p>
            <p>
              • 3 items require manual HS verification
            </p>
            <p>
              • Suggested improvement: update material mapping rules
            </p>
          </CardContent>
        </Card>
      </div>

   <Card>

  {/* ================= HEADER ================= */}
  <CardHeader className="space-y-2">

    <div className="flex items-center justify-between">

      {/* LEFT TITLE */}
      <div>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription className="pt-2">
          Click ID to view AI recommendation details
        </CardDescription>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-3">

        {/* SEARCH */}
        <Input
          placeholder="Search ID or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />

        {/* OPTIONAL FILTER (you can remove if not needed) */}
       <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>

      </div>

    </div>

  </CardHeader>

  {/* ================= TABLE ================= */}
  <CardContent className="p-0">

    <table className="w-full text-sm">

      <thead className="bg-slate-50 border-b">
        <tr className="text-left text-slate-600">

          <th className="py-3 px-4">ID</th>
          <th className="py-3 px-4">Description</th>
          <th className="py-3 px-4 text-center">Confidence</th>
          <th className="py-3 px-4 text-center">Status</th>
          <th className="py-3 px-4 text-right">Action</th>

        </tr>
      </thead>

      <tbody>
        {filtered.map((item) => (
          <tr
            key={item.id}
            className="border-b hover:bg-slate-50 transition cursor-pointer"
            onClick={() =>
              setLocation(`/recommendation-detail/${item.id}`)
            }
          >

            {/* ID */}
            <td className="py-3 px-4 font-mono text-[#3466E6] hover:underline">
              {item.id}
            </td>

            {/* DESCRIPTION */}
            <td className="py-3 px-4 text-slate-700">
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-slate-500">
                {item.description}
              </div>
            </td>

            {/* CONFIDENCE */}
            <td className="py-3 px-4 text-center font-semibold">
              {item.confidence}%
            </td>

            {/* STATUS */}
            <td className="py-3 px-4 text-center">
              <Badge className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
            </td>

            {/* ACTION */}
            <td className="py-3 px-4 text-right text-slate-400">
              →
            </td>

          </tr>
        ))}
      </tbody>

    </table>

    {/* ================= PAGINATION ================= */}
    <div className="flex items-center justify-between px-4 py-3 border-t bg-white">

      {/* LEFT INFO */}
      <p className="text-sm text-slate-500">
        Showing 1-4 of 4 line items
      </p>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-2">

        <Button variant="outline" size="icon">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm font-medium text-slate-600">
          Page 1
        </span>

        <Button variant="outline" size="icon">
          <ChevronRight className="w-4 h-4" />
        </Button>

      </div>

    </div>

  </CardContent>

</Card>

    </div>
  );
}