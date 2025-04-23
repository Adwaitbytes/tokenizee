
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTopicStore, Topic } from "@/stores/topicStore";
import { Plus, Check, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Topics = () => {
  const { topics, followTopic, unfollowTopic, isFollowing, addTopic } = useTopicStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    imageUrl: ""
  });

  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFollowToggle = (topic: Topic) => {
    if (isFollowing(topic.id)) {
      unfollowTopic(topic.id);
      toast({
        title: `Unfollowed ${topic.name}`,
        description: `You will no longer see ${topic.name} content in your feed.`
      });
    } else {
      followTopic(topic.id);
      toast({
        title: `Following ${topic.name}`,
        description: `${topic.name} content will now appear in your feed.`
      });
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopic.name || !newTopic.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both a name and description for your topic.",
        variant: "destructive"
      });
      return;
    }
    
    const createdTopic = addTopic(newTopic);
    
    toast({
      title: "Topic Created",
      description: `You are now following ${createdTopic.name}.`
    });
    
    setNewTopic({
      name: "",
      description: "",
      imageUrl: ""
    });
    
    setDialogOpen(false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Topics</h1>
            <p className="text-newsweave-muted mb-4 md:mb-0">Explore and follow topics that interest you</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search topics..."
                className="pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-newsweave-primary whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" /> Create Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                  <DialogDescription>
                    Create a new topic for discussions and content on NewsWeave.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTopic}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="topic-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="topic-name"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({...newTopic, name: e.target.value})}
                        placeholder="E.g., Artificial Intelligence"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="topic-description" className="text-right align-top pt-2">
                        Description
                      </Label>
                      <Textarea
                        id="topic-description"
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                        placeholder="Describe what this topic covers..."
                        className="col-span-3 resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="topic-image" className="text-right">
                        Image URL
                      </Label>
                      <Input
                        id="topic-image"
                        value={newTopic.imageUrl}
                        onChange={(e) => setNewTopic({...newTopic, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg (optional)"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Topic</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div 
                key={topic.id}
                className="border rounded-lg overflow-hidden bg-white transition-shadow duration-200 hover:shadow-md"
              >
                <div 
                  className="h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: topic.imageUrl 
                      ? `url(${topic.imageUrl})` 
                      : 'url(/placeholder.svg)'
                  }}
                ></div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
                  <p className="text-newsweave-muted text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-newsweave-muted">
                      <Users className="h-4 w-4 mr-1" /> 
                      <span>{topic.followersCount} followers</span> 
                      <span className="mx-2">•</span>
                      <span>{topic.postsCount} posts</span>
                    </div>
                    <Button 
                      variant={isFollowing(topic.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFollowToggle(topic)}
                      className={isFollowing(topic.id) ? "bg-newsweave-primary" : ""}
                    >
                      {isFollowing(topic.id) ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Following
                        </>
                      ) : (
                        "Follow"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-newsweave-muted mb-4">No topics match your search.</p>
              <Button onClick={() => setSearchTerm("")}>Show all topics</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Topics;
