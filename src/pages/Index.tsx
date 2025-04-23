
import Layout from "@/components/layout/Layout";
import { NewsFeed } from "@/components/news/NewsFeed";
import { TwitterFeed } from "@/components/news/TwitterFeed";
import { mockArticles } from "@/data/mockNewsData";
import { useArticleStore } from "@/stores/articleStore";

const Index = () => {
  const { articles } = useArticleStore();
  
  // Combine mock articles with user-created articles
  const allArticles = [...articles, ...mockArticles];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-2">NewsWeave</h1>
        <p className="text-newsweave-muted mb-8">Decentralized news summaries stored on the permaweb</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsFeed articles={allArticles} />
          </div>
          
          <div className="space-y-8">
            <TwitterFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
