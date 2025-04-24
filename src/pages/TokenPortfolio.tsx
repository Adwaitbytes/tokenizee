
import { useState, useEffect } from "react";
import { useTokenStore, TokenBid } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/stores/articleStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Lock, Unlock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TokenPortfolio = () => {
  const { address, isConnected, connect } = useWallet();
  const { userBids, tokenInfo } = useTokenStore();
  const { getArticleById } = useArticleStore();
  const navigate = useNavigate();
  const [userActiveBids, setUserActiveBids] = useState<(TokenBid & { title: string; profit: number })[]>([]);
  const [userHistoricalBids, setUserHistoricalBids] = useState<(TokenBid & { title: string; profit: number })[]>([]);
  
  useEffect(() => {
    if (!address) return;
    
    // Filter bids for current user
    const myBids = userBids.filter(bid => bid.bidder === address);
    
    const activeBids: (TokenBid & { title: string; profit: number })[] = [];
    const historicalBids: (TokenBid & { title: string; profit: number })[] = [];
    
    myBids.forEach(bid => {
      const article = getArticleById(bid.id);
      const title = article?.title || "Unknown Article";
      const currentPrice = tokenInfo[bid.id]?.currentPrice || bid.amount;
      const profit = currentPrice - bid.amount;
      const bidWithTitle = { ...bid, title, profit };
      
      if (bid.locked) {
        activeBids.push(bidWithTitle);
      } else {
        historicalBids.push(bidWithTitle);
      }
    });
    
    // Sort by timestamp (newest first)
    activeBids.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    historicalBids.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setUserActiveBids(activeBids);
    setUserHistoricalBids(historicalBids);
  }, [address, userBids, tokenInfo, getArticleById]);
  
  // Calculate total portfolio value
  const totalLockedValue = userActiveBids.reduce((sum, bid) => sum + bid.amount, 0);
  const totalPotentialProfit = userActiveBids.reduce((sum, bid) => sum + bid.profit, 0);
  const totalHistoricalProfit = userHistoricalBids.reduce((sum, bid) => sum + bid.profit, 0);
  
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  const viewArticle = (articleId: string) => {
    navigate(`/news/${articleId}`);
  };
  
  if (!isConnected) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-serif font-bold mb-6">Token Portfolio</h1>
          <Card className="text-center p-12">
            <CardContent className="pt-6">
              <Wallet className="h-16 w-16 text-newsweave-muted mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-3">Connect Wallet to View Your Portfolio</h2>
              <p className="text-newsweave-muted mb-6">
                Connect your Arweave wallet to see your token bids, track profits, and manage your portfolio.
              </p>
              <Button size="lg" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Token Portfolio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm text-newsweave-muted mb-1">Locked Value</h3>
            <div className="text-2xl font-bold">{totalLockedValue.toFixed(4)} AR</div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-newsweave-muted mb-1">Potential Profit</h3>
            <div className={`text-2xl font-bold ${totalPotentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPotentialProfit.toFixed(4)} AR
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm text-newsweave-muted mb-1">Historical Profit</h3>
            <div className={`text-2xl font-bold ${totalHistoricalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalHistoricalProfit.toFixed(4)} AR
            </div>
          </Card>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Active Bids ({userActiveBids.length})
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" /> Historical Bids ({userHistoricalBids.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {userActiveBids.length === 0 ? (
              <div className="text-center py-12 text-newsweave-muted">
                You don't have any active bids. Start bidding on trustworthy content!
              </div>
            ) : (
              <div className="space-y-4">
                {userActiveBids.map((bid) => (
                  <Card key={bid.id} className="overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-medium mb-1 line-clamp-1">{bid.title}</h3>
                        <div className="flex items-center text-sm text-newsweave-muted">
                          <Lock className="h-3.5 w-3.5 mr-1" /> 
                          Locked until {new Date(bid.lockExpiry).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-newsweave-muted">Bid Amount</div>
                          <div className="font-semibold">{bid.amount.toFixed(4)} AR</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-newsweave-muted">Potential Profit</div>
                          <div className={`font-semibold ${bid.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {bid.profit.toFixed(4)} AR
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="whitespace-nowrap"
                          onClick={() => viewArticle(bid.id)}
                        >
                          View Article <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="historical">
            {userHistoricalBids.length === 0 ? (
              <div className="text-center py-12 text-newsweave-muted">
                You don't have any historical bids yet.
              </div>
            ) : (
              <div className="space-y-4">
                {userHistoricalBids.map((bid) => (
                  <Card key={bid.id} className="overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-medium mb-1 line-clamp-1">{bid.title}</h3>
                        <div className="flex items-center text-sm text-newsweave-muted">
                          <Unlock className="h-3.5 w-3.5 mr-1" /> 
                          Released on {new Date(bid.lockExpiry).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-newsweave-muted">Bid Amount</div>
                          <div className="font-semibold">{bid.amount.toFixed(4)} AR</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-newsweave-muted">Final Profit</div>
                          <div className={`font-semibold ${bid.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {bid.profit.toFixed(4)} AR
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="whitespace-nowrap"
                          onClick={() => viewArticle(bid.id)}
                        >
                          View Article <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TokenPortfolio;
