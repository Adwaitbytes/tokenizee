
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">About NewsWeave</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              NewsWeave is a decentralized news discovery platform built for the Web3 era,
              powered by Arweave and AO. We deliver AI-curated, bite-sized content summaries
              while ensuring permanent storage and verifiable sources.
            </p>
            <p className="mb-4">
              Our mission is to make quality news accessible, verifiable, and permanently
              stored on the blockchain. We believe in the power of decentralized journalism
              and community curation.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
