const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const products = [
  {
    name: "Royal Kundan Choker Set",
    description: "An exquisite 24k gold Kundan choker set, perfect for the classic bride. Features intricate meenakari work, semi-precious stone embellishments, and a premium 6-month color and shine warranty.",
    pricePerDay: 150,
    securityDeposit: 500,
    category: "Bridal Sets",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2800"
    ],
    isAvailable: true,
    features: ["24k Pure Gold Plating", "6 Months Shine Warranty", "Kundan stones", "Matching earrings included"]
  },
  {
    name: "Maharani Full Bridal Jewellery Set",
    description: "Grand heritage bridal set including a heavy choker, long haar necklace, maang tikka, nath, and layered earrings. Includes 6-month color replacement warranty.",
    pricePerDay: 280,
    securityDeposit: 800,
    category: "Bridal Sets",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2800",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864"
    ],
    isAvailable: true,
    features: ["Heavy Royal Haar", "Maang Tikka & Nath Included", "6-Month Color Guarantee", "Velvet Presentation Case"]
  },
  {
    name: "Diamond Encrusted Bridal Lehenga",
    description: "A breathtaking heavily embellished red bridal lehenga with zardozi and diamond-cut stone hand embroidery.",
    pricePerDay: 300,
    securityDeposit: 1000,
    category: "Bridal Dresses",
    images: [
      "https://images.unsplash.com/photo-1594552072238-185671175bf9?q=80&w=2787",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2883",
      "https://images.unsplash.com/photo-1596450514735-11003b87ed72?q=80&w=2787"
    ],
    isAvailable: true,
    features: ["Designer wear", "Custom fitting", "Red and Gold zardozi theme", "Dual dupatta included"]
  },
  {
    name: "Regal Velvet Ballgown Lehenga",
    description: "Deep maroon velvet bridal gown with gold threadwork and Swarovski crystal accents. Designed for grand royal receptions.",
    pricePerDay: 350,
    securityDeposit: 1200,
    category: "Bridal Dresses",
    images: [
      "https://images.unsplash.com/photo-1596450514735-11003b87ed72?q=80&w=2787",
      "https://images.unsplash.com/photo-1628045952342-99882fa4b043?q=80&w=2800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2883"
    ],
    isAvailable: true,
    features: ["Pure Italian Velvet", "Swarovski Accents", "Complimentary Alteration", "Dry Cleaned"]
  },
  {
    name: "Modern Pastel Mermaid Gown",
    description: "Sophisticated blush pink mermaid silhouette with pearl highlights and sheer embroidered sleeves.",
    pricePerDay: 250,
    securityDeposit: 900,
    category: "Bridal Dresses",
    images: [
      "https://images.unsplash.com/photo-1628045952342-99882fa4b043?q=80&w=2800",
      "https://images.unsplash.com/photo-1594552072238-185671175bf9?q=80&w=2787",
      "https://images.unsplash.com/photo-1596450514735-11003b87ed72?q=80&w=2787"
    ],
    isAvailable: true,
    features: ["Pastel Blush Theme", "Pearl Handwork", "Cancan Layer Included", "Lightweight Fit"]
  },
  {
    name: "Emerald Drop Necklace",
    description: "A statement piece featuring large emerald drops surrounded by uncut diamonds, crafted with high-durability gold-plating covered by a 6-month warranty.",
    pricePerDay: 80,
    securityDeposit: 300,
    category: "Necklaces",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2800"
    ],
    isAvailable: true,
    features: ["Real Emerald Drops", "6 Months Plating Warranty", "Uncut Diamond Accents", "Adjustable Dori"]
  },
  {
    name: "Classic Temple Gold Haar",
    description: "Traditional 22k gold plated long necklace with divine Lakshmi motifs and pearl drops. 6-month warranty included.",
    pricePerDay: 110,
    securityDeposit: 400,
    category: "Necklaces",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940"
    ],
    isAvailable: true,
    features: ["Temple Design", "22k Gold Plating", "6 Months Warranty", "Handcrafted Motifs"]
  },
  {
    name: "Antique Temple Bangles",
    description: "Traditional South Indian style temple jewellery bangles crafted with precision, backed by our 6-month polish warranty.",
    pricePerDay: 40,
    securityDeposit: 150,
    category: "Earrings & Bangles",
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864",
      "https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=2940",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2800"
    ],
    isAvailable: true,
    features: ["Temple style", "6 Months Polish Warranty", "Pair of two bangles", "Screw open mechanism"]
  },
  {
    name: "Royal Jhumka & Chandbali Combo",
    description: "Stunning 24k gold-plated statement Jhumkas with freshwater pearls and detachable ear chains.",
    pricePerDay: 45,
    securityDeposit: 160,
    category: "Earrings & Bangles",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2800",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864"
    ],
    isAvailable: true,
    features: ["Freshwater Pearls", "Detachable Sahare Chains", "6 Months Guarantee", "Hypoallergenic Pin"]
  },
  {
    name: "Polki Diamond Ring",
    description: "A large uncut Polki diamond statement ring set in premium gold-forming, backed by a 6-month color guarantee.",
    pricePerDay: 35,
    securityDeposit: 100,
    category: "Rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=2940",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=2864"
    ],
    isAvailable: true,
    features: ["6 Months Color Warranty", "Adjustable band", "Uncut Polki Stone"]
  },
  {
    name: "Crystal Sapphire Solitaire Ring",
    description: "Elegant sapphire blue stone ring framed with micropave cz diamonds and 24k micro gold polish.",
    pricePerDay: 30,
    securityDeposit: 90,
    category: "Rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f6612644e?q=80&w=2940",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940"
    ],
    isAvailable: true,
    features: ["Micropave Diamonds", "Sapphire Center", "6-Month Polish Guarantee"]
  },
  {
    name: "Royal Royal Hathphool & Mathapatti",
    description: "Exquisite bridal Hathphool hand harness paired with a matching Kundan Mathapatti. Guaranteed 6-month color warranty.",
    pricePerDay: 65,
    securityDeposit: 220,
    category: "Fancy Items",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2940",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2787",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940"
    ],
    isAvailable: true,
    features: ["Full Hand Harness Set", "Matching Mathapatti", "6-Month Shine Warranty", "Adjustable Rings"]
  },
  {
    name: "Golden Kundan Payal & Anklet Pair",
    description: "Graceful heavy Kundan anklet pair with ghungroo bells and 24k gold micro-plating with 6-month warranty.",
    pricePerDay: 50,
    securityDeposit: 180,
    category: "Anklets",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2787",
      "https://images.unsplash.com/photo-1589312658865-68ff3789069d?q=80&w=2787",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2836"
    ],
    isAvailable: true,
    features: ["Pair of Two Anklets", "Acoustic Ghungroo Bells", "6 Months Color Guarantee", "Secure S-Hook"]
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
