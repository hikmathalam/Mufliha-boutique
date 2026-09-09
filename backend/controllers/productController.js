const Product = require('../models/Product');
const mongoose = require('mongoose');

const defaultProducts = [
  {
    _id: "650000000000000000000001",
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
    rating: 4.9,
    numReviews: 24,
    features: ["24k Pure Gold Plating", "6 Months Shine Warranty", "Kundan stones", "Matching earrings included"]
  },
  {
    _id: "650000000000000000000002",
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
    rating: 5.0,
    numReviews: 18,
    features: ["Heavy Royal Haar", "Maang Tikka & Nath Included", "6-Month Color Guarantee", "Velvet Presentation Case"]
  },
  {
    _id: "650000000000000000000003",
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
    rating: 4.8,
    numReviews: 31,
    features: ["Designer wear", "Custom fitting", "Red and Gold zardozi theme", "Dual dupatta included"]
  },
  {
    _id: "650000000000000000000004",
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
    rating: 4.9,
    numReviews: 15,
    features: ["Pure Italian Velvet", "Swarovski Accents", "Complimentary Alteration", "Dry Cleaned"]
  },
  {
    _id: "650000000000000000000005",
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
    rating: 4.7,
    numReviews: 20,
    features: ["Pastel Blush Theme", "Pearl Handwork", "Cancan Layer Included", "Lightweight Fit"]
  },
  {
    _id: "650000000000000000000006",
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
    rating: 4.8,
    numReviews: 14,
    features: ["Real Emerald Drops", "6 Months Plating Warranty", "Uncut Diamond Accents", "Adjustable Dori"]
  },
  {
    _id: "650000000000000000000007",
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
    rating: 4.9,
    numReviews: 22,
    features: ["Temple Design", "22k Gold Plating", "6 Months Warranty", "Handcrafted Motifs"]
  },
  {
    _id: "650000000000000000000008",
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
    rating: 4.7,
    numReviews: 19,
    features: ["Temple style", "6 Months Polish Warranty", "Pair of two bangles", "Screw open mechanism"]
  },
  {
    _id: "650000000000000000000009",
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
    rating: 4.8,
    numReviews: 16,
    features: ["Freshwater Pearls", "Detachable Sahare Chains", "6 Months Guarantee", "Hypoallergenic Pin"]
  },
  {
    _id: "650000000000000000000010",
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
    rating: 4.6,
    numReviews: 11,
    features: ["6 Months Color Warranty", "Adjustable band", "Uncut Polki Stone"]
  },
  {
    _id: "650000000000000000000011",
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
    rating: 4.9,
    numReviews: 13,
    features: ["Micropave Diamonds", "Sapphire Center", "6-Month Polish Guarantee"]
  },
  {
    _id: "650000000000000000000012",
    name: "Royal Hathphool & Mathapatti",
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
    rating: 4.9,
    numReviews: 27,
    features: ["Full Hand Harness Set", "Matching Mathapatti", "6-Month Shine Warranty", "Adjustable Rings"]
  },
  {
    _id: "650000000000000000000013",
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
    rating: 4.8,
    numReviews: 17,
    features: ["Pair of Two Anklets", "Acoustic Ghungroo Bells", "6 Months Color Guarantee", "Secure S-Hook"]
  }
];

let memoryProducts = [...defaultProducts];

// @desc    Fetch all products with search and filter
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, isAvailable } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (keyword) query.name = { $regex: keyword, $options: 'i' };
      if (category && category !== 'All') query.category = category;
      if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) query.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
      }
      if (isAvailable === 'true') query.isAvailable = true;

      let sortQuery = {};
      if (sort === 'priceAsc') sortQuery.pricePerDay = 1;
      else if (sort === 'priceDesc') sortQuery.pricePerDay = -1;
      else if (sort === 'rating') sortQuery.rating = -1;
      else sortQuery.createdAt = -1;

      const dbProducts = await Product.find(query).sort(sortQuery);
      if (dbProducts && dbProducts.length > 0) {
        return res.json(dbProducts);
      }
    }

    // In-memory fallback
    let filtered = [...memoryProducts];

    if (keyword) {
      const q = keyword.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.pricePerDay >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.pricePerDay <= Number(maxPrice));
    }
    if (isAvailable === 'true') {
      filtered = filtered.filter(p => p.isAvailable);
    }

    if (sort === 'priceAsc') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === 'priceDesc') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    res.json(filtered);
  } catch (error) {
    res.json(memoryProducts);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
    const found = memoryProducts.find(p => p._id === req.params.id);
    if (found) return res.json(found);
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const found = memoryProducts.find(p => p._id === req.params.id);
    if (found) return res.json(found);
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = new Product(req.body);
      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    }
    const newProduct = {
      _id: Date.now().toString(),
      ...req.body
    };
    memoryProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
