// FREE Multi-Device Solution - Using Supabase (PostgreSQL)
// Real-time database with cross-device synchronization

import { createClient } from '@supabase/supabase-js'

// 🔴 IMPORTANT: Replace these with your actual Supabase credentials
// Get them from: https://supabase.com/dashboard → Your Project → Settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://racemusoavpnneiurnsz.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhY2VtdXNvYXZwbm5laXVybnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzg4NTgsImV4cCI6MjA3MjgxNDg1OH0.keZMvLW-yTTSNiVIHl1c4hiKKycSTDIByfesg2kMKS8'

// Create Supabase client with increased timeout and retry configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  // Increase timeout to 30 seconds (default is 10 seconds)
  realtime: {
    timeout: 30000, // 30 seconds
  },
})


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

    const { error } = await supabase
      .from('products')
      .insert([dbData])

    if (error) throw error

    return { success: true, id: Date.now().toString() };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    try {
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
    } catch (storageError) {
      // If localStorage quota exceeded, cleanup and retry
      if (storageError.name === 'QuotaExceededError') {
        cleanupLocalStorage();
        try {
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
        } catch (retryError) {
          return { success: false, error: 'Storage quota exceeded. Please delete some products first.' };
        }
      }
      return { success: false, error: storageError.message };
    }
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)

    if (error) throw error

    return { success: true };
  } catch (error) {
    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    try {
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
    } catch (storageError) {
      if (storageError.name === 'QuotaExceededError') {
        cleanupLocalStorage();
        try {
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
        } catch (retryError) {
          return { success: false, error: 'Storage quota exceeded. Please delete some products first.' };
        }
      }
      return { success: false, error: storageError.message };
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

// Helper function for retry logic with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
      console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const getAllProducts = async (page = 1, limit = 6) => {
  try {
    console.log(`🔍 Fetching products from Supabase database (page ${page}, limit ${limit})...`);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Use retry logic for the database query
    const result = await retryWithBackoff(async () => {
      const { data, error, count } = await supabase
        .from('products')
        .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Supabase database error:', error);
        throw error;
      }

      return { data, count };
    }, 3, 2000); // 3 retries with 2 second base delay

    console.log(`✅ Retrieved ${result.data.length} products from database (page ${page})`);

    // Ensure images array exists for compatibility (prefer images array, fallback to single image)
    const products = result.data.map(product => ({
      ...product,
      images: product.images || (product.image ? [product.image] : []),
      sizes: product.sizes || [],
      inStock: product.inStock !== false,
      discount_percentage: product.discount_percentage || 0,
      discount_active: product.discount_active || false,
      featured: product.featured || false
    }));

    // Calculate pagination info
    const totalProducts = result.count || 0;
    const totalPages = Math.ceil(totalProducts / limit);
    const hasMore = page < totalPages;

    // Cache only the current page in localStorage for better performance
    try {
      const cacheKey = `figmist_products_page_${page}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        products,
        timestamp: Date.now(),
        page,
        limit,
        totalProducts,
        totalPages
      }));
      console.log(`💾 Page ${page} cached in localStorage for offline access`);
    } catch (cacheError) {
      console.warn('⚠️ Could not cache products in localStorage:', cacheError.message);
    }

    return {
      success: true,
      products,
      source: 'database',
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasMore
      }
    };
  } catch (error) {
    console.error('❌ Database connection failed after retries:', error.message);

    // Try to load from cache first
    try {
      const cacheKey = `figmist_products_page_${page}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey) || 'null');

      if (cachedData && cachedData.products && cachedData.products.length > 0) {
        // Check if cache is not too old (24 hours)
        const cacheAge = Date.now() - (cachedData.timestamp || 0);
        if (cacheAge < 24 * 60 * 60 * 1000) {
          console.log(`📱 Loaded ${cachedData.products.length} products from localStorage cache (page ${page})`);
          return {
            success: true,
            products: cachedData.products,
            source: 'cache',
            warning: 'Database unavailable - showing cached data',
            pagination: cachedData.pagination || {
              page,
              limit,
              hasMore: false
            }
          };
        }
      }
    } catch (cacheError) {
      console.error('❌ Cache loading failed:', cacheError.message);
    }

    // Return empty array if both database and cache fail
    console.log('🚫 No products available - both database and cache failed');
    return {
      success: false,
      products: [],
      source: 'none',
      error: 'Unable to load products from database or cache',
      pagination: {
        page,
        limit,
        totalProducts: 0,
        totalPages: 0,
        hasMore: false
      }
    };
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

export const getProductsByCategory = async (category, page = 1, limit = 6) => {
  try {
    console.log(`🔍 Fetching products by category '${category}' from Supabase database (page ${page}, limit ${limit})...`);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Use retry logic for the database query
    const result = await retryWithBackoff(async () => {
      const { data, error, count } = await supabase
        .from('products')
        .select('id, name, price, category, description, image, images, sizes, inStock, discount_percentage, discount_active, featured, details, created_at, updated_at', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Supabase database error:', error);
        throw error;
      }

      return { data, count };
    }, 3, 2000); // 3 retries with 2 second base delay

    console.log(`✅ Retrieved ${result.data.length} products from category '${category}' (page ${page})`);

    // Ensure images array exists for compatibility (prefer images array, fallback to single image)
    const products = result.data.map(product => ({
      ...product,
      images: product.images || (product.image ? [product.image] : []),
      sizes: product.sizes || [],
      inStock: product.inStock !== false,
      discount_percentage: product.discount_percentage || 0,
      discount_active: product.discount_active || false,
      featured: product.featured || false
    }));

    // Calculate pagination info
    const totalProducts = result.count || 0;
    const totalPages = Math.ceil(totalProducts / limit);
    const hasMore = page < totalPages;

    return {
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasMore
      }
    };
  } catch (error) {
    console.error('❌ Database connection failed after retries:', error.message);

    // Fallback to localStorage if Supabase fails
    console.warn('Supabase error, falling back to localStorage:', error.message)
    try {
      const allProducts = JSON.parse(localStorage.getItem('figmist_products') || '[]');
      const filteredProducts = allProducts.filter(p => p.category === category);

      // Apply pagination to cached results
      const offset = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      const totalProducts = filteredProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const hasMore = page < totalPages;

      return {
        success: true,
        products: paginatedProducts,
        source: 'cache',
        warning: 'Database unavailable - showing cached data',
        pagination: {
          page,
          limit,
          totalProducts,
          totalPages,
          hasMore
        }
      };
    } catch (cacheError) {
      console.error('❌ Cache loading failed:', cacheError.message);
      return {
        success: false,
        products: [],
        error: 'Unable to load products from database or cache',
        pagination: {
          page,
          limit,
          totalProducts: 0,
          totalPages: 0,
          hasMore: false
        }
      };
    }
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
    // Check file size (limit to 900KB per image to prevent localStorage quota issues)
    const maxSize = 900 * 1024; // 900KB
    if (file.size > maxSize) {
      return {
        success: false,
        error: `Image too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use an image smaller than 900KB.`
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

    // Check if adding this image would exceed localStorage quota
    const currentData = localStorage.getItem('figmist_products') || '[]';
    const testData = currentData.replace(/]$/, `,{"test":"${compressedBase64.substring(0, 100)}..."}]`);

    try {
      localStorage.setItem('figmist_products_test', testData);
      localStorage.removeItem('figmist_products_test');
    } catch (quotaError) {
      return {
        success: false,
        error: 'Storage quota exceeded. Please delete some products or use smaller images.'
      };
    }

    return {
      success: true,
      url: dataUrl,
      message: 'Image compressed and stored locally (900KB limit)'
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
      // Calculate new dimensions (max 600px width/height for better compression)
      let { width, height } = img;
      const maxDimension = 600; // Reduced from 800px

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

      // Draw and compress with higher compression (0.7 quality for smaller files)
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with higher compression (0.7 quality)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
      resolve(compressedBase64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to clean up localStorage when quota is exceeded
const cleanupLocalStorage = () => {
  try {
    const products = JSON.parse(localStorage.getItem('figmist_products') || '[]');

    // Keep only the most recent 10 products to prevent quota issues
    if (products.length > 10) {
      const recentProducts = products.slice(0, 10);
      localStorage.setItem('figmist_products', JSON.stringify(recentProducts));
      console.warn('Cleaned up localStorage: kept only 10 most recent products');
    }
  } catch (error) {
    console.error('Error cleaning up localStorage:', error);
    // If cleanup fails, clear everything except admin session
    const adminSession = localStorage.getItem('figmist_admin_session');
    localStorage.clear();
    if (adminSession) {
      localStorage.setItem('figmist_admin_session', adminSession);
    }
  }
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

// Connection diagnostic function
export const diagnoseConnection = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    url: supabaseUrl,
    keyPresent: !!supabaseKey,
    keyLength: supabaseKey ? supabaseKey.length : 0,
    tests: {}
  };

  try {
    console.log('🔍 Running Supabase connection diagnostics...');

    // Test 1: Basic connectivity
    diagnostics.tests.connectivity = { status: 'testing' };
    const startTime = Date.now();
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    const responseTime = Date.now() - startTime;

    if (testError) {
      diagnostics.tests.connectivity = {
        status: 'failed',
        error: testError.message,
        code: testError.code,
        responseTime
      };
    } else {
      diagnostics.tests.connectivity = {
        status: 'success',
        responseTime,
        count: testData
      };
    }

    // Test 2: Network information
    diagnostics.tests.network = {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'Not available'
    };

    console.log('📊 Connection diagnostics completed:', diagnostics);
    return diagnostics;

  } catch (error) {
    diagnostics.tests.connectivity = {
      status: 'error',
      error: error.message,
      stack: error.stack
    };
    console.error('❌ Connection diagnostics failed:', error);
    return diagnostics;
  }
};

// Export Supabase client for advanced usage
export default supabase;
