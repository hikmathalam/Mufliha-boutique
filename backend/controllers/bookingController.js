const Booking = require('../models/Booking');
const Product = require('../models/Product');

// @desc    Create a new booking (Prevent double-booking)
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { productId, startDate, endDate, phone, notes } = req.body;

    if (!productId || !startDate || !endDate || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end < start) {
      return res.status(400).json({ message: 'End date must be on or after start date' });
    }

    // Fetch the product to get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product is generally available (not archived/disabled)
    if (!product.isAvailable) {
      return res.status(400).json({ message: 'This piece is currently disabled for booking' });
    }

    // Overlap checking:
    // Any booking that has (existing.startDate <= requested.endDate) AND (existing.endDate >= requested.startDate)
    const clashingBooking = await Booking.findOne({
      product: productId,
      status: { $ne: 'Cancelled' },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (clashingBooking) {
      return res.status(400).json({ 
        message: 'This piece is already booked for the selected dates' 
      });
    }

    // Calculate total price
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    const totalPrice = diffDays * product.pricePerDay;

    const booking = new Booking({
      user: req.user._id,
      product: productId,
      startDate: start,
      endDate: end,
      totalPrice,
      phone,
      notes
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check product availability for a date range
// @route   GET /api/bookings/check
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.query;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide productId, startDate, and endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const clashingBooking = await Booking.findOne({
      product: productId,
      status: { $ne: 'Cancelled' },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (clashingBooking) {
      return res.json({
        available: false,
        conflictingBooking: {
          startDate: clashingBooking.startDate,
          endDate: clashingBooking.endDate
        }
      });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('product')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
