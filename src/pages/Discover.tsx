import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { NewsCard, NewsItemProps } from "@/components/news/NewsCard";
import { TopicSelector } from "@/components/news/TopicSelector";
import { fetchNewsArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";

// Add these properties to extend the NewsItem interface locally
interface ExtendedNewsItem extends NewsItemProps {
  views?: number;
  date?: string;
}

const ITEMS_PER_PAGE = 9; // Show 9 items per page (3x3 grid)

const Discover = () => {
  const { data: mockArticles = [], isLoading } = useQuery({
    queryKey: ['discoverNews'],
    queryFn: fetchNewsArticles,
    staleTime: 60000 // 1 minute cache to reduce refetching
  });
  
  const { articles } = useArticleStore();
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState<string>("trending");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Combine mock articles with user created articles - memoize this
  const allArticles = useMemo(() => [...mockArticles, ...articles], [mockArticles, articles]);
  
  // Extract unique categories from articles - memoize this
  const categories = useMemo(() => Array.from(
    new Set(allArticles.map(article => article.category))
  ).map(category => ({
    id: category,
    name: category,
    count: allArticles.filter(article => article.category === category).length
  })), [allArticles]);
  
  const tabs = useMemo(() => [
    { id: "trending", name: "Trending" },
    { id: "latest", name: "Latest" },
    { id: "recommended", name: "For You" },
  ], []);

  // Filter and sort articles based on the active tab, category and search query
  const filteredArticles = useMemo(() => {
    let filtered = [...allArticles];
    
    // Filter by category if not "all"
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    // Filter by search query if present
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) ||
        (article.summary && article.summary.toLowerCase().includes(query))
      );
    }
    
    // Sort based on active tab
    return filtered.sort((a, b) => {
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
      } else if (activeTab === "recommended") {
        // For recommended, prioritize articles from the same author if logged in
        if (address) {
          const isAuthorA = articleA.author === address;
          const isAuthorB = articleB.author === address;
          
          if (isAuthorA && !isAuthorB) return -1;
          if (!isAuthorA && isAuthorB) return 1;
        }
        
        // Otherwise randomize a bit, but use a stable sort key
        const hashA = articleA.id.charCodeAt(0);
        const hashB = articleB.id.charCodeAt(0);
        return hashB - hashA;
      }
      return 0;
    });
  }, [allArticles, selectedCategory, searchQuery, activeTab, address]);
  
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  
  // Get current page items - memoize this calculation
  const currentArticles = useMemo(() => filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [filteredArticles, currentPage]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, searchQuery]);

  // Debounced search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-newsweave-light to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-serif font-bold mb-4 md:mb-0 text-newsweave-primary">Discover News</h1>
              
              <div className="relative w-full md:w-64">
                <Input 
                  placeholder="Search articles..." 
                  className="pl-9 border-newsweave-border"
                  defaultValue={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b mb-6 bg-white rounded-t-lg overflow-hidden shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-newsweave-primary text-newsweave-primary bg-newsweave-light/50"
                      : "border-b-2 border-transparent text-newsweave-text hover:text-newsweave-primary"
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
              selectedTopic={selectedCategory}
              onSelectTopic={setSelectedCategory}
              className="mb-6"
            />
            
            {/* News Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(null).map((_, i) => (
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
            ) : currentArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((article) => (
                    <NewsCard 
                      key={article.id} 
                      item={article} 
                      showDeleteOption={article.author === address}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    
                    <span className="mx-4 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border">
                <Filter className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Discover;
