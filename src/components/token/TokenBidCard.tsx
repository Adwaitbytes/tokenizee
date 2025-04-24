
import { useState } from "react";
import { useTokenStore, TokenInfo } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wallet, TrendingUp, Clock, AlertCircle } from "lucide-react";

interface TokenBidCardProps {
  postId: string;
}

export const TokenBidCard = ({ postId }: TokenBidCardProps) => {
  const { address, isConnected, connect } = useWallet();
  const { bidOnPost, getPostTokenInfo } = useTokenStore();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get token info for this post
  const tokenInfo = getPostTokenInfo(postId);
  
  const handleBid = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast({
          title: "Wallet Connection Failed",
          description: "Please connect your Arweave wallet to continue",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!address) {
      toast({
        description: "Please connect your wallet to place a bid",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bidPlaced = await bidOnPost(
        postId, 
        tokenInfo.currentPrice, 
        address
      );
      
      if (bidPlaced) {
        toast({
          title: "Bid Placed Successfully",
          description: `You've placed a bid of ${tokenInfo.currentPrice} AR tokens on this post. Tokens are locked for 24 hours.`,
        });
      } else {
        toast({
          title: "Bid Failed",
          description: "There was an error placing your bid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place bid",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-newsweave-primary" />
          Trust Bidding
        </h3>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">
              Place bids on trustworthy content. Early bidders earn more as token value increases!
            </p>
            <div className="flex items-center gap-2 text-xs text-newsweave-muted mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Tokens locked for 24 hours after bidding</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-slate-500">Current Token Price</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{tokenInfo.currentPrice.toFixed(4)}</span>
                <span className="ml-1 text-sm">AR</span>
                {tokenInfo.totalBids > 0 && (
                  <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-500">Total Bids</span>
              <p className="text-lg font-semibold">{tokenInfo.totalBids}</p>
            </div>
          </div>
          
          {tokenInfo.totalBids > 0 && (
            <div className="text-xs text-newsweave-muted">
              Started at {tokenInfo.initialPrice} AR ({(((tokenInfo.currentPrice - tokenInfo.initialPrice) / tokenInfo.initialPrice) * 100).toFixed(1)}% increase)
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {tokenInfo.verified ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>
          ) : (
            <span className="text-sm text-newsweave-muted flex items-center">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Pending Verification
            </span>
          )}
        </div>
        <Button 
          onClick={handleBid} 
          disabled={isSubmitting}
          className="bg-newsweave-primary"
        >
          {isSubmitting ? "Processing..." : `Bid ${tokenInfo.currentPrice.toFixed(4)} AR`}
        </Button>
      </CardFooter>
    </Card>
  );
};
