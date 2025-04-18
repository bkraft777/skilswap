
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PointTransaction } from "@/hooks/useUserPoints";
import { format } from "date-fns";
import { Receipt } from "lucide-react";

interface RecentTransactionsProps {
  transactions?: PointTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    ?.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions && recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{transaction.transaction_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.created_at), 'PP')}
                  </p>
                </div>
                <p className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} points
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent transactions</p>
        )}
      </CardContent>
    </Card>
  );
}
