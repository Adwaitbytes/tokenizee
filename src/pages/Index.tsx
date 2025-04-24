
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { NewsFeed } from "@/components/news/NewsFeed";
import { TwitterFeed } from "@/components/news/TwitterFeed";
import { mockNewsArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenPortfolio } from "@/components/token/TokenPortfolio";
import { BookmarkIcon, TrendingUp, Clock, BellRing, Layout as LayoutIcon } from "lucide-react";
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
        // Fix the type issue by filtering where bookmarks includes article.id
        return allArticles.filter(article => bookmarks.includes(article.id));
      default:
        return allArticles;
    }
  };
  
  const filteredArticles = getFilteredArticles();
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-newsweave-primary/5 to-transparent pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-newsweave-primary">NewsWeave</h1>
            <p className="text-newsweave-muted text-lg">Decentralized news summaries stored on the permaweb with token-based bidding</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">News Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="recent" onValueChange={setCurrentTab}>
                  <div className="px-6">
                    <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
                      <TabsTrigger
                        value="recent"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                      >
                        <Clock className="h-4 w-4 mr-2" /> Recent
                      </TabsTrigger>
                      <TabsTrigger
                        value="trending"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" /> Trending
                      </TabsTrigger>
                      <TabsTrigger
                        value="bookmarked"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent px-4 py-2"
                      >
                        <BookmarkIcon className="h-4 w-4 mr-2" /> Bookmarked
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
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
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <TokenPortfolio />
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-newsweave-primary" />
                  Latest Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
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
