
import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { NewsFeed } from "@/components/news/NewsFeed";
import { TwitterFeed } from "@/components/news/TwitterFeed";
import { mockNewsArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenPortfolio } from "@/components/token/TokenPortfolio";
import { BookmarkIcon, TrendingUp, Clock, Sparkles, UserCircle } from "lucide-react";
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
          .slice(0, 5);
      }
      case "trending": {
        return [...allArticles]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
      }
      case "bookmarked": {
        return allArticles.filter(article => 
          bookmarks.some(bookmark => bookmark.articleId === article.id)
        );
      }
      default:
        return allArticles.slice(0, 5);
    }
  }, [currentTab, allArticles, bookmarks]);
  
  return (
    <Layout>
      <div className="flex flex-col">
        <div className="sticky top-14 z-10 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
          <Tabs defaultValue="recent" value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 mb-0 border-b border-transparent">
              <TabsTrigger
                value="recent"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
              >
                <Clock className="h-4 w-4 mr-2" /> For You
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
              >
                <TrendingUp className="h-4 w-4 mr-2" /> Trending
              </TabsTrigger>
              <TabsTrigger
                value="bookmarked"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-newsweave-primary data-[state=active]:bg-transparent data-[state=active]:text-newsweave-primary px-4 py-3"
              >
                <BookmarkIcon className="h-4 w-4 mr-2" /> Bookmarked
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-0">
              <div className="p-4">
                <NewsFeed articles={filteredArticles} />
                {filteredArticles.length > 0 && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={() => navigate('/discover')} 
                      variant="outline"
                      className="rounded-full border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/10"
                    >
                      Show more
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="p-4">
                <NewsFeed articles={filteredArticles} />
                {filteredArticles.length > 0 && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={() => navigate('/discover')} 
                      variant="outline"
                      className="rounded-full border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/10"
                    >
                      Show more
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="bookmarked" className="mt-0">
              <div className="p-4">
                {filteredArticles.length > 0 ? (
                  <NewsFeed articles={filteredArticles} />
                ) : (
                  <div className="text-center py-12 mt-8">
                    <BookmarkIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Save interesting content to read later
                    </p>
                    <Button 
                      onClick={() => navigate('/discover')} 
                      variant="outline" 
                      className="rounded-full border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/10"
                    >
                      Discover Content
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
