import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5>Figmist</h5>
            <p>"One Anime Enthusiastic Serving Another"</p>
            <p>Your ultimate destination for premium anime merchandise.</p>
          </div>
          <div className="col-lg-2 mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
              <li><Link to="/products" className="text-white text-decoration-none">Products</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
              <li><Link to="/cart" className="text-white text-decoration-none">Cart</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 mb-4">
            <h6>Customer Service</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://wa.me/918981308886"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  📦 Shipping Info (WhatsApp)
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/figmist_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  🔄 Returns (Instagram DM)
                </a>
              </li>
              <li>
                <strong className="text-white">Contact Methods:</strong>
                <div className="mt-2">
                  <a
                  href="https://wa.me/918981308886"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success text-decoration-none d-block"
                >
                  📱 WhatsApp: +91 89813 08886
                  </a>
                  <a
                    href="https://instagram.com/figmist_store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warning text-decoration-none d-block"
                  >
                    📸 Instagram: @figmist_store
                  </a>
                  <a
                    href="mailto:support@figmist.com"
                    className="text-primary text-decoration-none d-block"
                  >
                    ✉️ Email: support@figmist.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 mb-4">
            <h6>Follow Us</h6>
            <div className="d-flex">
              <a
                href="https://facebook.com/figmiststore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com/figmist_store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://instagram.com/figmist_store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white me-3"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://youtube.com/@figmist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <div className="mt-3">
              <p className="mb-1">Subscribe to our newsletter</p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  aria-label="Email for newsletter"
                />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2025 Figmist. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/legal" className="text-white text-decoration-none me-3">Legal Information</Link>
            <small className="text-muted d-block mt-2">
              GST Compliant | Indian Consumer Protection Act, 2019
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
