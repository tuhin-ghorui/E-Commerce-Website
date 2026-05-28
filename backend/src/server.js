import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Database and Middleware Config
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route Handlers
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares Setup
app.use(cors({
  origin: '*', // Allow all origins for local testing convenience
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Enable HTTP request logger in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check Greeting
app.get('/', (req, res) => {
  res.json({ message: 'ASTRA E-Commerce REST API is active and running.' });
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Fallback Error Interceptors
app.use(notFound);
app.use(errorHandler);

// Establish Server Port and Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
