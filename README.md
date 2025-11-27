# Bawar Biryani - Complete Web Application

A production-ready full-stack web application for an Afghani Pashtoon restaurant featuring Next.js, Express.js, and MongoDB.

## Features

### Frontend (Next.js Pages Router)

- **Responsive Design**: Mobile-first with Afghani Pashtoon cultural motifs
- **Authentication**: JWT-based login/register with role-based access
- **Product Catalog**: Dynamic menu with detailed product pages
- **Shopping Cart**: Real-time cart with localStorage persistence
- **Checkout System**: Address input with points redemption
- **Points System**: Earn and redeem loyalty points
- **Admin Dashboard**: Complete order, menu, and user management
- **SEO Optimized**: Dynamic meta tags, sitemap, robots.txt, schema.org markup

### Backend (Express.js + MongoDB)

- **RESTful API**: Clean API architecture
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, input validation
- **Points Logic**: Automatic points calculation and redemption

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection string ready

### Installation

1. **Install all dependencies**

   ```bash
   npm run install-all
   ```

2. **Configure environment variables**

   Server (`server/.env`):

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bawar-bryani
   JWT_SECRET=bawar_secret_key_123
   ```

3. **Seed the database**

   ```bash
   cd server
   npm run seed
   ```

   This creates:

   - Admin user: `admin@bawar.com` / `admin123`
   - Sample products (Qabili Palau, Mantu, Bolani)

4. **Start development servers**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

```
bawar-bryani/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Next.js pages
│   │   │   ├── admin/    # Admin dashboard
│   │   │   ├── product/  # Product details
│   │   │   └── ...
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
├── server/                # Express.js backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── scripts/          # Seed script
└── docker-compose.yml    # Docker setup
```

## Default Credentials

**Admin Account**

- Email: `admin@bawar.com`
- Password: `admin123`

## Design System

**Colors**

- Saffron: `#F4C430` (Primary accent)
- Deep Maroon: `#800000` (Brand color)
- Saffron Light: `#F9E076`
- Maroon Dark: `#600000`

**Typography**

- Sans-serif: Inter
- Serif (Headings): Merriweather

## Available Scripts

### Root

- `npm run dev` - Start both client and server
- `npm run install-all` - Install all dependencies
- `npm run server` - Start server only
- `npm run client` - Start client only

### Server

- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run seed` - Seed database

### Client

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server

## Docker Deployment

```bash
docker-compose up
```

Services:

- MongoDB: Port 27017
- Backend: Port 5000
- Frontend: Port 3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders

- `POST /api/orders` - Create order (protected)
- `GET /api/orders/myorders` - Get user orders (protected)
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin

- `GET /api/admin/stats` - Dashboard statistics (admin)
- `GET /api/admin/users` - Get all users (admin)

## User Flows

### Customer Flow

1. Browse menu → View product details
2. Add to cart → Proceed to checkout
3. Login/Register → Enter shipping address
4. Redeem points (optional) → Place order
5. View order history in profile

### Admin Flow

1. Login with admin credentials
2. Auto-redirect to `/admin/dashboard`
3. View statistics, manage orders, products, and users

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- Protected routes with middleware
- Role-based access control
- Helmet.js security headers
- CORS configuration
- Input validation

## SEO Features

- Dynamic meta tags per page
- Canonical URLs
- Open Graph tags
- Twitter Card support
- Schema.org LocalBusiness markup
- Dynamic sitemap.xml
- robots.txt
- Semantic HTML structure
- Accessible components

## Points System

- **Earning**: 1 point per $10 spent
- **Redemption**: 10 points = $1.00 discount
- **Tracking**: Full points history in user profile
- **Limits**: Cannot redeem more than order total

## Pages

### Public

- `/` - Home with hero and featured dishes
- `/menu` - Full product catalog
- `/product/[id]` - Product details
- `/about` - Restaurant story
- `/login` - User login
- `/register` - User registration

### Protected

- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/profile` - User dashboard with orders and points

### Admin

- `/admin/dashboard` - Statistics overview
- `/admin/orders` - Order management
- `/admin/menu` - Product CRUD
- `/admin/users` - User list

## Testing the Application

1. **Register a new user** at `/register`
2. **Browse products** at `/menu`
3. **Add items to cart** and view at `/cart`
4. **Complete checkout** at `/checkout`
5. **View order history** at `/profile`
6. **Login as admin** to access dashboard

## Contributing

This is a production-ready template. Customize as needed:

- Update MongoDB connection string
- Replace placeholder images
- Modify color scheme in `tailwind.config.js`
- Add payment gateway integration
- Implement email notifications

## License

MIT License - Feel free to use for your projects

## Support

For issues or questions, please check:

- MongoDB is running
- All dependencies are installed
- Environment variables are set correctly
- Ports 3000 and 5000 are available

---

**Built with ❤️ celebrating Afghani Pashtoon culture**
