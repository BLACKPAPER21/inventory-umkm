// Configuration file for Inventory System
// UMKM Konvensi Harapan

const CONFIG = {
  // Google Apps Script Web App URL
  // TODO: Replace this with your deployed Apps Script URL after deployment
  API_URL: 'https://script.google.com/macros/s/AKfycbw08MGJqI8RGlcaqn5TRmQFlHrwsdMzml5n2-kTvKN_7uhE4UnfB1Y9hvUc-bfIcFsPkw/exec',

  // API Endpoints
  ENDPOINTS: {
    LOGIN: '/login',
    GET_BARANG: '/getBarang',
    ADD_BARANG: '/addBarang',
    UPDATE_BARANG: '/updateBarang',
    DELETE_BARANG: '/deleteBarang',
    GET_BARANG_MASUK: '/getBarangMasuk',
    ADD_BARANG_MASUK: '/addBarangMasuk',
    GET_BARANG_KELUAR: '/getBarangKeluar',
    ADD_BARANG_KELUAR: '/addBarangKeluar',
    GET_LAPORAN: '/getLaporan',
    GET_DASHBOARD_STATS: '/getDashboardStats'
  },

  // App Settings
  APP_NAME: 'Sistem Inventori',
  APP_TITLE: 'UMKM Konvensi Harapan',

  // Session Storage Keys
  STORAGE_KEYS: {
    USER: 'inventory_user',
    TOKEN: 'inventory_token'
  },

  // Pagination
  ITEMS_PER_PAGE: 10,

  // Stock Warning Threshold
  LOW_STOCK_THRESHOLD: 10
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
