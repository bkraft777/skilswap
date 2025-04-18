
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

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'purchase';
  amount: number;
  description: string;
  created_at: string;
}

interface PointsHistoryTableProps {
  transactions?: Transaction[];
}

export function PointsHistoryTable({ transactions }: PointsHistoryTableProps) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No transactions yet</p>;
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'earn':
        return <Badge className="bg-green-500">Earned</Badge>;
      case 'spend':
        return <Badge className="bg-red-500">Spent</Badge>;
      case 'purchase':
        return <Badge className="bg-blue-500">Purchased</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'spend':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

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
                  {getTypeIcon(transaction.type)}
                  {getTypeLabel(transaction.type)}
                </div>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right font-medium">
                {transaction.type === 'earn' || transaction.type === 'purchase' 
                  ? `+${transaction.amount}` 
                  : `-${transaction.amount}`
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
