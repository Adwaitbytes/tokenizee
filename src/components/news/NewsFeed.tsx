
import { useState, useEffect } from "react";
import { NewsCard, NewsItemProps } from "@/components/news/NewsCard";
import { TopicSelector } from "@/components/news/TopicSelector";

interface NewsFeedProps {
  articles: NewsItemProps[];
  className?: string;
}

export function NewsFeed({ articles, className }: NewsFeedProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [filteredArticles, setFilteredArticles] = useState<NewsItemProps[]>(articles);

  // Extract unique categories from articles
  const categories = Array.from(
    new Set(articles.map(article => article.category))
  ).map(category => ({
    id: category,
    name: category,
    count: articles.filter(article => article.category === category).length
  }));

  // Filter articles when selected topic changes
  useEffect(() => {
    if (selectedTopic === "all") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === selectedTopic));
    }
  }, [selectedTopic, articles]);

  return (
    <div className={className}>
      <TopicSelector 
        topics={categories} 
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} item={article} />
        ))}
        
        {filteredArticles.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
