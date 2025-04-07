import express from 'express';
import path from 'path';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import connectDB from './config/db.js'; // DB connection
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware for session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_default_secret_key', // Use an environment secret for session cookies
    resave: false, // Prevent unnecessary session resaving
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side access to session cookies
      maxAge: 1000 * 60 * 60 * 24, // 1-day session expiration
    },
  })
);

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware to parse incoming JSON data
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Get the absolute directory path for serving static files
const __dirname = path.resolve();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Make the uploads folder publicly accessible
app.use('/uploads', express.static(uploadDir));

// Serve frontend files if in production
if (process.env.NODE_ENV === 'production') {
  // Serve the React frontend static files
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // Handle any other route requests by serving index.html (React SPA behavior)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // Development root route
  app.get('/', (req, res) => {
    res.send('API is running in Development mode');
  });
}

// Error handling middleware for 404 errors
app.use(notFound);

// Centralized error handler for all other errors
app.use(errorHandler);

// Port setup and starting the server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);
