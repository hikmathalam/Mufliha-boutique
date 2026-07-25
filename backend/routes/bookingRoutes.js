const express = require('express');
const router = express.Router();
const { createBooking, checkAvailability, getBookingById, getUserBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking);

router.route('/check')
  .get(checkAvailability);

router.route('/my-bookings')
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById);

module.exports = router;
