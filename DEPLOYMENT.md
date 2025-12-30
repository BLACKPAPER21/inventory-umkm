# Panduan Deployment - Sistem Inventori UMKM Konvensi Harapan

## 📋 Persiapan

Sebelum memulai deployment, pastikan Anda memiliki:
- Akun Google
- Google Chrome/Firefox browser
- Folder project ini sudah lengkap

## 🚀 Langkah-langkah Deployment

### STEP 1: Buat Google Sheet Database

1. **Buka Google Sheets**
   - Pergi ke [https://sheets.google.com](https://sheets.google.com)
   - Klik "+ Blank" untuk membuat spreadsheet baru
   - Beri nama spreadsheet: **"Inventori UMKM Konvensi Harapan"**

2. **Google Apps Script akan otomatis membuat sheet-sheet yang dibutuhkan**
   - `users` - Data pengguna
   - `barang` - Data inventori barang
   - `barang_masuk` - Transaksi barang masuk
   - `barang_keluar` - Transaksi barang keluar

---

### STEP 2: Setup Google Apps Script

1. **Buka Apps Script Editor**
   - Di Google Sheet yang baru dibuat, klik menu **Extensions** > **Apps Script**
   - Akan terbuka tab baru dengan Code.gs

2. **Copy Code Backend**
   - Hapus semua kode default di Code.gs
   - Buka file `gas/Code.gs` dari project folder
   - Copy semua isinya
   - Paste ke Code.gs di Apps Script Editor

3. **Save Project**
   - Klik icon **Save** (💾) atau tekan `Ctrl + S`
   - Beri nama project: **"Inventori API"**

---

### STEP 3: Deploy sebagai Web App

1. **Deploy Web App**
   - Klik tombol **Deploy** (di kanan atas) > **New deployment**
   - Klik icon "gear" ⚙️ di samping kiri "Select type"
   - Pilih **"Web app"**

2. **Konfigurasi Deployment**
   - **Description**: Inventori System API v1
   - **Execute as**: **Me** (email Anda)
   - **Who has access**: **Anyone**

   > ⚠️ **PENTING**: Pastikan pilih "Anyone" agar frontend bisa mengakses API

3. **Authorize Access**
   - Klik **Deploy**
   - Klik **Authorize access**
   - Pilih akun Google Anda
   - Klik **Advanced** > **Go to Inventori API (unsafe)**
   - Klik **Allow**

4. **Copy Web App URL**
   - Setelah deployment berhasil, akan muncul **Web app URL**
   - Copy URL ini (contoh: `https://script.google.com/macros/s/AKfycbx.../exec`)
   - **SIMPAN URL INI**, akan digunakan di step berikutnya

---

### STEP 4: Update Frontend Configuration

1. **Edit config.js**
   - Buka file `js/config.js`
   - Cari baris: `API_URL: 'YOUR_APPS_SCRIPT_URL_HERE'`
   - Ganti dengan URL yang Anda copy dari Step 3

   Contoh:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXX/exec',
   ```

2. **Save file config.js**

---

### STEP 5: Test System

1. **Buka index.html**
   - Double-click file `index.html` di folder project
   - Atau drag file ke browser

2. **Test Login**
   - Gunakan salah satu akun demo:
     - **Admin**: `admin` / `admin123`
     - **Staff**: `staff` / `staff123`
     - **Owner**: `owner` / `owner123`

3. **Test Fungsionalitas**
   - Dashboard: Lihat statistik
   - Data Barang: Tambah, edit, hapus barang
   - Barang Masuk: Input transaksi masuk
   - Barang Keluar: Input transaksi keluar (dengan validasi stok)
   - Laporan: Generate dan export laporan

---

## 🔨 Troubleshooting

### Error: "Script function not found: doPost"
**SOLUSI:** Apps Script belum di-save atau deploy. Ulangi Step 2 dan 3.

### Error: "Authorization required"
**SOLUSI:** Pastikan sudah authorize akses di Step 3.3.

### Login gagal terus
**SOLUSI:**
1. Periksa console browser (F12)
2. Pastikan API_URL di config.js sudah benar
3. Pastikan Google Apps Script sudah di-deploy

### Data tidak muncul
**SOLUSI:**
1. Buka Google Sheet
2. Periksa apakah sheet-sheet sudah terbuat
3. Jalankan function `setupTestData()` di Apps Script untuk menambah data sample

### Cara run function di Apps Script:
1. Buka Apps Script Editor
2. Di toolbar dropdown, pilih function `setupTestData`
3. Klik tombol Run (▶️)
4. Tunggu sampai selesai
5. Refresh halaman web

---

## 📱 Deploy ke Internet (Opsional)

Untuk membuat aplikasi bisa diakses dari internet:

### Option 1: GitHub Pages (Gratis)
1. Buat repository GitHub
2. Upload semua file project
3. Enable GitHub Pages di repository settings
4. Akses via: `https://username.github.io/repo-name`

### Option 2: Netlify/Vercel (Gratis)
1. Sign up di [Netlify](https://netlify.com) atau [Vercel](https://vercel.com)
2. Drag & drop folder project
3. Deploy otomatis
4. Dapatkan URL public

### Option 3: Google Drive (Simple Hosting)
1. Upload semua file ke Google Drive folder
2. Set folder permission ke "Anyone with the link"
3. Akses file HTML langsung via Google Drive

---

## 🔐 Keamanan Production

Untuk production environment, pertimbangkan:

1. **Ganti Password Default**
   - Edit sheet `users` di Google Sheet
   - Ganti password semua user

2. **Batasi Akses**
   - Di deployment setting, ubah "Who has access" dari "Anyone" ke "Anyone within organization" (jika punya Google Workspace)

3. **Backup Regular**
   - Google Sheet otomatis backup
   - Download copy manual secara berkala

4. **HTTPS Only**
   - Google Apps Script sudah menggunakan HTTPS
   - Pastikan frontend juga di-host dengan HTTPS

---

## 📞 Support

Jika ada masalah saat deployment:
1. Periksa console browser (F12) untuk error messages
2. Periksa Execution log di Apps Script Editor
3. Pastikan semua step diikuti dengan benar

---

## ✅ Checklist Deployment

- [ ] Google Sheet dibuat
- [ ] Apps Script code di-copy
- [ ] Apps Script di-deploy sebagai Web App
- [ ] Web App URL di-copy
- [ ] config.js sudah diupdate dengan URL yang benar
- [ ] Test login berhasil
- [ ] Test semua fitur berjalan

Selamat! Sistem inventori Anda siap digunakan! 🎉
