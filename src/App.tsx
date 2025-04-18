
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Skills from "./pages/Skills";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import BecomeTeacher from "./pages/BecomeTeacher";
import Marketplace from "./pages/Marketplace";
import MySessions from "./pages/MySessions";
import Dashboard from "./pages/Dashboard";
import PointsManagement from "./pages/PointsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/community" element={<Community />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/become-teacher" element={
            <ProtectedRoute>
              <BecomeTeacher />
            </ProtectedRoute>
          } />
          <Route path="/my-sessions" element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/points" element={
            <ProtectedRoute>
              <PointsManagement />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
