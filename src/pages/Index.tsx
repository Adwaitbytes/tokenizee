
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { NewsFeed } from "@/components/news/NewsFeed";
import { Button } from "@/components/ui/button";
import { fetchNewsArticles } from "@/data/mockNewsData";
import { NewsItemProps } from "@/components/news/NewsCard";

const Index = () => {
  const [articles, setArticles] = useState<NewsItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      const data = await fetchNewsArticles();
      setArticles(data);
      setIsLoading(false);
    };

    loadArticles();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Discover trusted, bite-sized news from the permaweb
            </h1>
            <p className="text-lg mb-8 opacity-90">
              NewsWeave delivers AI-curated, verified, and permanently stored content on Arweave - owned by the community, not corporations.
            </p>
            <Button className="bg-white text-newsweave-primary hover:bg-white/90">
              Connect Wallet
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-slate-50">
              <div className="w-12 h-12 bg-newsweave-accent/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-newsweave-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Bite-sized Content</h3>
              <p className="text-newsweave-muted">
                Get the essential information in 60-word summaries, saving time while staying informed on topics that matter.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-slate-50">
              <div className="w-12 h-12 bg-newsweave-accent/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-newsweave-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Verified Sources</h3>
              <p className="text-newsweave-muted">
                Every summary links to original sources with cryptographic verification ensuring content authenticity.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-slate-50">
              <div className="w-12 h-12 bg-newsweave-accent/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-newsweave-primary">
                  <path d="m2 18 8-8 4 4 8-8" />
                  <path d="M18 2h4v4" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Learn Deeper</h3>
              <p className="text-newsweave-muted">
                Save topics you care about and let our AI explain complex subjects in an easy-to-digest format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Feed Section */}
      <section className="py-12 bg-newsweave-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center">
            Today's Highlights
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white animate-pulse">
                  <div className="h-40 bg-slate-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NewsFeed articles={articles} />
          )}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Join the NewsWeave Community</h2>
          <p className="text-newsweave-muted max-w-2xl mx-auto mb-8">
            Become part of our decentralized news ecosystem as a reader, writer, curator, or developer. 
            Help shape the future of trustworthy, permanent news.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-newsweave-primary text-newsweave-primary">
              Learn More
            </Button>
            <Button className="bg-newsweave-primary hover:bg-newsweave-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
