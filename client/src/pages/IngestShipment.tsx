import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Grid,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";
 import { Sparkles } from "lucide-react";


export default function IngestShipment() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    {
      name: "Complex Electronics",
      desc: "Semiconductors, PCBs, Integrated Circuits",
    },
    {
      name: "Medical Devices",
      desc: "Surgical Equipment, Diagnostics, Prosthetics",
    },
    {
      name: "Automated Systems",
      desc: "Industrial Robotics, AI Logic Controllers",
    },
  ];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      // later you can send to backend
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-600 mt-1">
          Upload shipping documents and provide technical specifications for automated compliance screening.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">

          {/* UPLOAD */}
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-[#3466E6]" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Drag and drop documents
                </h3>

                <p className="text-slate-600 mb-4">
                  PDF, XLSX, PNG supported. Best for invoices, packing lists, technical sheets.
                </p>

                {/* REAL FILE INPUT */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  onClick={handleFileClick}
                  className="bg-[#3466E6] hover:bg-[#2f5ed6]"
                >
                  Browse Files
                </Button>

              </div>
            </CardContent>
          </Card>

          {/* MANUAL SPECS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-[#3466E6]" />
                MANUAL TECHNICAL SPECIFICATIONS
              </CardTitle>
              <CardDescription>
                Enter product parameters, materials, or model numbers from documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 rounded-lg p-6 text-sm text-slate-600 font-mono">
                Enter detailed technical parameters, chemical composition, or model numbers...
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">

          {/* CATEGORY */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#3466E6]" />
                CATEGORY
              </CardTitle>
              <CardDescription>
                Select product classification group
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;

                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`cursor-pointer border rounded-lg p-4 transition ${
                      isSelected
                        ? "bg-[#3466E6] text-white border-[#3466E6]"
                        : "bg-[#3466E6]/10 hover:bg-[#3466E6]/20"
                    }`}
                  >
                    <p className="font-semibold">{cat.name}</p>
                    <p
                      className={`text-sm mt-1 ${
                        isSelected ? "text-white/90" : "text-slate-600"
                      }`}
                    >
                      {cat.desc}
                    </p>
                  </div>
                );
              })}

            </CardContent>
          </Card>

          {/* CHECKLIST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#3466E6]" />
                COMPLIANCE CHECKLIST
              </CardTitle>
              <CardDescription>
                Required documents for selected category:
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                "Commercial Invoice",
                "Packing List",
                "Bill of Lading",
                "Certificate of Origin",
                "Technical Data Sheet",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <label className="text-slate-700 text-sm">{item}</label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* JKDM */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3466E6]" />
                JKDM Integration Status
              </CardTitle>
              <CardDescription>
                Customs system connectivity monitoring
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <p className="text-green-600 font-medium">● System Online</p>
                <p className="text-slate-600">
                  Last Sync: 26 June 2026, 14:32
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}

<div className="flex gap-3">
  <Button
    className="w-full h-14 bg-[#3466E6] hover:bg-[#2f5ed6] text-white font-semibold text-base shadow-xl shadow-blue-300/40 hover:shadow-blue-400/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
  >
    <Sparkles className="w-5 h-5" />
    ANALYSE INGEST
  </Button>
</div>

        </div>
      </div>
    </div>
  );
}