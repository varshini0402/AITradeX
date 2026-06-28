import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Search,
  Settings,
  Database,
  Shield,
  DollarSign,
  Package,
  Globe,
  HelpCircle,
  X
} from "lucide-react";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  helpful: number;
  unhelpful: number;
}

const faqData: FAQItem[] = [
  {
    id: 0,
    category: "AI Classification",
    question: "What is the overall AITradeX workflow?",
    answer: "AITradeX operates on a streamlined 3-step pipeline designed to automate global trade compliance: 1) Ingest Shipment (direct upload of commercial invoices or tech specs), 2) AI Analysis (automatic HS code determination and duty rate calculation), and 3) Manual Verification (human-in-the-loop review to finalize submissions with complete confidence).",
    helpful: 312,
    unhelpful: 5,
  },
  {
    id: 1,
    category: "Shipment Upload",
    question: "What file formats are supported for batch shipment uploads?",
    answer: "You can upload files using standard templates in .xlsx, .csv, and .ods formats. For seamless automated workflows, you can also connect your database natively via our API or compatible ERP connectors.",
    helpful: 45,
    unhelpful: 2,
  },
  {
    id: 2,
    category: "Compliance",
    question: "What does the AI Compliance Rate mean?",
    answer:
      "The AI Compliance Rate represents the percentage of your shipments that align with current regulatory requirements based on our machine learning model.",
    helpful: 124,
    unhelpful: 8,
  },
  {
    id: 3,
    category: "Tariff Calculation",
    question: "How is the estimated duty calculated?",
    answer:
      "Estimated duty is calculated based on HS code, product value, origin country, and trade agreements.",
    helpful: 89,
    unhelpful: 5,
  },
];

const categoryColors: Record<string, string> = {
  "Shipment Upload": "bg-blue-50 text-blue-700 border-blue-200/60",
  "AI Classification": "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  "Compliance": "bg-amber-50 text-amber-700 border-amber-200/60",
  "Tariff Calculation": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "FTA Eligibility": "bg-teal-50 text-teal-700 border-teal-200/60",
  "ERP Integration": "bg-orange-50 text-orange-700 border-orange-200/60",
};

export default function QA() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  // Check if any filters are currently active
  const isFiltered = activeTopic !== null || searchQuery.trim() !== "";

  // Reset all filters helper function
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveTopic(null);
    setExpandedId(null);
  };

  const filteredFAQ = faqData.filter((item) => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    const matchesSearch =
      cleanQuery === "" ||
      item.question.toLowerCase().includes(cleanQuery) ||
      item.answer.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery);

    const matchesTopic = !activeTopic || item.category === activeTopic;

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6 pb-10 px-2">

      {/* HEADER */}
      {/* <div className="text-center space-y-2 max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Knowledge Base & Support
        </h1>
      </div> */}

      {/* SEARCH */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="h-12 pl-12 border-slate-250"
        />
      </div>

      {/* TOPICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: "Shipment Upload", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { name: "AI Classification", icon: Database, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { name: "FTA Eligibility", icon: Globe, color: "text-teal-600 bg-teal-50 border-teal-100" },
          { name: "Tariff Calculation", icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { name: "Compliance", icon: Shield, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { name: "ERP Integration", icon: Settings, color: "text-orange-600 bg-orange-50 border-orange-100" },
        ].map((topic) => {
          const Icon = topic.icon;
          const isSelected = activeTopic === topic.name;

          return (
            <Card
              key={topic.name}
              onClick={() =>
                setActiveTopic(isSelected ? null : topic.name)
              }
              className={`cursor-pointer border ${
                isSelected
                  ? "ring-2 ring-blue-600"
                  : "border-slate-200"
              }`}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">

                {/* FIXED CLASSNAME HERE */}
                <div className={`p-2.5 rounded-xl mb-2.5 border ${topic.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-sm font-semibold text-slate-700">
                  {topic.name}
                </h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase text-slate-400 mt-2">
          {activeTopic ? `${activeTopic} Entries` : "Frequently Asked Questions"}
        </h2>

        {/*Clear filter button */}
        {isFiltered && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-xs h-7 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-lg flex items-center gap-1 transition-all"
          >
            Clear Filters
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* FAQ LIST */}
      <div className="space-y-3">

        {filteredFAQ.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No results found for your search.</p>
            <p className="text-slate-400 text-xs mt-1 mb-4">Try clarifying your terms or clearing filters.</p>
          
          </div>
        ) : (
          filteredFAQ.map((item) => {
            const isExpanded = expandedId === item.id;

            const badgeColorClass = categoryColors[item.category] || "bg-slate-100 text-slate-700 border-slate-200";

            return (
              <Card 
                key={item.id} 
                className={`transition-all duration-200 ${isExpanded ? "shadow-sm border-slate-300" : "hover:border-slate-300"}`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {/* Dynamic Badge Styling applied here */}
                    <Badge 
                      variant="outline" 
                      className={`w-fit font-semibold text-xs px-2.5 py-0.5 rounded-md border whitespace-nowrap shadow-sm transition-colors ${badgeColorClass}`}
                    >
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                      {item.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-slate-700" : ""
                    }`}
                  />
                </div>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <CardContent className="pb-5 pt-1 px-6 border-t border-slate-50">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })
        )}

      </div>
    </div>
  );
}