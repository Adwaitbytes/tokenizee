
import { useState, useEffect } from "react";
import { useTokenStore, TokenBid } from "@/stores/tokenStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TokenTransactionsProps {
  postId: string;
}

export const TokenTransactions = ({ postId }: TokenTransactionsProps) => {
  const { userBids } = useTokenStore();
  const [relevantBids, setRelevantBids] = useState<TokenBid[]>([]);
  
  useEffect(() => {
    // Filter bids for this post
    const filteredBids = userBids.filter(bid => bid.id === postId);
    // Sort by timestamp (newest first)
    const sortedBids = [...filteredBids].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setRelevantBids(sortedBids);
  }, [postId, userBids]);
  
  if (relevantBids.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2 font-medium">Bidder</th>
                  <th className="text-right pb-2 font-medium">Amount</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {relevantBids.map((bid) => {
                  const isLocked = bid.locked;
                  const shortAddress = `${bid.bidder.slice(0, 6)}...${bid.bidder.slice(-4)}`;
                  
                  return (
                    <tr key={bid.id} className="border-b last:border-0">
                      <td className="py-3">{shortAddress}</td>
                      <td className="py-3 text-right">{bid.amount.toFixed(4)} AR</td>
                      <td className="py-3 text-right">
                        {isLocked ? (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            Locked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Released
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
