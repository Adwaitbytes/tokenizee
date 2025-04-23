
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Bookmark, Clock, Plus } from "lucide-react";

interface LearningPathProps {
  id: string;
  title: string;
  description: string;
  articlesCount: number;
  timeToComplete: string;
  progress?: number;
  isStarted?: boolean;
  imageUrl: string;
}

const LEARNING_PATHS: LearningPathProps[] = [
  {
    id: "blockchain101",
    title: "Blockchain 101",
    description: "Learn the essentials of blockchain technology, from distributed ledgers to consensus mechanisms.",
    articlesCount: 8,
    timeToComplete: "45 min",
    progress: 25,
    isStarted: true,
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "ai-essentials",
    title: "AI Essentials",
    description: "Understand the fundamental concepts behind artificial intelligence and machine learning.",
    articlesCount: 6,
    timeToComplete: "35 min",
    imageUrl: "https://images.unsplash.com/photo-1677442135146-4522c09a7270?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "web3-future",
    title: "Future of Web3",
    description: "Explore the vision of Web3 and how it aims to revolutionize the internet as we know it.",
    articlesCount: 7,
    timeToComplete: "40 min",
    imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "crypto-investing",
    title: "Crypto Investing Basics",
    description: "Learn the fundamentals of cryptocurrency investing, risk management and market analysis.",
    articlesCount: 5,
    timeToComplete: "30 min",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=300"
  }
];

interface SavedArticleProps {
  id: string;
  title: string;
  source: string;
  date: string;
  readTime: string;
}

const SAVED_ARTICLES: SavedArticleProps[] = [
  {
    id: "article1",
    title: "Understanding Zero Knowledge Proofs in Blockchain Applications",
    source: "Crypto Today",
    date: "2 days ago",
    readTime: "5 min"
  },
  {
    id: "article2",
    title: "The Evolution of DeFi: Past, Present and Future",
    source: "Web3 Weekly",
    date: "1 week ago",
    readTime: "8 min"
  },
  {
    id: "article3",
    title: "How DAOs are Reshaping Organizational Structures",
    source: "Blockchain Review",
    date: "3 days ago",
    readTime: "6 min"
  }
];

const Learn = () => {
  const [activeTab, setActiveTab] = useState<string>("paths");
  const [savedArticles, setSavedArticles] = useState<SavedArticleProps[]>(SAVED_ARTICLES);
  
  const removeArticle = (articleId: string) => {
    setSavedArticles(prev => prev.filter(article => article.id !== articleId));
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Learn</h1>
          <p className="text-newsweave-muted mb-6">Dive deeper into topics with curated learning paths and saved articles</p>
          
          <Tabs defaultValue="paths" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="paths" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Paths
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Articles
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="paths">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_PATHS.map((path) => (
                  <div key={path.id} className="border rounded-lg overflow-hidden bg-white">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${path.imageUrl})` }}
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{path.title}</h3>
                      <p className="text-sm text-newsweave-muted mb-2">{path.description}</p>
                      
                      <div className="flex justify-between items-center text-xs text-newsweave-muted mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {path.articlesCount} articles
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {path.timeToComplete}
                        </span>
                      </div>
                      
                      {path.progress !== undefined ? (
                        <div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                            <div 
                              className="bg-newsweave-primary h-1.5 rounded-full" 
                              style={{ width: `${path.progress}%` }}
                            />
                          </div>
                          <Button className="w-full">Continue Learning</Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full">Start Learning</Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-newsweave-muted">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-center font-medium">Create Custom Path</p>
                  <p className="text-sm text-center mt-1">
                    Curate your own collection of articles on specific topics
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="saved">
              {savedArticles.length > 0 ? (
                <div className="space-y-3">
                  {savedArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4 bg-white flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <div className="flex text-xs text-newsweave-muted">
                          <span>{article.source}</span>
                          <span className="mx-2">•</span>
                          <span>{article.date}</span>
                          <span className="mx-2">•</span>
                          <span>{article.readTime} read</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Read</Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeArticle(article.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Bookmark className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                  <h3 className="text-lg font-medium mb-1">No saved articles yet</h3>
                  <p className="text-newsweave-muted">Save articles to read later by clicking the bookmark icon</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Learn;
