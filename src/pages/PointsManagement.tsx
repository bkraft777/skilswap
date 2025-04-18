
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPoints } from '@/hooks/useUserPoints';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Coins, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BuyPointsDialog } from '@/components/points/BuyPointsDialog';
import { PointsHistoryTable } from '@/components/points/PointsHistoryTable';
import { PointsDisplay } from '@/components/points/PointsDisplay';

const PointsManagement = () => {
  const { user } = useAuth();
  const { points, transactions } = useUserPoints();
  const navigate = useNavigate();
  const [buyPointsOpen, setBuyPointsOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Points Management</h1>
        
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Available Points
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {points && (
                  <div className="text-4xl font-bold flex items-center gap-2 mb-2">
                    <Coins className="h-6 w-6 text-primary" />
                    {points.points_balance}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2 mb-4">Use points to book sessions with teachers</p>
                <Button onClick={() => setBuyPointsOpen(true)}>Buy More Points</Button>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Points Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="h-5 w-5 text-green-500" />
                      <span>Points Earned</span>
                    </div>
                    <span className="font-bold">
                      {points?.total_earned || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                      <span>Points Spent</span>
                    </div>
                    <span className="font-bold">
                      {points?.total_spent || 0}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate('/marketplace')}
                  >
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <PointsHistoryTable transactions={transactions} />
            </CardContent>
          </Card>
        </div>
        
        <BuyPointsDialog open={buyPointsOpen} onOpenChange={setBuyPointsOpen} />
      </main>
      <Footer />
    </div>
  );
};

export default PointsManagement;
