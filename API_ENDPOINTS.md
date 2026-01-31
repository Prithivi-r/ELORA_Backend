# ELORA Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 AUTHENTICATION ROUTES

### User Authentication

#### User Signup
```http
POST /auth/signup
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### User Login
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Admin Authentication

#### Admin Signup
```http
POST /auth/admin/signup
```
**Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@elora.com",
  "password": "admin123"
}
```

#### Admin Login
```http
POST /auth/admin/login
```
**Body:**
```json
{
  "email": "admin@elora.com",
  "password": "admin123"
}
```

---

## 📦 PRODUCT ROUTES (Public)

#### Get All Products
```http
GET /products
GET /products?category=Skincare
GET /products?search=cream
```

#### Get Single Product
```http
GET /products/:id
```

---

## 🛒 CART ROUTES (User Protected)

#### Get User Cart
```http
GET /cart
```

#### Add to Cart
```http
POST /cart/add
```
**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/update
```
**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /cart/remove/:productId
```

#### Clear Cart
```http
DELETE /cart/clear
```

---

## 📋 ORDER ROUTES (User Protected)

#### Place Order
```http
POST /orders
```
**Body:**
```json
{
  "paymentMethod": "COD"
}
```
**Payment Methods:** `COD`, `UPI`, `CARD`, `CASHBACK`

#### Get User Orders
```http
GET /orders
```

#### Get Single Order
```http
GET /orders/:orderId
```

#### Cancel Order
```http
PUT /orders/cancel/:orderId
```

---

## 🧑‍💼 ADMIN ROUTES (Admin Protected)

### Product Management

#### Get All Products (Admin View)
```http
GET /admin/products
```

#### Add Product
```http
POST /admin/products
```
**Body:**
```json
{
  "name": "Product Name",
  "category": "Skincare",
  "price": 299.99,
  "description": "Product description here",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 50,
  "offer": 10
}
```
**Categories:** `Skincare`, `Makeup`, `Fragrance`, `Accessories`

#### Update Product
```http
PUT /admin/products/:id
```
**Body:** (Any combination of product fields)
```json
{
  "name": "Updated Name",
  "price": 399.99,
  "stock": 25,
  "isActive": true
}
```

#### Delete Product (Soft Delete)
```http
DELETE /admin/products/:id
```

### Order Management

#### Get All Orders
```http
GET /admin/orders
```

#### Update Order Status
```http
PUT /admin/orders/:id/status
```
**Body:**
```json
{
  "orderStatus": "shipped"
}
```
**Order Status:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

### User Management

#### Get All Users
```http
GET /admin/users
```

### Dashboard

#### Get Dashboard Stats
```http
GET /admin/dashboard
```

---

## 📊 RESPONSE FORMATS

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Authentication Response
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

---

## 🔒 SECURITY FEATURES

- JWT Authentication
- Password hashing with bcrypt
- Input validation
- Admin-only protected routes
- CORS enabled
- Error handling middleware

---

## 💳 PAYMENT & REFUND LOGIC

### Payment Methods
- **COD (Cash on Delivery):** Payment pending until delivery
- **UPI/CARD:** Payment marked as paid immediately
- **CASHBACK:** Special payment method

### Refund Logic (Order Cancellation)
- **CASHBACK orders:** Cancel only, no refund
- **COD orders:** Cancel without refund processing
- **UPI/CARD orders:** Mark as refunded, process within 5-7 days

---

## 📈 ORDER STATUS FLOW

1. **pending** → Order placed, awaiting confirmation
2. **confirmed** → Order confirmed by admin
3. **shipped** → Order dispatched
4. **delivered** → Order completed
5. **cancelled** → Order cancelled (with appropriate refund logic)

---

## 🗄️ DATABASE COLLECTIONS

- **users** - User accounts
- **admins** - Admin accounts  
- **products** - Product catalog
- **carts** - User shopping carts
- **orders** - Order history

---

## 🚀 GETTING STARTED

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start MongoDB service
4. Run server: `npm run dev`
5. Default admin created automatically on first run

---

## 📝 NOTES

- All timestamps are in ISO format
- Product stock is automatically updated on order placement/cancellation
- Cart data persists across sessions
- Only admin-added products appear in frontend
- User-specific data isolation enforced
- Production-ready error handling and validation