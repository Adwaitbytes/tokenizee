
import React from "react";
import Layout from "@/components/layout/Layout";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useArticleStore } from "@/stores/articleStore";
import { NewsFeed } from "@/components/news/NewsFeed";
import { mockNewsArticles } from "@/data/mockNewsData";

const Bookmarks = () => {
  const { bookmarks } = useBookmarkStore();
  const { articles } = useArticleStore();
  const navigate = useNavigate();
  
  const allArticles = [...articles, ...mockNewsArticles];
  const bookmarkedArticles = allArticles.filter(article => 
    bookmarks.some(bookmark => bookmark.articleId === article.id)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bookmarks</h1>
        
        {bookmarkedArticles.length > 0 ? (
          <div className="space-y-4">
            <NewsFeed articles={bookmarkedArticles} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Bookmark className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">No bookmarks yet</h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Save interesting articles to read later by bookmarking them.
              </p>
              <Button 
                className="bg-newsweave-primary hover:bg-newsweave-secondary text-white"
                onClick={() => navigate('/discover')}
              >
                Discover content
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;
