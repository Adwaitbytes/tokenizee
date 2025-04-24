
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { NewsFeed } from "@/components/news/NewsFeed";
import { TwitterFeed } from "@/components/news/TwitterFeed";
import { mockNewsArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenPortfolio } from "@/components/token/TokenPortfolio";
import { BookmarkIcon, TrendingUp, Clock, BellRing } from "lucide-react";
import { useBookmarkStore } from '@/stores/bookmarkStore';

const Index = () => {
  const { articles } = useArticleStore();
  const { bookmarks } = useBookmarkStore();
  const [currentTab, setCurrentTab] = useState("recent");
  
  // Combine mock articles with user-created articles
  const allArticles = [...articles, ...mockNewsArticles];
  
  // Filter articles based on the selected tab
  const getFilteredArticles = () => {
    switch (currentTab) {
      case "recent":
        return [...allArticles].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case "trending":
        // For demo purposes, let's just return the first 5 articles as "trending"
        return allArticles.slice(0, 5);
      case "bookmarked":
        // Fix the type issue by filtering where bookmarks includes article's id
        return allArticles.filter(article => 
          bookmarks.some(bookmark => bookmark.articleId === article.id)
        );
      default:
        return allArticles;
    }
  };
  
  const filteredArticles = getFilteredArticles();
  
  return (
    <Layout>
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-newsweave-primary/20 via-newsweave-accent/10 to-transparent pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-newsweave-primary to-newsweave-secondary">
              NewsWeave
            </h1>
            <p className="text-newsweave-text text-lg md:text-xl font-medium mb-8">
              Decentralized news summaries stored on the permaweb with token-based bidding
            </p>
            <div className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 shadow-sm border">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="ml-2 text-sm text-newsweave-muted">100% Decentralized • Web3-Powered • Community Verified</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="pb-3 bg-white border-b">
                <CardTitle className="text-xl text-newsweave-primary font-serif">News Feed</CardTitle>
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
                        <TrendingUp className="h-4 w-4 mr-2" /> Trending
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
                    </TabsContent>
                    
                    <TabsContent value="trending" className="m-0">
                      <NewsFeed articles={filteredArticles} />
                    </TabsContent>
                    
                    <TabsContent value="bookmarked" className="m-0">
                      {filteredArticles.length > 0 ? (
                        <NewsFeed articles={filteredArticles} />
                      ) : (
                        <div className="text-center py-12">
                          <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                          <p className="text-muted-foreground">
                            Save interesting articles to read later
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <TokenPortfolio />
            
            <Card className="border-none shadow-md overflow-hidden">
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
