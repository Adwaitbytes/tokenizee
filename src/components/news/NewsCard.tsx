
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewsItemProps {
  id: string;
  title: string;
  content: string;
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

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };
  
  return (
    <Link to={`/news/${item.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200",
        "animate-scale-in",
        className
      )}>
        {item.imageUrl && (
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className={cn(
          "p-4",
          !item.imageUrl && "pt-4"
        )}>
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="outline" className="bg-newsweave-accent/10 text-newsweave-primary font-medium">
              {item.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          </div>
          
          <h3 className="font-serif text-xl font-medium mb-2 line-clamp-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{item.content}</p>
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-slate-50 flex justify-between items-center">
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
              className="h-8 w-8"
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
              className="h-8 w-8" 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Share className="h-4 w-4 text-slate-500" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
