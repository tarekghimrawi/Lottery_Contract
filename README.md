# Modern E-Commerce Platform

A comprehensive, full-stack e-commerce website built with modern technologies, featuring all the essential components needed for a successful online store.

## 🚀 Features

### Core E-Commerce Features
- ✅ **User Authentication & Authorization** (JWT-based with role management)
- ✅ **Product Management** (CRUD operations, categories, variants, reviews)
- ✅ **Shopping Cart** (Add, remove, update quantities with real-time sync)
- ✅ **Order Management** (Complete checkout flow, order tracking, cancellation)
- ✅ **Payment Processing** (Stripe integration with multiple payment methods)
- ✅ **User Profiles** (Address management, order history, wishlist)
- ✅ **Admin Dashboard** (Comprehensive management panel)
- ✅ **Search & Filtering** (Advanced product search and filtering system)
- ✅ **Responsive Design** (Mobile-first, fully responsive UI)
- ✅ **Inventory Management** (Stock tracking, low stock alerts)

### Advanced Features
- ✅ **Product Reviews & Ratings** (Customer feedback system)
- ✅ **Order Status Tracking** (Real-time order updates with timeline)
- ✅ **Refund Management** (Full refund processing system)
- ✅ **Product Variants** (Size, color, and other variations)
- ✅ **Wishlist Functionality** (Save products for later)
- ✅ **Admin Analytics** (Sales reports, user metrics, dashboard stats)
- ✅ **Security Features** (Rate limiting, input validation, CORS protection)

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation and sanitization
- **Stripe** - Payment processing
- **Multer** - File upload handling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Material-UI v5** - Modern React component library
- **React Router v6** - Client-side routing
- **React Query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **React Hook Form** - Performant form library

### Development Tools
- **Concurrently** - Run multiple commands
- **Nodemon** - Development server auto-reload
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
ecommerce-platform/
├── server/                     # Backend API
│   ├── models/                # Database models
│   │   ├── User.js           # User model with authentication
│   │   ├── Product.js        # Product model with reviews
│   │   ├── Order.js          # Order model with tracking
│   │   └── Cart.js           # Shopping cart model
│   ├── routes/                # API route handlers
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── products.js       # Product CRUD operations
│   │   ├── orders.js         # Order management
│   │   ├── cart.js           # Shopping cart operations
│   │   ├── users.js          # User profile management
│   │   ├── admin.js          # Admin dashboard APIs
│   │   └── payments.js       # Payment processing
│   ├── middleware/            # Custom middleware
│   │   └── auth.js           # Authentication middleware
│   ├── index.js              # Server entry point
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/           # Route-based page components
│   │   │   └── admin/       # Admin panel pages
│   │   ├── contexts/        # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── config/          # Configuration files
│   │   │   └── axios.ts     # API client configuration
│   │   ├── App.tsx          # Main application component
│   │   └── index.tsx        # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Frontend environment variables
├── package.json             # Root package.json for scripts
├── README.md               # This file
└── ECOMMERCE_GUIDE.md      # Comprehensive development guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecommerce-platform
```

2. **Install dependencies for both frontend and backend**
```bash
npm run install-all
```

3. **Set up environment variables**

Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Frontend (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=ModernShop
```

4. **Start the development servers**
```bash
npm run dev
```

This will start both the backend server (http://localhost:5000) and frontend development server (http://localhost:3000).

### Alternative: Start servers separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/addresses` - Add new address

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/:id` - Get single product with reviews
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's order history
- `GET /api/orders/:id` - Get single order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Payments
- `POST /api/payments/create-payment-intent` - Process payment
- `POST /api/payments/refund` - Process refund (Admin only)
- `GET /api/payments/methods` - Get available payment methods

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with pagination
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/products/low-stock` - Get low stock products

## 🎯 Key Features Explained

### 1. Authentication System
- JWT-based authentication with refresh tokens
- Role-based access control (Customer vs Admin)
- Secure password hashing with bcryptjs
- Password reset functionality (ready for email integration)

### 2. Product Management
- Complete CRUD operations for products
- Category-based organization
- Product variants (size, color, etc.)
- Image management (ready for cloud storage)
- Inventory tracking with low stock alerts
- Customer reviews and ratings system

### 3. Shopping Cart
- Persistent cart storage in database
- Real-time synchronization across devices
- Optimistic UI updates for better UX
- Inventory validation before adding items
- Support for product variants

### 4. Order Processing
- Multi-step checkout process
- Multiple shipping and billing addresses
- Tax and shipping calculation
- Payment processing with Stripe
- Order status tracking with timeline
- Order cancellation and refund system

### 5. Admin Dashboard
- Comprehensive analytics and reporting
- User management with role control
- Product management with bulk operations
- Order management with status updates
- Low stock alerts and inventory management

### 6. Search & Filtering
- Full-text search across products
- Advanced filtering by category, price, rating
- Sorting options (price, rating, date, name)
- Pagination for large datasets
- URL-based filter state management

## 🔒 Security Features

- **Input Validation** - Express Validator for all inputs
- **Authentication** - JWT tokens with expiration
- **Authorization** - Role-based access control
- **Password Security** - bcryptjs hashing with salt
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin request security
- **Security Headers** - Helmet middleware
- **Environment Variables** - Secure configuration management

## 📱 Responsive Design

- **Mobile-First Approach** - Optimized for mobile devices
- **Material-UI Components** - Consistent, accessible design
- **Breakpoint System** - Responsive layouts for all screen sizes
- **Touch-Friendly Interface** - Mobile-optimized interactions
- **Fast Loading** - Optimized bundle sizes and lazy loading

## 🧪 Testing

```bash
# Run backend tests
npm run test:server

# Run frontend tests
npm run test:client

# Run all tests
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy with Git: `git push heroku main`

### Frontend Deployment (Vercel)
1. Build production version: `npm run build`
2. Deploy to Vercel: `vercel --prod`

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure network access and database user
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [ECOMMERCE_GUIDE.md](ECOMMERCE_GUIDE.md) for detailed documentation
- Open an issue for bug reports
- Contact: [your-email@example.com]

## 🎉 Acknowledgments

- Material-UI for the excellent component library
- MongoDB for the flexible database solution
- Stripe for payment processing capabilities
- React team for the amazing frontend framework

---

**Built with ❤️ using modern web technologies**
