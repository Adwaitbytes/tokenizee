
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "react-router-dom";

const Writers = () => {
  const { isConnected } = useWallet();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Writers</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Join the NewsWeave platform as a writer and have your content permanently stored on the
              Arweave blockchain. Get rewarded for quality journalism and build an audience that truly
              values your work.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Benefits for Writers</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Direct monetization through reader tips and subscriptions</li>
              <li>Permanent storage of your content on the permaweb</li>
              <li>Community feedback and engagement</li>
              <li>Full ownership of your content and intellectual property</li>
              <li>Access to AI-assisted writing and editing tools</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">How to Get Started</h2>
            <p className="mb-4">
              Connect your Arweave wallet, complete your writer profile, and start publishing
              your first article through our Creator page. Our editorial team will review your
              initial submissions before granting full publishing access.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              {isConnected ? (
                <Button asChild className="bg-newsweave-primary">
                  <Link to="/creator">Start Writing</Link>
                </Button>
              ) : (
                <Button className="bg-newsweave-primary">Connect Wallet to Start</Button>
              )}
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Writers;
