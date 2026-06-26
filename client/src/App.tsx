import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Chatbox from "./components/Chatbox";
import IngestShipment from "./pages/IngestShipment";
import Dashboard from "./pages/Dashboard";
import ComplianceWorkflows from "./pages/ComplianceWorkflows";
import Recommendations from "./pages/Recommendations";
import AuditTrail from "./pages/AuditTrail";
import QA from "./pages/QA";
import Profile from "./pages/Profile";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/ingest" component={IngestShipment} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/compliance" component={ComplianceWorkflows} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/audit" component={AuditTrail} />
      <Route path="/qa" component={QA} />
      <Route path="/profile" component={Profile} />
      <Route path="{/404}" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout>
            <Router />
          </DashboardLayout>
          <Chatbox />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
