
import Layout from "@/components/layout/Layout";

const Cookies = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-4">Cookie Policy</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Last updated: April 23, 2025
            </p>
            <p className="mb-4">
              This Cookie Policy explains how NewsWeave uses cookies and similar technologies 
              to provide, customize, and improve your experience on our platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">What are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information 
              to the website owners.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">How We Use Cookies</h2>
            <p className="mb-4">
              NewsWeave uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential cookies:</strong> Required for the operation of our platform</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use our platform</li>
              <li><strong>Authentication cookies:</strong> Recognize you when you return to our platform</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-3">Local Storage</h2>
            <p className="mb-4">
              In addition to cookies, we use local storage to maintain your wallet connection state 
              and user preferences. This data is stored directly in your browser and is not transmitted 
              to our servers.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to manage your cookie preferences. You can set your browser 
              to refuse cookies, or to alert you when cookies are being sent. Please note that disabling 
              cookies may affect the functionality of our platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Changes to this Policy</h2>
            <p className="mb-4">
              We may update our Cookie Policy from time to time. We will notify users of significant changes 
              by posting a notice on our platform.
            </p>
            <h2 className="text-xl font-bold mt-6 mb-3">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Cookie Policy, please contact us at privacy@newsweave.example.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
