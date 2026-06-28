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
  LogOut,
  Camera,
} from "lucide-react";

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

                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {userData.department}
                  </Badge>

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

      {/* ================= SETTINGS ================= */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase">
            Account Settings
          </CardTitle>
          {/* <CardDescription className="text-slate-500">
            Manage preferences and security
          </CardDescription> */}
        </CardHeader>

        <CardContent className="space-y-6">

          {/* NOTIFICATIONS */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              Notifications
            </p>

            <div className="space-y-3">
              {notificationItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <Switch
                    checked={item.value}
                    onCheckedChange={item.setter}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200" />

         {/* LANGUAGE */}
          <div className="flex items-center justify-between">
            
            {/* LEFT LABEL */}
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              Language
            </p>

            {/* RIGHT DROPDOWN */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-10 w-44 px-3 border border-slate-200 rounded-md text-sm bg-white"
            >
              <option value="en">English</option>
              <option value="ms">Malay</option>
              <option value="zh">Chinese</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="border-t border-slate-200" />

          {/* SECURITY */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                Security
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Password management
              </p>
            </div>

            <Button variant="outline">Change Password</Button>
          </div>

          <div className="border-t border-slate-200" />

          {/* LOGOUT */}
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

        </CardContent>
      </Card>

      {/* DANGER */}
      {/* <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-red-700 uppercase">
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-red-700 mb-3">
            Account deletion is permanent
          </p>

          <Button variant="outline" className="text-red-600 border-red-300">
            Delete Account
          </Button>
        </CardContent>
      </Card> */}

    </div>
  );
}