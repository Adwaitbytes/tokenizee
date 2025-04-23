
import Layout from "@/components/layout/Layout";

const HowItWorks = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">How NewsWeave Works</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              NewsWeave uses advanced AI to summarize news articles into concise,
              60-word summaries while preserving the essential information. All content
              is stored permanently on the Arweave blockchain.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Key Features</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>AI-powered summarization</li>
              <li>Permanent storage on Arweave</li>
              <li>Source verification</li>
              <li>Community curation</li>
              <li>Decentralized governance</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
