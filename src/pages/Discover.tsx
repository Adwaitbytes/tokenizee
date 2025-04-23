
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { NewsCard, NewsItemProps } from "@/components/news/NewsCard";
import { TopicSelector } from "@/components/news/TopicSelector";
import { fetchNewsArticles } from "@/data/mockNewsData";

// Add these properties to extend the NewsItem interface locally
interface ExtendedNewsItem extends NewsItemProps {
  views?: number;
  date?: string;
}

const Discover = () => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['discoverNews'],
    queryFn: fetchNewsArticles
  });
  
  const [activeTab, setActiveTab] = useState<string>("trending");
  
  // Extract unique categories from articles
  const categories = Array.from(
    new Set(articles.map(article => article.category))
  ).map(category => ({
    id: category,
    name: category,
    count: articles.filter(article => article.category === category).length
  }));
  
  const tabs = [
    { id: "trending", name: "Trending" },
    { id: "latest", name: "Latest" },
    { id: "recommended", name: "For You" },
  ];

  // Filter and sort articles based on the active tab
  const filteredArticles = [...articles].sort((a, b) => {
    const articleA = a as ExtendedNewsItem;
    const articleB = b as ExtendedNewsItem;
    
    if (activeTab === "trending") {
      // Default to sorting by ID if views not available
      return articleA.views && articleB.views 
        ? articleB.views - articleA.views 
        : Number(articleB.id) - Number(articleA.id);
    } else if (activeTab === "latest") {
      // Use timestamp if date is not available
      if (articleA.date && articleB.date) {
        return new Date(articleB.date).getTime() - new Date(articleA.date).getTime();
      } else {
        // Fallback to timestamp
        const timestampA = articleA.timestamp || "";
        const timestampB = articleB.timestamp || "";
        return timestampB.localeCompare(timestampA);
      }
    }
    // For "recommended", we'd normally use a personalized algorithm
    return Math.random() - 0.5; // Simple randomization as a placeholder
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6">Discover News</h1>
          
          {/* Tabs */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-newsweave-primary text-newsweave-primary"
                    : "border-transparent text-newsweave-text hover:text-newsweave-primary"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
          
          {/* Topic Filter */}
          <TopicSelector 
            topics={categories}
            selectedTopic="all"
            onSelectTopic={() => {}}
            className="mb-6"
          />
          
          {/* News Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white animate-pulse">
                  <div className="h-40 bg-slate-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard key={article.id} item={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
