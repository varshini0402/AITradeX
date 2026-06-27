import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Search,
  Settings,
  Database,
  Shield,
  DollarSign,
  Package,
  Globe
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
    id: 1,
    category: "Compliance",
    question: "What does the AI Compliance Rate mean?",
    answer:
      "The AI Compliance Rate represents the percentage of your shipments that align with current regulatory requirements based on our machine learning model.",
    helpful: 124,
    unhelpful: 8,
  },
  {
    id: 2,
    category: "Tariff Calculation",
    question: "How is the estimated duty calculated?",
    answer:
      "Estimated duty is calculated based on HS code, product value, origin country, and trade agreements.",
    helpful: 89,
    unhelpful: 5,
  },
];

export default function QA() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

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
      </div>

      {/* FAQ LIST */}
      <div className="space-y-3">
        {filteredFAQ.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <Card key={item.id}>
              <div
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.id)
                }
                className="px-6 py-4 cursor-pointer flex justify-between"
              >
                <div>
                  <Badge variant="outline">{item.category}</Badge>
                  <h3 className="font-semibold pt-2">{item.question}</h3>
                </div>

                <ChevronDown
                  className={`w-4 h-4 transition ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isExpanded && (
                <CardContent>
                  <p className="text-sm text-slate-600">
                    {item.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}