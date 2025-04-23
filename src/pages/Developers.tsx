
import Layout from "@/components/layout/Layout";

const Developers = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Developers</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Join our developer community and help build the future of decentralized news on Arweave.
              We offer comprehensive APIs, SDKs, and developer tools to integrate with the NewsWeave platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Developer Resources</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>API Documentation</li>
              <li>Arweave Integration Guides</li>
              <li>Smart Contract Examples</li>
              <li>Community Support</li>
            </ul>
            <p className="mb-4">
              Our developer program provides grants and technical support for those building
              innovative applications on top of NewsWeave's decentralized infrastructure.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Developers;
