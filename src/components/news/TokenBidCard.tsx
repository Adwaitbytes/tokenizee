
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SliderInput } from "@/components/ui/slider-input";
import { Badge } from "@/components/ui/badge";
import { useTokenStore } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Timer, Lock, Heart } from "lucide-react";

interface TokenBidCardProps {
  postId: string;
  className?: string;
  likeCount?: number;
}

export const TokenBidCard: React.FC<TokenBidCardProps> = ({ postId, className, likeCount = 0 }) => {
  const { getCurrentPrice, addBid, getBidsForPost, setInitialPrice } = useTokenStore();
  const { address, isConnected, connect } = useWallet();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState(1);
  
  // Get current price from store or calculate based on likes
  const initialPrice = 0.01;
  const likeMultiplier = 0.001; // Each like adds 0.001 AR to base price
  
  // Update the price when like count changes
  useEffect(() => {
    const calculatedPrice = initialPrice + (likeCount * likeMultiplier);
    const roundedPrice = parseFloat(calculatedPrice.toFixed(4));
    
    // Only set price if it doesn't exist or if likes have affected it
    const currentStorePrice = getCurrentPrice(postId);
    if (currentStorePrice === initialPrice || likeCount > 0) {
      setInitialPrice(postId, roundedPrice);
    }
  }, [postId, likeCount, setInitialPrice, getCurrentPrice]);
  
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
  
  // Calculate price increase percentage
  const priceIncreasePercentage = Math.round(((currentPrice - initialPrice) / initialPrice) * 100);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3 bg-gradient-to-r from-newsweave-primary/10 to-newsweave-accent/10">
        <CardTitle className="text-lg flex items-center gap-2 text-newsweave-primary">
          <Coins className="h-5 w-5" />
          Token Bidding
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        {likeCount > 0 && (
          <div className="flex items-center gap-2 text-sm border-l-4 border-newsweave-primary pl-3 py-1 bg-newsweave-accent/5">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{likeCount} likes have increased token value</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white">
              {currentPrice} AR
            </Badge>
            <span className="text-sm text-muted-foreground">per token</span>
          </div>
          
          {priceIncreasePercentage > 0 && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{priceIncreasePercentage}% growth</span>
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
            className="w-full accent-newsweave-primary"
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
            <span className="text-muted-foreground">Price updates with each bid and like</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={handleBidSubmit} 
          className="w-full bg-gradient-to-r from-newsweave-primary to-newsweave-secondary hover:opacity-90"
        >
          Bid with AR
        </Button>
      </CardFooter>
    </Card>
  );
};
