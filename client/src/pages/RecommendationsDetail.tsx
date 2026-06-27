import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Cpu,
  Lightbulb,
  Globe,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Edit,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const blueIcon = "text-[#3466E6]";

const technicalSpecs = [
  { label: "MPN", value: "VCAS121030H620DP" },
  { label: "MATERIAL TYPE", value: "ZROH" },
  { label: "PLANT CODE", value: "US02" },
  { label: "TARGET SAP SYSTEM", value: "Condition\nType ZDUT" },
];

const reasoningPoints = [
  "Classified under Heading 85.33: Electrical resistors (including rheostats and potentiometers).",
  "GRI 1 Application: Classification determined by heading terms for voltage-dependent resistors.",
  "SMD Type: Surface-mount device construction for high-density circuit protection.",
  "Function: Designed for transient voltage suppression and surge protection.",
];

export default function RecommendationsDetail() {
  const params = useParams();
  const itemId = params?.id;

  return (
    <div className="space-y-6 pb-10 px-2">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          {/* <h1 className="text-3xl font-bold">
            SUPPRESSOR VOLTAGE SMD 30V 1.2J
          </h1> */}

          <div className="flex items-center gap-3 mt-3">
            <span className="text-slate-600 font-semibold text-xl pr-4">
              SUPPRESSOR VOLTAGE SMD 30V 1.2J
            </span>

            <Badge className="bg-blue-100 text-blue-700 text-xs">
              Pending Approval
            </Badge>
          </div>
        </div>

        {/* BUTTON WITH ICON */}
        <Button variant="outline" className="gap-2">
          <ExternalLink className={`w-4 h-4 ${blueIcon}`} />
          View Official JKDM Portal
        </Button>

      </div>

      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT */}
        <Card className="pt-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEI6t2k1TXM75BVnv445ZZOyWbRqMoZc--9aB-KzlTCwZ7s3gZeTan5QyZctxy8tGCjsV0K69HiJDXmyl8x6gNFW41NmJLUKX-OBSD4936uOKYABmYJOHkPzs0Ew-vHWt4Dr3p1aAuTlVXCdhb5CdYhfw8rp1va1RmgEKHjcPhfoCW1Y3QFvsQ1bs7gEjZgZq-yLo4zAHaEjrIwF68d5orcgSofDGuvukdaivmWKyp0RMO4sbSJUmfcagRqtetKU7HqrYNTI82EXQD"
            className="w-full h-64 object-cover rounded-t-lg py-0"
          />

          <CardContent className="space-y-5">

            <div className="flex items-center gap-2">
              <FileText className={`w-5 h-5 ${blueIcon}`} />
              <h2 className="text-xl font-bold">
                Technical Specifications
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {technicalSpecs.map((item) => (
                <div key={item.label} className="bg-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    {item.label}
                  </p>
                  <p className="font-semibold whitespace-pre-line mt-1 text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card>
          <CardContent className="space-y-6">

            <div className="flex justify-between items-start">

              <div>
                <div className="flex items-center gap-2">
                  <Cpu className={`w-5 h-5 ${blueIcon}`} />
                  <h2 className="text-xl font-bold">
                    AI Intelligence Engine
                  </h2>
                </div>

                <p className="text-blue-600 font-semibold text-sm mt-1">
                  COMPLIANCE REASONING
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">
                  100%
                </div>
                <p className="text-xs text-slate-500">
                  AI CONFIDENCE SCORE
                </p>
              </div>
            </div>

            {/* REASONING */}
            <div className="border rounded-xl p-5 space-y-3">

              <div className="flex items-center gap-2">
                <Lightbulb className={`w-4 h-4 ${blueIcon}`} />
                <h3 className="font-bold">
                  Classification Reasoning
                </h3>
              </div>

              <ul className="space-y-2 text-sm text-slate-600 list-disc ml-5">
                {reasoningPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

            </div>

            {/* HTS */}
            <div className="border-l-4 border-blue-600 bg-slate-100 rounded-lg p-5">
              <div className="flex items-center gap-2">
                <Globe className={`w-4 h-4 ${blueIcon}`} />
                <p className="text-sm text-slate-500">
                  Suggested HTS Code
                </p>
              </div>

              <div className="text-2xl font-bold mt-1">
                8533.40.0000
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* FTA (MATCH TECH STYLE, NO BACKGROUND BLOCKS) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Globe className={`w-5 h-5 ${blueIcon}`} />
              FTA & Origin Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-slate-500 font-semibold">AGREEMENT NAME</p>
                <p className="font-semibold pt-2">ACFTA (ASEAN-China Free Trade Area)</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 pb-2 font-semibold">
                  ORIGIN STATUS
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Verified (China)
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 pb-2 font-semibold">SUPPLIER / DESTINATION</p>
                <p className="font-semibold">Emerson / Malaysia</p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 pb-2 font-semibold">WTO MEMBER / FTA APPLIED</p>
                <Badge className="bg-green-100 text-green-700 text-xs font-semibold mr-2">WTO: YES</Badge>
                <Badge className="bg-green-100 text-green-700 text-xs font-semibold">ACFTA</Badge>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* DUTY */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <DollarSign className={`w-5 h-5 ${blueIcon}`} />
              Duty & SST Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent>

            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-3 rounded-tl-lg">
                    Description
                  </th>

                  <th className="text-center">
                    Base
                  </th>

                  <th className="text-center">
                    Rate
                  </th>

                  <th className="text-right p-3 rounded-tr-lg">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="p-3">Import Duty</td>
                  <td className="text-center">5000 USD</td>
                  <td className="text-center">0%</td>
                  <td className="text-right p-3">RM0.00</td>
                </tr>

                <tr>
                  <td className="p-3">SST</td>
                  <td className="text-center">5000 USD</td>
                  <td className="text-center">0%</td>
                  <td className="text-right p-3">RM0.00</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-5 bg-slate-100 p-5 rounded-br-lg rounded-bl-lg flex justify-between">
              <span className="font-bold text-lg">
                TOTAL PAYABLE TAX
              </span>

              <span className="text-2xl font-bold">
                RM 0.00
              </span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* NOTES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className={`w-4 h-4 ${blueIcon}`} />
            Officer Review Notes
          </CardTitle>
        </CardHeader>

        <CardContent>

          <textarea
            rows={5}
            placeholder="Enter findings, discrepancy notes, or verification comments..."
            className="w-full border rounded-lg p-4 text-sm "
          />

          <div className="flex justify-end gap-3 mt-5">

            <Button variant="outline" className="gap-2 px-6 py-2.5">
              <Edit className="w-4 h-4" />
              Edit
            </Button>

            <Button variant="outline" className="gap-2 px-6 py-2.5">
              <AlertTriangle className="w-4 h-4" />
              Escalate
            </Button>

            <Button className="bg-green-600 hover:bg-green-700 gap-2 px-6 py-2.5">
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}