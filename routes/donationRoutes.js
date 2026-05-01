/**
 * Donation Routes
 * مسارات التبرعات
 */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { upload, handleUploadError } = require('../middleware/upload');
const { donationValidationRules, handleValidationErrors } = require('../middleware/validation');

// GET /donations - List all donations with filters
router.get('/', donationController.getAllDonations);

// GET /donations/api/stats - Get donation statistics (API)
router.get('/api/stats', donationController.getDonationStats);

// GET /donations/add - Show add donation form
router.get('/add', donationController.getAddDonationForm);

// POST /donations - Create new donation
router.post(
  '/',
  upload.single('image'),
  handleUploadError,
  donationValidationRules,
  handleValidationErrors,
  donationController.createDonation
);

// GET /donations/:id - Show single donation
router.get('/:id', donationController.getDonationById);

module.exports = router;
