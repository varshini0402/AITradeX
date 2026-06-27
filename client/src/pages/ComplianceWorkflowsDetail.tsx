import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const shipmentDetails = [
  {
    part: "JPN-1006",
    material: "VCAS121030H620DP",
    description: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",
    supplier: "EMERSON (US02)",
    hsCode: "8533400000",
    confidence: 100,
    logistics: "China → Malaysia",
    logisticsType: "Int'l Transit",
    status: "Pending Approval",
  },
  {
    part: "JPN-1007",
    material: "3AA06259500",
    description: "Monitor Touch LCD Module",
    supplier: "IBMRSS (HU07)",
    hsCode: "8528521000",
    confidence: 88,
    logistics: "Taiwan → Hong Kong",
    logisticsType: "Regional",
    status: "Verified",
  },
  {
    part: "JPN-1001",
    material: "TEMP-SNSR-IND-V1",
    description: "Industrial Temperature Sensor",
    supplier: "EMERSON (HU07)",
    hsCode: "902519",
    confidence: 92,
    logistics: "China → Singapore",
    logisticsType: "Intra-ASEAN",
    status: "Verified",
  },
  {
    part: "JPN-1002",
    material: "BRD-ASSY-MAIN",
    description: "PCB Assembly Module",
    supplier: "IBMRSS (SG23)",
    hsCode: "8534",
    confidence: 95,
    logistics: "Malaysia → Malaysia",
    logisticsType: "Domestic",
    status: "Verified",
  },
];

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-sm font-medium text-slate-700">
        {value}%
      </span>
    </div>
  );
}
export default function ComplianceWorkflowsDetail() {
  const total = shipmentDetails.length;
  const params = useParams();
  const shipmentId = params?.id;

  return (
    <div className="space-y-6 pb-10 px-2"> 

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500">
            AI classification and compliance audit for shipment line items.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="px-6 py-2.5 gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>

          <Button className="bg-[#3466E6] hover:bg-[#2f5ed6] px-6 py-2.5 gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve All
          </Button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5"><p className="text-xs text-slate-500">AI CONFIDENCE</p><h2 className="text-3xl font-bold">93.7%</h2></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-slate-500">VALUE</p><h2 className="text-3xl font-bold">RM 60,500</h2></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-slate-500">DUTY</p><h2 className="text-3xl font-bold">RM 1,250</h2></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-xs text-slate-500">PROGRESS</p><h2 className="text-3xl font-bold">3 / 4</h2></CardContent></Card>
      </div>

      {/* TABLE */}
      <Card className="border-slate-200 overflow-hidden p-0"> {/* ✅ removes top white gap effect */}
        <CardContent className="!p-0">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="py-3 px-4">ID & Part</th>
                  <th className="py-3 px-4">Description & Material</th>
                  <th className="py-3 px-4">Plant & Supplier</th>
                  <th className="py-3 px-4">HTS Code</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Logistics</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {shipmentDetails.map((item) => (
                  <tr key={item.part} className="border-b hover:bg-slate-50">

                    <td className="py-3 px-4 font-semibold">
                      <div>{item.part}</div>
                      <div className="text-xs text-slate-400">{item.material}</div>
                    </td>

                    <td className="py-3 px-4">{item.description}</td>

                    <td className="py-3 px-4 text-slate-600">{item.supplier}</td>

                    <td className="py-3 px-4">
                      <Badge variant="secondary">{item.hsCode}</Badge>
                    </td>

                    <td className="py-3 px-4">
                      <ConfidenceBar value={item.confidence} />
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div>{item.logistics}</div>
                      <div className="text-xs text-slate-400">{item.logisticsType}</div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={
                          item.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        className="bg-white text-[#3466E6] border border-[#3466E6] px-4 hover:bg-[#3466E6]/10"
                      >
                        Review
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-slate-500">
              Showing 1-{total} of {total} line items
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