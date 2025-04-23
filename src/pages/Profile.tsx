
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Settings, User, BookmarkIcon, BarChart3, 
  Twitter, Edit, X, Pencil, Link
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useArticleStore } from "@/stores/articleStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { address, isConnected, connect, disconnect } = useWallet();
  const { getUserArticles } = useArticleStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const userArticles = getUserArticles(address);
  
  // Profile edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Rodriguez",
    handle: "ar_reader",
    bio: "Web3 enthusiast | Blockchain developer | Creator of decentralized content",
    topics: ["Technology", "Web3", "AI", "Blockchain", "Science"]
  });
  const [newTopicInput, setNewTopicInput] = useState("");

  // Twitter connection state
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [twitterDialogOpen, setTwitterDialogOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  
  // Format wallet address for display
  const formatWalletAddress = (address: string | null): string => {
    if (!address) return "Not connected";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
    setEditDialogOpen(false);
  };

  const handleAddTopic = () => {
    if (newTopicInput.trim() && !profileData.topics.includes(newTopicInput.trim())) {
      setProfileData({
        ...profileData,
        topics: [...profileData.topics, newTopicInput.trim()]
      });
      setNewTopicInput("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setProfileData({
      ...profileData,
      topics: profileData.topics.filter(topic => topic !== topicToRemove)
    });
  };

  const handleTwitterConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (twitterHandle.trim()) {
      setTwitterConnected(true);
      setTwitterDialogOpen(false);
      toast({
        title: "Twitter Connected",
        description: `Your Twitter handle @${twitterHandle} has been connected.`
      });
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Light Mode Activated" : "Dark Mode Activated",
      description: `Theme preference has been updated.`
    });
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationText.toLowerCase() === "delete my account") {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        variant: "destructive"
      });
      setDeleteDialogOpen(false);
      disconnect();
      navigate("/");
    } else {
      toast({
        title: "Confirmation Failed",
        description: "Please type 'delete my account' to confirm.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarFallback className="text-2xl bg-newsweave-primary text-white">
                {profileData.name.split(" ").map(name => name[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
              <p className="text-newsweave-muted mb-2">@{profileData.handle}</p>
              <p className="mb-3">{profileData.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {profileData.topics.map(topic => (
                  <span 
                    key={topic} 
                    className="px-3 py-1 bg-slate-100 text-newsweave-muted text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap items-center text-sm text-newsweave-muted gap-2">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Joined April 2023
                </span>
                <span className="mx-1 hidden md:inline">•</span>
                <span className="flex items-center">
                  <svg 
                    className="h-4 w-4 mr-1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                    <line x1="16" y1="8" x2="2" y2="22" />
                    <line x1="17.5" y1="15" x2="9" y2="15" />
                  </svg>
                  Wallet {isConnected ? formatWalletAddress(address) : "Not connected"}
                </span>
                {twitterConnected && (
                  <>
                    <span className="mx-1 hidden md:inline">•</span>
                    <span className="flex items-center">
                      <Twitter className="h-4 w-4 mr-1 text-[#1DA1F2]" />
                      @{twitterHandle}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mb-2 w-full">
                    <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile information.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="handle" className="text-right">
                          Handle
                        </Label>
                        <Input
                          id="handle"
                          value={profileData.handle}
                          onChange={(e) => setProfileData({...profileData, handle: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio" className="text-right">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="topics" className="text-right pt-2">
                          Topics
                        </Label>
                        <div className="col-span-3">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {profileData.topics.map(topic => (
                              <div key={topic} className="px-2 py-1 bg-slate-100 rounded-full flex items-center text-sm">
                                {topic}
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveTopic(topic)}
                                  className="ml-1 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              id="newTopic"
                              value={newTopicInput}
                              placeholder="Add a topic"
                              onChange={(e) => setNewTopicInput(e.target.value)}
                              className="flex-grow"
                            />
                            <Button type="button" onClick={handleAddTopic}>Add</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              {!isConnected && (
                <Button className="w-full" onClick={connect}>
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <BookmarkIcon className="h-4 w-4" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="bg-white border rounded-lg p-6">
                {userArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                    <h3 className="text-lg font-medium mb-1">No activity yet</h3>
                    <p className="text-newsweave-muted mb-4">
                      Your reading history, comments, and engagement will appear here
                    </p>
                    <Button onClick={() => navigate("/discover")}>Discover Articles</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Your Published Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userArticles.map((article) => (
                        <div key={article.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="h-40 bg-cover bg-center" 
                            style={{
                              backgroundImage: article.imageUrl 
                                ? `url(${article.imageUrl})` 
                                : 'url(/placeholder.svg)'
                            }}
                          ></div>
                          <div className="p-4">
                            <div className="text-xs text-newsweave-muted mb-2">
                              {new Date(article.timestamp).toLocaleDateString()}
                            </div>
                            <h4 className="text-lg font-medium mb-2">{article.title}</h4>
                            <p className="text-sm text-newsweave-muted mb-4 line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/news/${article.id}`)}
                              >
                                View Article
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="bookmarks">
              <div className="bg-white border rounded-lg p-6">
                <div className="text-center py-8">
                  <BookmarkIcon className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                  <h3 className="text-lg font-medium mb-1">No bookmarks yet</h3>
                  <p className="text-newsweave-muted mb-4">
                    Articles you bookmark will be stored on Arweave and appear here
                  </p>
                  <Button onClick={() => navigate("/discover")}>Browse Articles</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Connected Wallet</h4>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-full flex items-center justify-center mr-3">
                          <svg 
                            className="h-4 w-4 text-white" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                            <line x1="16" y1="8" x2="2" y2="22" />
                            <line x1="17.5" y1="15" x2="9" y2="15" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Arweave Wallet</p>
                          <p className="text-xs text-newsweave-muted">{isConnected ? formatWalletAddress(address) : "Not connected"}</p>
                        </div>
                      </div>
                      {isConnected ? (
                        <Button variant="outline" size="sm" onClick={disconnect}>Disconnect</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={connect}>Connect</Button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Social Media Connections</h4>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center mr-3">
                          <Twitter className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-xs text-newsweave-muted">
                            {twitterConnected 
                              ? `Connected as @${twitterHandle}` 
                              : "Connect to share your articles"}
                          </p>
                        </div>
                      </div>
                      <Dialog open={twitterDialogOpen} onOpenChange={setTwitterDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {twitterConnected ? "Change" : "Connect"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Connect Twitter</DialogTitle>
                            <DialogDescription>
                              Link your Twitter account to share your articles automatically.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleTwitterConnection}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="twitterHandle" className="text-right">
                                  Username
                                </Label>
                                <div className="col-span-3 flex">
                                  <span className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">@</span>
                                  <Input
                                    id="twitterHandle"
                                    value={twitterHandle}
                                    onChange={(e) => setTwitterHandle(e.target.value)}
                                    className="rounded-l-none"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Connect Twitter</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Email Notifications</span>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Push Notifications</span>
                        <Switch id="push-notifications" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Display Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Dark Mode</span>
                        <Switch 
                          id="dark-mode" 
                          checked={darkMode} 
                          onCheckedChange={handleDarkModeToggle}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Account Actions</h4>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-red-500">Delete Account</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteAccount}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 items-center gap-2">
                              <Label htmlFor="confirmation" className="font-semibold">
                                Please type "delete my account" to confirm
                              </Label>
                              <Input
                                id="confirmation"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                className="col-span-1"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setDeleteDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              variant="destructive"
                              disabled={confirmationText.toLowerCase() !== "delete my account"}
                            >
                              Delete Account
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
