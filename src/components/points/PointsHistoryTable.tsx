
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PointTransaction } from '@/hooks/useUserPoints';

interface PointsHistoryTableProps {
  transactions?: PointTransaction[];
}

export function PointsHistoryTable({ transactions }: PointsHistoryTableProps) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No transactions yet</p>;
  }

  const getTypeLabel = (transactionType: string) => {
    switch (transactionType) {
      case 'earn':
      case 'welcome_bonus':
      case 'session_earning':
        return <Badge className="bg-green-500">Earned</Badge>;
      case 'spend':
      case 'session_booking':
        return <Badge className="bg-red-500">Spent</Badge>;
      case 'purchase':
        return <Badge className="bg-blue-500">Purchased</Badge>;
      default:
        return <Badge>{transactionType}</Badge>;
    }
  };

  const getTypeIcon = (transactionType: string) => {
    switch (transactionType) {
      case 'earn':
      case 'welcome_bonus':
      case 'session_earning':
      case 'purchase':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'spend':
      case 'session_booking':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const isEarnType = (transactionType: string) => 
    ['earn', 'welcome_bonus', 'session_earning', 'purchase'].includes(transactionType);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(transaction.transaction_type)}
                  {getTypeLabel(transaction.transaction_type)}
                </div>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right font-medium">
                {isEarnType(transaction.transaction_type) || transaction.amount > 0
                  ? `+${Math.abs(transaction.amount)}` 
                  : `-${Math.abs(transaction.amount)}`
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
