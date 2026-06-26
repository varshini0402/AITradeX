import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp } from "lucide-react";

const recommendations = [
  {
    id: 1,
    title: "SUPPRESSOR VOLTAGE SMD 30V 1.2J",
    category: "Product Classification",
    description: "AI Intelligence Engine — Harmonized System Classification Determined by Tracking Terms for Tag-Aware Regulatory Nomenclature",
    confidence: "100%",
    estimatedSavings: "RM 833.40 MONTHLY",
    details: [
      { label: "Technical Specifications", value: "SMD Package, 30V Rating, 1.2J Energy" },
      { label: "Recommended HS Code", value: "8534.31.00" },
      { label: "Duty & S&T Breakdown", value: "Duty: RM 0.00 | S&T: RM 0.00" },
      { label: "Total Payable Tax", value: "RM 0.00" }
    ]
  },
  {
    id: 2,
    title: "FTA & Origin Details",
    category: "Trade Agreement",
    description: "Malaysia is a member of ASEAN Free Trade Area (AFTA) and CPTPP, enabling preferential tariff rates for qualifying goods.",
    confidence: "98%",
    estimatedSavings: "RM 125.50 MONTHLY",
    details: [
      { label: "Applicable Agreement", value: "ASEAN Free Trade Area (AFTA)" },
      { label: "Origin Requirement", value: "Verified Origin - China" },
      { label: "Preferential Rate", value: "0% Duty (Eligible)" }
    ]
  },
  {
    id: 3,
    title: "Duty & S&T Breakdown",
    category: "Tax Optimization",
    description: "Analysis of duty and service & tax components for optimal cost management.",
    confidence: "95%",
    estimatedSavings: "RM 450.00 MONTHLY",
    details: [
      { label: "Import Duty", value: "RM 0.00" },
      { label: "Service & Tax", value: "RM 0.00" },
      { label: "Total Payable Tax", value: "RM 0.00" }
    ]
  }
];

export default function Recommendations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Recommendations</h2>
        <p className="text-slate-600 mt-1">AI-powered suggestions to optimize your trade compliance and reduce costs.</p>
      </div>

      {/* Recommendations List */}
      {recommendations.map((rec) => (
        <Card key={rec.id} className="border-slate-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {rec.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                <CardDescription className="mt-2">{rec.description}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-700 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-green-600">{rec.confidence}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rec.details.map((detail, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">{detail.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Estimated Savings */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase mb-1">Estimated Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-700">{rec.estimatedSavings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Apply Recommendation</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
