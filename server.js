/**
 * Clothes Donation App - Main Server
 * تطبيق التبرع بالملابس المستعملة
 * 
 * Tech Stack: Node.js, Express, MongoDB, Mongoose, EJS, Tailwind CSS
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxies used by platforms like Railway/Render so secure
// cookies and protocol detection behave correctly in production.
app.set('trust proxy', 1);

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "res.cloudinary.com"],
      fontSrc: ["'self'", "https:", "cdn.jsdelivr.net"],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// ============================================
// Database Connection
// ============================================
require('./config/db');

// ============================================
// Middleware Setup
// ============================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash Messages
app.use(flash());

// Global Variables Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// ============================================
// i18n (Internationalization) Setup
// ============================================
const i18n = require('./middleware/i18n');
app.use(i18n);

// ============================================
// Template Engine Setup
// ============================================
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Create layouts directory if not exists
const layoutsDir = path.join(__dirname, 'views', 'layouts');
if (!fs.existsSync(layoutsDir)) {
  fs.mkdirSync(layoutsDir, { recursive: true });
}

// ============================================
// Routes
// ============================================
const mainRoutes = require('./routes/mainRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'clothes-donation-app'
  });
});

// Fallback homepage for production deployments. If the main router does not
// match `/` for any platform-specific reason, send visitors to the donations
// listing instead of the generic 404 page.
app.get('/', (req, res, next) => {
  if (req.path !== '/') {
    return next();
  }

  return res.redirect('/donations');
});

app.use('/', mainRoutes);
app.use('/donations', donationRoutes);
app.use('/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  if (req.originalUrl === '/' || req.path === '/') {
    return res.redirect('/donations');
  }

  res.status(404).render('pages/404', { 
    title: '404 - Page Not Found',
    layout: false 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/404', { 
    title: '500 - Server Error',
    layout: false,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;

// ============================================
// Start Server
// ============================================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Language Support: Arabic & English\n');
  });
}
