# 🔧 Troubleshooting Guide - Sistem Inventori

## ❌ Error: "Failed to Fetch" saat Login

Jika Anda mengalami error "failed to fetch" saat mencoba login, ikuti langkah-langkah berikut:

### 1. Cek URL Google Apps Script

**Masalah:** URL Apps Script di `js/config.js` salah atau belum diatur dengan benar.

**Solusi:**
1. Buka file `js/config.js`
2. Pastikan `API_URL` pada baris 7 sudah diisi dengan URL deployment yang benar
3. URL harus dalam format: `https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec`

**Cara mendapatkan URL yang benar:**
1. Buka Google Apps Script editor (script.google.com)
2. Buka project Anda
3. Klik **Deploy** > **Manage deployments**
4. Copy **Web app URL** dari deployment yang aktif
5. Paste ke `js/config.js`

### 2. Pastikan Script Sudah Di-Deploy Dengan Benar

**Masalah:** Script belum di-deploy atau deployment tidak aktif.

**Solusi:**
1. Buka Google Apps Script editor
2. Klik **Deploy** > **New deployment**
3. Pilih type: **Web app**
4. Atur settings:
   - **Execute as:** Me (email@gmail.com)
   - **Who has access:** Anyone
5. Klik **Deploy**
6. Copy URL deployment

⚠️ **PENTING:** Setiap kali Anda mengubah kode Apps Script, Anda HARUS membuat deployment baru atau update deployment yang ada!

### 3. Cek Permission Access

**Masalah:** Permission tidak diatur ke "Anyone".

**Solusi:**
1. Buka **Deploy** > **Manage deployments**
2. Klik ⚙️ (icon edit) pada deployment
3. Pastikan **Who has access** diatur ke **Anyone**
4. Klik **Save**
5. Test ulang aplikasi

### 4. Authorize Script

**Masalah:** Script belum di-authorize untuk akses spreadsheet.

**Solusi:**
1. Di Apps Script editor, klik **Run** > pilih function `setupDatabase`
2. Akan muncul popup "Authorization required"
3. Klik **Review permissions**
4. Pilih akun Google Anda
5. Klik **Advanced** > **Go to [Project Name] (unsafe)**
6. Klik **Allow**
7. Tunggu sampai function selesai
8. Deploy ulang scriptnya

### 5. Test Connection

**Cara test apakah API berfungsi:**

1. Copy URL deployment Anda
2. Buka di browser: `[URL]?action=login&username=admin&password=admin123`
3. Jika berhasil, Anda akan melihat response JSON seperti ini:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "nama": "Administrator"
  },
  "token": "token_..."
}
```

Jika muncul error atau tidak ada response, berarti ada masalah dengan deployment.

### 6. Cek Console Browser

**Untuk melihat error detail:**

1. Buka browser (Chrome/Edge)
2. Tekan `F12` untuk buka Developer Tools
3. Pilih tab **Console**
4. Coba login lagi
5. Perhatikan error message yang muncul

**Contoh Error & Solusi:**

| Error Message | Penyebab | Solusi |
|--------------|----------|--------|
| `Failed to fetch` | URL salah / Script belum deploy | Cek URL di config.js |
| `CORS error` | Permission issue | Set access ke "Anyone" |
| `404 Not Found` | URL deployment tidak valid | Deploy ulang dan update URL |
| `NetworkError` | Internet terputus | Cek koneksi internet |

### 7. Setup Database (Jika Belum)

**Masalah:** Sheet di Google Spreadsheet belum dibuat.

**Solusi:**
1. Buka Google Apps Script editor
2. Di menu atas, pilih function: **setupDatabase**
3. Klik **Run** (tombol play ▶️)
4. Tunggu sampai selesai (cek Logs)
5. Buka spreadsheet dan pastikan ada 4 sheets:
   - users
   - barang
   - barang_masuk
   - barang_keluar

---

## 🔐 Akun Demo

Setelah setup berhasil, gunakan akun ini untuk login:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Staff:**
- Username: `staff`
- Password: `staff123`

**Owner:**
- Username: `owner`
- Password: `owner123`

---

## 📞 Masih Bermasalah?

Jika masih error setelah mengikuti semua langkah di atas:

1. **Screenshot error message** dari browser console (F12)
2. **Screenshot konfigurasi deployment** dari Apps Script
3. **Copy URL** yang ada di `js/config.js`
4. Hubungi developer dengan informasi tersebut

---

## ✅ Quick Checklist

Pastikan semua poin ini sudah dilakukan:

- [ ] Google Apps Script sudah di-deploy sebagai Web App
- [ ] Permission diatur ke "Anyone"
- [ ] Script sudah di-authorize
- [ ] Function `setupDatabase()` sudah dijalankan
- [ ] URL deployment sudah di-copy ke `js/config.js`
- [ ] Spreadsheet memiliki 4 sheets (users, barang, barang_masuk, barang_keluar)
- [ ] Test URL di browser berfungsi

Jika semua checklist sudah ✅, aplikasi seharusnya berfungsi dengan baik!
