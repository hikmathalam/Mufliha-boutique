const Product = require('../models/Product');

// @desc    Fetch all products with search and filter
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, isAvailable } = req.query;
    
    let query = {};
    
    // Search by keyword
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Filter by availability
    if (isAvailable === 'true') {
      query.isAvailable = true;
    }

    // Sorting
    let sortQuery = {};
    if (sort === 'priceAsc') {
      sortQuery.pricePerDay = 1;
    } else if (sort === 'priceDesc') {
      sortQuery.pricePerDay = -1;
    } else if (sort === 'rating') {
      sortQuery.rating = -1;
    } else {
      sortQuery.createdAt = -1; // Newest / Featured
    }

    const products = await Product.find(query).sort(sortQuery);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
