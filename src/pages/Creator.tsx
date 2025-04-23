
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Archive, Award } from "lucide-react";
import { storeOnArweave } from "@/lib/arweave";

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
  const { toast } = useToast();
  
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
    setIsSubmitting(true);
    
    try {
      // Add timestamp and format for Arweave storage
      const contentToStore = {
        ...formData,
        timestamp: new Date().toISOString(),
        type: "article"
      };
      
      // Store content on Arweave
      const result = await storeOnArweave(contentToStore);
      
      toast({
        title: "Article successfully published!",
        description: `Your article has been stored on Arweave with transaction ID: ${result.txId}`,
        variant: "default",
      });
      
      // Reset form
      setFormData(initialFormData);
      setWordCount(0);
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
              <div className="bg-white p-6 border rounded-lg text-center">
                <Archive className="h-12 w-12 mx-auto text-newsweave-muted mb-3" />
                <h3 className="text-lg font-medium mb-1">No content published yet</h3>
                <p className="text-newsweave-muted mb-4">
                  Your published articles will appear here. Start creating to see your content.
                </p>
                <Button onClick={() => setActiveTab("create")}>Create New Article</Button>
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
                    <p className="text-3xl font-bold text-newsweave-primary mb-1">0</p>
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
                
                <Button className="w-full" disabled>Connect Arweave Wallet to Claim Rewards</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Creator;
