
import Layout from "@/components/layout/Layout";
import { useState, useMemo } from "react";
import { NewsFeed } from "@/components/news/NewsFeed";
import { TwitterFeed } from "@/components/news/TwitterFeed";
import { mockNewsArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenPortfolio } from "@/components/token/TokenPortfolio";
import { BookmarkIcon, TrendingUp, Clock, BellRing, Sparkles, Flame, Newspaper } from "lucide-react";
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/wallet/WalletConnect";

const Index = () => {
  const { articles } = useArticleStore();
  const { bookmarks } = useBookmarkStore();
  const [currentTab, setCurrentTab] = useState("recent");
  const navigate = useNavigate();
  
  // Combine mock articles with user-created articles - memoized for performance
  const allArticles = useMemo(() => [...articles, ...mockNewsArticles], [articles]);
  
  // Filter articles based on the selected tab - memoized for performance
  const filteredArticles = useMemo(() => {
    switch (currentTab) {
      case "recent": {
        return [...allArticles]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);
      }
      case "trending": {
        return [...allArticles]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      }
      case "bookmarked": {
        return allArticles.filter(article => 
          bookmarks.some(bookmark => bookmark.articleId === article.id)
        );
      }
      default:
        return allArticles.slice(0, 3);
    }
  }, [currentTab, allArticles, bookmarks]);
  
  return (
    <Layout>
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-newsweave-primary/40 via-newsweave-accent/20 to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-newsweave-primary to-newsweave-secondary">
              Tokenizee
            </h1>
            <p className="text-newsweave-text text-lg md:text-xl font-medium mb-8 leading-relaxed">
              Decentralized content tokenization platform with creator rewards and token-based engagement
            </p>
            <div className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 shadow-md border animate-pulse-light mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="ml-2 text-sm text-newsweave-muted">100% Decentralized • Web3-Powered • Community Verified</span>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button 
                className="bg-newsweave-primary hover:bg-newsweave-secondary text-white px-6 py-2 transition-all"
                onClick={() => navigate('/discover')}
              >
                <Newspaper className="h-4 w-4 mr-2" />
                Discover Content
              </Button>
              <Button 
                variant="outline"
                className="border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/5 px-6 py-2 transition-all"
                onClick={() => navigate('/creator')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Content
              </Button>
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md overflow-hidden rounded-xl transform transition-all hover:shadow-lg">
              <CardHeader className="pb-3 bg-white border-b">
                <CardTitle className="text-xl text-newsweave-primary font-serif">Content Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-slate-50">
                <Tabs defaultValue="recent" onValueChange={setCurrentTab}>
                  <div className="px-6 bg-white">
                    <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-0">
                      <TabsTrigger
                        value="recent"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
                      >
                        <Clock className="h-4 w-4 mr-2" /> Recent
                      </TabsTrigger>
                      <TabsTrigger
                        value="trending"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
                      >
                        <Flame className="h-4 w-4 mr-2" /> Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="bookmarked"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
                      >
                        <BookmarkIcon className="h-4 w-4 mr-2" /> Bookmarked
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    <TabsContent value="recent" className="m-0">
                      <NewsFeed articles={filteredArticles} />
                      {filteredArticles.length > 0 && (
                        <div className="text-center mt-8">
                          <Button 
                            onClick={() => navigate('/discover')} 
                            className="bg-newsweave-primary hover:bg-newsweave-secondary"
                          >
                            Discover More Content
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="trending" className="m-0">
                      <NewsFeed articles={filteredArticles} />
                      {filteredArticles.length > 0 && (
                        <div className="text-center mt-8">
                          <Button 
                            onClick={() => navigate('/discover')} 
                            className="bg-newsweave-primary hover:bg-newsweave-secondary"
                          >
                            Discover More Content
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="bookmarked" className="m-0">
                      {filteredArticles.length > 0 ? (
                        <NewsFeed articles={filteredArticles} />
                      ) : (
                        <div className="text-center py-12">
                          <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                          <p className="text-muted-foreground mb-6">
                            Save interesting content to read later
                          </p>
                          <Button 
                            onClick={() => navigate('/discover')} 
                            variant="outline" 
                            className="border-newsweave-primary text-newsweave-primary"
                          >
                            Discover Content
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-newsweave-primary/5 to-white rounded-xl transform transition-all hover:shadow-lg">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-newsweave-primary">
                  <Sparkles className="h-5 w-5" />
                  Hot Topic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-white p-4 rounded-lg border border-newsweave-border shadow-sm">
                  <h3 className="font-serif font-medium mb-2">Web3 Content Tokenization</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Decentralized tokenization platforms are changing how content is monetized and distributed.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-newsweave-light px-2 py-1 rounded-full text-newsweave-primary">Trending</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7 border-newsweave-primary text-newsweave-primary"
                      onClick={() => navigate('/discover')}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <TokenPortfolio className="transform transition-all hover:shadow-lg rounded-xl" />
            
            <Card className="border-none shadow-md overflow-hidden rounded-xl transform transition-all hover:shadow-lg">
              <CardHeader className="pb-3 bg-gradient-to-r from-newsweave-primary/10 to-newsweave-accent/5 border-b">
                <CardTitle className="text-lg flex items-center gap-2 text-newsweave-primary">
                  <BellRing className="h-5 w-5" />
                  Latest Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <TwitterFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
