
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTokenStore } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useSocialStore } from "@/stores/socialStore";
import { Coins, TrendingUp, Timer, Lock, Heart, Unlock, Award, DollarSign } from "lucide-react";
import { differenceInHours, formatDistanceToNow } from "date-fns";

interface TokenBidCardProps {
  postId: string;
  className?: string;
  likeCount?: number;
}

export const TokenBidCard: React.FC<TokenBidCardProps> = ({ postId, className, likeCount: propLikeCount }) => {
  const { 
    getCurrentPrice, 
    addBid, 
    getBidsForPost, 
    setInitialPrice,
    increasePrice,
    areTokensLocked,
    getUnlockTime,
    areTokensRedeemable,
    redeemTokens,
    getUserTokens
  } = useTokenStore();
  
  const { getReactionCountsForPost } = useSocialStore();
  const { address, isConnected, connect } = useWallet();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState(1);
  const [sellAmount, setSellAmount] = useState(1);
  const [showSell, setShowSell] = useState(false);
  const [secondsPassed, setSecondsPassed] = useState(0);
  const priceIntervalRef = useRef<number | null>(null);
  const sellTimerRef = useRef<number | null>(null);
  
  // Get current price from store
  const initialPrice = 0.01;
  const currentPrice = getCurrentPrice(postId);
  const totalBids = getBidsForPost(postId).length;
  const totalValue = parseFloat((bidAmount * currentPrice).toFixed(4));
  
  // Get like count for this post - use prop value if provided
  const reactionCounts = getReactionCountsForPost(postId);
  const likeCount = propLikeCount !== undefined ? propLikeCount : reactionCounts.like || 0;
  
  // Update the price when like count changes or periodically
  useEffect(() => {
    const likeMultiplier = 0.001; // Each like adds 0.001 AR to base price
    const calculatedPrice = initialPrice + (likeCount * likeMultiplier);
    const roundedPrice = parseFloat(calculatedPrice.toFixed(4));
    
    // Only set price if it doesn't exist or if likes have affected it
    const currentStorePrice = getCurrentPrice(postId);
    if (currentStorePrice === initialPrice || likeCount > 0) {
      setInitialPrice(postId, roundedPrice);
    }
    
    // Set up interval for small periodic price increases
    if (!priceIntervalRef.current) {
      priceIntervalRef.current = window.setInterval(() => {
        increasePrice(postId, 0.1); // Small 0.1% increase every 10 seconds
        setSecondsPassed(prev => prev + 10);
      }, 10000); // Every 10 seconds
    }
    
    return () => {
      if (priceIntervalRef.current) {
        clearInterval(priceIntervalRef.current);
        priceIntervalRef.current = null;
      }
    };
  }, [postId, likeCount, setInitialPrice, getCurrentPrice, initialPrice, increasePrice]);
  
  // Check if user has tokens for this post
  const userTokens = address ? getUserTokens(address).find(t => t.postId === postId) : undefined;
  const userHasTokens = !!userTokens && userTokens.amount > 0;
  const tokensLocked = userHasTokens && areTokensLocked(postId, address!);
  const tokensRedeemable = userHasTokens && areTokensRedeemable(postId, address!);
  const unlockTime = userHasTokens && getUnlockTime(postId, address!);
  
  // Start sell timer when tokens are purchased
  useEffect(() => {
    if (userHasTokens && !showSell && !tokensLocked) {
      // Show sell option after 5 seconds
      sellTimerRef.current = window.setTimeout(() => {
        setShowSell(true);
      }, 5000);
    }
    
    return () => {
      if (sellTimerRef.current) {
        clearTimeout(sellTimerRef.current);
        sellTimerRef.current = null;
      }
    };
  }, [userHasTokens, showSell, tokensLocked]);
  
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
      // Add the bid
      addBid(postId, address, bidAmount);
      
      toast({
        title: "Bid Successful!",
        description: `You have purchased ${bidAmount} tokens for ${totalValue} AR`,
      });
      
      // Start the sell timer
      if (!tokensLocked) {
        if (sellTimerRef.current) {
          clearTimeout(sellTimerRef.current);
        }
        sellTimerRef.current = window.setTimeout(() => {
          setShowSell(true);
        }, 5000); // 5 seconds
      }
    } catch (error) {
      toast({
        title: "Bid Failed",
        description: "There was an error processing your bid",
        variant: "destructive",
      });
    }
  };
  
  const handleRedeemTokens = () => {
    if (!address) return;
    
    const redemptionValue = redeemTokens(postId, address);
    
    if (redemptionValue > 0) {
      toast({
        title: "Tokens Redeemed!",
        description: `You have redeemed tokens for ${redemptionValue} AR`,
      });
      setShowSell(false);
    } else {
      toast({
        title: "Redemption Failed",
        description: "There was an error redeeming your tokens",
        variant: "destructive",
      });
    }
  };
  
  const handleSellTokens = () => {
    if (!address || !userTokens) return;
    
    // Make sure sell amount doesn't exceed what user has
    const validSellAmount = Math.min(sellAmount, userTokens.amount);
    
    // For selling, we just call redeemTokens with specific amount
    const redemptionValue = redeemTokens(postId, address);
    
    if (redemptionValue > 0) {
      toast({
        title: "Tokens Sold!",
        description: `You have sold ${validSellAmount} tokens for ${(validSellAmount * currentPrice).toFixed(4)} AR`,
      });
      
      // Reset the sell UI if all tokens are sold
      if (validSellAmount >= userTokens.amount) {
        setShowSell(false);
      }
    } else {
      toast({
        title: "Sale Failed",
        description: "There was an error selling your tokens",
        variant: "destructive",
      });
    }
  };
  
  // Calculate price increase percentage
  const priceIncreasePercentage = Math.round(((currentPrice - initialPrice) / initialPrice) * 100);
  
  // Format unlock time in a user-friendly way
  const getFormattedUnlockTime = () => {
    if (!unlockTime) return "";
    
    const unlockDate = new Date(unlockTime);
    const now = new Date();
    const hoursLeft = differenceInHours(unlockDate, now);
    
    if (hoursLeft <= 0) {
      return "Ready to redeem";
    } else {
      return `Unlocks ${formatDistanceToNow(unlockDate, { addSuffix: true })}`;
    }
  };

  return (
    <Card className={`overflow-hidden shadow-lg border border-slate-200 transition-all hover:border-newsweave-primary/30 ${className}`}>
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
        
        {userHasTokens ? (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Tokens:</span>
                <Badge variant="outline" className="font-mono">{userTokens.amount}</Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                {tokensLocked ? (
                  <>
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-amber-700">{getFormattedUnlockTime()}</span>
                  </>
                ) : (
                  <>
                    <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-700">Tokens unlocked and ready to redeem</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs mt-2">
                <Award className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-blue-700">Early supporter benefits apply</span>
              </div>
              
              {showSell && !tokensLocked && (
                <div className="mt-3 space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">Sell Tokens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(Math.max(1, Math.min(userTokens.amount, parseInt(e.target.value) || 1)))}
                        className="w-16 h-7 text-right"
                        min={1}
                        max={userTokens.amount}
                      />
                      <span>tokens</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Sale Value:</span>
                    <span className="font-medium">{(sellAmount * currentPrice).toFixed(4)} AR</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSellTokens}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 transition-opacity"
                    >
                      Sell Now
                    </Button>
                    <Button
                      onClick={handleRedeemTokens}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition-opacity"
                    >
                      Redeem All
                    </Button>
                  </div>
                </div>
              )}
              
              {!showSell && !tokensLocked && (
                <div className="mt-3">
                  <Button
                    onClick={handleRedeemTokens}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 transition-opacity"
                  >
                    Redeem Tokens
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
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
            
            <div className="bg-slate-50 p-3 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-muted-foreground">Tokens are locked for 24 hours after purchase</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Timer className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-muted-foreground">Price updates with each bid and like</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Award className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-muted-foreground">Early supporters get higher rewards</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {!userHasTokens && (
        <CardFooter className="pt-2">
          <Button 
            onClick={handleBidSubmit} 
            className="w-full bg-gradient-to-r from-newsweave-primary to-newsweave-secondary hover:opacity-90"
          >
            Bid with AR
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
