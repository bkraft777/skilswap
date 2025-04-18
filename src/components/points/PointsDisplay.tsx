
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserPoints } from "@/hooks/useUserPoints";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { BuyPointsDialog } from "./BuyPointsDialog";
import { UserPoints, PointTransaction } from "@/hooks/useUserPoints";

interface PointsDisplayProps {
  points?: UserPoints;
  transactions?: PointTransaction[];
  size?: 'small' | 'medium' | 'large';
}

export const PointsDisplay = ({ 
  points: passedPoints, 
  transactions: passedTransactions,
  size = 'medium' 
}: PointsDisplayProps) => {
  const { points: fetchedPoints, transactions: fetchedTransactions, isLoading, error } = useUserPoints();
  
  // Use passed points/transactions or fetched ones
  const points = passedPoints || fetchedPoints;
  const transactions = passedTransactions || fetchedTransactions;

  if (isLoading) return <div>Loading points...</div>;
  if (error) return <div>Error loading points information</div>;
  if (!points) return <div>No points information found</div>;

  const pointsTextSize = size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-xl';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Points Balance
            </CardTitle>
            <CardDescription>Your current points and statistics</CardDescription>
          </div>
          <BuyPointsDialog />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className={`${pointsTextSize} font-bold`}>{points.points_balance}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Total Earned</span>
              <span className={`${pointsTextSize} font-bold text-green-600`}>{points.total_earned}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <span className={`${pointsTextSize} font-bold text-red-600`}>{points.total_spent}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {transactions && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent point transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.transaction_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
