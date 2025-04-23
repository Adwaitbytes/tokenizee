
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Terms of Service</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Last updated: April 23, 2025
            </p>
            <p className="mb-4">
              Welcome to NewsWeave. By using our platform, you agree to these Terms of Service. Please read them carefully.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using NewsWeave, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, please do not use our platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">2. Platform Description</h2>
            <p className="mb-4">
              NewsWeave is a decentralized news platform built on the Arweave blockchain. We provide 
              AI-curated, bite-sized news summaries with permanent storage and source verification.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">3. User Responsibilities</h2>
            <p className="mb-4">
              When using NewsWeave, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate information</li>
              <li>Not engage in any illegal or harmful activities</li>
              <li>Respect intellectual property rights</li>
              <li>Follow community guidelines</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">4. Content on NewsWeave</h2>
            <p className="mb-4">
              Content published on NewsWeave is permanently stored on the Arweave blockchain. You retain 
              ownership of your content but grant NewsWeave a license to display and distribute it on our platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">5. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time. We will notify users of significant changes. 
              Continued use of NewsWeave after changes constitutes acceptance of the new Terms.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Terms of Service, please contact us at terms@newsweave.example.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
