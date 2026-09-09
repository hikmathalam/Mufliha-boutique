const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const ADMIN_EMAIL = 'admin@hikmath.com';
const ADMIN_PASSWORD = 'hikmath1234';
const ADMIN_NAME = 'Mufliha Admin';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for admin seeding');

    // Always delete the existing admin to ensure password gets hashed fresh
    await User.deleteMany({ email: ADMIN_EMAIL });
    console.log(`Cleared existing admin user with email ${ADMIN_EMAIL}`);

    // Also clear other admin users if any
    await User.deleteMany({ isAdmin: true });

    // Create the admin user fresh
    const user = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      isAdmin: true,
    });

    console.log('✅ Admin user created and hashed successfully!');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
