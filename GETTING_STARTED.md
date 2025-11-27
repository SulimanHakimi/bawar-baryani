# 🚀 Getting Started with Bawar Biryani

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed (`node --version`)
- ✅ MongoDB installed and running (`mongod`)
- ✅ npm or yarn package manager
- ✅ Git (optional, for version control)

## Step-by-Step Setup

### 1️⃣ Install Dependencies

Open terminal in the project root and run:

```bash
npm run install-all
```

This will install dependencies for:

- Root (concurrently)
- Server (Express, MongoDB, JWT, etc.)
- Client (Next.js, React, Tailwind, etc.)

**Expected output**: "added XXX packages" for each directory

### 2️⃣ Start MongoDB

Ensure MongoDB is running. Open a new terminal and run:

```bash
mongod
```

Or if you have MongoDB as a service:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 3️⃣ Seed the Database

This creates the admin user and sample products:

```bash
cd server
npm run seed
cd ..
```

**Expected output**:

```
MongoDB Connected
Data Seeded
```

**What gets created**:

- Admin user: admin@bawar.com / admin123
- 3 sample products (Qabili Palau, Mantu, Bolani)

### 4️⃣ Start the Application

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

**Expected output**:

```
[server] Server running on port 5000
[server] MongoDB Connected
[client] ready - started server on 0.0.0.0:3000
```

### 5️⃣ Access the Application

Open your browser and visit:

**Frontend**: http://localhost:3000

You should see the Bawar Biryani homepage with:

- Hero section with "Bawar Biryani" title
- Tagline: "Taste the Pashtoon hearth..."
- "Order Biryani" button
- Featured dishes section

## 🎯 First Actions

### As a Customer

1. **Browse Menu**

   - Click "Order Biryani" or navigate to Menu
   - View all products

2. **View Product Details**

   - Click on any product card
   - See ingredients, calories, price
   - Add to cart

3. **Register an Account**

   - Click "Login" in navbar
   - Click "Don't have an account? Sign up"
   - Fill in name, email, password
   - Submit

4. **Complete a Purchase**

   - Add items to cart
   - Go to cart
   - Proceed to checkout
   - Enter shipping address
   - Place order

5. **View Your Profile**
   - Click your name in navbar
   - See order history
   - Check points balance

### As an Admin

1. **Login**

   - Go to http://localhost:3000/login
   - Email: `admin@bawar.com`
   - Password: `admin123`
   - You'll be auto-redirected to dashboard

2. **View Dashboard**

   - See statistics (revenue, orders, users, products)

3. **Manage Orders**

   - Click "Orders" in sidebar
   - View all customer orders
   - Update order status

4. **Manage Menu**

   - Click "Menu Management"
   - Add new products
   - Edit existing products
   - Delete products

5. **View Users**
   - Click "Users" in sidebar
   - See all registered users
   - View their points

## 🔧 Configuration

### Environment Variables

**Server** (`server/.env`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bawar-bryani
JWT_SECRET=bawar_secret_key_123
```

**Client** (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Changing Ports

If ports 3000 or 5000 are in use:

**Backend** (server/.env):

```env
PORT=5001
```

**Frontend** (client/package.json):

```json
"dev": "next dev -p 3001"
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError`

**Solution**:

1. Ensure MongoDB is running: `mongod`
2. Check connection string in `server/.env`
3. Verify MongoDB is on port 27017

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:

1. Find process using port: `netstat -ano | findstr :3000`
2. Kill process: `taskkill /PID <PID> /F`
3. Or change port in configuration

### Dependencies Not Installing

**Error**: `npm ERR!`

**Solution**:

1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Delete package-lock.json
4. Reinstall: `npm install`

### Frontend Not Loading

**Solution**:

1. Check if backend is running (http://localhost:5000)
2. Check browser console for errors
3. Verify API URL in code matches backend port
4. Clear browser cache

### Admin Login Not Working

**Solution**:

1. Ensure database was seeded: `cd server && npm run seed`
2. Check credentials: admin@bawar.com / admin123
3. Check browser console for errors
4. Verify JWT_SECRET is set in server/.env

## 📱 Testing Features

### Test Points System

1. Register as a new user
2. Add products worth $50 to cart
3. Complete checkout
4. Go to profile
5. You should see 5 points earned (1 pt per $10)
6. Make another order
7. At checkout, redeem points

### Test Admin Features

1. Login as admin
2. Go to Menu Management
3. Add a new product:
   - Name: "Kabuli Pulao"
   - Price: 18.99
   - Category: "Main"
   - Description: "Traditional rice dish"
4. Save and verify it appears on menu
5. Go to Orders
6. Update an order status to "Delivered"

### Test Cart Persistence

1. Add items to cart
2. Close browser
3. Reopen and go to cart
4. Items should still be there (localStorage)

## 🎨 Customization Quick Start

### Change Colors

Edit `client/tailwind.config.js`:

```javascript
colors: {
  saffron: '#YOUR_COLOR',
  maroon: '#YOUR_COLOR',
}
```

### Change Fonts

Edit `client/src/pages/_document.js`:

```javascript
<link href="https://fonts.googleapis.com/css2?family=YourFont" />
```

### Add Your Logo

1. Add logo image to `client/public/`
2. Update Navbar component:

```javascript
<Image src="/logo.png" alt="Logo" width={50} height={50} />
```

### Update Restaurant Info

Edit `client/src/components/Footer.js`:

- Address
- Phone number
- Email

## 📚 Learning Resources

**Next.js**: https://nextjs.org/docs
**Express.js**: https://expressjs.com/
**MongoDB**: https://docs.mongodb.com/
**Tailwind CSS**: https://tailwindcss.com/docs

## 🎉 You're Ready!

Your Bawar Biryani application is now running. Explore the features, customize the design, and make it your own!

**Need help?** Check:

- README.md - Full documentation
- VERIFICATION.md - Feature checklist
- SUMMARY.md - Project overview

---

**Happy Coding!** 🍛✨
