
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Skills from "./pages/Skills";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import BecomeTeacher from "./pages/BecomeTeacher";

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
          <Route path="/login" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/become-teacher" element={<BecomeTeacher />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
