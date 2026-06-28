import { useLocation } from "wouter";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { navigate } from "wouter/use-browser-location";
/* ---------------- DATA ---------------- */

const complianceData = [
  { month: "Jan", approved: 120, pending: 3, rejected: 5 },
  { month: "Feb", approved: 135, pending: 8, rejected: 3 },
  { month: "Mar", approved: 128, pending: 11, rejected: 4 },
  { month: "Apr", approved: 145, pending: 7, rejected: 2 },
  { month: "May", approved: 152, pending: 0, rejected: 1 },
  { month: "Jun", approved: 160, pending: 16, rejected: 2 },
];

const shipments = [
  {
    id: "INV-MY-88291",
    description: "Electronic Components Batch",
    compliance: 93.7,
    value: 60500,
    duty: 1250,
    status: "Approved",
  },
  {
    id: "INV-MY-88290",
    description: "Industrial Equipment Assembly",
    compliance: 87.2,
    value: 45200,
    duty: 890,
    status: "Approved",
  },
  {
    id: "INV-MY-88289",
    description: "PCB & Sensors Shipment",
    compliance: 91.5,
    value: 52100,
    duty: 1050,
    status: "Approved",
  },
  {
    id: "INV-MY-88288",
    description: "Chemical Compounds Shipment",
    compliance: 85.3,
    value: 38900,
    duty: 750,
    status: "Pending",
  },
];

/* ---------------- HELPERS ---------------- */

function getStatusColor(status: string) {
  return status === "Approved"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";
}

/* ---------------- MAIN ---------------- */

export default function ComplianceWorkflows() {
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalValue = shipments.reduce((sum, s) => sum + s.value, 0);
  const totalDuty = shipments.reduce((sum, s) => sum + s.duty, 0);
  const avgCompliance =
    shipments.reduce((sum, s) => sum + s.compliance, 0) / shipments.length;

  const handleNewIngest = () => {
    navigate("/ingest");
  };

  /* FILTERED DATA */
  const filteredShipments = shipments.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-10 px-2">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-slate-500 ">
          Monitor and manage compliance status across all shipments.
        </p>
      </div>

      {/* ⭐ New ingest button ⭐ */}
        <Button 
          onClick={handleNewIngest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm flex items-center justify-center gap-2 h-10 px-4 rounded-xl self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          Ingest Shipment
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* AI Compliance */}
  <Card className="border-slate-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
        AI Compliance Rate
      </CardTitle>
    </CardHeader>

    <CardContent className="pb-3">
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">
          {avgCompliance.toFixed(1)}%
        </span>

        <div className="flex items-center gap-1 text-green-600 text-s">
          <TrendingUp className="w-5 h-5" />
          <span>+2.1%</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Total Shipment Value */}
  <Card className="border-slate-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
        Total Shipment Value
      </CardTitle>
    </CardHeader>

    <CardContent className="pb-3">
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">
          RM {totalValue.toLocaleString()}
        </span>

        <div className="flex items-center gap-1 text-green-600 text-s">
          <TrendingUp className="w-5 h-5" />
          <span>+8.4%</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Estimated Duty */}
  <Card className="border-slate-200">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
        Estimated Duty
      </CardTitle>
    </CardHeader>

    <CardContent className="pb-3">
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">
          RM 18.4K
        </span>

        <div className="flex items-center gap-1 text-red-600 text-s">
          <TrendingDown className="w-5 h-5" />
          <span>-3.2%</span>
        </div>
      </div>
    </CardContent>
  </Card>

</div>


      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: 15,
                  gap: "20px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="approved" fill="#10B981" />
              <Bar dataKey="pending" fill="#F59E0B" />
              <Bar dataKey="rejected" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>

      <CardHeader className="space-y-2">

        {/* TOP ROW: TITLE + SEARCH + FILTER */}
        <div className="flex items-center justify-between pb-4">

          {/* LEFT TITLE */}
          <div>
            <CardTitle>Shipments</CardTitle>
            <CardDescription className="pt-2">
              Click shipment ID to view details
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

            {/* FILTER DROPDOWN */}
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

      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-600">
              <th className="py-3 px-4">Shipment ID</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">AI Compliance</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Duty</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-slate-50 transition cursor-pointer"
                onClick={() =>
                  setLocation(`/compliance-detail/${item.id}`)
                }
              >
                {/* ID */}
                <td className="py-3 px-4 text-[#3466E6] font-mono hover:underline">
                  {item.id}
                </td>

                {/* DESCRIPTION */}
                <td className="py-3 px-4 text-slate-700">
                  {item.description}
                </td>

                {/* COMPLIANCE BAR */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${item.compliance}%` }}
                      />
                    </div>
                    <span className="font-medium">
                      {item.compliance}%
                    </span>
                  </div>
                </td>

                {/* VALUE */}
                <td className="py-3 px-4 font-semibold text-slate-900">
                  RM {item.value.toLocaleString()}
                </td>

                {/* DUTY */}
                <td className="py-3 px-4 font-semibold text-slate-900">
                  RM {item.duty.toLocaleString()}
                </td>

                {/* STATUS */}
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-white">

          {/* LEFT INFO */}
          <p className="text-sm text-slate-500">
            Showing 1-4 of 1420 line items
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