import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function IngestShipment() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Ingest Shipment</h2>
        <p className="text-slate-600 mt-1">Upload shipping documents and provide technical specifications for automated compliance screening.</p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Drag and drop documents</h3>
            <p className="text-slate-600 mb-4">Support for PDF, XLSX, and PNG formats. Best for Commercial Invoice, Packing Lists, and Technical Data Sheets.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Categories */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">PRODUCT CATEGORY</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Complete Electronics", "Medical Devices", "Industrial Materials", "Industrial Metals", "Chemicals", "Textiles"].map((category) => (
            <Card key={category} className="border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
              <CardContent className="pt-6">
                <p className="text-slate-700 font-medium">{category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manual Technical Specifications */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">MANUAL TECHNICAL SPECIFICATIONS</CardTitle>
          <CardDescription>Enter detailed technical parameters, chemical composition, or model numbers as found in the documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 rounded-lg p-6 text-slate-600 text-sm font-mono">
            Enter detailed technical parameters, chemical composition, or model numbers as found in the documents.
          </div>
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">COMPLIANCE CHECKLIST</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Commercial Invoice",
              "Packing List",
              "Bill of Lading",
              "Certificate of Origin",
              "Technical Data Sheet"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <input type="checkbox" id={item} className="w-4 h-4 rounded border-slate-300" />
                <label htmlFor={item} className="text-slate-700">{item}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">Analyze Ingest</Button>
        <Button variant="outline">Save Draft</Button>
      </div>
    </div>
  );
}
