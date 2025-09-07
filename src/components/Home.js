import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { getFeaturedProducts } from '../freeDatabase';

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercentage, discountActive) => {
  if (discountActive && discountPercentage > 0) {
    return price * (1 - discountPercentage / 100);
  }
  return price;
};

const Home = () => {
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const result = await getFeaturedProducts();
        if (result.success) {
          setFeaturedProducts(result.products);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        setFeaturedProducts([]);
      }
      setLoading(false);
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero text-white"
        style={{
          height: '100vh',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <video
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/From Klickpin CF - Video Pinterest.mp4" type="video/mp4" />
          <source src="/From Klickpin CF - Video Pinterest.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Text Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '3rem',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '600px',
          width: '90%'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}>
            Welcome to Figmist
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            lineHeight: '1.6',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            "One Anime Enthusiastic Serving Another" - Discover the best anime merchandise
            with premium quality and fast shipping.
          </p>
          <Link
            to="/products"
            className="btn btn-primary btn-lg"
            style={{
              fontSize: '1.1rem',
              padding: '0.75rem 2rem',
              borderRadius: '25px',
              fontWeight: '600'
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Products</h2>
          <div className="row">
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div
                      className="card-img-top bg-light"
                      style={{ height: '250px' }}
                    ></div>
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-12"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              // Dynamic featured products
              featuredProducts.map(product => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text flex-grow-1">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          {product.discount_active && product.discount_percentage > 0 ? (
                            <div>
                              <span className="h5 text-success">
                                ₹{calculateDiscountedPrice(product.price, product.discount_percentage, product.discount_active).toLocaleString('en-IN')}
                              </span>
                              <br />
                              <small className="text-muted text-decoration-line-through">
                                ₹{product.price.toLocaleString('en-IN')}
                              </small>
                              <span className="badge bg-danger ms-2">
                                -{product.discount_percentage}%
                              </span>
                            </div>
                          ) : (
                            <span className="h5 text-primary">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <Link to={`/product/${product.id}`} className="btn btn-primary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No products available
              <div className="col-12 text-center">
                <p>No featured products available at the moment.</p>
                <Link to="/products" className="btn btn-primary">
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Join the Anime Community</h2>
          <p className="lead mb-4">
            Discover amazing anime merchandise that celebrates your passion for anime.
            From clothing to collectibles, we have everything you need.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
