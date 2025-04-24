
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SliderInput } from "@/components/ui/slider-input";
import { Badge } from "@/components/ui/badge";
import { useTokenStore } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Timer, Lock } from "lucide-react";

interface TokenBidCardProps {
  postId: string;
  className?: string;
}

export const TokenBidCard: React.FC<TokenBidCardProps> = ({ postId, className }) => {
  const { getCurrentPrice, addBid, getBidsForPost } = useTokenStore();
  const { address, isConnected, connect } = useWallet();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState(1);
  
  const currentPrice = getCurrentPrice(postId);
  const totalBids = getBidsForPost(postId).length;
  const totalValue = parseFloat((bidAmount * currentPrice).toFixed(4));
  
  const handleBidSubmit = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast({
          title: "Wallet Connection Required",
          description: "Please connect your wallet to bid on tokens",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!address) {
      toast({
        title: "Wallet Address Required",
        description: "Please connect your wallet to bid on tokens",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real implementation, here we would:
      // 1. Check that the user has enough AR tokens
      // 2. Process the payment via Arweave
      
      // For demo, we'll just add the bid
      addBid(postId, address, bidAmount);
      
      toast({
        title: "Bid Successful!",
        description: `You have purchased ${bidAmount} tokens for ${totalValue} AR`,
      });
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: "There was an error processing your bid",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins className="h-5 w-5 text-newsweave-primary" />
          Token Bidding
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-newsweave-primary text-white">
              {currentPrice} AR
            </Badge>
            <span className="text-sm text-muted-foreground">per token</span>
          </div>
          
          {totalBids > 0 && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{((totalBids * 5) + 5)}% growth</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Amount</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 h-8 text-right"
                min={1}
              />
              <span>tokens</span>
            </div>
          </div>
          
          <input
            type="range"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseInt(e.target.value))}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span>Total Cost:</span>
            <span className="font-medium">{totalValue} AR</span>
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-muted-foreground">Tokens are locked for 24 hours after purchase</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <Timer className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-muted-foreground">Price updates with each bid</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleBidSubmit} 
          className="w-full"
        >
          Bid with AR
        </Button>
      </CardFooter>
    </Card>
  );
};
