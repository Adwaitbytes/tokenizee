
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Twitter, ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Tweet {
  id: string;
  text: string;
  author: string;
  username: string;
  likes: number;
  retweets: number;
  timestamp: string;
  category: string;
}

// This is mock data since we can't actually connect to Twitter API without credentials
const MOCK_TWEETS: Tweet[] = [
  {
    id: "1",
    text: "Just published our latest research on Web3 integration with traditional finance systems. The future is decentralized! #web3 #defi",
    author: "Web3 Daily",
    username: "web3daily",
    likes: 543,
    retweets: 128,
    timestamp: "2h ago",
    category: "web3"
  },
  {
    id: "2",
    text: "Breaking: Major cryptocurrency exchange announces support for Arweave permanence for all user data. This is huge for data sovereignty! #arweave #crypto",
    author: "Crypto News",
    username: "cryptonews",
    likes: 1204,
    retweets: 326,
    timestamp: "4h ago",
    category: "crypto"
  },
  {
    id: "3",
    text: "Our AI model has achieved new state-of-the-art results on multi-modal learning with 40% improved efficiency. Full paper dropping tomorrow! #ai #machinelearning",
    author: "AI Research Group",
    username: "airesearch",
    likes: 897,
    retweets: 219,
    timestamp: "6h ago",
    category: "ai"
  },
  {
    id: "4",
    text: "The future of AI is not just about algorithms but about responsible implementation. Here's our framework for ethical AI deployment in enterprise settings.",
    author: "Tech Ethics",
    username: "techethics",
    likes: 456,
    retweets: 102,
    timestamp: "5h ago",
    category: "ai"
  },
  {
    id: "5",
    text: "New policy paper on tech regulation is suggesting balanced approaches for blockchain innovation while protecting consumers. It's about time! #crypto #regulation",
    author: "Blockchain Policy",
    username: "blockchainpolicy",
    likes: 324,
    retweets: 87,
    timestamp: "3h ago",
    category: "crypto"
  },
  {
    id: "6",
    text: "Our team just developed a new DeFi protocol that reduces gas fees by 65% while maintaining the same security guarantees. Testnet live now! #web3 #defi",
    author: "Web3 Foundation",
    username: "web3foundation",
    likes: 723,
    retweets: 245,
    timestamp: "7h ago",
    category: "web3"
  },
  {
    id: "7",
    text: "Just released our new tool for analyzing tech trends across different sectors. The data shows AI adoption has increased 300% in healthcare this year.",
    author: "Tech Trends",
    username: "techtrends",
    likes: 512,
    retweets: 143,
    timestamp: "8h ago",
    category: "tech"
  },
  {
    id: "8",
    text: "The integration of AR/VR technology with blockchain verification systems is creating entirely new digital ownership paradigms. Our latest research: link.co/vr-blockchain",
    author: "Digital Futures",
    username: "digitalfutures",
    likes: 378,
    retweets: 91,
    timestamp: "5h ago",
    category: "tech"
  }
];

export function TwitterFeed() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    
    setTimeout(() => {
      if (selectedCategory === "all") {
        setTweets(MOCK_TWEETS);
      } else {
        setTweets(MOCK_TWEETS.filter(tweet => tweet.category === selectedCategory));
      }
      setLoading(false);
    }, 1000);
  }, [selectedCategory]);
  
  return (
    <Card className="border-t-4 border-t-[#1DA1F2]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            Trending on Twitter
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-[#1DA1F2] hover:text-[#1DA1F2]/80" asChild>
            <a href="https://twitter.com/search?q=%23crypto%20OR%20%23web3%20OR%20%23ai%20OR%20%23tech&src=typed_query&f=top" target="_blank" rel="noopener noreferrer">
              View More <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="tech">Tech</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.length > 0 ? (
              tweets.map(tweet => (
                <div key={tweet.id} className="border-b pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{tweet.author}</span>
                    <span className="text-sm text-gray-500">@{tweet.username}</span>
                    <span className="text-xs text-gray-400 ml-auto">{tweet.timestamp}</span>
                  </div>
                  <p className="text-sm mb-2">{tweet.text}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {tweet.retweets} retweets
                    </div>
                    <div>❤️ {tweet.likes} likes</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No trending tweets in this category right now
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
