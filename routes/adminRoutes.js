/**
 * Admin Routes
 * مسارات لوحة التحكم
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { statusValidationRules, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

// Protected routes
router.use(adminController.requireAuth);

router.get('/dashboard', adminController.getDashboard);
router.get('/logout', adminController.logout);

// API Routes for admin
router.patch(
  '/donations/:id/status',
  statusValidationRules,
  handleValidationErrors,
  adminController.updateStatus
);

router.delete('/donations/:id', adminController.deleteDonation);
router.get('/donations/:id', adminController.getDonation);

module.exports = router;
