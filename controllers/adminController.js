/**
 * Admin Controller
 * متحكم لوحة التحكم
 */

const Donation = require('../models/Donation');
const cloudinary = require('../config/cloudinary');

// Admin Authentication Middleware
// التحقق من صلاحيات الأدمن
exports.requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Access denied. Please login as admin.');
  res.redirect('/admin/login');
};

// Show Login Page
exports.getLogin = (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('pages/admin-login', {
    title: 'Admin Login',
    layout: false
  });
};

// Process Login
exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUsername && password === adminPassword) {
    req.session.isAdmin = true;
    req.flash('success_msg', 'Welcome back, Admin!');
    res.redirect('/admin/dashboard');
  } else {
    req.flash('error_msg', 'Invalid credentials');
    res.redirect('/admin/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Get all donations with pagination
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments();
    const totalPages = Math.ceil(total / limit);

    // Get stats
    const stats = await Donation.getStats();

    // Recent activity (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentActivity = await Donation.countDocuments({
      createdAt: { $gte: last7Days }
    });

    res.render('pages/admin-dashboard', {
      title: 'Admin Dashboard',
      donations,
      stats,
      recentActivity,
      pagination: {
        page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      layout: 'layouts/admin'
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error_msg', 'Failed to load dashboard');
    res.redirect('/');
  }
};

// Update Donation Status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      if (req.xhr) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
      }
      req.flash('error_msg', 'Donation not found');
      return res.redirect('/admin/dashboard');
    }

    donation.status = status;
    await donation.save();

    if (req.xhr) {
      return res.json({ success: true, message: 'Status updated successfully' });
    }

    req.flash('success_msg', 'Status updated successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Update status error:', error);
    if (req.xhr) {
      return res.status(500).json({ success: false, message: 'Failed to update status' });
    }
    req.flash('error_msg', 'Failed to update status');
    res.redirect('/admin/dashboard');
  }
};

// Delete Donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      if (req.xhr) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
      }
      req.flash('error_msg', 'Donation not found');
      return res.redirect('/admin/dashboard');
    }

    // Delete image from Cloudinary
    if (donation.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(donation.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    await Donation.findByIdAndDelete(req.params.id);

    if (req.xhr) {
      return res.json({ success: true, message: 'Donation deleted successfully' });
    }

    req.flash('success_msg', 'Donation deleted successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete error:', error);
    if (req.xhr) {
      return res.status(500).json({ success: false, message: 'Failed to delete donation' });
    }
    req.flash('error_msg', 'Failed to delete donation');
    res.redirect('/admin/dashboard');
  }
};

// Get donation by ID (admin view)
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({ success: true, donation });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donation' });
  }
};
