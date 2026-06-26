import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Server, Zap, Database, RefreshCw } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enhanced dataset with country, category, and business unit information
const tariffDataset = [
  { month: "Jan", country: "China", category: "Electronics", unit: "Operations", cost: 18000, duty: 1260 },
  { month: "Jan", country: "China", category: "Textiles", unit: "Supply Chain", cost: 10000, duty: 660 },
  { month: "Jan", country: "Japan", category: "Electronics", unit: "Operations", cost: 8000, duty: 560 },
  { month: "Jan", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 4000, duty: 280 },
  { month: "Jan", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 5000, duty: 440 },
  
  { month: "Feb", country: "China", category: "Electronics", unit: "Operations", cost: 20000, duty: 1400 },
  { month: "Feb", country: "China", category: "Textiles", unit: "Supply Chain", cost: 11000, duty: 770 },
  { month: "Feb", country: "Japan", category: "Electronics", unit: "Operations", cost: 10000, duty: 700 },
  { month: "Feb", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 5000, duty: 350 },
  { month: "Feb", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 6000, duty: 540 },
  
  { month: "Mar", country: "China", category: "Electronics", unit: "Operations", cost: 17000, duty: 1190 },
  { month: "Mar", country: "China", category: "Textiles", unit: "Supply Chain", cost: 12000, duty: 840 },
  { month: "Mar", country: "Japan", category: "Electronics", unit: "Operations", cost: 9000, duty: 630 },
  { month: "Mar", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 5000, duty: 350 },
  { month: "Mar", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 5000, duty: 440 },
  
  { month: "Apr", country: "China", category: "Electronics", unit: "Operations", cost: 22000, duty: 1540 },
  { month: "Apr", country: "China", category: "Textiles", unit: "Supply Chain", cost: 15000, duty: 1050 },
  { month: "Apr", country: "Japan", category: "Electronics", unit: "Operations", cost: 10000, duty: 700 },
  { month: "Apr", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 6000, duty: 420 },
  { month: "Apr", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 8000, duty: 720 },
  
  { month: "May", country: "China", category: "Electronics", unit: "Operations", cost: 20000, duty: 1400 },
  { month: "May", country: "China", category: "Textiles", unit: "Supply Chain", cost: 13000, duty: 910 },
  { month: "May", country: "Japan", category: "Electronics", unit: "Operations", cost: 9000, duty: 630 },
  { month: "May", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 6000, duty: 420 },
  { month: "May", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 7000, duty: 630 },
  
  { month: "Jun", country: "China", category: "Electronics", unit: "Operations", cost: 24000, duty: 1680 },
  { month: "Jun", country: "China", category: "Textiles", unit: "Supply Chain", cost: 16000, duty: 1120 },
  { month: "Jun", country: "Japan", category: "Electronics", unit: "Operations", cost: 11000, duty: 770 },
  { month: "Jun", country: "Japan", category: "Machinery", unit: "Manufacturing", cost: 7000, duty: 490 },
  { month: "Jun", country: "Vietnam", category: "Textiles", unit: "Supply Chain", cost: 9000, duty: 810 },
];

const recentActivity = [
  { id: "JPN-1006", product: "SUPPRESSOR VOLTAGE SMD 30V 1.2J", value: "5,000", compliance: "98%", status: "Approved" },
  { id: "JPN-1007", product: "BTIO-BTI-SMJ-BM4T2-15 Monitor Touch", value: "25,000", compliance: "98%", status: "Approved" },
  { id: "JPN-1008", product: "Industrial Temperature Sensor", value: "8,500", compliance: "92%", status: "Approved" },
];

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");

  // Aggregate data by month based on filters
  const filteredChartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; cost: number; duty: number }> = {};

    tariffDataset.forEach((item) => {
      const countryMatch = selectedCountry === "all" || item.country === selectedCountry;
      const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
      const unitMatch = selectedUnit === "all" || item.unit === selectedUnit;

      if (countryMatch && categoryMatch && unitMatch) {
        if (!monthlyData[item.month]) {
          monthlyData[item.month] = { month: item.month, cost: 0, duty: 0 };
        }
        monthlyData[item.month].cost += item.cost;
        monthlyData[item.month].duty += item.duty;
      }
    });

    return Object.values(monthlyData).sort((a, b) => {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }, [selectedCountry, selectedCategory, selectedUnit]);

  const hasData = filteredChartData.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good Day, Ahmad</h2>
          <p className="text-sm text-slate-600">You have 5 shipments pending review.</p>
        </div>
      </div>

      {/* ROW 1: Four Stat Cards in a Single Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Shipments This Month */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Shipments This Month</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">148</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Review */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Pending Review</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">5</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                Action
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Compliance */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">AI Compliance</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">93.7%</span>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Est. Duty */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Est. Duty</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">RM 18.4K</span>
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <TrendingDown className="w-3 h-3" />
                <span>-3.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: Chart + Duty Breakdown Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tariff Cost Analytics - Takes 2 columns */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              {/* Title and Filters Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-sm">Tariff Cost Analytics</CardTitle>
                  <CardDescription className="text-xs">Monthly spend breakdown - Jan - Jun 2026</CardDescription>
                </div>
              </div>

              {/* Filter Dropdowns Row */}
              <div className="flex flex-wrap gap-2">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Textiles">Textiles</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Last Updated Indicator */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-slate-600">
                  Regulations updated: <span className="font-semibold text-slate-700">26 Jun 2026, 2:15 PM</span>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#64748B" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#F1F5F9", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="cost" stroke="#2563EB" fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-medium">No data for this selection</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Duty Breakdown - Takes 1 column */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase">Duty Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-slate-700">Direct</span>
              </div>
              <span className="font-semibold text-slate-900">RM 12.5K</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-700">Regulatory</span>
              </div>
              <span className="font-semibold text-slate-900">RM 5.9K</span>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">RM 18.4K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Recent Activity - Full Width */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
              <CardDescription className="text-xs">Latest shipment classifications</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">View All →</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">ID</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Product</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Value</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Compliance</th>
                  <th className="text-left py-2 px-2 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-2 font-mono text-blue-600 text-xs">{item.id}</td>
                    <td className="py-2 px-2 text-slate-700 truncate text-xs">{item.product}</td>
                    <td className="py-2 px-2 text-slate-900 font-semibold text-xs">{item.value}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: item.compliance }}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-700 w-8">{item.compliance}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Approved</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Status Footer */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="pt-3 pb-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-xs font-semibold text-slate-900">JKDM Connected</p>
                <p className="text-xs text-slate-600">Live sync active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Regulation Feed</p>
                <p className="text-xs text-slate-600">Updated 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-xs font-semibold text-slate-900">AI Engine</p>
                <p className="text-xs text-slate-600">Processing active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
