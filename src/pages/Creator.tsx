import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Archive, Award, Twitter, ImageIcon, WalletIcon, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { storeOnArweave } from "@/lib/arweave";
import { useWallet } from "@/contexts/WalletContext";
import { useArticleStore, Article } from "@/stores/articleStore";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { NewsCard } from "@/components/news/NewsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  "Technology", "Business", "Web3", "Science", "Politics", 
  "Health", "Environment", "Culture", "Sports", "Education"
];

interface ArticleFormData {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  category: string;
  imageUrl: string;
}

const initialFormData: ArticleFormData = {
  title: "",
  summary: "",
  content: "",
  sourceUrl: "",
  category: "",
  imageUrl: ""
};

const Creator = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [shareOnTwitter, setShareOnTwitter] = useState(false);
  const [isValidImageUrl, setIsValidImageUrl] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { toast } = useToast();
  const { address, isConnected, connect } = useWallet();
  const { addArticle, getUserArticles, removeArticle } = useArticleStore();
  const navigate = useNavigate();
  
  const userArticles = getUserArticles(address);
  
  // Add effect to check wallet connection on mount
  useEffect(() => {
    if (!isConnected && activeTab === "create") {
      toast({
        title: "Wallet Required",
        description: "You need to connect your wallet to create content",
        variant: "destructive",
      });
    }
  }, [isConnected, activeTab, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update word count for summary field
    if (name === "summary") {
      const words = value.trim().split(/\s+/).length;
      setWordCount(value.trim() === "" ? 0 : words);
    }

    // Validate image URL when it changes
    if (name === "imageUrl" && value) {
      setIsImageLoading(true);
      validateImageUrl(value).then(isValid => {
        setIsValidImageUrl(isValid);
        setIsImageLoading(false);
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateImageUrl = (url: string): Promise<boolean> => {
    if (!url) return Promise.resolve(true);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Arweave wallet to publish content",
        variant: "destructive",
      });
      try {
        await connect();
      } catch (error) {
        return;
      }
      return;
    }

    // Validate image URL before submitting
    if (formData.imageUrl) {
      setIsImageLoading(true);
      const isValid = await validateImageUrl(formData.imageUrl);
      setIsImageLoading(false);
      
      if (!isValid) {
        setIsValidImageUrl(false);
        toast({
          title: "Invalid image URL",
          description: "The image URL you provided cannot be loaded. Please check the URL and try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Add timestamp and format for Arweave storage
      const contentToStore = {
        ...formData,
        timestamp: new Date().toISOString(),
        type: "article",
        author: address
      };
      
      // Store content on Arweave
      const result = await storeOnArweave(contentToStore);
      
      // Generate a unique ID for the article
      const articleId = crypto.randomUUID();

      // Save to our local store with the required properties
      const newArticle: Article = {
        id: articleId,
        ...formData,
        author: address || '',
        txId: result.txId,
        timestamp: result.timestamp, // Using the timestamp from the result
        source: "NewsWeave",
        verified: false,
        hash: result.txId.slice(0, 16)
      };
      
      addArticle(newArticle);
      
      toast({
        title: "Article successfully published!",
        description: `Your article has been stored on Arweave with transaction ID: ${result.txId}`,
        variant: "default",
      });
      
      // Share on Twitter if selected
      if (shareOnTwitter) {
        const articleUrl = `${window.location.origin}/news/${articleId}`;
        const twitterText = encodeURIComponent(`I just published "${formData.title}" on NewsWeave!\n\nRead it here: ${articleUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank');
      }
      
      // Reset form
      setFormData(initialFormData);
      setWordCount(0);
      setShareOnTwitter(false);
      // Switch to the manage tab to show the newly published article
      setActiveTab("manage");
    } catch (error) {
      toast({
        title: "Failed to publish article",
        description: "There was an error storing your content on Arweave. Please try again.",
        variant: "destructive",
      });
      console.error("Error storing content on Arweave:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToArticle = (id: string) => {
    navigate(`/news/${id}`);
  };
  
  return (
    <Layout>
      <div 
        className="bg-gradient-to-br from-newsweave-primary/10 via-newsweave-accent/5 to-transparent min-h-screen pt-8"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2 text-newsweave-primary">Creator Studio</h1>
                <p className="text-newsweave-muted">Create, publish, and manage your content on the permaweb</p>
              </div>
              {!isConnected && (
                <Button 
                  onClick={connect} 
                  className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white hover:opacity-90 flex items-center gap-2"
                >
                  <WalletIcon className="h-4 w-4" /> Connect Wallet
                </Button>
              )}
            </div>
            
            <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
                <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-newsweave-primary data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  Create Content
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-newsweave-primary data-[state=active]:text-white">
                  <Archive className="h-4 w-4" />
                  Your Content
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex items-center gap-2 data-[state=active]:bg-newsweave-primary data-[state=active]:text-white">
                  <Award className="h-4 w-4" />
                  Rewards
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                {!isConnected ? (
                  <Card className="bg-white p-8 border rounded-lg shadow-sm text-center">
                    <div className="flex flex-col items-center max-w-md mx-auto">
                      <WalletIcon className="h-16 w-16 text-newsweave-muted mb-4" />
                      <h3 className="text-2xl font-medium mb-2">Connect Your Wallet</h3>
                      <p className="text-newsweave-muted mb-6">
                        You need to connect your Arweave wallet to create and publish content on NewsWeave.
                      </p>
                      <Button 
                        onClick={connect} 
                        className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white hover:opacity-90 px-6"
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="bg-white p-6 border rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-base">Article Title</Label>
                          <Input 
                            id="title" 
                            name="title"
                            placeholder="Enter a concise, attention-grabbing title" 
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="mt-1 text-base"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="summary" className="text-base">Summary (60 words max)</Label>
                            <span className={`text-xs ${wordCount > 60 ? "text-red-500 font-bold" : "text-newsweave-muted"}`}>
                              {wordCount}/60 words
                            </span>
                          </div>
                          <Textarea 
                            id="summary" 
                            name="summary"
                            placeholder="Write a bite-sized summary of your article (max 60 words)" 
                            value={formData.summary}
                            onChange={handleInputChange}
                            required
                            className="mt-1 min-h-[100px] text-base"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="content" className="text-base">Full Content</Label>
                          <Textarea 
                            id="content" 
                            name="content"
                            placeholder="Write or paste the full content of your article" 
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            className="mt-1 min-h-[200px] text-base"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="sourceUrl" className="flex items-center text-base">
                              <LinkIcon className="h-4 w-4 mr-2 text-newsweave-primary" />
                              Source URL
                            </Label>
                            <Input 
                              id="sourceUrl" 
                              name="sourceUrl"
                              type="url"
                              placeholder="Original source URL (if applicable)" 
                              value={formData.sourceUrl}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="category" className="text-base">Category</Label>
                            <select 
                              id="category" 
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                            >
                              <option value="">Select a category</option>
                              {CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="imageUrl" className="flex items-center text-base">
                            <ImageIcon className="h-4 w-4 mr-2 text-newsweave-primary" />
                            Featured Image URL
                          </Label>
                          <Input 
                            id="imageUrl" 
                            name="imageUrl"
                            placeholder="URL for the featured image" 
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className={`mt-1 ${!isValidImageUrl ? 'border-red-500' : ''}`}
                          />
                          {isImageLoading && (
                            <p className="text-xs text-amber-500 mt-1 flex items-center">
                              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse mr-2"></span>
                              Validating image URL...
                            </p>
                          )}
                          {!isValidImageUrl && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" /> 
                              Unable to load this image. Please check the URL and try again.
                            </p>
                          )}
                          <p className="text-xs text-newsweave-muted mt-1">
                            Provide a URL to an image that represents your content (e.g., https://example.com/image.jpg)
                          </p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-lg flex items-center">
                          <Archive className="h-5 w-5 text-newsweave-primary mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Permanent Storage on Arweave</p>
                            <p className="text-xs text-newsweave-muted">
                              Your content will be permanently stored on the Arweave permaweb, making it censorship-resistant and available forever
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="twitter-share" 
                            checked={shareOnTwitter} 
                            onCheckedChange={setShareOnTwitter} 
                          />
                          <Label htmlFor="twitter-share" className="flex items-center">
                            <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" /> 
                            Also share on Twitter when published
                          </Label>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="flex items-center gap-2 bg-gradient-to-r from-newsweave-primary to-newsweave-secondary hover:opacity-90 text-white px-6 py-2"
                            disabled={isSubmitting || wordCount > 60 || (formData.imageUrl !== "" && !isValidImageUrl)}
                          >
                            <Upload className="h-4 w-4" />
                            {isSubmitting ? "Publishing..." : "Publish on Arweave"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="manage">
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  {!isConnected ? (
                    <div className="text-center py-10">
                      <WalletIcon className="h-16 w-16 mx-auto text-newsweave-muted mb-3" />
                      <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                      <p className="text-newsweave-muted mb-4">
                        Connect your wallet to view and manage your published content.
                      </p>
                      <Button onClick={connect} className="bg-newsweave-primary hover:bg-newsweave-secondary">
                        Connect Wallet
                      </Button>
                    </div>
                  ) : userArticles.length === 0 ? (
                    <div className="text-center py-10">
                      <Archive className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                      <h3 className="text-lg font-medium mb-1">No content published yet</h3>
                      <p className="text-newsweave-muted mb-4">
                        Your published articles will appear here. Start creating to see your content.
                      </p>
                      <Button onClick={() => setActiveTab("create")} className="bg-newsweave-primary hover:bg-newsweave-secondary">
                        Create New Article
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Your Published Articles</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-newsweave-primary text-newsweave-primary"
                          onClick={() => setActiveTab("create")}
                        >
                          + New Article
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {userArticles.map((article) => (
                          <NewsCard 
                            key={article.id} 
                            item={article} 
                            showDeleteOption={true} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rewards">
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <div className="text-center mb-6">
                    <Award className="h-12 w-12 mx-auto text-newsweave-primary mb-3" />
                    <h3 className="text-lg font-medium mb-1">Creator Rewards</h3>
                    <p className="text-newsweave-muted">
                      Earn rewards for creating high-quality, verified content
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4 text-center shadow-sm bg-gradient-to-b from-white to-slate-50">
                      <p className="text-3xl font-bold text-newsweave-primary mb-1">{userArticles.length}</p>
                      <p className="text-sm text-newsweave-muted">Articles Published</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center shadow-sm bg-gradient-to-b from-white to-slate-50">
                      <p className="text-3xl font-bold text-newsweave-primary mb-1">0</p>
                      <p className="text-sm text-newsweave-muted">Total Engagement</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center shadow-sm bg-gradient-to-b from-white to-slate-50">
                      <p className="text-3xl font-bold text-newsweave-primary mb-1">0 AR</p>
                      <p className="text-sm text-newsweave-muted">Rewards Earned</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium mb-2">How Rewards Work</h4>
                    <ul className="text-sm text-newsweave-muted space-y-2">
                      <li className="flex items-start">
                        <span className="text-newsweave-primary mr-2">•</span>
                        Earn tokens when readers engage with your content
                      </li>
                      <li className="flex items-start">
                        <span className="text-newsweave-primary mr-2">•</span>
                        Receive additional rewards for verified, high-quality sources
                      </li>
                      <li className="flex items-start">
                        <span className="text-newsweave-primary mr-2">•</span>
                        Build reputation through consistent quality contributions
                      </li>
                      <li className="flex items-start">
                        <span className="text-newsweave-primary mr-2">•</span>
                        Exchange rewards for $AR or use within the NewsWeave ecosystem
                      </li>
                    </ul>
                  </div>
                  
                  {isConnected ? (
                    <Button className="w-full bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white hover:opacity-90">View Rewards Dashboard</Button>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white hover:opacity-90" onClick={connect}>
                      Connect Arweave Wallet to Claim Rewards
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Creator;
