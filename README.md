# VIA — Luxury Indian Streetwear E-Commerce Platform

> **Vibe • Identity • Authenticity**  
> Complete full-stack MERN e-commerce application engineered for heavyweight luxury streetwear.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Seed Database with Streetwear Catalog & Accounts
```bash
cd backend
# Optional: Set SEED_ADMIN_PASSWORD in your environment before running
npm run seed
```

### 3. Start Full Stack Application
```bash
# In backend/
npm run dev

# In frontend/
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **REST API Server:** [http://localhost:5001/api](http://localhost:5001/api)

---

## 🏗️ Architecture

```
VIA/
├── frontend/                   # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, CartDrawer, ProductCard, Modals, AdminLayout
│   │   ├── pages/              # Shop, ProductDetails, Checkout, OrderSuccess, Account, Admin, Auth
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── services/           # Axios API clients (auth, products, cart, orders, payments, admin)
│   │   ├── utils/              # WhatsApp link generators, helpers
│   │   └── App.jsx             # Routing and global provider setup
│
├── backend/                    # Node.js + Express REST API
│   ├── config/                 # db.js, razorpay.js, cloudinary.js
│   ├── controllers/            # auth, product, cart, order, payment, review, coupon, admin
│   ├── middleware/             # auth.js, error.js, rateLimiter.js, validate.js
│   ├── models/                 # User, Product, Category, Collection, Cart, Order, Review, Coupon
│   ├── routes/                 # authRoutes, productRoutes, cartRoutes, orderRoutes, etc.
│   ├── services/               # emailService.js, shippingService.js
│   └── utils/                  # seedData.js, token.js, apiResponse.js
│
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Create `.env` inside `backend/`:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/via_clothing
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
SEED_ADMIN_PASSWORD=your_secure_admin_password
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_FROM=orders@viaclothing.in
```

---

## 📦 Production Build & Deployment

### Frontend (Vercel / Amplify)
```bash
cd frontend && npm run build
```

### Backend
Deploy `backend/` to Render, Railway, DigitalOcean, or AWS with standard `npm start`.

