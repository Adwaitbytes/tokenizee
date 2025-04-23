
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { NewsCard, NewsItemProps } from "@/components/news/NewsCard";
import { TopicSelector } from "@/components/news/TopicSelector";
import { fetchNewsArticles } from "@/data/mockNewsData";

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

  // Filter articles based on the active tab
  const filteredArticles = articles.sort((a, b) => {
    if (activeTab === "trending") {
      return b.views - a.views;
    } else if (activeTab === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
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
              {filteredArticles.map((article: NewsItemProps) => (
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
