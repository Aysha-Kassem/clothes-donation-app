/**
 * Donation Model - Mongoose Schema
 * نموذج بيانات التبرعات
 */

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Basic Info
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },

  // Category: Men / Women / Kids
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['men', 'women', 'kids'],
      message: 'Category must be men, women, or kids'
    }
  },

  // Size
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Other'],
      message: 'Please select a valid size'
    }
  },

  // Condition
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['new', 'like-new', 'good', 'fair'],
      message: 'Please select a valid condition'
    }
  },

  // City
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },

  // WhatsApp Number
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
    match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid WhatsApp number']
  },

  // Image URL from Cloudinary
  imageUrl: {
    type: String,
    required: [true, 'Image is required']
  },

  // Image Public ID (for deletion from Cloudinary)
  imagePublicId: {
    type: String
  },

  // Description (optional)
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Status: Available / Reserved / Donated
  status: {
    type: String,
    enum: ['available', 'reserved', 'donated'],
    default: 'available'
  },

  // Donor Name (optional)
  donorName: {
    type: String,
    trim: true,
    maxlength: [50, 'Donor name cannot exceed 50 characters']
  },

  // View Count
  views: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
// فهرسة للاستعلامات السريعة
donationSchema.index({ category: 1, status: 1 });
donationSchema.index({ city: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ status: 1 });

// Virtual for formatted date
// تنسيق التاريخ
donationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Method to generate WhatsApp link
// إنشاء رابط واتساب
donationSchema.methods.getWhatsAppLink = function(message) {
  const phone = this.whatsappNumber.replace(/\D/g, '');
  const defaultMessage = message || `Hello, I am interested in your donation: ${this.itemName}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;
};

// Static method to get statistics
// إحصائيات التبرعات
donationSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await this.countDocuments();

  return {
    total,
    available: stats.find(s => s._id === 'available')?.count || 0,
    reserved: stats.find(s => s._id === 'reserved')?.count || 0,
    donated: stats.find(s => s._id === 'donated')?.count || 0
  };
};

module.exports = mongoose.model('Donation', donationSchema);
