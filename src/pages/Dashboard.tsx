
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserSessions } from '@/hooks/useUserSessions';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Coins, BookOpen, ArrowRight, Search, Video } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: sessions } = useUserSessions();
  const { points, transactions } = useUserPoints();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/points')}
              className="flex items-center gap-2"
            >
              Manage Points <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/find-teacher')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Search className="h-4 w-4" />
              Find a Teacher
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          <DashboardStats 
            sessions={sessions} 
            points={points}
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            <UpcomingSessions sessions={sessions} />
            <RecentTransactions transactions={transactions} />
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => navigate('/find-teacher')}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <Video className="mr-2 h-5 w-5" />
              Find a Teacher Now
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              Get live help with any skill by connecting with a qualified teacher
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
