const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
    expiresIn: '30d',
  });
};

// In-memory user store (used when MongoDB is offline)
// Passwords are bcrypt-hashed: admin123 → hash, user123 → hash
const MEMORY_USERS = [];

// Pre-hash passwords once on startup
const initMemoryUsers = async () => {
  if (MEMORY_USERS.length > 0) return;
  const adminHash = await bcrypt.hash('hikmath1234', 10);
  const userHash = await bcrypt.hash('user123', 10);
  MEMORY_USERS.push(
    {
      _id: 'mem_admin_001',
      name: 'Mufliha Admin',
      email: 'admin@hikmath.com',
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

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (isDbConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await User.create({ name, email, password });
      if (user) {
        const token = generateToken(user._id);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      }
      return res.status(400).json({ message: 'Invalid user data' });
    }

    // --- In-memory fallback ---
    await initMemoryUsers();
    const existing = MEMORY_USERS.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `mem_${Date.now()}`,
      name,
      email,
      password: hash,
      isAdmin: false,
      wishlist: [],
    };
    MEMORY_USERS.push(newUser);
    const token = generateToken(newUser._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // --- In-memory fallback ---
    await initMemoryUsers();
    const memUser = MEMORY_USERS.find((u) => u.email === email);
    if (memUser && (await bcrypt.compare(password, memUser.password))) {
      const token = generateToken(memUser._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        isAdmin: memUser.isAdmin,
        token,
      });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (Dashboard data)
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) return res.json(user);
      return res.status(404).json({ message: 'User not found' });
    }

    // --- In-memory fallback ---
    await initMemoryUsers();
    const memUser = MEMORY_USERS.find((u) => u._id === req.user._id || u._id === String(req.user._id));
    if (memUser) {
      const { password, ...safe } = memUser;
      return res.json(safe);
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
