
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Archive, Award, Twitter } from "lucide-react";
import { storeOnArweave } from "@/lib/arweave";
import { useWallet } from "@/contexts/WalletContext";
import { useArticleStore, Article } from "@/stores/articleStore";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

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
  const { toast } = useToast();
  const { address, isConnected, connect } = useWallet();
  const { addArticle, getUserArticles } = useArticleStore();
  const navigate = useNavigate();
  
  const userArticles = getUserArticles(address);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update word count for summary field
    if (name === "summary") {
      const words = value.trim().split(/\s+/).length;
      setWordCount(value.trim() === "" ? 0 : words);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      // Save to our local store
      const newArticle: Article = {
        id: crypto.randomUUID(),
        ...formData,
        timestamp: new Date().toISOString(),
        author: address || '',
        txId: result.txId
      };
      
      addArticle(newArticle);
      
      toast({
        title: "Article successfully published!",
        description: `Your article has been stored on Arweave with transaction ID: ${result.txId}`,
        variant: "default",
      });
      
      // Share on Twitter if selected
      if (shareOnTwitter) {
        const twitterText = encodeURIComponent(`I just published "${formData.title}" on NewsWeave!\n\nRead it here: ${window.location.origin}/news/${newArticle.id}`);
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-2">Creator Studio</h1>
          <p className="text-newsweave-muted mb-6">Create, publish, and manage your content on the permaweb</p>
          
          <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create Content
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Your Content
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Rewards
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="bg-white p-6 border rounded-lg">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Article Title</Label>
                      <Input 
                        id="title" 
                        name="title"
                        placeholder="Enter a concise, attention-grabbing title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="summary">Summary (60 words max)</Label>
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
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Full Content</Label>
                      <Textarea 
                        id="content" 
                        name="content"
                        placeholder="Write or paste the full content of your article" 
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        className="mt-1 min-h-[200px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sourceUrl">Source URL</Label>
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
                      <Label htmlFor="category">Category</Label>
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
                    
                    <div>
                      <Label htmlFor="imageUrl">Featured Image URL</Label>
                      <Input 
                        id="imageUrl" 
                        name="imageUrl"
                        placeholder="URL for the featured image" 
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <p className="text-xs text-newsweave-muted mt-1">
                        Provide a URL to an image that represents your content
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
                        className="flex items-center gap-2"
                        disabled={isSubmitting || wordCount > 60}
                      >
                        <Upload className="h-4 w-4" />
                        {isSubmitting ? "Publishing..." : "Publish on Arweave"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <div className="bg-white p-6 border rounded-lg">
                {userArticles.length === 0 ? (
                  <div className="text-center">
                    <Archive className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                    <h3 className="text-lg font-medium mb-1">No content published yet</h3>
                    <p className="text-newsweave-muted mb-4">
                      Your published articles will appear here. Start creating to see your content.
                    </p>
                    <Button onClick={() => setActiveTab("create")}>Create New Article</Button>
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
                                onClick={() => navigateToArticle(article.id)}
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
            
            <TabsContent value="rewards">
              <div className="bg-white p-6 border rounded-lg">
                <div className="text-center mb-6">
                  <Award className="h-12 w-12 mx-auto text-newsweave-primary mb-3" />
                  <h3 className="text-lg font-medium mb-1">Creator Rewards</h3>
                  <p className="text-newsweave-muted">
                    Earn rewards for creating high-quality, verified content
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-newsweave-primary mb-1">{userArticles.length}</p>
                    <p className="text-sm text-newsweave-muted">Articles Published</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-newsweave-primary mb-1">0</p>
                    <p className="text-sm text-newsweave-muted">Total Engagement</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-newsweave-primary mb-1">0 AR</p>
                    <p className="text-sm text-newsweave-muted">Rewards Earned</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">How Rewards Work</h4>
                  <ul className="text-sm text-newsweave-muted space-y-2">
                    <li>• Earn tokens when readers engage with your content</li>
                    <li>• Receive additional rewards for verified, high-quality sources</li>
                    <li>• Build reputation through consistent quality contributions</li>
                    <li>• Exchange rewards for $AR or use within the NewsWeave ecosystem</li>
                  </ul>
                </div>
                
                {isConnected ? (
                  <Button className="w-full">View Rewards Dashboard</Button>
                ) : (
                  <Button className="w-full" onClick={connect}>Connect Arweave Wallet to Claim Rewards</Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Creator;
