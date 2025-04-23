
import Layout from "@/components/layout/Layout";

const DAO = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">NewsWeave DAO</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              The NewsWeave DAO (Decentralized Autonomous Organization) governs the platform's
              development, content policies, and treasury management. Token holders can participate
              in key decisions that shape the future of decentralized news.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Governance Model</h2>
            <p className="mb-4">
              Our governance model empowers community members to propose and vote on changes
              to the platform, ensuring that NewsWeave remains transparent, accountable, and
              aligned with the interests of its users.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">DAO Treasury</h2>
            <p className="mb-4">
              The DAO treasury funds platform development, content creation grants, and community
              initiatives. Revenue generated from the platform is distributed according to token
              holder decisions.
            </p>
            <p className="mb-4">
              To participate in governance, connect your Arweave wallet and stake NewsWeave tokens.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DAO;
