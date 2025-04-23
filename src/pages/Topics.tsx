import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface TopicProps {
  id: string;
  name: string;
  description: string;
  followers: number;
  imageUrl: string;
}

const TOPICS: TopicProps[] = [
  {
    id: "technology",
    name: "Technology",
    description: "Latest news in tech, AI, and digital transformation",
    followers: 25430,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "business",
    name: "Business & Finance",
    description: "Market trends, economy insights, and business news",
    followers: 18745,
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "web3",
    name: "Web3 & Crypto",
    description: "Blockchain innovations, cryptocurrency updates, and decentralized applications",
    followers: 12963,
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "science",
    name: "Science & Space",
    description: "Scientific breakthroughs, space exploration, and research",
    followers: 15230,
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "politics",
    name: "Politics & Government",
    description: "Political developments, policy changes, and governance",
    followers: 9876,
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Medical research, fitness trends, and healthcare innovations",
    followers: 11543,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300"
  }
];

const Topics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const { isConnected } = useWallet();
  const { toast } = useToast();
  
  const handleCreateTopic = () => {
    if (!isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to create a topic",
        variant: "destructive"
      });
      return;
    }

    if (!newTopicName.trim() || !newTopicDescription.trim()) {
      toast({
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically interact with Arweave to store the new topic
    toast({
      title: "Topic Created",
      description: "Your topic has been created successfully"
    });

    setNewTopicName("");
    setNewTopicDescription("");
  };
  
  const filteredTopics = TOPICS.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleFollow = (topicId: string) => {
    setFollowedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };
  
  const formatNumber = (num: number): string => {
    return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif font-bold">Topics</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-newsweave-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Topic Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter topic name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter topic description"
                      value={newTopicDescription}
                      onChange={(e) => setNewTopicDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateTopic} className="w-full">
                    Create Topic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="flex border rounded-lg overflow-hidden bg-white">
                <div 
                  className="w-1/3 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${topic.imageUrl})` }}
                />
                <div className="w-2/3 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{topic.name}</h3>
                    <Button
                      variant={followedTopics.includes(topic.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFollow(topic.id)}
                      className={followedTopics.includes(topic.id) ? "bg-newsweave-primary" : ""}
                    >
                      {followedTopics.includes(topic.id) ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <p className="text-sm text-newsweave-muted my-2">{topic.description}</p>
                  <p className="text-xs text-newsweave-muted">{formatNumber(topic.followers)} followers</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-10">
              <p className="text-newsweave-muted">No topics found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Topics;
