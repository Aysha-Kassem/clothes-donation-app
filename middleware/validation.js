/**
 * Express Validator - Input Validation
 * التحقق من صحة البيانات المدخلة
 */

const { body, validationResult } = require('express-validator');

// Donation Validation Rules
const donationValidationRules = [
  body('itemName')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Item name must be between 2 and 100 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['men', 'women', 'kids']).withMessage('Invalid category selected'),

  body('size')
    .notEmpty().withMessage('Size is required')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Other']).withMessage('Invalid size selected'),

  body('condition')
    .notEmpty().withMessage('Condition is required')
    .isIn(['new', 'like-new', 'good', 'fair']).withMessage('Invalid condition selected'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),

  body('whatsappNumber')
    .trim()
    .notEmpty().withMessage('WhatsApp number is required')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Please enter a valid WhatsApp number (10-15 digits)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('donorName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Donor name cannot exceed 50 characters')
];

// Status Update Validation
const statusValidationRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['available', 'reserved', 'donated']).withMessage('Invalid status')
];

// Validation Result Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If it's an API request
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    // For form submissions, flash errors and redirect back
    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error_msg', errorMessages.join(' | '));
    return res.redirect('back');
  }
  next();
};

module.exports = {
  donationValidationRules,
  statusValidationRules,
  handleValidationErrors
};
