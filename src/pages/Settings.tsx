
import React from "react";
import Layout from "@/components/layout/Layout";
import { Settings as SettingsIcon, UserCircle, Bell, Shield, Moon, Sun, Globe, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/contexts/WalletContext";

const Settings = () => {
  const { address, isConnected, connect } = useWallet();
  const [theme, setTheme] = React.useState("light");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:max-w-[600px]">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Account Settings</h2>
              <p className="text-gray-500 mb-6">
                Manage your account information and preferences
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    className="w-full p-2 border rounded h-24"
                  />
                </div>
                
                <div className="pt-4">
                  <Button className="bg-newsweave-primary hover:bg-newsweave-secondary text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Notification Preferences</h2>
              <p className="text-gray-500 mb-6">
                Choose what notifications you receive
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New comments</h3>
                    <p className="text-sm text-gray-500">Notifications for new comments on your posts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Likes and bookmarks</h3>
                    <p className="text-sm text-gray-500">When someone likes or bookmarks your content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Direct messages</h3>
                    <p className="text-sm text-gray-500">When you receive a new message</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Token rewards</h3>
                    <p className="text-sm text-gray-500">Updates about your token rewards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Appearance Settings</h2>
              <p className="text-gray-500 mb-6">
                Customize how Tokenizee looks for you
              </p>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Theme</h3>
                  <div className="flex gap-4">
                    <Button 
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className={theme === "light" ? "bg-newsweave-primary text-white" : ""}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className={theme === "dark" ? "bg-newsweave-primary text-white" : ""}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className={theme === "system" ? "bg-newsweave-primary text-white" : ""}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Content Density</h3>
                  <div className="flex gap-4">
                    <Button variant="outline">Compact</Button>
                    <Button className="bg-newsweave-primary text-white">Default</Button>
                    <Button variant="outline">Comfortable</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallet">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Wallet Settings</h2>
              <p className="text-gray-500 mb-6">
                Manage your blockchain wallet connection
              </p>
              
              {isConnected ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Connected Wallet</h3>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded overflow-auto">
                      {address}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Transaction Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Auto-confirmation</h4>
                          <p className="text-xs text-gray-500">Automatically confirm low-value transactions</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No wallet connected</h3>
                  <p className="text-gray-500 mb-6">
                    Connect your Arweave wallet to access all features
                  </p>
                  <Button 
                    onClick={connect} 
                    className="bg-newsweave-primary hover:bg-newsweave-secondary text-white"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
