/**
 * Main Routes
 * المسارات الرئيسية
 */

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Homepage
router.get('/', async (req, res) => {
  try {
    const latestDonations = await donationController.getLatestDonations(8);
    const stats = await donationController.fetchHomepageStats();

    res.render('pages/index', {
      title: req.t('home.title', 'Clothes Donation - Share the Warmth'),
      donations: latestDonations,
      stats,
      layout: 'layouts/main'
    });
  } catch (error) {
    console.error('Homepage error:', error);
    res.render('pages/index', {
      title: req.t('home.title', 'Clothes Donation - Share the Warmth'),
      donations: [],
      stats: {
        total: 0,
        available: 0,
        reserved: 0,
        donated: 0,
        cities: 0
      },
      layout: 'layouts/main'
    });
  }
});

// About Page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: req.t('about.title', 'About Us'),
    layout: 'layouts/main'
  });
});

// How It Works
router.get('/how-it-works', (req, res) => {
  res.render('pages/how-it-works', {
    title: req.t('howItWorks.title', 'How It Works'),
    layout: 'layouts/main'
  });
});

// Language Switch
router.get('/lang/:lang', (req, res) => {
  const lang = req.params.lang;
  if (['en', 'ar'].includes(lang)) {
    res.cookie('lang', lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  res.redirect(req.get('Referrer') || '/');
});

module.exports = router;
