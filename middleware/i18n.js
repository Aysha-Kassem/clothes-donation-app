/**
 * i18n Middleware - Multi-language Support
 * نظام الترجمة متعدد اللغات (العربية والإنجليزية)
 */

const fs = require('fs');
const path = require('path');

// Load translations
const translations = {
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf8')),
  ar: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/ar.json'), 'utf8'))
};

const i18nMiddleware = (req, res, next) => {
  // Get language from query, cookie, or default to 'ar' (Arabic)
  let lang = req.query.lang || req.cookies?.lang || 'ar';

  // Validate language
  if (!['en', 'ar'].includes(lang)) {
    lang = 'ar';
  }

  // Set language in request
  req.lang = lang;
  req.isRTL = lang === 'ar';

  // Translation function
  req.t = (key, fallback = '') => {
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    return value || fallback || key;
  };

  // Make available in views
  res.locals.lang = lang;
  res.locals.isRTL = req.isRTL;
  res.locals.t = req.t;
  res.locals.otherLang = lang === 'ar' ? 'en' : 'ar';
  res.locals.otherLangLabel = lang === 'ar' ? 'English' : 'العربية';

  // Set cookie for language preference
  res.cookie('lang', lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });

  next();
};

module.exports = i18nMiddleware;
