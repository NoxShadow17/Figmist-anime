import React, { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, addProduct, updateProduct, deleteProduct, getAllProducts, uploadProductImage, checkAdminSession } from '../freeDatabase';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Form data for add/edit product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    sizes: '',
    inStock: false,
    discountPercentage: 0,
    discountActive: false,
    featured: false
  });

  useEffect(() => {
    // Load products when component mounts
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getAllProducts();
    if (result.success) {
      setProducts(result.products);
    } else {
      alert('Error loading products: ' + result.error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginAdmin(email, password);
    if (result.success) {
      setIsLoggedIn(true);
    } else {
      alert('Login failed: ' + result.error);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      setIsLoggedIn(false);
      setProducts([]);
    } else {
      alert('Logout failed: ' + result.error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if file is selected
      if (imageFile) {
        const uploadResult = await uploadProductImage(imageFile, Date.now().toString());
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          alert('Image upload failed: ' + uploadResult.error);
          setLoading(false);
          return;
        }
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: imageUrl,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
        inStock: formData.inStock,
        discount_percentage: parseFloat(formData.discountPercentage) || 0,
        discount_active: formData.discountActive,
        featured: formData.featured
      };

      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
      } else {
        result = await addProduct(productData);
      }

      if (result.success) {
        alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
        loadProducts();
      } else {
        alert(`Failed to ${editingProduct ? 'update' : 'add'} product: ` + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      sizes: product.sizes ? product.sizes.join(', ') : '',
      inStock: product.inStock,
      discountPercentage: product.discount_percentage || 0,
      discountActive: product.discount_active || false,
      featured: product.featured || false
    });
    setImagePreview(product.image);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      const result = await deleteProduct(id);
      if (result.success) {
        alert('Product deleted successfully!');
        loadProducts();
      } else {
        alert('Failed to delete product: ' + result.error);
      }
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      sizes: '',
      inStock: false,
      discountPercentage: 0,
      discountActive: false,
      featured: false
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center mb-4">Admin Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Panel</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (showAddForm) {
                handleCancel();
              } else {
                setShowAddForm(true);
              }
            }}
          >
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (INR)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="clothing">Clothing</option>
                      <option value="accessories">Accessories</option>
                      <option value="posters">Posters</option>
                      <option value="collectibles">Collectibles</option>
                      <option value="figurines">Figurines</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sizes (optional, comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sizes}
                      onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                      placeholder="S, M, L, XL, XXL"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                      />
                      <label className="form-check-label">In Stock</label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Discount Percentage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="form-control"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.discountActive}
                        onChange={(e) => setFormData({...formData, discountActive: e.target.checked})}
                      />
                      <label className="form-check-label">Enable Discount</label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      />
                      <label className="form-check-label">Featured Product</label>
                    </div>
                    <small className="text-muted">Featured products appear on the homepage</small>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h3>Manage Products</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
