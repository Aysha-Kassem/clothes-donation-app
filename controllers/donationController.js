/**
 * Donation Controller
 * متحكم التبرعات
 */

const Donation = require('../models/Donation');
const cloudinary = require('../config/cloudinary');

const emptyStats = {
  total: 0,
  available: 0,
  reserved: 0,
  donated: 0
};

// Get all donations with filtering
// عرض جميع التبرعات مع الفلترة
exports.getAllDonations = async (req, res) => {
  try {
    const { category, city, status = 'available', search } = req.query;

    // Build filter object
    const filter = {};

    if (category && ['men', 'women', 'kids'].includes(category)) {
      filter.category = category;
    }

    if (city && city.trim()) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    if (status && ['available', 'reserved', 'donated'].includes(status)) {
      filter.status = status;
    }

    if (search && search.trim()) {
      filter.$or = [
        { itemName: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Get donations sorted by newest first
    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    // Get unique cities for filter dropdown
    const cities = await Donation.distinct('city');

    // Get stats
    const stats = await Donation.getStats();

    res.render('pages/donations', {
      title: req.t('donations.title', 'Browse Donations'),
      donations,
      cities,
      stats,
      filters: { category, city, status, search },
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    req.flash('error_msg', req.t('errors.fetchFailed', 'Failed to load donations'));
    res.redirect('/');
  }
};

// Get single donation details
// عرض تفاصيل قطعة واحدة
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      req.flash('error_msg', req.t('errors.notFound', 'Donation not found'));
      return res.redirect('/donations');
    }

    // Increment view count
    donation.views += 1;
    await donation.save();

    // Get related donations (same category)
    const relatedDonations = await Donation.find({
      category: donation.category,
      _id: { $ne: donation._id },
      status: 'available'
    }).limit(4).sort({ createdAt: -1 });

    res.render('pages/donation-details', {
      title: donation.itemName,
      donation,
      relatedDonations,
      whatsappLink: donation.getWhatsAppLink(),
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    req.flash('error_msg', req.t('errors.fetchFailed', 'Failed to load donation'));
    res.redirect('/donations');
  }
};

// Show add donation form
// عرض نموذج إضافة تبرع
exports.getAddDonationForm = (req, res) => {
  res.render('pages/add-donation', {
    title: req.t('addDonation.title', 'Add New Donation'),
    layout: 'layouts/main'
  });
};

// Create new donation
// إنشاء تبرع جديد
exports.createDonation = async (req, res) => {
  try {
    const { itemName, category, size, condition, city, whatsappNumber, description, donorName } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      req.flash('error_msg', req.t('errors.imageRequired', 'Please upload an image'));
      return res.redirect('/donations/add');
    }

    const donation = new Donation({
      itemName,
      category,
      size,
      condition,
      city,
      whatsappNumber,
      description: description || '',
      donorName: donorName || 'Anonymous',
      imageUrl: req.file.path,
      imagePublicId: req.file.filename
    });

    await donation.save();

    req.flash('success_msg', req.t('success.donationAdded', 'Donation added successfully!'));
    res.redirect(`/donations/${donation._id}`);
  } catch (error) {
    console.error('Error creating donation:', error);

    // Delete uploaded image if donation creation failed
    if (req.file && req.file.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    req.flash('error_msg', req.t('errors.createFailed', 'Failed to add donation'));
    res.redirect('/donations/add');
  }
};

// Get latest donations (for homepage)
// أحدث التبرعات للصفحة الرئيسية
exports.getLatestDonations = async (limit = 8) => {
  try {
    return await Donation.find({ status: 'available' })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error fetching latest donations:', error);
    return [];
  }
};

// Fetch donation statistics for server-rendered pages
exports.fetchDonationStats = async () => {
  try {
    return await Donation.getStats();
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return emptyStats;
  }
};

// Fetch homepage stats including unique city count
exports.fetchHomepageStats = async () => {
  try {
    const [stats, cities] = await Promise.all([
      Donation.getStats(),
      Donation.distinct('city')
    ]);

    return {
      ...stats,
      cities: cities.length
    };
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return {
      ...emptyStats,
      cities: 0
    };
  }
};

// Get donation statistics
// إحصائيات التبرعات
exports.getDonationStats = async (req, res) => {
  try {
    const stats = await exports.fetchDonationStats();

    // Category breakdown
    const categoryStats = await Donation.aggregate([
      { $match: { status: 'available' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats,
      categories: categoryStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
