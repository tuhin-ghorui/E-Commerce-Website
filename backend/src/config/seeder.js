import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Load env configurations
dotenv.config();

// Connect to MongoDB
connectDB();

const SEED_USERS = [
  {
    name: 'Admin Astra',
    email: 'admin@astrashop.com',
    password: 'adminpassword123',
    role: 'admin',
  },
  {
    name: 'Alex Miller',
    email: 'alex@example.com',
    password: 'userpassword123',
    role: 'user',
  },
];

const SEED_PRODUCTS = [
  // Electronics
  {
    name: 'Astra SoundMax Wireless Headphones',
    price: 189.99,
    category: 'Electronics',
    description: 'Experience pure sonic bliss with the SoundMax. High-fidelity drivers, active noise cancellation, and a luxurious memory foam headband combine for an unmatched auditory journey. Up to 40 hours of battery life on a single charge.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.8,
    reviews: [
      { user: 'Sarah L.', rating: 5, comment: 'Phenomenal sound quality and super comfortable!' },
      { user: 'John D.', rating: 4, comment: 'Active noise cancellation is good, battery is superb.' },
    ],
  },
  {
    name: 'Astra RGB Mechanical Keyboard',
    price: 129.99,
    category: 'Electronics',
    description: 'Designed for typing purists. Linear mechanical switches offer tactile keypresses, with customizable per-key RGB backlighting and durable double-shot PBT keycaps inside an anodized aluminum frame.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock: 10,
    rating: 4.7,
    reviews: [],
  },
  {
    name: 'Premium Bluetooth Speaker',
    price: 89.99,
    category: 'Electronics',
    description: 'IPX7 waterproof and ruggedly engineered. Immersive 360-degree sound with rich bass response. Dual passive radiators keep vocals crystal clear. Perfect for outdoor gather and desk setups.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.3,
    reviews: [],
  },

  // Fashion
  {
    name: 'Exquisite Leather Chronograph Watch',
    price: 249.50,
    category: 'Fashion',
    description: 'A timeless timepiece designed for the discerning individual. Featuring a double-domed sapphire crystal, Japanese quartz movement, and an Italian hand-stitched leather strap, this chronograph is both a tool and a statement.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    stock: 8,
    rating: 4.7,
    reviews: [
      { user: 'Jordan S.', rating: 5, comment: 'Gorgeous watch, fits perfectly and looks very premium!' },
    ],
  },
  {
    name: 'Premium Leather Travel Backpack',
    price: 159.00,
    category: 'Fashion',
    description: 'Crafted from full-grain water-resistant leather. Includes dedicated 15-inch laptop compartment, padded mesh shoulder straps, and modular organizer dividers. The perfect travel and office companion.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    stock: 6,
    rating: 4.9,
    reviews: [],
  },
  {
    name: 'Premium Denim Jacket',
    price: 95.00,
    category: 'Fashion',
    description: 'Constructed from heavy-duty organic selvedge denim. Over time, it conforms to your body, wearing in beautifully. Features solid copper shank buttons, double breast pockets, and welt hand pockets.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    stock: 7,
    rating: 4.5,
    reviews: [],
  },

  // Fitness
  {
    name: 'UltraLite Smart Running Shoes',
    price: 110.00,
    category: 'Fitness',
    description: 'Run faster, recover smarter. Made with a 3D-knit recycled upper and responsive energy-returning midsole, these shoes adapt to your stride. The embedded smart chip syncs metrics directly to your health app.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    stock: 3,
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Smart Fitness Tracker Pro',
    price: 79.99,
    category: 'Fitness',
    description: '24/7 biometric tracking. Monitors heart rate, blood oxygen levels, sleep quality, and daily calorie expenditure. Includes built-in GPS and a vibrant AMOLED color display. Battery lasts up to 10 days.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.4,
    reviews: [],
  },
  {
    name: 'Eco-Friendly Yoga Mat',
    price: 39.99,
    category: 'Fitness',
    description: 'Made from sustainably harvested natural tree rubber. Provides high cushion support and anti-slip grip even during sweaty workouts. Fully biodegradable and free of toxic PVCs.',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.7,
    reviews: [],
  },

  // Home Living
  {
    name: 'Astra Minimalist Ceramic Vase',
    price: 45.00,
    category: 'Home Living',
    description: 'Individually wheel-thrown and glazed by artisans, this stoneware vase embodies wabi-sabi simplicity. The matte textured surface and neutral cream tones provide the perfect framing for fresh or dried botanicals.',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.5,
    reviews: [],
  },
  {
    name: 'Ergonomic Mesh Office Chair',
    price: 299.99,
    category: 'Home Living',
    description: 'Designed to support back posture. Features 3D-adjustable armrests, adaptive lumbar support depth, synchronous tilt mechanism, and breathable elastomeric mesh upholstery to keep you cool and focused.',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80',
    stock: 4,
    rating: 4.6,
    reviews: [],
  },
  {
    name: 'Architectural Table Lamp',
    price: 69.99,
    category: 'Home Living',
    description: 'Sculptural table light featuring a concrete dome base and warm glowing LED lighting. The minimal geometry casts a subtle indirect wash across your workspace or bedside table, adjustable via touch dimming.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    stock: 9,
    rating: 4.8,
    reviews: [],
  },
];

const importData = async () => {
  try {
    // Wipe Database Collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database collections wiped successfully.');

    // Seed User Accounts
    await User.create(SEED_USERS);
    console.log('Seed users created.');

    // Seed Store Products
    await Product.create(SEED_PRODUCTS);
    console.log('Seed products created.');

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

importData();
