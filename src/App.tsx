import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import FloatingNav from "./components/FloatingNav";
import Index from "./pages/Index";
import QueueRanking from "./pages/QueueRanking";
import TicketRetrieval from "./pages/TicketRetrieval";
import ClientNotification from "./pages/ClientNotification";
import OperatorDashboard from "./pages/OperatorDashboard";
import GeneralDisplay from "./pages/GeneralDisplay";
import ClientView from "./pages/ClientView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/client" element={<ClientView />} />
                <Route path="/ticket" element={<TicketRetrieval />} />
                <Route path="/display" element={<GeneralDisplay />} />
                <Route path="/notification/:ticketId" element={<ClientNotification />} />
                
                {/* Restricted Routes */}
                <Route path="/ranking" element={<Navigate to="/client" replace />} />
                <Route path="/operator" element={<Navigate to="/client" replace />} />
              </Routes>
            </main>
            <FloatingNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;