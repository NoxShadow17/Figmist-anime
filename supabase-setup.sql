-- Supabase Database Setup for Figmist
-- Run this SQL in your Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT,
  description TEXT,
  image TEXT,  -- Single image for backward compatibility
  images TEXT[],  -- Array of images for multiple image support
  sizes TEXT[],
  "inStock" BOOLEAN DEFAULT true,
  discount_percentage NUMERIC DEFAULT 0,
  discount_active BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security (optional - for production)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (optional)
-- CREATE POLICY "Allow all operations for products" ON products FOR ALL USING (true);

-- Insert sample data (optional)
INSERT INTO products (name, price, category, description, images, sizes, "inStock", details) VALUES
('Naruto T-Shirt', 2499, 'clothing', 'Premium cotton t-shirt featuring Naruto characters.', ARRAY['/549e0e7ad7e492ba4766f0bbdfe5e0c8.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], true, 'Made with high-quality cotton for maximum comfort.'),
('Demon Slayer Hoodie', 3999, 'clothing', 'Comfortable hoodie with Demon Slayer design.', ARRAY['/b5cb57fee9d32714bd3aa049c237a26f.jpg'], ARRAY['S', 'M', 'L', 'XL'], true, 'Perfect for anime fans and casual wear.'),
('Attack on Titan Poster', 599, 'accessories', 'High-quality poster featuring Attack on Titan artwork.', ARRAY['/d82f062b907f5dcb15cdbfa4f8ae9b12.jpg'], null, true, 'Printed on premium quality paper.')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists, then create it
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
