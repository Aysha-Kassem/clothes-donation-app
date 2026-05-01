# 👕 Clothes Donation App | تطبيق التبرع بالملابس

A full-stack web application for donating and finding used clothes. Built with Node.js, Express, MongoDB, and EJS.

منصة متكاملة للتبرع بالملابس المستعملة وإيجادها لمن يحتاجها. مبنية باستخدام Node.js و Express و MongoDB و EJS.

---

## 🚀 Features | المميزات

- **🖼️ Image Upload** - Upload clothes images via Multer, stored on Cloudinary
- **📱 WhatsApp Integration** - Direct WhatsApp contact with donors
- **🔍 Advanced Filtering** - Filter by category, city, and status
- **🌍 Bilingual** - Full Arabic & English support with RTL
- **📊 Admin Dashboard** - Manage donations and update status
- **🔒 Security** - Helmet, Rate Limiting, Input Validation
- **📱 Responsive** - Mobile-first design with Tailwind CSS

---

## 🛠️ Tech Stack | التقنيات

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB + Mongoose | Database |
| EJS | Template Engine |
| Tailwind CSS | Styling |
| Cloudinary | Image Storage |
| Multer | File Upload |
| express-validator | Validation |

---

## 📦 Installation | التثبيت

### Prerequisites | المتطلبات
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary Account (free)

### Step 1: Clone & Install | الخطوة 1

```bash
# Clone the repository
git clone <repository-url>
cd clothes-donation-app

# Install dependencies
npm install
```

### Step 2: Environment Variables | الخطوة 2

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clothes_donation
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_random_secret_key
```

### Step 3: Run the Server | الخطوة 3

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The app will be available at: `http://localhost:3000`

---

## 📁 Project Structure | هيكل المشروع

```
clothes-donation-app/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary config
├── controllers/
│   ├── donationController.js
│   └── adminController.js
├── middleware/
│   ├── upload.js          # Multer + Cloudinary
│   ├── validation.js      # express-validator
│   └── i18n.js            # Translation middleware
├── models/
│   └── Donation.js        # Mongoose Schema
├── routes/
│   ├── mainRoutes.js
│   ├── donationRoutes.js
│   └── adminRoutes.js
├── views/
│   ├── layouts/
│   │   ├── main.ejs
│   │   └── admin.ejs
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   └── pages/
│       ├── index.ejs
│       ├── donations.ejs
│       ├── add-donation.ejs
│       ├── donation-details.ejs
│       ├── admin-dashboard.ejs
│       ├── admin-login.ejs
│       └── 404.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── preview.js
│   └── images/
├── locales/
│   ├── en.json            # English translations
│   └── ar.json            # Arabic translations
├── server.js              # Main entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🔐 Admin Access | وصول الأدمن

1. Navigate to `/admin/login`
2. Enter credentials from `.env` file
3. Access dashboard to manage donations

---

## 🌐 API Endpoints | نقاط الوصول

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Homepage |
| GET | `/donations` | Browse donations |
| GET | `/donations/add` | Add donation form |
| POST | `/donations` | Create donation |
| GET | `/donations/:id` | Donation details |
| GET | `/admin/login` | Admin login |
| GET | `/admin/dashboard` | Admin dashboard |
| PATCH | `/admin/donations/:id/status` | Update status |
| DELETE | `/admin/donations/:id` | Delete donation |

---

## 📝 Data Schema | هيكل البيانات

```javascript
{
  itemName: String,        // Name of the item
  category: String,        // men | women | kids
  size: String,           // XS | S | M | L | XL | XXL | XXXL | Other
  condition: String,     // new | like-new | good | fair
  city: String,         // City name
  whatsappNumber: String, // WhatsApp contact
  imageUrl: String,      // Cloudinary URL
  imagePublicId: String, // Cloudinary ID
  description: String,   // Optional description
  donorName: String,    // Optional donor name
  status: String,      // available | reserved | donated
  views: Number,      // View count
  createdAt: Date    // Auto-generated
}
```

---

## 🎨 Customization | التخصيص

### Adding New Categories | إضافة فئات جديدة
Edit the category enum in `models/Donation.js` and update the select options in views.

### Changing Colors | تغيير الألوان
Modify the Tailwind config in the layout files or update `public/css/style.css`.

### Adding New Languages | إضافة لغات جديدة
1. Create a new JSON file in `locales/`
2. Update the i18n middleware in `middleware/i18n.js`

---

## 🔒 Security Features | مميزات الأمان

- ✅ Helmet.js for HTTP headers
- ✅ express-rate-limit for DDoS protection
- ✅ express-validator for input sanitization
- ✅ MongoDB injection protection via Mongoose
- ✅ Secure session configuration
- ✅ Cloudinary secure upload

---

## 🤝 Contributing | المساهمة

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License | الترخيص

This project is licensed under the MIT License.

---

## 👨‍💻 Developer | المطور

Built with ❤️ for the community.

---

## 📞 Support | الدعم

For issues or questions, please open an issue on GitHub.

**Email:** support@clothesdonation.app

---

<div align="center">
  <p>Made with ❤️ | صُنع بحب</p>
</div>
