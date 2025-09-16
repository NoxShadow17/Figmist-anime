import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../freeDatabase';
import { useCart } from '../App';

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercentage, discountActive) => {
  if (discountActive && discountPercentage > 0) {
    return price * (1 - discountPercentage / 100);
  }
  return price;
};

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['all']);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = (product) => {
    if (product.sizes && product.sizes.length > 0 && product.category === 'clothing') {
      // Product is clothing with sizes, show size selection modal
      setSelectedProduct(product);
      setSelectedSize('');
      setShowSizeModal(true);
    } else {
      // Product doesn't have sizes or isn't clothing, add directly
      addToCart(product, 1, null);
      alert(`${product.name} added to cart!`);
    }
  };

  const handleSizeConfirm = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }

    addToCart(selectedProduct, 1, selectedSize);
    alert(`${selectedProduct.name} (${selectedSize}) added to cart!`);
    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  const handleSizeCancel = () => {
    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProducts();
        if (result.success) {
          setProducts(result.products);
          setFilteredProducts(result.products);

          // Extract unique categories
          const uniqueCategories = ['all', ...new Set(result.products.map(product => product.category))];
          setCategories(uniqueCategories);
        } else {
          console.error('Failed to load products:', result.error);
          // Fallback to empty array
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setFilteredProducts([]);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Filter products when search term or category changes
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Our Products</h1>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <img
                src={product.images ? product.images[0] : product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text flex-grow-1">{product.description}</p>
                <div className="mt-auto">
                  <div className="mb-2">
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-fill"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fas fa-cart-plus me-1"></i>
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.id}`} className="btn btn-outline-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Size Selection Modal */}
      {showSizeModal && selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Size - {selectedProduct.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleSizeCancel}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img
                    src={selectedProduct.images ? selectedProduct.images[0] : selectedProduct.image}
                    alt={selectedProduct.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Choose Size:</label>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-primary'} btn-lg`}
                        onClick={() => setSelectedSize(size)}
                        style={{ minWidth: '60px' }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-1">
                    <strong>Price:</strong>{' '}
                    {selectedProduct.discount_active && selectedProduct.discount_percentage > 0 ? (
                      <span>
                        <span className="text-success">₹{calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount_percentage, selectedProduct.discount_active).toLocaleString('en-IN')}</span>
                        <small className="text-muted text-decoration-line-through ms-2">
                          ₹{selectedProduct.price.toLocaleString('en-IN')}
                        </small>
                      </span>
                    ) : (
                      <span className="text-primary">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    )}
                  </p>
                  {selectedProduct.discount_active && selectedProduct.discount_percentage > 0 && (
                    <span className="badge bg-danger">
                      -{selectedProduct.discount_percentage}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSizeCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSizeConfirm}
                  disabled={!selectedSize}
                >
                  <i className="fas fa-cart-plus me-1"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
