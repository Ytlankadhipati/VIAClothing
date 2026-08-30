# VIA — Luxury Indian Streetwear E-Commerce Platform

> **Vibe • Identity • Authenticity**  
> Complete full-stack MERN e-commerce application engineered for heavyweight luxury streetwear.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
# Install root & frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Seed Database with Streetwear Catalog & Accounts
```bash
npm run seed
```

### 3. Start Full Stack Application
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **REST API Server:** [http://localhost:5001/api](http://localhost:5001/api)

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@viaclothing.in` | `Admin@VIA2026` | Full Storefront + Admin Dashboard (`/admin`) |
| **Customer** | `customer@viaclothing.in` | `Customer@VIA2026` | Storefront, Bag, Orders & Profile (`/account`) |

---

## 🏗️ Architecture

```
VIA/
├── src/                        # Vite + React Frontend
│   ├── components/             # Navbar, CartDrawer, ProductCard, Modals, AdminLayout
│   ├── pages/                  # Shop, ProductDetails, Checkout, OrderSuccess, Account, Admin, Auth
│   ├── context/                # AuthContext, CartContext, WishlistContext, ToastContext
│   ├── services/               # Axios API clients (auth, products, cart, orders, payments, admin)
│   ├── utils/                  # WhatsApp link generators, helpers
│   └── App.jsx                 # Routing and global provider setup
│
├── server/                     # Node.js + Express REST API
│   ├── config/                 # db.js (with in-memory fallback), razorpay.js, cloudinary.js
│   ├── controllers/            # auth, product, cart, order, payment, review, coupon, admin
│   ├── middleware/             # auth.js (JWT & RBAC), error.js, rateLimiter.js, upload.js
│   ├── models/                 # User, Product, Category, Collection, Cart, Order, Review, Coupon
│   ├── routes/                 # authRoutes, productRoutes, cartRoutes, orderRoutes, etc.
│   ├── services/               # emailService.js, shippingService.js
│   └── utils/                  # seedData.js, token.js, apiResponse.js
│
├── .env.example
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Create `.env` inside `server/` (or refer to `.env.example`):
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/via_clothing
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_FROM=orders@viaclothing.in
```

---

## 📦 Production Build & Deployment

### Frontend (Vercel)
```bash
npm run build
```
Vercel automatically detects the Vite build output (`dist/`). Routing rewrites are handled by `vercel.json` and `public/_redirects`.

### Backend
Deploy `server/` to Render, Railway, DigitalOcean, or AWS with standard `npm start`.
