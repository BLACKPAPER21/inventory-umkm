# 📦 Sistem Informasi Inventori Barang Berbasis Cloud

**UMKM Konvensi Harapan – Kabupaten Sidrap**

Sistem manajemen inventori modern berbasis cloud dengan Google Sheets sebagai database dan interface web yang responsif.

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Hak Akses
- Login multi-user dengan role-based access
- 3 level pengguna: Admin, Staff, Owner
- Session management yang aman

### 📊 Dashboard
- Statistik real-time (total barang, stok menipis, transaksi hari ini)
- Overview transaksi terbaru
- Quick action buttons
- Charts dan visualisasi data

### 📦 Manajemen Data Barang
- CRUD lengkap (Create, Read, Update, Delete)
- Search dan filter barang
- Pagination untuk performa optimal
- Kategori dan satuan kustomisasi

### 📥 Barang Masuk
- Form input transaksi masuk
- Auto-update stok otomatis
- History transaksi lengkap
- Date picker untuk tracking

### 📤 Barang Keluar
- Form input transaksi keluar
- Validasi ketersediaan stok
- Warning jika stok menipis
- Pencegahan transaksi jika stok tidak cukup
- Auto-reduce stok otomatis

### 📄 Laporan Inventori
- 3 jenis laporan:
  - Laporan Inventori (semua barang & stok)
  - Laporan Barang Masuk
  - Laporan Barang Keluar
- Filter berdasarkan tanggal
- Export ke Excel/CSV
- Print/Export to PDF

---

## 🎨 Desain

### Modern & Premium
- **Glassmorphism Effect**: Cards dengan backdrop blur
- **Gradient Colors**: Warna-warna modern dan menarik
- **Smooth Animations**: Transisi dan animasi halus
- **Dark Theme**: Design gelap yang elegan
- **Responsive Layout**: Mobile, tablet, dan desktop

### Typography
- **Font**: Inter (UI) dan Poppins (Headings)
- Professional dan mudah dibaca

### Color Palette
- Primary: Deep Blue (#1e3a8a → #3b82f6)
- Secondary: Purple (#8b5cf6)
- Success: Emerald (#10b981)
- Warning: Amber (#f59e0b)
- Danger: Rose (#ef4444)

---

## 🛠️ Teknologi

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Glassmorphism, Flexbox, Grid)
- **Vanilla JavaScript** - Logic & API calls

### Backend
- **Google Apps Script** - Server-side API
- **Google Sheets** - Cloud database

### Keunggulan
- ✅ Tidak perlu server sendiri
- ✅ Gratis (menggunakan Google infrastructure)
- ✅ Auto-backup oleh Google
- ✅ Multi-user access
- ✅ Bisa diakses dari mana saja
- ✅ Tidak perlu install aplikasi

---

## 📁 Struktur Project

```
CODE/
├── index.html              # Landing page
├── login.html              # Login page
├── dashboard.html          # Dashboard
├── barang.html            # Data barang management
├── barang-masuk.html      # Incoming goods
├── barang-keluar.html     # Outgoing goods
├── laporan.html           # Reports
│
├── css/
│   ├── style.css          # Global styles & design system
│   └── components.css     # Component-specific styles
│
├── js/
│   ├── config.js          # Configuration & constants
│   ├── auth.js            # Authentication module
│   ├── api.js             # API communication layer
│   ├── dashboard.js       # Dashboard logic
│   ├── barang.js          # Items management logic
│   ├── transaksi.js       # Transaction shared code
│   └── laporan.js         # Reports generation
│
├── gas/
│   └── Code.gs            # Google Apps Script backend
│
├── DEPLOYMENT.md          # Deployment guide (BACA INI DULU!)
└── README.md              # This file
```

---

## 🚀 Quick Start

### 1. Setup Backend
Lihat panduan lengkap di **[DEPLOYMENT.md](DEPLOYMENT.md)**

Ringkasan singkat:
1. Buat Google Sheet baru
2. Buka Apps Script Editor
3. Copy kode dari `gas/Code.gs`
4. Deploy sebagai Web App
5. Copy URL deployment

### 2. Update Frontend
Edit `js/config.js`:
```javascript
API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_URL/exec'
```

### 3. Test
Buka `index.html` di browser dan login dengan:
- **Username**: `admin` / **Password**: `admin123`

---

## 👥 User Roles

### 1. Admin
- Akses penuh ke semua fitur
- Kelola data barang
- Input transaksi masuk/keluar
- Lihat semua laporan
- Manage users (via Google Sheet)

### 2. Staff
- Input barang masuk & keluar
- Lihat data barang
- Lihat dashboard

### 3. Owner (Pemilik)
- Lihat dashboard & statistik
- Lihat laporan inventori
- Monitoring (read-only)

---

## 📊 Database Schema

### Sheet: `users`
| Column | Type | Description |
|--------|------|-------------|
| id | String | User ID |
| username | String | Username login |
| password | String | Hashed password |
| role | String | admin/staff/owner |
| nama | String | Full name |

### Sheet: `barang`
| Column | Type | Description |
|--------|------|-------------|
| id_barang | String | Item ID |
| nama_barang | String | Item name |
| kategori | String | Category |
| satuan | String | Unit |
| stok | Number | Current stock |

### Sheet: `barang_masuk`
| Column | Type | Description |
|--------|------|-------------|
| id | String | Transaction ID |
| tanggal | Date | Date |
| id_barang | String | Item ID |
| nama_barang | String | Item name |
| jumlah | Number | Quantity |
| user | String | User who input |

### Sheet: `barang_keluar`
| Column | Type | Description |
|--------|------|-------------|
| id | String | Transaction ID |
| tanggal | Date | Date |
| id_barang | String | Item ID |
| nama_barang | String | Item name |
| jumlah | Number | Quantity |
| user | String | User who input |

---

## 🔒 Keamanan

- ✅ Password hashing (SHA-256)
- ✅ Session-based authentication
- ✅ Role-based access control
- ✅ Input validation (frontend & backend)
- ✅ HTTPS only (Google Apps Script)
- ✅ Stock validation untuk transaksi keluar

---

## 📱 Responsive Design

Sistem fully responsive dan bisa diakses dari:
- 💻 Desktop (optimal experience)
- 📱 Tablet (adaptive layout)
- 📱 Mobile phones (touch-optimized)

---

## 📈 Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:
- [ ] QR Code scanner untuk barang
- [ ] Email notifications untuk stok menipis
- [ ] Chart/grafik statistik
- [ ] Multi-warehouse support
- [ ] Barcode generation
- [ ] Advanced analytics

---

## 🐛 Troubleshooting

### Login tidak berhasil
- Periksa console browser (F12)
- Pastikan API_URL sudah benar di `config.js`
- Pastikan Google Apps Script sudah di-deploy

### Data tidak muncul
- Periksa Google Sheet apakah sheets sudah terbuat
- Run function `setupTestData()` di Apps Script
- Clear browser cache

### Stock tidak update
- Periksa Apps Script execution log
- Pastikan formula di sheet tidak mengunci cell

Untuk troubleshooting lengkap, lihat **[DEPLOYMENT.md](DEPLOYMENT.md)**

---

## 📞 Support & Kontribusi

Untuk bug reports atau feature requests:
1. Buka issue di repository
2. Deskripsikan masalah dengan detail
3. Sertakan screenshot jika perlu

---

## 📄 Licensi

Dibuat untuk **UMKM Konvensi Harapan - Kabupaten Sidrap**

© 2024 - Sistem Inventori Cloud

---

## 🙏 Credits

- Design inspiration: Modern cloud-based applications
- Icons: Unicode Emoji
- Fonts: Google Fonts (Inter & Poppins)
- Backend: Google Apps Script & Sheets

---

**Selamat menggunakan Sistem Inventori! 🎉**
