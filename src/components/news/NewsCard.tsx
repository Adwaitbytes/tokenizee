import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, ExternalLink, Clock, GraduationCap, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useArticleStore } from "@/stores/articleStore";

export interface NewsItemProps {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  source: string;
  sourceUrl: string;
  timestamp: string;
  verified: boolean;
  imageUrl?: string;
  hash?: string;
  author?: string;
  txId?: string; // Added this property that was missing
}

interface NewsCardProps {
  item: NewsItemProps;
  className?: string;
  showDeleteOption?: boolean;
}

export const NewsCard = ({ item, className, showDeleteOption = false }: NewsCardProps) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const { address } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { removeArticle } = useArticleStore();
  
  // Check if article is bookmarked on mount and when bookmarks change
  useEffect(() => {
    setBookmarked(isBookmarked(item.id));
  }, [isBookmarked, item.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(item.id);
      toast({
        title: "Bookmark removed",
        description: "Article has been removed from your bookmarks",
      });
    } else {
      addBookmark(item.id);
      toast({
        title: "Bookmark added",
        description: "Article has been added to your bookmarks",
      });
    }
    
    setBookmarked(!bookmarked);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    removeArticle(item.id);
    toast({
      title: "Article deleted",
      description: "Your article has been deleted successfully",
      variant: "destructive",
    });
    
    // Redirect to creator page if we're on the article detail page
    if (window.location.pathname.includes(`/news/${item.id}`)) {
      navigate('/creator');
    }
  };

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };
  
  const isAuthor = address && item.author === address;
  
  return (
    <Link to={`/news/${item.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200",
        "animate-scale-in group hover:border-newsweave-primary/30",
        className
      )}>
        {item.imageUrl && (
          <div className="w-full h-52 overflow-hidden relative">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}
        <CardContent className={cn(
          "p-5",
          !item.imageUrl && "pt-5"
        )}>
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-newsweave-accent/20 text-newsweave-primary font-medium border-newsweave-primary/20">
                {item.category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                <Clock className="h-3 w-3" />
                {calculateReadTime(item.content)}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
          
          <h3 className="font-serif text-xl font-medium mb-2 line-clamp-2 group-hover:text-newsweave-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="relative">
            <p className={cn(
              "text-sm text-muted-foreground mb-3",
              !showFullSummary && "line-clamp-3"
            )}>
              {item.summary || item.content}
            </p>
            {(item.summary || item.content).length > 150 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowFullSummary(!showFullSummary);
                }}
                className="text-xs text-newsweave-primary hover:underline"
              >
                {showFullSummary ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {item.verified && (
            <div className="flex items-center gap-2 mb-3 text-xs text-emerald-600">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Educational Content</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-5 py-3 bg-slate-50 flex justify-between items-center border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">{item.source}</span>
            {item.verified && (
              <Badge variant="secondary" className="h-5 bg-green-100 text-green-800 text-[10px]">Verified</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-slate-100"
              onClick={toggleBookmark}
            >
              <Bookmark className={cn(
                "h-4 w-4",
                bookmarked ? "fill-newsweave-primary text-newsweave-primary" : "text-slate-500"
              )} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-slate-100" 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Share className="h-4 w-4 text-slate-500" />
            </Button>
            
            {showDeleteOption && isAuthor && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-red-100 hover:text-red-500" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            {item.sourceUrl && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-slate-100" 
                asChild
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                </a>
              </Button>
            )}
            {item.txId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // Fetch data from Arweave mainnet using the transaction ID
                  fetch(`https://arweave.net/${item.txId}`)
                    .then(response => response.json())
                    .then(data => {
                      // Display the data in a new tab
                      const newTab = window.open("", "_blank");
                      if (newTab) {
                        newTab.document.write(`
                          <html>
                            <head>
                              <title>Arweave Source Data</title>
                              <style>
                                body {
                                  font-family: system-ui, -apple-system, sans-serif;
                                  max-width: 800px;
                                  margin: 0 auto;
                                  padding: 20px;
                                  line-height: 1.6;
                                }
                                pre {
                                  background: #f5f5f5;
                                  padding: 15px;
                                  border-radius: 5px;
                                  overflow-x: auto;
                                }
                                h1 {
                                  color: #333;
                                  border-bottom: 2px solid #eee;
                                  padding-bottom: 10px;
                                }
                              </style>
                            </head>
                            <body>
                              <h1>Arweave Source Data</h1>
                              <pre>${JSON.stringify(data, null, 2)}</pre>
                              <p>Timestamp: ${item.timestamp}</p>
                              <p>Transaction ID: ${item.txId}</p>
                            </body>
                          </html>
                        `);
                        newTab.document.close();
                      }
                    })
                    .catch(error => {
                      console.error("Error fetching data from Arweave:", error);
                      toast({
                        title: "Error fetching data",
                        description: "Failed to fetch data from Arweave. Please try again later.",
                        variant: "destructive",
                      });
                    });
                }}
              >
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
