const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for testing');

    const email = 'hikmathalam121575@gmail.com';
    const password = 'hikmath1234';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found in DB!');
      process.exit(1);
    }

    console.log('User found:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      passwordHash: user.password
    });

    const isMatch = await user.matchPassword(password);
    console.log('Password match test:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
