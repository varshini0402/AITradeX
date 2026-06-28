import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Building2,
  Lock,
  Bell,
  Globe,
  Settings, 
  LogOut,
  Camera,
  History, 
  FileDown 
} from "lucide-react";

interface HistoryItem {
  id: string;
  timestamp: string;
  action: "Approval" | "Edit";
  target: string;
  details: string;
}

export default function Profile() {
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  const [notificationWeekly, setNotificationWeekly] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: "Ahmad Hassan",
    email: "ahmad.hassan@company.com",
    role: "Trade Compliance Analyst",
    department: "Regulatory Affairs",
    phone: "+60 12-345-6789",
  });

  // Mock History Activity Logs
  const [historyData] = useState<HistoryItem[]>([
    {
      id: "TX-9021",
      timestamp: "2026-06-28 14:22",
      action: "Approval",
      target: "Shipment #MY-4810",
      details: "Approved HS Code classification matching 8708.29",
    },
    {
      id: "TX-8911",
      timestamp: "2026-06-26 09:15",
      action: "Edit",
      target: "Commercial Invoice #CI-9902",
      details: "Updated item unit value from RM 450 to RM 490",
    },
    {
      id: "TX-8840",
      timestamp: "2026-06-25 16:40",
      action: "Approval",
      target: "FTA Eligibility Verification",
      details: "Verified Form MJEPA for automotive components bundle",
    },
  ]);

  const notificationItems: {
    label: string;
    value: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    description: string;
  }[] = [
    {
      label: "Email Notifications",
      value: notificationEmail,
      setter: setNotificationEmail,
      description: "System updates",
    },
    {
      label: "Push Notifications",
      value: notificationPush,
      setter: setNotificationPush,
      description: "System updates",
    },
    {
      label: "Weekly Digest",
      value: notificationWeekly,
      setter: setNotificationWeekly,
      description: "System updates",
    },
  ];

  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };
  
  // Placeholder trigger for spreadsheet exporting
  const handleExportExcel = () => {
    alert("Exporting activity logs history to Excel format (.xlsx)...");
    // In production, integrate your preferred library here (e.g., xlsx or standard CSV downloading layout)
  };

  return (
    <div className="space-y-6">

      {/* HEADER (same style as your system) */}
      <div>
        {/* <h2 className="text-3xl font-bold text-slate-900">
          Profile Settings
        </h2> */}
        <p className="text-slate-500">
          Manage your account information and preferences
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="border-slate-200 pt-4">
        {/* <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
            Your Profile
          </CardTitle>
        </CardHeader> */}

        <CardContent className="space-y-6">

          {/* TOP SECTION */}
          <div className="flex items-start justify-between gap-6">

           {/* AVATAR */}
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz5TL7PTsO_xQTzYPHxumbpR9vlk175LcEWsPsSyyCA0evVsypuXBETahqcTVOii2YY0YjVHSdhFayLcH9NWR5UX8u-DGpOVwx2DzyWd5G3omzYsqg7TgieCpEvHFKLd0jhHfNlMY1bTkqaFcJChE2sXQnsZ682s7B6XFT_uQI3P7q3nULz4P7VJnXSXywzBkSkXIAhf29c4d_w8dgxHh_eUVyOV_v1x6CZJfD59P1oX0s6eUe6cNdJjzjl8mxtmKX3N8ryv531_gO"
              alt="AI Profile"
              className="w-20 h-20 rounded-full object-cover shadow"
            />

            <button className="absolute bottom-0 right-0 bg-white border border-slate-200 p-1.5 rounded-full shadow hover:bg-slate-50">
              <Camera className="w-3 h-3 text-slate-600" />
            </button>
          </div>

            {/* USER INFO */}
            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {userData.name}
                  </h3>

                  <p className="text-slate-600 text-sm">
                    {userData.role}
                  </p>

                  <p className="text-slate-600 text-sm">
                    {userData.department}
                  </p>

                  <div className="pt-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-500 uppercase">
                      Full Name
                    </Label>
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-500 uppercase">
                      Role
                    </Label>
                    <Input
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          role: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-slate-200" />

          {/* CONTACT (dashboard-style grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <p className="text-xs text-slate-500 uppercase">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                <p className="text-slate-900 font-medium text-sm">
                  {userData.email}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase">Department</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                <p className="text-slate-900 font-medium text-sm">
                  {userData.department}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase">Phone</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-slate-400" />
                <p className="text-slate-900 font-medium text-sm">
                  {userData.phone}
                </p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ================= AUDIT LOG & EXPORT FEATURE ================= */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0 gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Activity & Approval History
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-1">
              Review your historical approvals, workspace alterations, and document updates
            </CardDescription>
          </div>
          
          <Button 
            onClick={handleExportExcel}
            variant="outline" 
            size="sm"
            className="text-xs font-semibold h-9 rounded-xl flex items-center gap-1.5 border-slate-200 hover:bg-slate-50 shadow-sm shrink-0"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            Export to Excel
          </Button>
        </CardHeader>

        <CardContent className="p-0 border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Timestamp</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Target Document</th>
                  <th className="px-6 py-3 font-semibold hidden md:table-cell">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historyData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {item.timestamp}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                          item.action === "Approval" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" 
                            : "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                        }`}
                      >
                        {item.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                      {item.target}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs max-w-xs truncate hidden md:table-cell">
                      {item.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ================= ACCOUNT PREFERENCES SETTINGS ================= */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Account Settings
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Manage system notifications, configurations, and general security settings
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          
          {/* 1. NOTIFICATIONS SECTION */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 pt-1 mb-3">
              <Bell className="w-3.5 h-3.5" />
              Notification Preferences
            </p>
            
            <div className="space-y-2">
              {notificationItems.map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50/70 transition-colors gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 my-2" />

          {/* 2. LANGUAGE ROW */}
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-3">
              {/* Added mb-3 for clean space below the title*/}
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              App Preferences & Security
            </p>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/30">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                Language
              </p>
              <p className="text-xs text-slate-400">Change your system localization profile</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 w-35 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm font-medium text-slate-700"
            >
              <option value="en">English</option>
              <option value="ms">Malay</option>
              <option value="zh">Chinese</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* 3. SECURITY ROW (Single Row Content) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/30">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                Security
              </p>
              <p className="text-xs text-slate-400">Update account passwords and safety protocols</p>
            </div>
            <Button variant="outline" className="h-9 rounded-lg text-sm font-semibold shadow-sm bg-white border-slate-200 hover:bg-slate-50">
              Change Password
            </Button>
          </div>

          <div className="border-t border-slate-100 pt-2" />

          {/* 4. SIGN OUT ROW */}
          <div className="flex justify-start">
            <Button variant="outline" className="text-red-600 hover:bg-red-50/50 border-red-100 h-9 rounded-lg text-xs font-semibold shadow-sm bg-white">
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EXTRA BOTTOM SPACE BUFFER */}
      <div className="h-15" />

    </div>
  );
}