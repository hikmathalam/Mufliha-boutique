const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Royal Kundan Choker Set",
    description: "An exquisite 24k gold Kundan choker set, perfect for the classic bride. Features intricate meenakari work, semi-precious stone embellishments, and a premium 6-month color and shine warranty.",
    pricePerDay: 150,
    securityDeposit: 500,
    category: "Bridal Sets",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787"],
    isAvailable: true,
    features: ["24k Pure Gold Plating", "6 Months Shine Warranty", "Kundan stones", "Matching earrings included"]
  },
  {
    name: "Diamond Encrusted Bridal Lehenga",
    description: "A breathtaking heavily embellished red bridal lehenga with zardozi and diamond-cut stones.",
    pricePerDay: 300,
    securityDeposit: 1000,
    category: "Bridal Dresses",
    images: ["https://images.unsplash.com/photo-1594552072238-185671175bf9?q=80&w=2787"],
    isAvailable: true,
    features: ["Designer wear", "Custom fitting", "Red and Gold theme"]
  },
  {
    name: "Emerald Drop Necklace",
    description: "A statement piece featuring large emerald drops surrounded by uncut diamonds, crafted with high-durability gold-plating covered by a 6-month warranty.",
    pricePerDay: 80,
    securityDeposit: 300,
    category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940"],
    isAvailable: true,
    features: ["Real Emeralds", "6 Months Plating Warranty", "Uncut Diamonds"]
  },
  {
    name: "Antique Temple Bangles",
    description: "Traditional South Indian style temple jewellery bangles crafted with precision, backed by our 6-month polish warranty.",
    pricePerDay: 40,
    securityDeposit: 150,
    category: "Earrings & Bangles",
    images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864"],
    isAvailable: true,
    features: ["Temple style", "6 Months Polish Warranty", "Pair of two"]
  },
  {
    name: "Polki Diamond Ring",
    description: "A large uncut Polki diamond statement ring set in premium gold-forming, backed by a 6-month color guarantee.",
    pricePerDay: 35,
    securityDeposit: 100,
    category: "Rings",
    images: ["https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=2940"],
    isAvailable: true,
    features: ["6 Months Color Warranty", "Adjustable band"]
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Products Seeded!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
