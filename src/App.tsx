
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
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import BecomeTeacher from "./pages/BecomeTeacher";
import Marketplace from "./pages/Marketplace";
import MySessions from "./pages/MySessions";
import Dashboard from "./pages/Dashboard";
import PointsManagement from "./pages/PointsManagement";
import FindTeacher from "./pages/FindTeacher";
import WaitingRoom from "./pages/WaitingRoom";
import TeacherRoom from "./pages/TeacherRoom";
import Admin from "./pages/Admin";

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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
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
          <Route path="/find-teacher" element={
            <ProtectedRoute>
              <FindTeacher />
            </ProtectedRoute>
          } />
          <Route path="/waiting-room/:requestId" element={
            <ProtectedRoute>
              <WaitingRoom />
            </ProtectedRoute>
          } />
          <Route path="/teacher-room/:requestId" element={
            <ProtectedRoute>
              <TeacherRoom />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
