import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";

const auditData = [
  { id: "JPN-1006", approvedBy: "Ahmad Zaidi", date: "24 Aug, 19:22", compliance: "100%", overrides: "None", status: "Approved", action: "View Details" },
  { id: "JPN-1007", approvedBy: "Tracy Lim", date: "24 Aug, 17:05", compliance: "88.6%", overrides: "HS Code: 8473.30.50", status: "Overridden", action: "View Details" },
  { id: "JPN-1008", approvedBy: "Lee Hin Kuat", date: "24 Aug, 10:45", compliance: "92.5%", overrides: "None", status: "Approved", action: "View Details" },
  { id: "JPN-1009", approvedBy: "Ahmad Zaidi", date: "24 Aug, 09:30", compliance: "94.1%", overrides: "None", status: "Approved", action: "View Details" },
];

export default function AuditTrail() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Audit Trail & Compliance History</h2>
        <p className="text-slate-600 mt-1">Full immutable record of all manual officer approvals and compliance decisions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Range
          </Button>
          <Button variant="outline" size="sm">01-04 - 30/04/2026</Button>
          <Button variant="outline" size="sm">Compliance</Button>
          <Button variant="outline" size="sm">All sources</Button>
          <Button variant="outline" size="sm" className="gap-2">
            <span>Search by officer</span>
          </Button>
          <Button variant="outline" size="sm">Clear</Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export History (CSV / PDF)
        </Button>
      </div>

      {/* Audit Table */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">ITEM ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">APPROVED BY</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">TIMESTAMP</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">AI COMPLIANCE</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">CHANGES MADE</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">STATUS</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">LEDGER VERIFIED</th>
                </tr>
              </thead>
              <tbody>
                {auditData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-blue-600">{item.id}</td>
                    <td className="py-3 px-4 text-slate-700">{item.approvedBy}</td>
                    <td className="py-3 px-4 text-slate-700">{item.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: item.compliance }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.compliance}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.overrides}</td>
                    <td className="py-3 px-4">
                      <Badge className={item.status === "Approved" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="link" size="sm" className="text-blue-600">
                        {item.action}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-slate-600 text-center">
            Showing 1-4 of 1,482 items
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
