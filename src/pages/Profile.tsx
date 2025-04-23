
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User, BookmarkIcon, BarChart3 } from "lucide-react";
import { getUserAddress } from "@/lib/arweave";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Mock user data
  const user = {
    name: "Alex Rodriguez",
    handle: "ar_reader",
    bio: "Web3 enthusiast | Blockchain developer | Creator of decentralized content",
    joined: "April 2023",
    walletAddress: getUserAddress(),
    topics: ["Technology", "Web3", "AI", "Blockchain", "Science"]
  };
  
  // Format wallet address for display
  const formatWalletAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarFallback className="text-2xl bg-newsweave-primary text-white">
                AR
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-newsweave-muted mb-2">@{user.handle}</p>
              <p className="mb-3">{user.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {user.topics.map(topic => (
                  <span 
                    key={topic} 
                    className="px-3 py-1 bg-slate-100 text-newsweave-muted text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-newsweave-muted">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Joined {user.joined}
                </span>
                <span className="mx-3">•</span>
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
                  Wallet {formatWalletAddress(user.walletAddress)}
                </span>
              </div>
            </div>
            
            <div>
              <Button variant="outline" className="mb-2">Edit Profile</Button>
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
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                  <h3 className="text-lg font-medium mb-1">No activity yet</h3>
                  <p className="text-newsweave-muted mb-4">
                    Your reading history, comments, and engagement will appear here
                  </p>
                  <Button>Discover Articles</Button>
                </div>
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
                  <Button>Browse Articles</Button>
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
                          <p className="text-xs text-newsweave-muted">{formatWalletAddress(user.walletAddress)}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newsweave-primary"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Push Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newsweave-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Display Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <span>Dark Mode</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-newsweave-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Account Actions</h4>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                      Delete Account
                    </Button>
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
