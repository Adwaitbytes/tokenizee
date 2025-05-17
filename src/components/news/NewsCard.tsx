
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, ExternalLink, Clock, GraduationCap, Trash2, Heart, Repeat, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useArticleStore } from "@/stores/articleStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  txId?: string;
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
      <div className={cn(
        "border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 p-4 transition-colors",
        className
      )}>
        <div className="flex gap-3">
          <div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-newsweave-primary/20 text-newsweave-primary">
                {item.source.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <div>
                <span className="font-bold">{item.source}</span>
                <span className="text-gray-500 mx-1">·</span>
                <span className="text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 break-words">
              {item.title}
            </h3>
            
            <div className="relative mb-3">
              <p className={cn(
                "text-gray-600 dark:text-gray-300 break-words",
                !showFullSummary && "line-clamp-2"
              )}>
                {item.summary || item.content.substring(0, 280)}
              </p>
              {(item.summary || item.content).length > 280 && !showFullSummary && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFullSummary(true);
                  }}
                  className="text-sm text-newsweave-primary hover:underline ml-1"
                >
                  Show more
                </button>
              )}
            </div>
            
            {item.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-3 border border-gray-200 dark:border-gray-700">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-auto object-cover max-h-96"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center mt-2 justify-between text-gray-500">
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="rounded-full text-xs bg-gray-100 text-gray-800 border-gray-200">
                  {item.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200 rounded-full">
                  <Clock className="h-3 w-3" />
                  {calculateReadTime(item.content)}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-between mt-3 max-w-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 hover:bg-newsweave-primary/10 hover:text-newsweave-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 hover:bg-green-100 hover:text-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Repeat className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 hover:bg-red-100 hover:text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                onClick={toggleBookmark}
              >
                <Bookmark className={cn(
                  "h-4 w-4",
                  bookmarked ? "fill-newsweave-primary text-newsweave-primary" : ""
                )} />
              </Button>
              
              {showDeleteOption && isAuthor && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8 hover:bg-red-100 hover:text-red-500" 
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              {item.txId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
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
                  <Share className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
