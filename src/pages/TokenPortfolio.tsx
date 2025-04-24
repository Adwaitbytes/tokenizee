
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenTransactions } from "@/components/news/TokenTransactions";
import { useWallet } from "@/contexts/WalletContext";
import { useTokenStore } from "@/stores/tokenStore";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  BarChart3, 
  Clock,
  ArrowRightLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TokenPortfolio = () => {
  const [tab, setTab] = useState("portfolio");
  const { address, isConnected, connect } = useWallet();
  const { getUserTokens, getCurrentPrice, transactions } = useTokenStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const userTokens = address ? getUserTokens(address) : [];
  
  // Calculate total value of all tokens
  const totalValue = userTokens.reduce((acc, token) => {
    const currentPrice = getCurrentPrice(token.postId);
    return acc + (token.amount * currentPrice);
  }, 0);
  
  const totalTokens = userTokens.reduce((acc, token) => acc + token.amount, 0);
  
  // Get user transactions
  const userTransactions = address 
    ? transactions.filter(tx => tx.fromUser === address || tx.toUser === address)
    : [];
  
  // Calculate earnings from price increases
  const calculatePriceGains = () => {
    if (!userTokens.length) return 0;
    
    let gains = 0;
    userTokens.forEach(token => {
      const relevantTxs = userTransactions.filter(tx => 
        tx.postId === token.postId && tx.fromUser === address
      );
      
      relevantTxs.forEach(tx => {
        const currentPrice = getCurrentPrice(tx.postId);
        gains += (currentPrice - tx.price) * tx.amount;
      });
    });
    
    return gains;
  };
  
  const priceGains = calculatePriceGains();
  
  const connectWalletPrompt = (
    <div className="text-center py-12 max-w-md mx-auto">
      <Wallet className="h-14 w-14 mx-auto mb-4 text-slate-300" />
      <h2 className="text-2xl font-serif font-bold mb-2">Connect Your Wallet</h2>
      <p className="text-muted-foreground mb-6">
        Connect your Arweave wallet to view your token portfolio, manage your tokens, and track your investments.
      </p>
      <Button 
        size="lg"
        onClick={() => {
          connect().catch(error => {
            toast({
              title: "Connection Failed",
              description: "There was a problem connecting to your wallet",
              variant: "destructive",
            });
          });
        }}
      >
        Connect Wallet
      </Button>
    </div>
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-2">Token Portfolio</h1>
            <p className="text-newsweave-muted">Manage your tokens and track your investments</p>
          </div>
          
          {isConnected && (
            <Button onClick={() => navigate("/creator")}>
              Create Content
            </Button>
          )}
        </div>
        
        {!isConnected ? connectWalletPrompt : (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-muted-foreground font-medium">Total Value</h3>
                    <Coins className="h-5 w-5 text-newsweave-primary" />
                  </div>
                  <div className="text-3xl font-bold">{totalValue.toFixed(4)} AR</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Across {userTokens.length} posts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-muted-foreground font-medium">Price Gains</h3>
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className={`text-3xl font-bold ${priceGains >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {priceGains.toFixed(4)} AR
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    From price increases
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-muted-foreground font-medium">Token Count</h3>
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold">{totalTokens}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total tokens owned
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs for Portfolio, Transactions, Stats */}
            <Card>
              <CardHeader className="pb-0">
                <Tabs defaultValue="portfolio" onValueChange={setTab} className="w-full">
                  <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
                    <TabsTrigger
                      value="portfolio"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      <Coins className="h-4 w-4 mr-2" /> Portfolio
                    </TabsTrigger>
                    <TabsTrigger
                      value="transactions"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" /> Transactions
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      <Clock className="h-4 w-4 mr-2" /> History
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="p-6">
                <TabsContent value="portfolio" className="mt-0 pt-2">
                  {userTokens.length > 0 ? (
                    <div className="divide-y">
                      {userTokens.map(token => {
                        const currentPrice = getCurrentPrice(token.postId);
                        const totalTokenValue = token.amount * currentPrice;
                        
                        return (
                          <div key={token.postId} className="py-4 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{token.amount} tokens</p>
                              <Button 
                                variant="link" 
                                className="p-0 h-auto font-normal text-sm text-newsweave-primary"
                                onClick={() => navigate(`/news/${token.postId}`)}
                              >
                                View post
                              </Button>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="font-medium">{totalTokenValue.toFixed(4)} AR</p>
                              <p className="text-xs text-muted-foreground">
                                {currentPrice} AR per token
                                <TrendingUp className="inline-block h-3 w-3 ml-1 text-emerald-500" />
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Coins className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                      <h3 className="text-lg font-medium mb-2">No tokens yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start exploring and investing in news articles
                      </p>
                      <Button onClick={() => navigate("/")}>
                        Browse news
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="transactions" className="mt-0 pt-2">
                  <TokenTransactions userId={address} limit={10} className="border-0 shadow-none" />
                </TabsContent>
                
                <TabsContent value="history" className="mt-0 pt-2">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="font-medium">Activity History</h3>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                  
                  {userTransactions.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {userTransactions.slice(0, 5).map(tx => (
                        <div key={tx.id} className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            tx.type === 'buy' 
                              ? 'bg-green-100' 
                              : tx.type === 'sell' 
                                ? 'bg-red-100' 
                                : 'bg-amber-100'
                          }`}>
                            {tx.type === 'buy' ? (
                              <ArrowUpRight className={`h-5 w-5 ${
                                tx.type === 'buy' 
                                  ? 'text-green-600' 
                                  : tx.type === 'sell' 
                                    ? 'text-red-600' 
                                    : 'text-amber-600'
                              }`} />
                            ) : tx.type === 'sell' ? (
                              <ArrowDownLeft className="h-5 w-5 text-red-600" />
                            ) : (
                              <Coins className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium">
                              {tx.type === 'buy' 
                                ? 'Purchased tokens' 
                                : tx.type === 'sell' 
                                  ? 'Sold tokens' 
                                  : 'Received reward'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">
                              {tx.amount} tokens
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tx.price} AR per token
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                      <p className="text-muted-foreground">No activity yet</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TokenPortfolio;
