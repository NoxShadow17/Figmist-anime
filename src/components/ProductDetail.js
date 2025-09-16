import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../freeDatabase';
import { useCart } from '../App';

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercentage, discountActive) => {
  if (discountActive && discountPercentage > 0) {
    return price * (1 - discountPercentage / 100);
  }
  return price;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const result = await getProductById(id);
        if (result.success) {
          setProduct(result.product);
        } else {
          console.error('Failed to load product:', result.error);
          setProduct(null);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      }
      setLoading(false);
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.category === 'clothing' && !selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }

    addToCart(product, quantity, selectedSize);
    alert(`Added ${quantity} ${product.name}${selectedSize ? ` (${selectedSize})` : ''} to cart!`);
  };

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          {product.images && product.images.length > 1 ? (
            // Multiple images - show carousel
            <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {product.images.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="d-block w-100 rounded"
                      style={{ maxHeight: '500px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>

              {/* Carousel indicators */}
              <div className="carousel-indicators">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#productCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          ) : (
            // Single image - show regular image
            <img
              src={product.images ? product.images[0] : product.image}
              alt={product.name}
              className="img-fluid rounded"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <div className="mb-3">
            {product.discount_active && product.discount_percentage > 0 ? (
              <div>
                <h3 className="text-success mb-1">
                  ₹{calculateDiscountedPrice(product.price, product.discount_percentage, product.discount_active).toLocaleString('en-IN')}
                </h3>
                <p className="mb-1">
                  <small className="text-muted text-decoration-line-through">
                    Original: ₹{product.price.toLocaleString('en-IN')}
                  </small>
                </p>
                <span className="badge bg-danger fs-6">
                  -{product.discount_percentage}% OFF
                </span>
              </div>
            ) : (
              <h3 className="text-primary mb-3">
                ₹{product.price.toLocaleString('en-IN')}
              </h3>
            )}
          </div>
          <p className="mb-4">{product.description}</p>

          {product.sizes && product.category === 'clothing' && (
            <div className="mb-3">
              <label className="form-label">Size:</label>
              <select
                className="form-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {product.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Quantity:</label>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="mx-3">{quantity}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className={`mb-0 ${product.inStock ? 'text-success' : 'text-danger'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </p>
          </div>



          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProductDetail;
