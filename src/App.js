import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Admin from './components/Admin';
import About from './components/About';
import Legal from './components/Legal';
import Footer from './components/Footer';
import './App.css';

const ThemeContext = createContext();
const CartContext = createContext();

export const useTheme = () => useContext(ThemeContext);
export const useCart = () => useContext(CartContext);

function App() {
  const [theme, setTheme] = useState('light');
  const [cartItems, setCartItems] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('figmist_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('figmist_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart operations
  const addToCart = (product, quantity = 1, size = null) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.id === product.id && item.size === size
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          size: size,
          discount_percentage: product.discount_percentage || 0,
          discount_active: product.discount_active || false
        }];
      }
    });
  };

  const removeFromCart = (id, size = null) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_active && item.discount_percentage > 0
        ? item.price * (1 - item.discount_percentage / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <CartContext.Provider value={cartContextValue}>
        <div className={`App ${theme}`}>
          <Router>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/about" element={<About />} />
                <Route path="/legal" element={<Legal />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </div>
      </CartContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
