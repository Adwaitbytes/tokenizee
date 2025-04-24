import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Bookmark, Share, ExternalLink, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { fetchArticleById } from "@/data/mockNewsData";
import { NewsItemProps } from "@/components/news/NewsCard";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useToast } from '@/hooks/use-toast';
import { useArticleStore, Article } from '@/stores/articleStore';
import { TokenBidCard } from "@/components/token/TokenBidCard";
import { TokenTransactions } from "@/components/token/TokenTransactions";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItemProps | Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { toast } = useToast();
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);
  const { articles } = useArticleStore();

  useEffect(() => {
    const loadArticle = async () => {
      setIsLoading(true);
      
      try {
        // First try to get the article from the store
        if (id) {
          const storeArticle = articles.find(a => a.id === id);
          
          if (storeArticle) {
            setArticle(storeArticle);
            setIsBookmarkedState(isBookmarked(storeArticle.id));
            setIsLoading(false);
            return;
          }
          
          // If not in store, try to get from mock data
          const fetchedArticle = await fetchArticleById(id);
          if (fetchedArticle) {
            setArticle(fetchedArticle);
            setIsBookmarkedState(isBookmarked(fetchedArticle.id));
          }
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [id, articles, isBookmarked]);

  const handleBookmark = () => {
    if (!article) return;
    
    if (isBookmarkedState) {
      removeBookmark(article.id);
      setIsBookmarkedState(false);
      toast({
        description: "Article removed from bookmarks",
      });
    } else {
      addBookmark(article.id);
      setIsBookmarkedState(true);
      toast({
        description: "Article added to bookmarks",
      });
    }
  };

  const handleShare = async () => {
    if (!article) return;
    
    try {
      await navigator.share({
        title: article.title,
        text: article.content,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild variant="outline">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Function to determine if the article has the property
  const hasProperty = (prop: string): boolean => {
    return prop in article;
  };

  // Extract source info based on article type
  const source = hasProperty('source') ? (article as NewsItemProps).source : "NewsWeave";
  const verified = hasProperty('verified') ? (article as NewsItemProps).verified : false;
  const hash = hasProperty('hash') ? (article as NewsItemProps).hash : "";

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-newsweave-muted hover:text-newsweave-primary">
            <Link to="/">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to news
            </Link>
          </Button>
        </div>

        {/* Category badge */}
        <Badge variant="outline" className="mb-4 bg-newsweave-accent/10 text-newsweave-primary font-medium">
          {article.category}
        </Badge>
        
        {/* Article title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          {article.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-newsweave-muted mb-6">
          <span className="flex items-center">
            <Clock className="mr-1 h-3.5 w-3.5" />
            {new Date(article.timestamp).toLocaleString()}
          </span>
          
          <span className="flex items-center">
            Source: <span className="font-medium ml-1">{source}</span>
          </span>
          
          {verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Article image */}
        {article.imageUrl && (
          <div className="rounded-lg overflow-hidden my-6">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Two column layout for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article content */}
          <div className="lg:col-span-2">
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-lg leading-relaxed mb-4">
                {article.summary || article.content}
              </p>
              <div className="leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Source verification */}
            <div className="bg-slate-50 border rounded-lg p-4 mb-8">
              <h3 className="font-medium mb-2">Source Verification</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-newsweave-muted">Original Source:</span>
                  <a 
                    href={article.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-newsweave-primary hover:underline flex items-center"
                  >
                    Visit source <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                {hash && (
                  <div className="flex justify-between">
                    <span className="text-newsweave-muted">SHA256 Hash:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border">{hash}</code>
                  </div>
                )}
                {'txId' in article && (
                  <div className="flex justify-between">
                    <span className="text-newsweave-muted">Arweave TX:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border">{article.txId.slice(0, 8)}...</code>
                  </div>
                )}
              </div>
            </div>
            
            {/* Transaction history */}
            <TokenTransactions postId={article.id} />
          </div>
          
          {/* Sidebar with token bidding */}
          <div className="lg:col-span-1">
            <TokenBidCard postId={article.id} />

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleBookmark}
                className={cn(
                  "w-full justify-center",
                  isBookmarkedState && "bg-newsweave-accent/10 border-newsweave-primary text-newsweave-primary"
                )}
              >
                <Bookmark className={cn(
                  "mr-2 h-4 w-4",
                  isBookmarkedState && "fill-newsweave-primary"
                )} />
                {isBookmarkedState ? "Bookmarked" : "Bookmark"}
              </Button>
              
              <Button variant="outline" onClick={handleShare} className="w-full justify-center">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              {article.sourceUrl && (
                <Button variant="outline" asChild className="w-full justify-center">
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Source
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
