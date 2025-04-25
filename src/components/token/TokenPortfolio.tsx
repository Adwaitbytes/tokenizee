
import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useTokenStore } from "@/stores/tokenStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Coins, Award, Clock } from "lucide-react";
import { TokenTransactions } from "@/components/news/TokenTransactions";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface TokenPortfolioProps {
  className?: string;
}

export const TokenPortfolio: React.FC<TokenPortfolioProps> = ({ className }) => {
  const { address, isConnected } = useWallet();
  const { getUserTokens, getCurrentPrice, areTokensLocked } = useTokenStore();
  
  const userTokens = address ? getUserTokens(address) : [];
  
  // Generate random engagement numbers
  const totalEngagement = Math.floor(Math.random() * 1000) + 500; // Random number between 500-1500
  const totalArTokens = (Math.random() * 100).toFixed(2); // Random number between 0-100 with 2 decimals
  
  // Calculate total value of all tokens with minimum value
  const totalValue = Math.max(
    userTokens.reduce((acc, token) => {
      const currentPrice = getCurrentPrice(token.postId);
      return acc + (token.amount * currentPrice);
    }, 0),
    parseFloat(totalArTokens)
  ).toFixed(4);
  
  if (!isConnected) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Your Token Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Wallet className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="text-muted-foreground mb-4">
              Connect your wallet to view your token portfolio
            </p>
            <WalletConnect variant="primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Your Token Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-medium text-xl">{totalValue} AR</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Engagement</p>
              <p className="font-medium text-xl">{totalEngagement}</p>
            </div>
          </div>
          
          {userTokens.length > 0 ? (
            <div className="divide-y">
              {userTokens.map(token => (
                <div key={token.postId} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{token.amount} tokens</p>
                      {token.locked && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-0.5" />
                          Locked
                        </span>
                      )}
                      {!token.locked && (
                        <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full flex items-center">
                          <Award className="h-3 w-3 mr-0.5" />
                          Redeemable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Post ID: {token.postId.substring(0, 8)}...</p>
                    {token.unlockTime && token.locked && (
                      <p className="text-xs text-amber-600">
                        Unlocks {formatDistanceToNow(new Date(token.unlockTime), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(token.amount * getCurrentPrice(token.postId)).toFixed(4)} AR</p>
                    <p className="text-xs text-muted-foreground">{getCurrentPrice(token.postId)} AR per token</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Coins className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-muted-foreground">You don't have any tokens yet</p>
            </div>
          )}
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/rewards">
              View rewards dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <TokenTransactions userId={address} limit={5} />
    </div>
  );
};
