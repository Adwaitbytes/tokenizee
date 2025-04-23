
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";

const Curators = () => {
  const { isConnected } = useWallet();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Content Curators</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Content curators play a vital role in ensuring the quality and relevance of news 
              on the NewsWeave platform. As a curator, you'll help verify sources, rate content 
              quality, and highlight the most important stories for the community.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Curator Responsibilities</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Verify sources and fact-check articles</li>
              <li>Rate content based on journalistic standards</li>
              <li>Identify trending and important stories</li>
              <li>Flag misinformation or low-quality content</li>
              <li>Create and maintain topic collections</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">Rewards for Curators</h2>
            <p className="mb-4">
              Curators earn tokens based on the performance and quality of their curation work.
              The more valuable your contributions are to the community, the higher your rewards.
              Top curators may also receive governance rights in the NewsWeave DAO.
            </p>
            
            <div className="mt-6">
              {isConnected ? (
                <Button className="bg-newsweave-primary">Apply to be a Curator</Button>
              ) : (
                <Button className="bg-newsweave-primary">Connect Wallet to Apply</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Curators;
