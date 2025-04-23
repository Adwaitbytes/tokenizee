
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, MessageSquare, TrendingUp, Clock, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommunityRoomProps {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  lastActive: string;
  joined?: boolean;
}

const COMMUNITIES: CommunityRoomProps[] = [
  {
    id: "web3",
    name: "Web3 Enthusiasts",
    description: "Discussions about blockchain, cryptocurrency, NFTs, and the decentralized web.",
    members: 3420,
    posts: 287,
    lastActive: "5 min ago",
    joined: true
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    description: "Share insights on artificial intelligence, machine learning models, and ethical AI development.",
    members: 2856,
    posts: 312,
    lastActive: "2 min ago",
    joined: true
  },
  {
    id: "climate",
    name: "Climate Action",
    description: "Discussion forum for climate tech, sustainability innovations, and environmental policies.",
    members: 1930,
    posts: 178,
    lastActive: "15 min ago"
  },
  {
    id: "dao",
    name: "DAO Governance",
    description: "A space to discuss decentralized autonomous organizations, governance models, and voting systems.",
    members: 1245,
    posts: 143,
    lastActive: "30 min ago"
  },
  {
    id: "defi",
    name: "DeFi Explorers",
    description: "Conversations around decentralized finance protocols, yield strategies, and DeFi innovations.",
    members: 2110,
    posts: 231,
    lastActive: "3 min ago"
  }
];

interface DiscussionProps {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  community: string;
  replies: number;
  likes: number;
  timePosted: string;
}

const DISCUSSIONS: DiscussionProps[] = [
  {
    id: "disc1",
    title: "The impact of ZK rollups on Ethereum scaling solutions",
    author: "eth_researcher",
    authorAvatar: "ER",
    community: "Web3 Enthusiasts",
    replies: 24,
    likes: 87,
    timePosted: "2 hours ago"
  },
  {
    id: "disc2",
    title: "Can AI be used to detect fake news on permaweb platforms?",
    author: "ai_truthseeker",
    authorAvatar: "AT",
    community: "AI & Machine Learning",
    replies: 18,
    likes: 45,
    timePosted: "4 hours ago"
  },
  {
    id: "disc3",
    title: "Best practices for DAO voting mechanisms with token-weighted governance",
    author: "dao_builder",
    authorAvatar: "DB",
    community: "DAO Governance",
    replies: 31,
    likes: 73,
    timePosted: "1 day ago"
  }
];

const Community = () => {
  const [activeTab, setActiveTab] = useState<string>("rooms");
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(
    COMMUNITIES.filter(c => c.joined).map(c => c.id)
  );
  
  const toggleJoin = (communityId: string) => {
    setJoinedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };
  
  const filteredCommunities = COMMUNITIES.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatNumber = (num: number): string => {
    return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Community</h1>
          <p className="text-newsweave-muted mb-6">Join DAO rooms, participate in discussions, and connect with like-minded readers</p>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search communities or discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs defaultValue="rooms" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="rooms" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Rooms
              </TabsTrigger>
              <TabsTrigger value="discussions" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Active Discussions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms">
              <div className="space-y-4">
                {filteredCommunities.map((community) => (
                  <div key={community.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{community.name}</h3>
                        <p className="text-sm text-newsweave-muted mt-1">{community.description}</p>
                      </div>
                      <Button
                        variant={joinedCommunities.includes(community.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleJoin(community.id)}
                        className={joinedCommunities.includes(community.id) ? "bg-newsweave-primary h-9" : "h-9"}
                      >
                        {joinedCommunities.includes(community.id) ? "Joined" : "Join"}
                      </Button>
                    </div>
                    
                    <div className="flex mt-3 text-xs text-newsweave-muted">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {formatNumber(community.members)} members
                      </div>
                      <div className="mx-3">•</div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {formatNumber(community.posts)} posts
                      </div>
                      <div className="mx-3">•</div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {community.lastActive}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-newsweave-muted">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6" />
                  </div>
                  <p className="text-center font-medium">Create New Community</p>
                  <p className="text-sm text-center mt-1">
                    Start your own decentralized community around topics you care about
                  </p>
                </div>
              </div>
              
              {filteredCommunities.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-newsweave-muted">No communities found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discussions">
              <div className="space-y-4">
                {DISCUSSIONS.map((discussion) => (
                  <div key={discussion.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{discussion.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-base">{discussion.title}</h3>
                        <div className="flex text-xs text-newsweave-muted mt-1 mb-2">
                          <span>by {discussion.author}</span>
                          <span className="mx-2">•</span>
                          <span>in {discussion.community}</span>
                          <span className="mx-2">•</span>
                          <span>{discussion.timePosted}</span>
                        </div>
                        <div className="flex gap-4">
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            <MessageSquare className="h-3 w-3 mr-1" /> {discussion.replies} Replies
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            <TrendingUp className="h-3 w-3 mr-1" /> {discussion.likes} Likes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
