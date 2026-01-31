# ELORA API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status

### Authentication Routes (`/auth`)

#### User Registration
- **POST** `/auth/signup`
- Body: `{ name, email, password, role? }`
- Returns: `{ token, user }`

#### User Login
- **POST** `/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

### Product Routes (`/products`)

#### Get All Products
- **GET** `/products`
- Query: `?category=skincare&search=cream`
- Returns: Array of active products

#### Get Single Product
- **GET** `/products/:id`
- Returns: Product details

### Cart Routes (`/cart`) - Requires Auth

#### Get User Cart
- **GET** `/cart`
- Returns: `{ items, total }`

#### Add to Cart
- **POST** `/cart/add`
- Body: `{ productId, quantity }`

#### Update Cart Item
- **PUT** `/cart/update`
- Body: `{ productId, quantity }`

#### Remove from Cart
- **DELETE** `/cart/remove/:productId`

#### Clear Cart
- **DELETE** `/cart/clear`

### Order Routes (`/orders`) - Requires Auth

#### Create Order
- **POST** `/orders`
- Body: `{ paymentMethod }`
- Returns: `{ orderId, totalAmount, paymentMethod, isCashback }`

#### Get User Orders
- **GET** `/orders`
- Returns: Array of user orders

#### Cancel Order
- **PUT** `/orders/cancel/:orderId`
- Returns: Cancellation status and refund info

### Admin Routes (`/admin`) - Requires Admin Auth

#### Product Management
- **GET** `/admin/products` - Get all products
- **POST** `/admin/products` - Add new product
- **PUT** `/admin/products/:id` - Update product
- **DELETE** `/admin/products/:id` - Delete product (soft delete)

#### Order Management
- **GET** `/admin/orders` - Get all orders
- **PUT** `/admin/orders/:id/status` - Update order status

#### User Management
- **GET** `/admin/users` - Get all users

#### Dashboard Stats
- **GET** `/admin/stats` - Get dashboard statistics

## Product Categories
- `skincare`
- `makeup`
- `fragrance`
- `accessories`

## Order Status Values
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

## Payment Methods
- `COD` (Cash on Delivery)
- `CARD`
- `UPI`

## Error Responses
All errors return:
```json
{
  "error": "Error message"
}
```

## Success Responses
Most successful operations return:
```json
{
  "message": "Success message",
  "data": {}
}
```