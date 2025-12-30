# 🚀 Panduan Deploy ke Vercel

## Langkah 1: Setup Google Apps Script Backend (WAJIB!)

Sebelum deploy ke Vercel, pastikan backend Google Apps Script sudah running:

### A. Deploy Google Apps Script
1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru
2. Beri nama: **"Inventori UMKM Konvensi Harapan"**
3. Klik **Extensions** → **Apps Script**
4. Hapus semua code default, copy paste semua isi file `gas/Code.gs`
5. Klik **Run** → pilih function `setupDatabase` untuk setup database pertama kali
6. Approve permissions yang diminta Google
7. Klik **Deploy** → **New deployment**
8. Settings deployment:
   - **Type**: Web app
   - **Description**: Inventori API v1.0
   - **Execute as**: Me (email kamu)
   - **Who has access**: Anyone
9. Klik **Deploy**
10. **COPY URL** yang muncul (format: `https://script.google.com/macros/s/...../exec`)

### B. Update Config di Project
Edit file `js/config.js`:
```javascript
const CONFIG = {
  API_URL: 'PASTE_URL_DARI_LANGKAH_10_DISINI',
  // ...
}
```

---

## Langkah 2: Install Vercel CLI (Pilihan)

### Option A: Via NPM
```bash
npm install -g vercel
```

### Option B: Via Dashboard (Lebih Mudah!)
Langsung ke [vercel.com](https://vercel.com) - tidak perlu install CLI

---

## Langkah 3: Deploy ke Vercel

### 🎯 CARA TERMUDAH: Via GitHub + Vercel Dashboard

#### 1. Push ke GitHub
```bash
# Di folder project kamu
git init
git add .
git commit -m "Initial commit - Inventory System"
git branch -M main
git remote add origin https://github.com/USERNAME/inventory-umkm.git
git push -u origin main
```

#### 2. Deploy via Vercel Dashboard
1. Buka [vercel.com/new](https://vercel.com/new)
2. Login dengan GitHub
3. Import repository **inventory-umkm**
4. Framework Preset: **Other** (biarkan default)
5. Root Directory: **./** (biarkan default)
6. Build Settings: **Biarkan kosong semua** (sudah ada vercel.json)
7. Klik **Deploy**
8. Tunggu 1-2 menit sampai selesai ✅

#### 3. Cek Hasil
- URL production: `https://inventory-umkm.vercel.app` (atau nama lain)
- Test login dengan:
  - Username: `admin` / Password: `admin123`
  - Username: `staff` / Password: `staff123`
  - Username: `owner` / Password: `owner123`

---

### 🔥 ALTERNATIF: Via Vercel CLI

```bash
# Login ke Vercel
vercel login

# Deploy (pertama kali)
vercel

# Ikuti prompt:
# - Set up and deploy? [Y/n] → Y
# - Which scope? → Pilih account kamu
# - Link to existing project? [y/N] → N
# - Project name → inventory-umkm
# - Directory → ./ (enter)
# - Override settings? [y/N] → N

# Deploy production
vercel --prod
```

---

## Langkah 4: Konfigurasi Domain (Opsional)

### Menggunakan Domain Vercel (Gratis)
URL otomatis: `https://project-name.vercel.app`

### Menggunakan Custom Domain
1. Buka [vercel.com](https://vercel.com) → Project → Settings → Domains
2. Add domain kamu (misal: `inventori.sidrap.id`)
3. Ikuti instruksi DNS configuration
4. Tunggu propagasi DNS (5-60 menit)

---

## ✅ Checklist Sebelum Deploy

- [x] `vercel.json` sudah ada ✅
- [ ] Google Apps Script sudah deployed dan dapat URL
- [ ] URL Apps Script sudah dimasukkan ke `js/config.js`
- [ ] Test login di local (buka `index.html` via browser)
- [ ] Git repository sudah dibuat
- [ ] Ready to deploy!

---

## 🔧 Troubleshooting

### ❌ Problem: API Error / Login Gagal
**Solution:**
1. Cek `js/config.js` → pastikan `API_URL` sudah benar
2. Buka URL Apps Script di browser → harus muncul JSON response
3. Cek Console browser (F12) → lihat error detail

### ❌ Problem: 404 Not Found
**Solution:**
- Pastikan `vercel.json` ada di root folder
- Cek redirect settings di vercel.json

### ❌ Problem: CORS Error
**Solution:**
- Sudah solved di `Code.gs` dengan header `Access-Control-Allow-Origin: *`
- Pastikan Apps Script deployed dengan access "Anyone"

### ❌ Problem: Build Failed di Vercel
**Solution:**
- Ini static site, tidak butuh build
- Pastikan `buildCommand: null` di vercel.json
- Pastikan semua file (HTML, CSS, JS) ada di root

---

## 📱 Test Setelah Deploy

1. **Buka URL production** (dari Vercel)
2. **Test Login:**
   - Admin: `admin` / `admin123`
   - Staff: `staff` / `staff123`
   - Owner: `owner` / `owner123`
3. **Test Fitur:**
   - ✅ Dashboard → lihat statistik
   - ✅ Data Barang → tambah, edit, hapus
   - ✅ Barang Masuk → input transaksi
   - ✅ Barang Keluar → input transaksi
   - ✅ Laporan → generate laporan

---

## 🎨 Customize

### Ganti Logo/Brand
Edit file HTML dan ganti:
- Nama: "UMKM Konvensi Harapan"
- Lokasi: "Kabupaten Sidrap"

### Ganti Theme/Warna
Edit `css/style.css`:
```css
:root {
  --primary-color: #2563eb;  /* Ganti warna primary */
  --success-color: #10b981;
  /* ... */
}
```

---

## 📞 Support

Untuk troubleshooting lebih lanjut, cek:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎉 Selesai!

Aplikasi Inventory System kamu sekarang sudah online dan bisa diakses dari mana saja!

**Demo Credentials:**
- Admin: `admin` / `admin123`
- Staff: `staff` / `staff123`
- Owner: `owner` / `owner123`

**Live URL:** `https://your-project.vercel.app`

---

Made with ❤️ for UMKM Konvensi Harapan - Kabupaten Sidrap
