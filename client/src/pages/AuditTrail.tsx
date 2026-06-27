import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ---------------- DATA ---------------- */

const auditData = [
  {
    id: "JPN-1006",
    approvedBy: "Ahmad Zaidi",
    date: "2025-08-24T19:22:00",
    compliance: "100%",
    overrides: "None",
    status: "Approved",
    action: "View Details",
  },
  {
    id: "JPN-1007",
    approvedBy: "Tracy Lim",
    date: "2025-08-24T17:05:00",
    compliance: "88.6%",
    overrides: "HS Code: 8473.30.50",
    status: "Overridden",
    action: "View Details",
  },
  {
    id: "JPN-1008",
    approvedBy: "Lee Hin Kuat",
    date: "2025-08-24T10:45:00",
    compliance: "92.5%",
    overrides: "None",
    status: "Approved",
    action: "View Details",
  },
  {
    id: "JPN-1009",
    approvedBy: "Ahmad Zaidi",
    date: "2025-08-24T09:30:00",
    compliance: "94.1%",
    overrides: "None",
    status: "Approved",
    action: "View Details",
  },
];

export default function AuditTrail() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredData = auditData.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.approvedBy.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || item.status === statusFilter;

    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchDate =
      (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="space-y-6 px-2">

      {/* ================= TOP TEXT + EXPORT BUTTON ================= */}
      <div className="flex items-start justify-between">

        <p className="text-slate-500">
          Full immutable record of all manual officer approvals and compliance decisions.
        </p>

        <Button variant="outline" className="px-6 py-2.5 gap-2">
          <Download className="w-4 h-4" />
          Export History (CSV / PDF)
        </Button>

      </div>


    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-0">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">TOTAL AUDITS</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-slate-900">1482</span>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ANNUAL OVERRIDES</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-slate-900">4.2%</span>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">AI COMPLIANCE</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-slate-900">94.8%</span>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">PENDING</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-slate-900">24</span>
          </CardContent>
        </Card>
      </div>


      {/* ================= TABLE ================= */}
      <Card>

        {/* HEADER CONTROLS */}
       <CardHeader className="space-y-3">

        <div className="flex items-center justify-between">

          {/* TITLE ONLY (no description) */}
          <div>
            <CardTitle>Audit Trail</CardTitle>
          </div>

          {/* CONTROLS ROW (SEARCH + FILTER + DATE RANGE SAME LINE) */}
          <div className="flex items-center gap-3 flex-wrap justify-end">

            {/* SEARCH */}
            <Input
              placeholder="Search ID or approver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Overridden">Overridden</option>
            </select>

            {/* DATE RANGE */}
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />

            <span className="text-slate-400">to</span>

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />

          </div>
        </div>

      </CardHeader>

        {/* TABLE (UNCHANGED COMPLETELY) */}
        <CardContent className="p-0">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-600">

                <th className="py-3 px-4">ITEM ID</th>
                <th className="py-3 px-4">APPROVED BY</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">AI COMPLIANCE</th>
                <th className="py-3 px-4">CHANGES MADE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LEDGER VERIFIED</th>

              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="py-3 px-4 font-mono text-[#3466E6]">
                    {item.id}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {item.approvedBy}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {new Date(item.date).toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    {item.compliance}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {item.overrides}
                  </td>

                  <td className="py-3 px-4">
                    <Badge
                      className={
                        item.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                    {item.action}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-white">

            <p className="text-sm text-slate-500">
              Showing 1-4 of 4 line items
            </p>

            <div className="flex items-center gap-2">

              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm">Page 1</span>

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