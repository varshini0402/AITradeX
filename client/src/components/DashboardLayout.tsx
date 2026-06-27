import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  Lightbulb,
  ClipboardList,
  CircleHelp,
  Plus,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Compliance Workflows", path: "/compliance", icon: ShieldCheck },
  { label: "Recommendations", path: "/recommendations", icon: Lightbulb },
  { label: "Audit Trail", path: "/audit", icon: ClipboardList },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => location === path;
  const [, params] = useRoute("/compliance-detail/:id");

  const shipmentId = params?.id;

  return (
    <div className="flex h-screen bg-background">

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg transition-all duration-300 lg:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">

          {/* LOGO */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-700">
            <span className="text-lg font-bold tracking-wide">
              AITradeX
            </span>
          </div>

          {/* NAV ITEMS (main) */}
          <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] transition",
                  isActive(item.path)
                    ? "bg-[#3466E6] text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive(item.path)
                      ? "text-white"
                      : "text-[#CAD2E4]"
                  )}
                />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* BOTTOM ACTIONS (compact) */}
          <div className="px-4 pb-4 space-y-2.5">

            {/* NEW INGEST (circle +) */}
           <a
            href="/ingest"
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#3466E6] text-white text-[14px] font-semibold shadow hover:bg-[#2f5ed6] transition"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-white" />
            </span>

            <span className="leading-none">
              New Ingest
            </span>
          </a>

            {/* SUPPORT */}
            <a
              href="/qa"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white text-[14px] transition"
            >
              <CircleHelp className="w-5 h-5 text-[#CAD2E4]" />
              Support
            </a>

            {/* SIGN OUT */}
           <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-300 text-[14px] transition"
            >
              <LogOut className="w-5 h-5 text-[#CAD2E4]" />
              Sign Out
            </a>
          </div>

          {/* FOOTER (smaller) */}
          <div className="px-3 py-3 border-t border-slate-700 text-center text-[10px] text-slate-400">
            AITradeX v1.0 · Trade AI
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

         <h1 className="text-2xl font-bold text-slate-900 px-2">
          {location === "/ingest"
            ? "Ingest Shipment"
            : location === "/qa"
            ? "Knowledge Base & Support"
            : shipmentId
            ? `Shipment Analysis: ${shipmentId}`
            : navItems.find((item) => isActive(item.path))?.label || "AITradeX"}
        </h1>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="text-sm text-slate-600">
            Welcome back, <span className="font-semibold">Ahmad</span>
          </div>
        <a
          href="/profile"
          className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-[#3466E6] via-blue-400 to-indigo-500 shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz5TL7PTsO_xQTzYPHxumbpR9vlk175LcEWsPsSyyCA0evVsypuXBETahqcTVOii2YY0YjVHSdhFayLcH9NWR5UX8u-DGpOVwx2DzyWd5G3omzYsqg7TgieCpEvHFKLd0jhHfNlMY1bTkqaFcJChE2sXQnsZ682s7B6XFT_uQI3P7q3nULz4P7VJnXSXywzBkSkXIAhf29c4d_w8dgxHh_eUVyOV_v1x6CZJfD59P1oX0s6eUe6cNdJjzjl8mxtmKX3N8ryv531_gO"
          alt="AI Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* subtle online glow dot */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
    </a>
        </div>

      </div>
    </header>
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>

      {/* overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}