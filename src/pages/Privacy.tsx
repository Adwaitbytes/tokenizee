
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Last updated: April 23, 2025
            </p>
            <p className="mb-4">
              At NewsWeave, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              and protect your personal information when you use our decentralized news platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Information We Collect</h2>
            <p className="mb-4">
              As a blockchain-based platform, NewsWeave collects minimal personal information. The data we collect includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your public wallet address when you connect to the platform</li>
              <li>Content you create or interact with on the platform</li>
              <li>Your reading preferences and topic interests</li>
              <li>Technical information necessary for the operation of the service</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">How We Use Your Information</h2>
            <p className="mb-4">
              We use your information to provide, improve, and personalize the NewsWeave platform, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Enabling you to access and use the platform</li>
              <li>Providing personalized news recommendations</li>
              <li>Processing transactions and distributing rewards</li>
              <li>Improving our services and user experience</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">Data on the Blockchain</h2>
            <p className="mb-4">
              Please be aware that information stored on the Arweave blockchain is permanent and immutable. 
              This includes content you publish, comments you make, and certain interactions with the platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Privacy Policy, please contact us at privacy@newsweave.example.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
