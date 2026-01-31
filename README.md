# ELORA Backend - Cosmetics E-commerce API

A complete, production-ready backend system for ELORA cosmetics e-commerce platform built with Node.js, Express.js, MongoDB, and JWT authentication.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Token expiration handling

### Product Management (Admin Only)
- Add, edit, delete products
- Category-based organization
- Stock management
- Discount/offer system
- Image URL support

### User Cart System
- User-specific carts stored in MongoDB
- Add/update/remove items
- Automatic cart clearing on logout
- Stock validation

### Order Management
- Complete order placement system
- Multiple payment methods (COD, Card, UPI, Cashback)
- Order history for users
- Order cancellation with refund logic
- Admin order management

### Admin Dashboard
- User statistics
- Order analytics
- Product management
- Sales tracking

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── middleware/
│   ├── authMiddleware.js     # User authentication
│   └── adminMiddleware.js    # Admin authorization
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema
│   └── Order.js             # Order schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── admin.js             # Admin routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   └── orders.js            # Order routes
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```

## 🛠️ Installation & Setup

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file with:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/elora
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Seed admin user**
   ```bash
   npm run seed-admin
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🧪 Testing

Run comprehensive API tests:
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Products (Public)
- `GET /products` - Get all active products
- `GET /products/:id` - Get single product

#### Cart (User Auth Required)
- `GET /cart` - Get user cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove/:productId` - Remove from cart
- `DELETE /cart/clear` - Clear cart

#### Orders (User Auth Required)
- `POST /orders` - Place order
- `GET /orders` - Get user orders
- `PUT /orders/cancel/:orderId` - Cancel order

#### Admin (Admin Auth Required)
- `GET /admin/products` - Get all products
- `POST /admin/products` - Add product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/orders` - Get all orders
- `GET /admin/users` - Get all users
- `GET /admin/stats` - Dashboard statistics

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with express-validator
- CORS configuration
- Environment variable protection

## 🏗️ Database Schema

### User
- name, email, password (hashed)
- role (user/admin)
- timestamps

### Product
- name, category, description
- price, offer (discount %)
- imageUrl, stock
- isActive flag
- timestamps

### Cart
- userId (reference)
- items array with productId, quantity
- totalAmount
- timestamps

### Order
- orderId (auto-generated)
- userId (reference)
- products array
- totalAmount, paymentMethod
- orderStatus, paymentStatus
- timestamps

## 🚀 Production Deployment

1. **Environment Setup**
   - Set NODE_ENV=production
   - Use secure JWT_SECRET
   - Configure production MongoDB URI
   - Set up proper CORS origins

2. **Security Considerations**
   - Use HTTPS in production
   - Implement rate limiting
   - Add request logging
   - Set up monitoring

3. **Database**
   - Use MongoDB Atlas or dedicated MongoDB server
   - Set up database backups
   - Configure proper indexes

## 📝 Default Admin Credentials

After running `npm run seed-admin`:
- **Email:** admin@elora.com
- **Password:** admin123
- **Role:** admin

⚠️ **Important:** Change these credentials in production!

## 🤝 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## 📊 Order Status Flow

1. **pending** → Order created
2. **confirmed** → Payment confirmed
3. **shipped** → Order dispatched
4. **delivered** → Order completed
5. **cancelled** → Order cancelled (with refund logic)

## 💳 Payment Methods

- **COD** - Cash on Delivery
- **CARD** - Credit/Debit Card
- **UPI** - UPI Payment
- **CASHBACK** - Cashback/Wallet (no refund on cancellation)

## 🔄 Refund Logic

- **COD Orders:** No refund needed
- **Prepaid Orders:** Refund initiated within 5-7 business days
- **Cashback Orders:** No refund applicable

---

**Built with ❤️ for ELORA Cosmetics**