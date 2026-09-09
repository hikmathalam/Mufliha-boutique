const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const os = require('os');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();

// Disable mongoose buffering in serverless to prevent requests hanging until timeout
mongoose.set('bufferCommands', false);

// Cache MongoDB connection across serverless function invocations
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ Warning: MONGO_URI is not set in environment variables');
    return;
  }
  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, // 3 second timeout max - prevents serverless timeout crashes!
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Initiate connection on startup
connectDB().catch(err => console.error('Initial DB connection error:', err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded files safely
const uploadPath = process.env.VERCEL ? path.join(os.tmpdir(), 'uploads') : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));

// CORS configuration (supports localhost, configured FRONTEND_URL, and *.vercel.app)
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Root Health Check endpoint (always returns 200 immediately without waiting for DB)
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Mufliha Boutique Backend API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      hasMongoUri: Boolean(process.env.MONGO_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    },
  });
});

// Middleware to ensure DB connection before handling API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect error:', err);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening only if run directly as standalone process (e.g. node server.js)
const PORT = process.env.PORT || 5000;
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel Serverless Functions
module.exports = app;
