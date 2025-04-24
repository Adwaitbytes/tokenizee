
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, ExternalLink, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface NewsCardProps {
  item: NewsItemProps;
  className?: string;
}

export const NewsCard = ({ item, className }: NewsCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };
  
  return (
    <Link to={`/news/${item.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200",
        "animate-scale-in group",
        className
      )}>
        {item.imageUrl && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        <CardContent className={cn(
          "p-4",
          !item.imageUrl && "pt-4"
        )}>
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-newsweave-accent/10 text-newsweave-primary font-medium">
                {item.category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
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
        
        <CardFooter className="px-4 py-3 bg-slate-50 flex justify-between items-center border-t">
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
                isBookmarked ? "fill-newsweave-primary text-newsweave-primary" : "text-slate-500"
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
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
