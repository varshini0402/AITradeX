import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown } from "lucide-react";

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
    answer: "The AI Compliance Rate represents the percentage of your shipments that align with current regulatory requirements based on our machine learning model. A score of 93.7% means 93.7% of your classified shipments meet compliance standards. Scores above 90% indicate strong compliance practices.",
    helpful: 124,
    unhelpful: 8,
  },
  {
    id: 2,
    category: "Tariffs",
    question: "How is the estimated duty calculated?",
    answer: "Estimated duty is calculated based on the HS code classification, product value, origin country, and applicable trade agreements. Our system analyzes the product specifications you provide and matches them against the Harmonized System database to determine the correct tariff rate. Actual duty may vary based on customs officer review.",
    helpful: 89,
    unhelpful: 5,
  },
  {
    id: 3,
    category: "Features",
    question: "What trade agreements does AITradeX support?",
    answer: "AITradeX supports major trade agreements including ASEAN Free Trade Area (AFTA), CPTPP, and bilateral agreements. Our system automatically identifies applicable agreements based on origin and destination countries, helping you access preferential tariff rates when eligible.",
    helpful: 156,
    unhelpful: 12,
  },
  {
    id: 4,
    category: "Data",
    question: "How often is regulatory data updated?",
    answer: "Our regulatory database is updated daily to reflect changes in tariff rates, HS code classifications, and trade agreement terms. The Live Regulation Tracker shows real-time compliance scores and alerts you to significant regulatory changes that may affect your shipments.",
    helpful: 201,
    unhelpful: 15,
  },
  {
    id: 5,
    category: "Security",
    question: "How is my shipment data protected?",
    answer: "All shipment data is encrypted in transit and at rest using industry-standard protocols. We comply with international data protection regulations and maintain strict access controls. Your data is never shared with third parties without explicit consent.",
    helpful: 178,
    unhelpful: 3,
  },
  {
    id: 6,
    category: "Integration",
    question: "Can I integrate AITradeX with my existing systems?",
    answer: "Yes! AITradeX provides API endpoints for integration with ERP, logistics, and customs systems. Our technical team can assist with custom integrations. Contact support@aitradex.com for integration assistance.",
    helpful: 92,
    unhelpful: 6,
  },
  {
    id: 7,
    category: "Compliance",
    question: "What happens if my compliance rate drops?",
    answer: "A drop in compliance rate typically indicates changes in regulations or misclassifications. Our system will alert you to the specific issues and provide recommendations. Review the Recommendations page for AI-powered suggestions to improve compliance.",
    helpful: 145,
    unhelpful: 9,
  },
  {
    id: 8,
    category: "Tariffs",
    question: "How can I reduce my tariff costs?",
    answer: "Several strategies can help: 1) Ensure accurate product classification using our AI engine, 2) Leverage applicable trade agreements, 3) Optimize product sourcing, 4) Consider duty drawback programs. The Recommendations page provides personalized suggestions based on your shipment patterns.",
    helpful: 267,
    unhelpful: 18,
  },
];

export default function QA() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleHelpful = (id: number, isHelpful: boolean) => {
    setHelpfulVotes({ ...helpfulVotes, [id]: isHelpful });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Q&A & Knowledge Base</h2>
        <p className="text-slate-600 mt-1">Find answers to common questions about AITradeX, compliance, and trade regulations.</p>
      </div>

      {/* Search */}
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQ.map((item) => (
          <Card key={item.id} className="border-slate-200">
            <div
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="cursor-pointer p-4 flex items-start justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{item.question}</h3>
              </div>
              {expandedId === item.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
              )}
            </div>

            {expandedId === item.id && (
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <p className="text-slate-700 leading-relaxed mb-4">{item.answer}</p>

                {/* Helpful/Unhelpful */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Was this helpful?</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHelpful(item.id, true)}
                      className={helpfulVotes[item.id] === true ? "bg-green-50 border-green-300 text-green-700" : ""}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {item.helpful + (helpfulVotes[item.id] === true ? 1 : 0)}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHelpful(item.id, false)}
                      className={helpfulVotes[item.id] === false ? "bg-red-50 border-red-300 text-red-700" : ""}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {item.unhelpful + (helpfulVotes[item.id] === false ? 1 : 0)}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQ.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-slate-600 mb-4">No questions found matching your search.</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card className="border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Didn't find your answer?</h3>
              <p className="text-slate-600 text-sm">Contact our support team for additional assistance.</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
