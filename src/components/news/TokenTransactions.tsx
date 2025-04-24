
import React from "react";
import { useTokenStore, TokenTransaction } from "@/stores/tokenStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TokenTransactionsProps {
  postId?: string; // If provided, show only transactions for this post
  userId?: string; // If provided, show only transactions for this user
  limit?: number;
  className?: string;
}

export const TokenTransactions: React.FC<TokenTransactionsProps> = ({
  postId,
  userId,
  limit = 5,
  className,
}) => {
  const { transactions } = useTokenStore();
  
  let filteredTransactions = [...transactions];
  
  if (postId) {
    filteredTransactions = filteredTransactions.filter(tx => tx.postId === postId);
  }
  
  if (userId) {
    filteredTransactions = filteredTransactions.filter(tx => 
      tx.fromUser === userId || tx.toUser === userId
    );
  }
  
  // Sort by timestamp, most recent first
  filteredTransactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Limit the number of transactions
  if (limit) {
    filteredTransactions = filteredTransactions.slice(0, limit);
  }
  
  const getTransactionIcon = (tx: TokenTransaction) => {
    switch (tx.type) {
      case 'buy':
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      case 'sell':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'reward':
        return <Gift className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const getTransactionLabel = (tx: TokenTransaction, viewingUserId?: string) => {
    switch (tx.type) {
      case 'buy':
        return viewingUserId && tx.fromUser === viewingUserId 
          ? "You purchased tokens" 
          : "Purchased tokens";
      case 'sell':
        return viewingUserId && tx.fromUser === viewingUserId 
          ? "You sold tokens" 
          : "Sold tokens";
      case 'reward':
        return "Reward distribution";
    }
  };
  
  const formatShortAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (filteredTransactions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="px-6 py-3 hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    {getTransactionIcon(tx)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {getTransactionLabel(tx, userId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-sm">
                    {tx.amount} tokens
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.price} AR per token
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
