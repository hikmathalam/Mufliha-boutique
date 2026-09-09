const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Shared in-memory user store (same as authController)
const MEMORY_USERS = [];
let _initialized = false;

const initMemoryUsers = async () => {
  if (_initialized) return;
  _initialized = true;
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);
  MEMORY_USERS.push(
    {
      _id: 'mem_admin_001',
      name: 'Mufliha Admin',
      email: 'admin@mufliha.com',
      password: adminHash,
      isAdmin: true,
      wishlist: [],
    },
    {
      _id: 'mem_user_001',
      name: 'Demo User',
      email: 'user@mufliha.com',
      password: userHash,
      isAdmin: false,
      wishlist: [],
    }
  );
};
initMemoryUsers();

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

    if (mongoose.connection.readyState === 1) {
      // MongoDB is live — fetch from DB
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = user;
    } else {
      // MongoDB offline — look up in-memory store
      await initMemoryUsers();
      const memUser = MEMORY_USERS.find(
        (u) => u._id === decoded.id || u._id === String(decoded.id)
      );
      if (!memUser) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
      const { password, ...safe } = memUser;
      req.user = safe;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
