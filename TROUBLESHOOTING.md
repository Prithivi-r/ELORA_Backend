# ELORA Server Troubleshooting Guide

## Issues Fixed

### 1. Database Connection Issues
- ✅ Fixed import path: `./config/db` → `./config/database`
- ✅ Fixed auth routes import: `./routes/authRoutes` → `./routes/auth`

### 2. Authentication Issues
- ✅ Fixed JWT token verification: `decoded.id` → `decoded.userId`
- ✅ Ensured consistent user ID handling across middleware

### 3. Order Display Issues
- ✅ Added user population to order queries
- ✅ Orders now show user names and email addresses
- ✅ Product details are properly populated

## Testing Steps

### 1. Test Database Connection
```bash
cd server
node test-db-connection.js
```

### 2. Start Server
```bash
cd server
npm start
# OR
node start-server.js
```

### 3. Test API Endpoints

#### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Orders (with user info)
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `.env` file
3. Verify MongoDB is accessible on `localhost:27017`

### Issue: "Invalid token" errors
**Solution:**
1. Check JWT_SECRET in `.env` file
2. Ensure token is passed correctly in Authorization header
3. Verify token format: `Bearer <token>`

### Issue: Orders not showing user names
**Solution:**
- ✅ Fixed by adding `.populate('userId', 'name email')` to order queries
- Orders now include user information

### Issue: Data not persisting
**Solution:**
1. Check MongoDB connection
2. Verify models are properly defined
3. Ensure database operations use `await`
4. Check for validation errors

## Environment Setup

### Required Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elora
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### MongoDB Setup
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `elora`
4. Ensure proper permissions

## API Endpoints Status

### Authentication ✅
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/admin/signup` - Admin registration
- POST `/api/auth/admin/login` - Admin login

### Orders ✅
- POST `/api/orders` - Place order
- GET `/api/orders` - Get user orders (with user info)
- GET `/api/orders/:orderId` - Get single order (with user info)
- PUT `/api/orders/cancel/:orderId` - Cancel order

### Admin ✅
- GET `/api/admin/orders` - Get all orders (with user info)
- PUT `/api/admin/orders/:id/status` - Update order status
- GET `/api/admin/users` - Get all users
- GET `/api/admin/stats` - Dashboard statistics

## Next Steps

1. **Test the fixes:**
   ```bash
   cd server
   node test-db-connection.js
   npm start
   ```

2. **Verify user registration/login works**
3. **Test order placement and retrieval**
4. **Check that orders show user names and product details**

## Support

If issues persist:
1. Check server logs for detailed error messages
2. Verify all dependencies are installed: `npm install`
3. Ensure MongoDB is running and accessible
4. Check network connectivity and firewall settings