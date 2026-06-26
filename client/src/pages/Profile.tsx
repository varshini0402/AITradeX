import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Mail, Building2, Lock, Bell, Globe, LogOut, Camera } from "lucide-react";

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
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Profile Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account information and preferences.</p>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo & Basic Info */}
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {userData.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{userData.name}</h3>
                    <p className="text-slate-600">{userData.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">{userData.department}</Badge>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Role/Title</Label>
                    <Input
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Email</p>
                  <p className="text-slate-900 font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Department</p>
                  <p className="text-slate-900 font-medium">{userData.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Phone</p>
                  <p className="text-slate-900 font-medium">{userData.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Preferences */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notification Preferences
            </h4>

            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive updates via email</p>
                </div>
                <Switch checked={notificationEmail} onCheckedChange={setNotificationEmail} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Push Notifications</p>
                  <p className="text-sm text-slate-600">Get real-time alerts in the app</p>
                </div>
                <Switch checked={notificationPush} onCheckedChange={setNotificationPush} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Weekly Digest</p>
                  <p className="text-sm text-slate-600">Receive a summary every Monday</p>
                </div>
                <Switch checked={notificationWeekly} onCheckedChange={setNotificationWeekly} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Language Preference */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Language & Region
            </h4>

            <div className="pl-7">
              <Label className="text-sm font-semibold text-slate-700">Preferred Language</Label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full md:w-48 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ms">Malay (Bahasa Melayu)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="es">Spanish (Español)</option>
              </select>
              <p className="text-xs text-slate-600 mt-2">Changes will apply on your next login</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Security */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Security
            </h4>

            <div className="pl-7 space-y-3">
              <Button variant="outline" className="w-full md:w-48 justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <p className="text-xs text-slate-600">Last changed 3 months ago</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Logout */}
          <div className="pt-2">
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Danger Zone</CardTitle>
          <CardDescription className="text-red-700">Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 mb-4">
            Deleting your account will permanently remove all your data and cannot be undone.
          </p>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-100 border-red-300">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
