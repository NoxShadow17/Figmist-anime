import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../freeDatabase';
import { useCart, useTheme } from '../App';

// Helper function to calculate discounted price
const calculateDiscountedPrice = (price, discountPercentage, discountActive) => {
  if (discountActive && discountPercentage > 0) {
    return price * (1 - discountPercentage / 100);
  }
  return price;
};

const Products = () => {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categories, setCategories] = useState(['all']);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

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

  const loadProducts = async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let result;
      if (selectedCategory === 'all') {
        result = await getAllProducts(page, 6); // Changed from 3 to 6
      } else {
        result = await getProductsByCategory(selectedCategory, page, 6); // Changed from 3 to 6
      }

      if (result.success) {
        if (append) {
          setProducts(prev => [...prev, ...result.products]);
        } else {
          setProducts(result.products);
          setCurrentPage(page);
        }

        // Update pagination state from response
        if (result.pagination) {
          setHasMore(result.pagination.hasMore);
          setTotalPages(result.pagination.totalPages);
          setTotalProducts(result.pagination.totalProducts);
        } else {
          setHasMore(result.hasMore || false);
        }

        // Extract unique categories only on first load
        if (!append && page === 1) {
          const uniqueCategories = ['all', ...new Set(result.products.map(product => product.category))];
          setCategories(uniqueCategories);
        }
      } else {
        console.error('Failed to load products:', result.error);
        if (!append) {
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      if (!append) {
        setProducts([]);
      }
    }

    setLoading(false);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadProducts(nextPage, true);
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      loadProducts(page, false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  useEffect(() => {
    loadProducts(1, false);
  }, [selectedCategory, loadProducts]); // Reload when category changes

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
                src={product.images && product.images.length > 0 ? product.images[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
                className="card-img-top"
                alt={product.name}
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
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

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-5">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
          <nav aria-label="Product pagination">
            <ul className={`pagination pagination-lg ${theme === 'dark' ? 'pagination-dark' : ''}`}>
              {/* Previous Button */}
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''} ${theme === 'dark' ? 'page-item-dark' : ''}`}>
                <button
                  className={`page-link ${theme === 'dark' ? 'page-link-dark' : ''}`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <i className="fas fa-chevron-left me-1"></i>
                  Previous
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''} ${theme === 'dark' ? 'page-item-dark' : ''}`}>
                    <button
                      className={`page-link ${theme === 'dark' ? 'page-link-dark' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              {/* Next Button */}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''} ${theme === 'dark' ? 'page-item-dark' : ''}`}>
                <button
                  className={`page-link ${theme === 'dark' ? 'page-link-dark' : ''}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <i className="fas fa-chevron-right ms-1"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Load More Button (fallback for infinite scroll) */}
      {hasMore && !loading && totalPages <= 1 && (
        <div className="text-center mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                Load More Products
              </>
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {totalProducts > 0 && !loading && (
        <div className="text-center text-muted mt-3">
          <small>
            Showing {((currentPage - 1) * 6) + 1}-{Math.min(currentPage * 6, totalProducts)} of {totalProducts} products
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </small>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
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
