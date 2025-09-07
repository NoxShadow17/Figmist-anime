import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-5">Legal Information</h1>

          {/* Terms of Service */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Terms of Service</h3>
            </div>
            <div className="card-body">
              <h5>1. Acceptance of Terms</h5>
              <p>By accessing and using Figmist, you accept and agree to be bound by the terms and provision of this agreement.</p>

              <h5>2. Use License</h5>
              <p>Permission is granted to temporarily access the materials (information or software) on Figmist's website for personal, non-commercial transitory viewing only.</p>

              <h5>3. Product Information</h5>
              <p>We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.</p>

              <h5>4. Pricing</h5>
              <p>All prices displayed on our website are final and inclusive of all applicable taxes. For payment and shipping arrangements, please contact us directly.</p>

              <h5>5. Order Process</h5>
              <p>Orders are processed through direct communication with our team. Shipping and payment details are discussed and arranged individually for each customer.</p>

              <h5>6. Returns and Refunds</h5>
              <p>Return and refund policies are discussed directly with customers on a case-by-case basis. Please contact our support team for any concerns.</p>

              <h5>7. Limitation of Liability</h5>
              <p>In no event shall Figmist or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Privacy Policy</h3>
            </div>
            <div className="card-body">
              <h5>1. Information We Collect</h5>
              <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>

              <h5>2. How We Use Your Information</h5>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

              <h5>3. Information Sharing</h5>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

              <h5>4. Data Security</h5>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <h5>5. Cookies</h5>
              <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.</p>

              <h5>6. Your Rights</h5>
              <p>You have the right to access, update, or delete your personal information. You may also opt out of marketing communications.</p>

              <h5>7. Contact Us</h5>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@figmist.com</p>
            </div>
          </div>

          {/* Consumer Rights */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Consumer Rights (India)</h3>
            </div>
            <div className="card-body">
              <h5>Consumer Protection Act, 2019</h5>
              <p>As per the Consumer Protection Act, 2019, you have the following rights:</p>
              <ul>
                <li>Right to be protected against marketing of goods that are hazardous to life and property</li>
                <li>Right to be informed about the quality, quantity, potency, purity, standard, and price of goods</li>
                <li>Right to be assured of access to a variety of goods at competitive prices</li>
                <li>Right to seek redressal against unfair trade practices</li>
                <li>Right to consumer education</li>
              </ul>

              <h5>Contact Information</h5>
              <p>For consumer complaints, you can reach us at:</p>
              <ul>
                <li>Email: support@figmist.com</li>
                <li>Phone: +91-XXXXXXXXXX</li>
                <li>WhatsApp: +91-XXXXXXXXXX</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h3>Contact Information</h3>
            </div>
            <div className="card-body">
              <p>For any queries or support, please contact us:</p>
              <ul>
                <li><strong>Email:</strong> support@figmist.com</li>
                <li><strong>WhatsApp:</strong> +91-XXXXXXXXXX</li>
                <li><strong>Phone:</strong> +91-XXXXXXXXXX</li>
                <li><strong>Address:</strong> [Business Address]</li>
              </ul>
              <p><strong>Business Hours:</strong> Monday to Saturday, 10:00 AM to 8:00 PM IST</p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
