import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="mb-4">About Figmist</h1>
          <h2 className="text-primary mb-4">"One Anime Enthusiastic Serving Another"</h2>

          <div className="mb-5">
            <p className="lead">
              Welcome to Figmist, your ultimate destination for premium anime merchandise.
              We're passionate about bringing the best anime products to fellow enthusiasts
              around the world.
            </p>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-heart fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Passion for Anime</h5>
              <p className="card-text">
                We share your love for anime and carefully curate products that capture
                the essence of your favorite series and characters.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Fast Shipping</h5>
              <p className="card-text">
                We ensure quick and reliable delivery of your orders so you can enjoy
                your new anime merchandise as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-star fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Quality Products</h5>
              <p className="card-text">
                Every product in our collection is selected for its quality and authenticity,
                ensuring you get the best value for your money.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <h3>Our Mission</h3>
          <p>
            At Figmist, our mission is to connect anime fans worldwide through high-quality
            merchandise that celebrates their favorite shows, characters, and moments.
            We believe that great anime deserves great merchandise.
          </p>
          <p>
            Whether you're looking for the perfect t-shirt, collectible figures, posters,
            or accessories, we've got you covered with products that match your passion
            and style.
          </p>
        </div>

        <div className="col-lg-6 mb-4">
          <h3>Why Choose Us?</h3>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i>
              Curated selection of premium anime products
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i>
              Competitive pricing and frequent discounts
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i>
              Fast and secure shipping worldwide
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i>
              Excellent customer service
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-success me-2"></i>
              Satisfaction guarantee on all products
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col-12 text-center">
          <div className="bg-light p-4 rounded community-section">
            <h3 className="mb-3">Join Our Community</h3>
            <p className="mb-4">
              Stay connected with fellow anime enthusiasts and get the latest updates
              on new products and exclusive offers.
            </p>

            {/* Social Media Links */}
            <div className="d-flex justify-content-center gap-3 mb-4">
              <a
                href="https://facebook.com/figmiststore"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-facebook-f me-2"></i>Facebook
              </a>
              <a
                href="https://twitter.com/figmist_store"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-twitter me-2"></i>Twitter
              </a>
              <a
                href="https://instagram.com/figmist_store"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-instagram me-2"></i>Instagram
              </a>
              <a
                href="https://youtube.com/@figmist"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-youtube me-2"></i>YouTube
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="row justify-content-center">
              <div className="col-md-6">
                <h5 className="mb-3">Subscribe to Our Newsletter</h5>
                <p className="text-muted mb-3">
                  Get exclusive deals, new product announcements, and anime community updates!
                </p>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    aria-label="Email for newsletter"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe
                  </button>
                </div>
                <small className="text-muted">
                  We respect your privacy. Unsubscribe at any time.
                </small>
              </div>
            </div>

            {/* Community Stats */}
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="text-center">
                  <h4 className="text-primary mb-1">10K+</h4>
                  <small className="text-muted">Happy Customers</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-center">
                  <h4 className="text-primary mb-1">500+</h4>
                  <small className="text-muted">Anime Products</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-center">
                  <h4 className="text-primary mb-1">50+</h4>
                  <small className="text-muted">Anime Series</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
