import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";

interface RegulationData {
  date: string;
  complianceScore: number;
  regulatoryChanges: number;
  riskLevel: number;
}

export default function RegulationTracker() {
  const [data, setData] = useState<RegulationData[]>([
    { date: "Mon", complianceScore: 92, regulatoryChanges: 2, riskLevel: 15 },
    { date: "Tue", complianceScore: 93, regulatoryChanges: 1, riskLevel: 12 },
    { date: "Wed", complianceScore: 91, regulatoryChanges: 3, riskLevel: 18 },
    { date: "Thu", complianceScore: 94, regulatoryChanges: 2, riskLevel: 10 },
    { date: "Fri", complianceScore: 95, regulatoryChanges: 1, riskLevel: 8 },
    { date: "Sat", complianceScore: 94, regulatoryChanges: 0, riskLevel: 9 },
    { date: "Sun", complianceScore: 96, regulatoryChanges: 2, riskLevel: 7 },
  ]);

  const [latestUpdate, setLatestUpdate] = useState<string>("2 minutes ago");

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const lastItem = newData[newData.length - 1];

        // Generate new data point
        const newScore = Math.max(85, Math.min(98, lastItem.complianceScore + (Math.random() - 0.5) * 3));
        const newChanges = Math.floor(Math.random() * 4);
        const newRisk = Math.max(5, Math.min(25, lastItem.riskLevel + (Math.random() - 0.5) * 4));

        newData.push({
          date: `+${newData.length}h`,
          complianceScore: Math.round(newScore),
          regulatoryChanges: newChanges,
          riskLevel: Math.round(newRisk),
        });

        // Keep only last 10 data points
        if (newData.length > 10) {
          newData.shift();
        }

        return newData;
      });

      setLatestUpdate("just now");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const latestData = data[data.length - 1];
  const avgCompliance = Math.round(data.reduce((sum, d) => sum + d.complianceScore, 0) / data.length);

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Live Regulation Tracker
            </CardTitle>
            <CardDescription>Real-time compliance score and regulatory changes</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Updated {latestUpdate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Current Score</p>
              <p className="text-2xl font-bold text-blue-900">{latestData.complianceScore}%</p>
              <p className="text-xs text-blue-600 mt-1">↑ 4% from start of week</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Reg. Changes</p>
              <p className="text-2xl font-bold text-amber-900">{latestData.regulatoryChanges}</p>
              <p className="text-xs text-amber-600 mt-1">New updates today</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-red-700 uppercase mb-1">Risk Level</p>
              <p className="text-2xl font-bold text-red-900">{latestData.riskLevel}%</p>
              <p className="text-xs text-red-600 mt-1">↓ 8% improvement</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis stroke="#64748B" domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px", color: "#F1F5F9" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complianceScore"
                  stroke="#2563EB"
                  name="Compliance Score"
                  strokeWidth={2}
                  dot={{ fill: "#2563EB", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="riskLevel"
                  stroke="#EF4444"
                  name="Risk Level"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 text-sm">New ASEAN Trade Regulation</p>
                <p className="text-xs text-yellow-700">Effective immediately: Updated HS code classifications for electronics. Review recommended.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">Compliance Milestone Reached</p>
                <p className="text-xs text-blue-700">Your compliance score has exceeded 95% for 3 consecutive days. Excellent performance!</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
