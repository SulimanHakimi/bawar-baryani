const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' }); // Adjust path if needed, or run from server dir

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    await User.deleteMany({});
    await Product.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@bawar.com',
      password: hashedPassword,
      role: 'admin'
    });

    await Product.create([
      {
        name: 'Qabili Palau',
        description: 'Traditional Afghan rice dish with carrots and raisins.',
        price: 15.99,
        image: '/images/qabili.jpg',
        category: 'Main',
        calories: 800,
        ingredients: ['Rice', 'Lamb', 'Carrots', 'Raisins', 'Spices']
      },
      {
        name: 'Mantu',
        description: 'Steamed dumplings filled with spiced beef.',
        price: 12.99,
        image: '/images/mantu.jpg',
        category: 'Appetizer',
        calories: 600,
        ingredients: ['Dough', 'Beef', 'Onions', 'Yogurt', 'Lentils']
      },
      {
        name: 'Bolani',
        description: 'Stuffed flatbread with potatoes or leeks.',
        price: 8.99,
        image: '/images/bolani.jpg',
        category: 'Appetizer',
        calories: 400,
        ingredients: ['Flour', 'Potatoes', 'Leeks', 'Spices']
      }
    ]);

    console.log('Data Seeded');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
