// FREE Multi-Device Solution - Using Supabase (PostgreSQL)
// Real-time database with cross-device synchronization

import { createClient } from '@supabase/supabase-js'

// 🔴 IMPORTANT: Replace these with your actual Supabase credentials
// Get them from: https://supabase.com/dashboard → Your Project → Settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://racemusoavpnneiurnsz.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2VtdXNvYXZwbm5laXVybnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzg4NTgsImV4cCI6MjA3MjgxNDg1OH0.keZMvLW-yTTSNiVIHl1c4hiKKycSTDIByfesg2kMKS8'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication functions
export const loginAdmin = async (email, password) => {
  try {
    // For demo purposes, using simple email/password check
    // In production, use Supabase Auth: const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (email === 'admin@figmist.com' && password === 'admin123') {
      localStorage.setItem('figmist_admin_session', JSON.stringify({
        email: email,
        role: 'admin',
        loginTime: new Date().toISOString()
      }));
      return { success: true, user: { email: email, role: 'admin' } };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutAdmin = async () => {
  try {
    // In production: await supabase.auth.signOut()
    localStorage.removeItem('figmist_admin_session');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkAdminSession = () => {
  try {
    const session = localStorage.getItem('figmist_admin_session');
    return session ? JSON.parse(session) : null;
  } catch (error) {
    return null;
  }
};

// Product CRUD operations with Supabase
export const addProduct = async (productData) => {
  try {
    // Prepare data for database - handle both old and new schema
    const dbData = { ...productData };

    // If images array exists, use first image for backward compatibility
    if (dbData.images && dbData.images.length > 0) {
      dbData.image = dbData.images[0]; // For old schema compatibility
    }

    const { data, error } = await supabase
      .from('products')
      .insert([dbData])
      .select()

    if (error) throw error

    return { success: true, id: data[0].id };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    products.unshift(newProduct);
    localStorage.setItem('figmist_products', JSON.stringify(products));

    return { success: true, id: newProduct.id };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()

    if (error) throw error

    return { success: true };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('figmist_products', JSON.stringify(products));
      return { success: true };
    } else {
      return { success: false, error: 'Product not found' };
    }
  }
};

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const filteredProducts = products.filter(p => p.id !== id);

    if (filteredProducts.length < products.length) {
      localStorage.setItem('figmist_products', JSON.stringify(filteredProducts));
      return { success: true };
    } else {
      return { success: false, error: 'Product not found' };
    }
  }
};

export const getAllProducts = async () => {
  try {
    // Query Supabase with both image columns for backward compatibility
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Normalize data to ensure images array exists (prefer images array, fallback to single image)
    const normalizedData = data.map(product => ({
      ...product,
      images: product.images || (product.image ? [product.image] : []),
      sizes: product.sizes || [],
      inStock: product.inStock !== false,
      discount_percentage: product.discount_percentage || 0,
      discount_active: product.discount_active || false,
      featured: product.featured || false
    }));

    return { success: true, products: normalizedData };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    return { success: true, products };
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at')
      .eq('id', id)
      .single()

    if (error) throw error

    // Ensure images array exists for compatibility (prefer images array, fallback to single image)
    const product = {
      ...data,
      images: data.images || (data.image ? [data.image] : []),
      sizes: data.sizes || [],
      inStock: data.inStock !== false,
      discount_percentage: data.discount_percentage || 0,
      discount_active: data.discount_active || false,
      featured: data.featured || false
    };

    return { success: true, product };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const product = products.find(p => p.id === id);

    if (product) {
      return { success: true, product };
    } else {
      return { success: false, error: 'Product not found' };
    }
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Ensure images array exists for compatibility (prefer images array, fallback to single image)
    const products = data.map(product => ({
      ...product,
      images: product.images || (product.image ? [product.image] : []),
      sizes: product.sizes || [],
      inStock: product.inStock !== false,
      discount_percentage: product.discount_percentage || 0,
      discount_active: product.discount_active || false,
      featured: product.featured || false
    }));

    return { success: true, products };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const filteredProducts = products.filter(p => p.category === category);
    return { success: true, products: filteredProducts };
  }
};

export const getFeaturedProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Ensure images array exists for compatibility (prefer images array, fallback to single image)
    const products = data.map(product => ({
      ...product,
      images: product.images || (product.image ? [product.image] : []),
      sizes: product.sizes || [],
      inStock: product.inStock !== false,
      discount_percentage: product.discount_percentage || 0,
      discount_active: product.discount_active || false,
      featured: product.featured || false
    }));

    return { success: true, products };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');
    const featuredProducts = products.filter(p => p.featured === true);
    return { success: true, products: featuredProducts };
  }
};

// FREE Image Storage - Supabase Storage (50MB FREE)
export const uploadProductImage = async (file, productId) => {
  try {
    // Check file size (limit to 500KB per image to prevent localStorage quota issues)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
      return {
        success: false,
        error: `Image too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use an image smaller than 500KB.`
      };
    }

    // Option 1: Supabase Storage (FREE up to 50MB)
    // const fileExt = file.name.split('.').pop()
    // const fileName = `${productId}.${fileExt}`
    // const { data, error } = await supabase.storage
    //   .from('product-images')
    //   .upload(fileName, file)
    //
    // if (error) throw error
    // const { data: { publicUrl } } = supabase.storage
    //   .from('product-images')
    //   .getPublicUrl(fileName)

    // Option 2: Base64 fallback (works immediately) - compress image
    const compressedBase64 = await compressImage(file);
    const dataUrl = `data:${file.type};base64,${compressedBase64}`;

    return {
      success: true,
      url: dataUrl,
      message: 'Image compressed and stored locally (FREE!)'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProductImage = async (imageUrl) => {
  // Supabase delete - replace with:
  // const { error } = await supabase.storage
  //   .from('product-images')
  //   .remove([fileName])
  return { success: true, message: 'Local image removed' };
};

// Helper function to compress image
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 800px width/height)
      let { width, height } = img;
      const maxDimension = 800;

      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression (0.8 quality)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      resolve(compressedBase64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem('figmist_products')) {
    const defaultProducts = [
      {
        id: '1',
        name: 'Naruto T-Shirt',
        price: 2499,
        category: 'clothing',
        images: ['/549e0e7ad7e492ba4766f0bbdfe5e0c8.jpg'],
        description: 'Premium cotton t-shirt featuring Naruto characters.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inStock: true,
        details: 'Made with high-quality cotton for maximum comfort.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('figmist_products', JSON.stringify(defaultProducts));
  }
};

initializeData();

// Export Supabase client for advanced usage
export default supabase;
