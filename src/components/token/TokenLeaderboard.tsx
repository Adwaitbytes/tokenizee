
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTokenStore } from "@/stores/tokenStore";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Medal } from "lucide-react";

export const TokenLeaderboard: React.FC = () => {
  const { bids, transactions } = useTokenStore();
  
  // Calculate user rankings based on total tokens held and rewards earned
  const leaderboard = React.useMemo(() => {
    const userStats = new Map();
    
    // Process bids
    bids.forEach(bid => {
      const userId = bid.userId;
      if (!userStats.has(userId)) {
        userStats.set(userId, { 
          userId, 
          totalBids: 0,
          totalTokens: 0,
          totalRewards: 0,
          postsSupported: new Set()
        });
      }
      
      const stats = userStats.get(userId);
      stats.totalBids += 1;
      stats.totalTokens += bid.bidAmount;
      stats.postsSupported.add(bid.postId);
      userStats.set(userId, stats);
    });
    
    // Process transactions for rewards
    transactions
      .filter(tx => tx.type === 'reward')
      .forEach(tx => {
        if (!tx.toUser) return;
        
        const userId = tx.toUser;
        if (!userStats.has(userId)) {
          userStats.set(userId, { 
            userId, 
            totalBids: 0,
            totalTokens: 0,
            totalRewards: 0,
            postsSupported: new Set()
          });
        }
        
        const stats = userStats.get(userId);
        stats.totalRewards += (tx.amount * tx.price);
        userStats.set(userId, stats);
      });
    
    // Convert to array and process for display
    return Array.from(userStats.values())
      .map(user => ({
        ...user,
        postsSupported: user.postsSupported.size,
        totalRewards: parseFloat(user.totalRewards.toFixed(4)),
        score: (user.totalTokens * 10) + (user.totalRewards * 100) + (user.postsSupported * 50)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }, [bids, transactions]);
  
  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-md">
        <Trophy className="h-8 w-8 mx-auto text-slate-300 mb-2" />
        <p className="text-muted-foreground">No supporters yet</p>
        <p className="text-xs text-muted-foreground mt-1">Be the first to support content and earn rewards!</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Supporter</TableHead>
            <TableHead className="text-right">Posts Supported</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="text-right">Rewards</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map(user => (
            <TableRow key={user.userId}>
              <TableCell>
                {user.rank === 1 && (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                )}
                {user.rank === 2 && (
                  <Medal className="h-5 w-5 text-slate-400" />
                )}
                {user.rank === 3 && (
                  <Medal className="h-5 w-5 text-amber-600" />
                )}
                {user.rank > 3 && (
                  <span className="text-muted-foreground">{user.rank}</span>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs">{user.userId.substring(0, 6)}...</span>
                  {user.rank <= 3 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 4 - user.rank }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">{user.postsSupported}</TableCell>
              <TableCell className="text-right">{user.totalTokens}</TableCell>
              <TableCell className="text-right">{user.totalRewards} AR</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
