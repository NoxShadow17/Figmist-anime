import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../App';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const handleUpdateQuantity = (id, size, newQuantity) => {
    updateQuantity(id, size, newQuantity);
  };

  const handleRemoveItem = (id, size) => {
    removeFromCart(id, size);
  };

  const total = getCartTotal();

  // Generate unique order ID
  const generateOrderId = () => {
    return `FIG-${Date.now()}`;
  };

  // Handle WhatsApp order with customer details
  const handleWhatsAppOrder = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      alert('Please provide your name and phone number for the order.');
      return;
    }

    const orderId = generateOrderId();

    // Create detailed order message
    const orderMessage = `*🛒 FIGMIST ORDER - ${orderId}*\n\n` +
      `*👤 Customer Details:*\n` +
      `Name: ${customerDetails.name}\n` +
      `Phone: ${customerDetails.phone}\n` +
      `Email: ${customerDetails.email || 'Not provided'}\n` +
      `Address: ${customerDetails.address || 'Will discuss via WhatsApp'}\n\n` +
      `*📦 Order Items:*\n` +
      cartItems.map(item => {
        const itemTotal = item.discount_active && item.discount_percentage > 0
          ? item.price * (1 - item.discount_percentage / 100) * item.quantity
          : item.price * item.quantity;

        return `• ${item.name}${item.size ? ` (${item.size})` : ''}\n` +
               `  Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}\n` +
               `  Total: ₹${itemTotal.toLocaleString('en-IN')}`;
      }).join('\n\n') +
      `\n\n*💰 Order Total: ₹${total.toLocaleString('en-IN')}*\n\n` +
      `*📝 Notes:* Please confirm availability and delivery details.\n` +
      `Order placed on: ${new Date().toLocaleString('en-IN')}`;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(orderMessage)}`;

    // Show confirmation
    if (window.confirm(`Order #${orderId} ready!\n\nTotal: ₹${total.toLocaleString('en-IN')}\n\nSend via WhatsApp?`)) {
      window.open(whatsappUrl, '_blank');
      alert(`✅ Order #${orderId} sent!\n\nYou'll receive confirmation on WhatsApp soon.`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p className="mb-4">Add some amazing anime merchandise to your cart!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Shopping Cart</h1>

      <div className="row">
        <div className="col-lg-8">
          {cartItems.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="card-title">{item.name}</h5>
                    {item.size && <p className="text-muted mb-0">Size: {item.size}</p>}
                  </div>
                  <div className="col-md-2">
                    <span className="h6">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="col-md-2">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <span className="h6">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => handleRemoveItem(item.id, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          {/* Customer Details Form */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-user me-2"></i>
                Customer Details
                <button
                  className="btn btn-sm btn-outline-secondary float-end"
                  onClick={() => setShowOrderForm(!showOrderForm)}
                >
                  {showOrderForm ? 'Hide' : 'Show'}
                </button>
              </h5>

              {showOrderForm && (
                <div className="mt-3">
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email (Optional)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Address (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                      placeholder="Enter your delivery address"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Total Amount:</span>
                <strong className="h5 text-primary">₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <div className="alert alert-info mb-3">
                <small>
                  <strong>Note:</strong> All prices include GST. Shipping and payment details will be discussed directly with our team.
                </small>
              </div>
              <button
                className="btn btn-success btn-lg w-100 mb-2"
                onClick={handleWhatsAppOrder}
                disabled={!customerDetails.name || !customerDetails.phone}
              >
                <i className="fab fa-whatsapp me-2"></i>
                Place Order via WhatsApp
              </button>
              <Link to="/products" className="btn btn-outline-primary w-100">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
