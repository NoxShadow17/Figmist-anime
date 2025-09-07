# Figmist - Anime Merchandise E-commerce Platform

A modern, responsive e-commerce platform for anime merchandise built with React, Firebase, and Bootstrap.

## 🚀 Features

- **Admin Panel**: Complete product management system
- **Firebase Integration**: Real-time database and authentication
- **Indian Market Ready**: INR pricing, GST compliance, WhatsApp integration
- **Responsive Design**: Mobile-first approach
- **Search & Filter**: Advanced product filtering
- **Image Upload**: Firebase Storage integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd figmist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (see Supabase Setup section below)

4. **Start the development server**
   ```bash
   npm start
   ```

## 💰 FREE Setup Options

Choose the solution that fits your needs:

### **Option 1: Single Device (100% FREE, No Setup)**
Perfect for getting started immediately!

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm start
   ```

3. **Access Admin Panel**
   - Go to `http://localhost:3000/admin`
   - Login with: `admin@figmist.com` / `admin123`

4. **Start Adding Products**
   - Upload images (stored locally as base64)
   - Add product details
   - Products appear instantly on your site

**Features:**
- ✅ **Admin Panel**: Full product management
- ✅ **Product Catalog**: Dynamic product display
- ✅ **Image Storage**: Local base64 storage
- ✅ **Search & Filter**: Real-time filtering
- ✅ **Cart System**: WhatsApp integration
- ✅ **INR Pricing**: Indian currency formatting
- ✅ **Works Offline**: No internet required

**Limitation:** Data only available on the same device/browser

---

### **Option 2: Multi-Device (FREE Supabase Database)**

For cross-device access with real-time sync:

#### **🚀 Supabase Setup (5 minutes)**

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (FREE - no credit card required)
   - Verify your email

2. **Create New Project**
   - Click "New Project"
   - Project name: `figmist-store`
   - Database password: Choose a strong password
   - Region: `ap-south-1` (Asia - Mumbai) for India
   - Wait 2 minutes for setup

3. **Get Your API Keys**
   - Go to Settings → API (left sidebar)
   - Copy these values:
     - **Project URL**: `https://your-project-id.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Update `src/freeDatabase.js`**
   ```javascript
   // Replace these lines (around line 6-7):
   const supabaseUrl = 'https://your-project-id.supabase.co'  // ← Your Project URL
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ← Your anon key
   ```

5. **Create Database Table**
   - Go to Table Editor (left sidebar)
   - Click "Create a new table"
   - Table name: `products`
   - Add these columns:
     ```
     id: uuid (primary key, default: gen_random_uuid())
     name: text
     price: numeric
     category: text
     description: text
     image: text
     sizes: text[] (array)
     in_stock: boolean
     created_at: timestamptz (default: now())
     updated_at: timestamptz (default: now())
     ```

6. **Enable Row Level Security (Optional)**
   - Go to Authentication → Policies
   - For now, you can skip this - your table will be publicly accessible

7. **Test Your Setup**
   ```bash
   npm start
   ```
   - Visit `/admin` and add a product
   - Check if it appears on the main site
   - Try accessing from another device/browser!

#### **🎯 What You'll Get with Supabase:**

- ✅ **Multi-device access** - Login from phone, tablet, computer
- ✅ **Real-time sync** - Changes appear instantly across devices
- ✅ **Professional database** - PostgreSQL with SQL queries
- ✅ **File storage** - 50MB FREE for images
- ✅ **Authentication** - Secure user management
- ✅ **API ready** - RESTful endpoints
- ✅ **Backup & scaling** - Enterprise features

#### **Alternative FREE Database Options:**

**MockAPI (Free Tier)**
- Website: [mockapi.io](https://mockapi.io)
- Free for basic usage
- REST API interface

**PlanetScale (Free MySQL)**
- Website: [planetscale.com](https://planetscale.com)
- Free MySQL database
- Great for relational data

**MongoDB Atlas (Free Tier)**
- Website: [mongodb.com/atlas](https://mongodb.com/atlas)
- Free NoSQL database
- 512MB storage free

#### **FREE Image Hosting Options:**

**ImgBB (FREE API)**
```javascript
// Add to src/freeDatabase.js
const IMGBB_API_KEY = 'your-free-api-key'; // Get from imgbb.com
```

**PostImages (FREE)**
- No API key required
- Direct upload support

**GitHub Pages (FREE)**
- Store images in repository
- Use GitHub as CDN

---

### **🎯 Quick Comparison:**

| Feature | Single Device | Multi-Device |
|---------|---------------|--------------|
| **Cost** | FREE | FREE |
| **Setup Time** | 2 minutes | 10 minutes |
| **Multi-Device** | ❌ | ✅ |
| **Offline Support** | ✅ | ❌ |
| **Data Persistence** | Browser only | Cloud |
| **Real-time Sync** | ❌ | ✅ |

**Recommendation:** Start with **Single Device** option, then upgrade to **Supabase** when you need multi-device access!

---

### **🔧 Firebase (Optional Paid Upgrade)**

If you want enterprise features, you can optionally use Firebase:

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication
3. Replace imports with `src/firebase.js`
4. Update Firebase config

But for most small businesses, the FREE options above are perfect! 🎉

## 📱 Usage

### Admin Panel
- Navigate to `/admin`
- Login with your Firebase admin credentials
- Add, edit, and delete products
- Upload product images
- Manage inventory

### Customer Features
- Browse products by category
- Search and filter products
- Add products to cart
- WhatsApp integration for orders
- INR pricing with GST

## 🗂️ Project Structure

```
figmist/
├── public/
│   ├── images/          # Product images
│   └── videos/          # Hero video
├── src/
│   ├── components/
│   │   ├── Admin.js     # Admin panel
│   │   ├── Cart.js      # Shopping cart
│   │   ├── Home.js      # Homepage
│   │   ├── Products.js  # Product listing
│   │   └── ...
│   ├── firebase.js      # Firebase configuration
│   ├── App.js           # Main app component
│   └── index.js         # App entry point
└── package.json
```

## 🎯 Key Features

### Admin Panel (`/admin`)
- ✅ Real Firebase authentication
- ✅ Add/edit/delete products
- ✅ Image upload to Firebase Storage
- ✅ Real-time product management
- ✅ INR currency display

### Customer Experience
- ✅ Dynamic product loading from Firebase
- ✅ Search and category filtering
- ✅ WhatsApp order integration
- ✅ Responsive design
- ✅ Loading states and error handling

### Indian Market Features
- ✅ INR pricing with proper formatting
- ✅ GST compliance information
- ✅ WhatsApp business integration
- ✅ Indian consumer protection info

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Email: support@figmist.com
- WhatsApp: +91-XXXXXXXXXX
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Figmist** - "One Anime Enthusiastic Serving Another" 🏮

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
