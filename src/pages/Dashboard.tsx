
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSessions } from '@/hooks/useUserSessions';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Coins, BookOpen } from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { UpcomingSessions } from '@/components/dashboard/UpcomingSessions';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: sessions } = useUserSessions();
  const { points, transactions } = useUserPoints();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-6">
          <DashboardStats 
            sessions={sessions} 
            points={points}
          />
          
          <div className="grid gap-6 md:grid-cols-2">
            <UpcomingSessions sessions={sessions} />
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
