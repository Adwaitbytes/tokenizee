
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenRewardsTable } from "@/components/token/TokenRewardsTable";
import { TokenEarningsChart } from "@/components/token/TokenEarningsChart";
import { TokenLeaderboard } from "@/components/token/TokenLeaderboard";
import { useWallet } from "@/contexts/WalletContext";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { Award, Coins, TrendingUp, Star, BadgeDollarSign, BadgePercent } from "lucide-react";

const RewardsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isConnected, address } = useWallet();
  
  if (!isConnected) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-3xl font-serif font-bold mb-4 text-newsweave-primary">Rewards Dashboard</h1>
              <p className="text-muted-foreground mb-8">Connect your wallet to view your rewards and earnings</p>
              <div className="flex justify-center">
                <WalletConnect variant="primary" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-newsweave-light to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-newsweave-primary mb-2">Your Rewards Dashboard</h1>
              <p className="text-muted-foreground">Track your token performance, earnings, and rewards in real-time</p>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-blue-500" />
                    Total Tokens
                  </CardDescription>
                  <CardTitle className="text-2xl">124</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Across 15 different posts</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4 text-emerald-500" />
                    Total Earnings
                  </CardDescription>
                  <CardTitle className="text-2xl">32.45 AR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+12.5% this week</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Supporter Rank
                  </CardDescription>
                  <CardTitle className="text-2xl">Silver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 text-yellow-500" />
                    <span>75 points to Gold rank</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Token Performance</CardTitle>
                      <CardDescription>How your tokens have performed over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TokenEarningsChart />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Tokens</CardTitle>
                      <CardDescription>Your best performing tokens</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <div key={item} className="flex items-center justify-between p-4">
                            <div>
                              <p className="font-medium">Post #{item}</p>
                              <p className="text-xs text-muted-foreground">Purchased 2 days ago</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-newsweave-primary">{(Math.random() * 10).toFixed(2)} AR</p>
                              <div className="flex items-center gap-1 text-emerald-600 text-xs">
                                <TrendingUp className="h-3 w-3" />
                                <span>+{(Math.random() * 20).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="earnings">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Breakdown</CardTitle>
                    <CardDescription>Details of your earnings from token sales and rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TokenRewardsTable userId={address} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="leaderboard">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Supporters Leaderboard</CardTitle>
                    <CardDescription>Top token supporters in the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TokenLeaderboard />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RewardsDashboard;
