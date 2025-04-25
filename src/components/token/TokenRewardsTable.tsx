
import React from "react";
import { useTokenStore } from "@/stores/tokenStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { BadgeDollarSign, BadgePercent } from "lucide-react";

interface TokenRewardsTableProps {
  userId: string;
  limit?: number;
}

export const TokenRewardsTable: React.FC<TokenRewardsTableProps> = ({ 
  userId,
  limit = 10
}) => {
  const { getUserTransactions } = useTokenStore();
  
  const transactions = getUserTransactions(userId)
    .filter(tx => tx.type === 'reward' || tx.type === 'sell')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-md">
        <BadgeDollarSign className="h-8 w-8 mx-auto text-slate-300 mb-2" />
        <p className="text-muted-foreground">No earnings yet</p>
        <p className="text-xs text-muted-foreground mt-1">Start supporting content to earn rewards!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Post ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(tx => (
            <TableRow key={tx.id}>
              <TableCell>
                <Badge variant={tx.type === 'reward' ? 'outline' : 'default'} 
                       className={tx.type === 'reward' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}>
                  {tx.type === 'reward' ? 'Reward' : 'Sale'}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{tx.postId.substring(0, 8)}...</TableCell>
              <TableCell>{tx.amount} tokens</TableCell>
              <TableCell>{(tx.amount * tx.price).toFixed(4)} AR</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
