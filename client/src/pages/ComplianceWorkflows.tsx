import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const complianceData = [
  { month: "Jan", approved: 120, pending: 25, rejected: 5 },
  { month: "Feb", approved: 135, pending: 18, rejected: 3 },
  { month: "Mar", approved: 128, pending: 22, rejected: 4 },
  { month: "Apr", approved: 145, pending: 15, rejected: 2 },
  { month: "May", approved: 152, pending: 12, rejected: 1 },
  { month: "Jun", approved: 160, pending: 8, rejected: 2 },
];

const shipmentDetails = [
  { id: "INV-MY-88291", product: "Shipment Analysis: INV-MY-88291", compliance: "93.7%", duty: "RM 60,500", items: "RM 1,250", status: "Approved" },
  { id: "INV-MY-88290", product: "Industrial Equipment Assembly", compliance: "87.2%", duty: "RM 45,200", items: "RM 890", status: "Approved" },
  { id: "INV-MY-88289", product: "Electronic Components Batch", compliance: "91.5%", duty: "RM 52,100", items: "RM 1,050", status: "Approved" },
  { id: "INV-MY-88288", product: "Chemical Compounds Shipment", compliance: "85.3%", duty: "RM 38,900", items: "RM 750", status: "Pending" },
];

export default function ComplianceWorkflows() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Compliance Workflows</h2>
        <p className="text-slate-600 mt-1">Monitor and manage compliance status across all shipments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">AI COMPLIANCE RATE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">93.7%</span>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">TOTAL SHIPMENT VALUE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">RM 60,500</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                3 / 4 completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ESTIMATED DUTY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">RM 1,250</span>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">-1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Chart */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Compliance Trend Analysis</CardTitle>
          <CardDescription>Shipment status distribution over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#F1F5F9" }} />
              <Legend />
              <Bar dataKey="approved" fill="#10B981" name="Approved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Shipment Details */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
          <CardDescription>Current compliance status for all shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">SHIPMENT ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">DESCRIPTION</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">AI COMPLIANCE</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">TOTAL SHIPMENT VALUE</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">ESTIMATED DUTY</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {shipmentDetails.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-blue-600">{item.id}</td>
                    <td className="py-3 px-4 text-slate-700">{item.product}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: item.compliance }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.compliance}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{item.duty}</td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{item.items}</td>
                    <td className="py-3 px-4">
                      <Badge className={item.status === "Approved" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}>
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
        <Button className="bg-green-600 hover:bg-green-700">Escalate</Button>
        <Button variant="outline">Approve</Button>
      </div>
    </div>
  );
}
