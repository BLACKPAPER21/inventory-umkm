/**
 * Google Apps Script - Inventory System Backend
 * UMKM Konvensi Harapan - Kabupaten Sidrap
 *
 * IMPORTANT: After copying this code to Apps Script Editor:
 * 1. Deploy as Web App
 * 2. Set "Execute as" to "Me"
 * 3. Set "Who has access" to "Anyone"
 * 4. Copy the deployment URL to js/config.js
 */

// ===================================
// CONFIGURATION
// ===================================

const SHEET_NAMES = {
  USERS: 'users',
  BARANG: 'barang',
  BARANG_MASUK: 'barang_masuk',
  BARANG_KELUAR: 'barang_keluar'
};

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setHeader('Access-Control-Allow-Origin', '*');
  return output;
}

/**
 * Get spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get sheet by name
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  // Create sheet if doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }

  return sheet;
}

/**
 * Initialize sheet with headers
 */
function initializeSheet(sheet, sheetName) {
  let headers = [];

  switch(sheetName) {
    case SHEET_NAMES.USERS:
      headers = ['id', 'username', 'password', 'role', 'nama'];
      // Add demo users
      sheet.appendRow(headers);
      sheet.appendRow(['1', 'admin', hashPassword('admin123'), 'admin', 'Administrator']);
      sheet.appendRow(['2', 'staff', hashPassword('staff123'), 'staff', 'Staff User']);
      sheet.appendRow(['3', 'owner', hashPassword('owner123'), 'owner', 'Pemilik']);
      break;

    case SHEET_NAMES.BARANG:
      headers = ['id_barang', 'nama_barang', 'kategori', 'satuan', 'stok'];
      sheet.appendRow(headers);
      break;

    case SHEET_NAMES.BARANG_MASUK:
      headers = ['id', 'tanggal', 'id_barang', 'nama_barang', 'jumlah', 'user'];
      sheet.appendRow(headers);
      break;

    case SHEET_NAMES.BARANG_KELUAR:
      headers = ['id', 'tanggal', 'id_barang', 'nama_barang', 'jumlah', 'user'];
      sheet.appendRow(headers);
      break;
  }
}

/**
 * Simple password hashing (SHA-256)
 */
function hashPassword(password) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return rawHash.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

/**
 * Generate unique ID
 */
function generateId(prefix = '') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}${timestamp}${random}`;
}

/**
 * Convert sheet data to array of objects
 */
function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Find row by column value
 */
function findRow(sheet, columnIndex, value) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][columnIndex] == value) {
      return i + 1; // Return 1-indexed row number
    }
  }
  return -1;
}

// ===================================
// API ENDPOINTS
// ===================================

/**
 * Handle GET requests (for testing and browser access)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    let response = {};

    // Handle specific GET actions
    switch(action) {
      case 'login':
        response = handleLogin(e.parameter);
        break;
      case 'getBarang':
        response = getBarang();
        break;
      case 'getDashboardStats':
        response = getDashboardStats();
        break;
      case 'getBarangMasuk':
        response = getBarangMasuk(e.parameter);
        break;
      case 'getBarangKeluar':
        response = getBarangKeluar(e.parameter);
        break;
      default:
        // Default API info response
        response = {
          success: true,
          message: 'Inventori API v1.0 - UMKM Konvensi Harapan',
          status: 'running',
          endpoints: {
            authentication: ['login'],
            barang: ['getBarang', 'addBarang', 'updateBarang', 'deleteBarang'],
            transaksi: ['getBarangMasuk', 'addBarangMasuk', 'getBarangKeluar', 'addBarangKeluar'],
            laporan: ['getLaporan', 'getDashboardStats']
          }
        };
    }

    var output = ContentService.createTextOutput(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    return output;

  } catch (error) {
    Logger.log('GET Error: ' + error.toString());
    var output = ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Server error: ' + error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    return output;
  }
}

/**
 * Main POST handler
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action; // Get action from POST body
    const params = payload; // Use entire payload as params

    Logger.log('Action: ' + action);
    Logger.log('Params: ' + JSON.stringify(params));

    let response = {};

    switch(action) {
      case 'login':
        response = handleLogin(params);
        break;
      case 'getBarang':
        response = getBarang();
        break;
      case 'addBarang':
        response = addBarang(params);
        break;
      case 'updateBarang':
        response = updateBarang(params);
        break;
      case 'deleteBarang':
        response = deleteBarang(params);
        break;
      case 'getBarangMasuk':
        response = getBarangMasuk(params);
        break;
      case 'addBarangMasuk':
        response = addBarangMasuk(params);
        break;
      case 'getBarangKeluar':
        response = getBarangKeluar(params);
        break;
      case 'addBarangKeluar':
        response = addBarangKeluar(params);
        break;
      case 'getLaporan':
        response = getLaporan(params);
        break;
      case 'getDashboardStats':
        response = getDashboardStats();
        break;
      default:
        response = {
          success: false,
          message: 'Invalid action: ' + action
        };
    }

    var output = ContentService.createTextOutput(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    return output;

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    var output = ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Server error: ' + error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    return output;
  }
}

/**
 * Login authentication
 */
function handleLogin(params) {
  const { username, password } = params;
  const sheet = getSheet(SHEET_NAMES.USERS);
  const users = sheetToObjects(sheet);

  const hashedPassword = hashPassword(password);
  const user = users.find(u => u.username === username && u.password === hashedPassword);

  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nama: user.nama
      },
      token: generateId('token_')
    };
  } else {
    return {
      success: false,
      message: 'Username atau password salah'
    };
  }
}

/**
 * Get all barang
 */
function getBarang() {
  const sheet = getSheet(SHEET_NAMES.BARANG);
  const data = sheetToObjects(sheet);

  return {
    success: true,
    data: data
  };
}

/**
 * Add new barang
 */
function addBarang(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG);
  const id = generateId('BRG');

  sheet.appendRow([
    id,
    params.nama_barang,
    params.kategori,
    params.satuan,
    params.stok || 0
  ]);

  return {
    success: true,
    message: 'Barang berhasil ditambahkan',
    data: { id_barang: id }
  };
}

/**
 * Update barang
 */
function updateBarang(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG);
  const rowIndex = findRow(sheet, 0, params.id_barang);

  if (rowIndex === -1) {
    return {
      success: false,
      message: 'Barang tidak ditemukan'
    };
  }

  sheet.getRange(rowIndex, 2).setValue(params.nama_barang);
  sheet.getRange(rowIndex, 3).setValue(params.kategori);
  sheet.getRange(rowIndex, 4).setValue(params.satuan);
  sheet.getRange(rowIndex, 5).setValue(params.stok);

  return {
    success: true,
    message: 'Barang berhasil diperbarui'
  };
}

/**
 * Delete barang
 */
function deleteBarang(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG);
  const rowIndex = findRow(sheet, 0, params.id_barang);

  if (rowIndex === -1) {
    return {
      success: false,
      message: 'Barang tidak ditemukan'
    };
  }

  sheet.deleteRow(rowIndex);

  return {
    success: true,
    message: 'Barang berhasil dihapus'
  };
}

/**
 * Get barang masuk transactions
 */
function getBarangMasuk(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG_MASUK);
  let data = sheetToObjects(sheet);

  // Sort by date descending
  data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  // Apply limit if specified
  if (params && params.limit) {
    data = data.slice(0, params.limit);
  }

  return {
    success: true,
    data: data
  };
}

/**
 * Add barang masuk transaction
 */
function addBarangMasuk(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG_MASUK);
  const barangSheet = getSheet(SHEET_NAMES.BARANG);

  // Find barang and update stock
  const barangRow = findRow(barangSheet, 0, params.id_barang);
  if (barangRow === -1) {
    return {
      success: false,
      message: 'Barang tidak ditemukan'
    };
  }

  // Get current stock and add
  const currentStock = barangSheet.getRange(barangRow, 5).getValue();
  const newStock = Number(currentStock) + Number(params.jumlah);
  barangSheet.getRange(barangRow, 5).setValue(newStock);

  // Add transaction record
  const id = generateId('TM');
  sheet.appendRow([
    id,
    params.tanggal,
    params.id_barang,
    params.nama_barang,
    params.jumlah,
    params.user
  ]);

  return {
    success: true,
    message: 'Transaksi barang masuk berhasil dicatat'
  };
}

/**
 * Get barang keluar transactions
 */
function getBarangKeluar(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG_KELUAR);
  let data = sheetToObjects(sheet);

  // Sort by date descending
  data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  // Apply limit if specified
  if (params && params.limit) {
    data = data.slice(0, params.limit);
  }

  return {
    success: true,
    data: data
  };
}

/**
 * Add barang keluar transaction
 */
function addBarangKeluar(params) {
  const sheet = getSheet(SHEET_NAMES.BARANG_KELUAR);
  const barangSheet = getSheet(SHEET_NAMES.BARANG);

  // Find barang and check stock
  const barangRow = findRow(barangSheet, 0, params.id_barang);
  if (barangRow === -1) {
    return {
      success: false,
      message: 'Barang tidak ditemukan'
    };
  }

  // Check stock availability
  const currentStock = barangSheet.getRange(barangRow, 5).getValue();
  if (Number(currentStock) < Number(params.jumlah)) {
    return {
      success: false,
      message: 'Stok tidak mencukupi! Stok tersedia: ' + currentStock
    };
  }

  // Update stock
  const newStock = Number(currentStock) - Number(params.jumlah);
  barangSheet.getRange(barangRow, 5).setValue(newStock);

  // Add transaction record
  const id = generateId('TK');
  sheet.appendRow([
    id,
    params.tanggal,
    params.id_barang,
    params.nama_barang,
    params.jumlah,
    params.user
  ]);

  return {
    success: true,
    message: 'Transaksi barang keluar berhasil dicatat'
  };
}

/**
 * Get reports
 */
function getLaporan(params) {
  const { type, startDate, endDate } = params;
  let data = [];
  let summary = {};

  if (type === 'inventory') {
    // Inventory report
    const sheet = getSheet(SHEET_NAMES.BARANG);
    data = sheetToObjects(sheet);

    summary = {
      totalBarang: data.length,
      lowStock: data.filter(item => Number(item.stok) <= 10).length
    };

  } else if (type === 'masuk') {
    // Incoming goods report
    const sheet = getSheet(SHEET_NAMES.BARANG_MASUK);
    data = sheetToObjects(sheet);

    // Filter by date if provided
    if (startDate && endDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.tanggal);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    summary = {
      totalTransaksi: data.length,
      totalJumlah: data.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
    };

  } else if (type === 'keluar') {
    // Outgoing goods report
    const sheet = getSheet(SHEET_NAMES.BARANG_KELUAR);
    data = sheetToObjects(sheet);

    // Filter by date if provided
    if (startDate && endDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.tanggal);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    summary = {
      totalTransaksi: data.length,
      totalJumlah: data.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
    };
  }

  return {
    success: true,
    data: data,
    summary: summary
  };
}

/**
 * Get dashboard statistics
 */
function getDashboardStats() {
  const barangSheet = getSheet(SHEET_NAMES.BARANG);
  const masukSheet = getSheet(SHEET_NAMES.BARANG_MASUK);
  const keluarSheet = getSheet(SHEET_NAMES.BARANG_KELUAR);

  const barangData = sheetToObjects(barangSheet);
  const masukData = sheetToObjects(masukSheet);
  const keluarData = sheetToObjects(keluarSheet);

  // Get today's date
  const today = new Date();
  const todayStr = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // Filter today's transactions
  const masukToday = masukData.filter(item => {
    const itemDate = Utilities.formatDate(new Date(item.tanggal), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return itemDate === todayStr;
  });

  const keluarToday = keluarData.filter(item => {
    const itemDate = Utilities.formatDate(new Date(item.tanggal), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    return itemDate === todayStr;
  });

  const stats = {
    totalBarang: barangData.length,
    lowStock: barangData.filter(item => Number(item.stok) <= 10).length,
    barangMasukToday: masukToday.reduce((sum, item) => sum + Number(item.jumlah || 0), 0),
    barangKeluarToday: keluarToday.reduce((sum, item) => sum + Number(item.jumlah || 0), 0)
  };

  return {
    success: true,
    stats: stats
  };
}

/**
 * SETUP FUNCTION - RUN THIS FIRST!
 * Initialize all required sheets with demo data
 */
function setupDatabase() {
  Logger.log('=== Starting Database Setup ===');

  // Create all sheets
  Logger.log('Creating USERS sheet...');
  const usersSheet = getSheet(SHEET_NAMES.USERS);

  Logger.log('Creating BARANG sheet...');
  const barangSheet = getSheet(SHEET_NAMES.BARANG);

  Logger.log('Creating BARANG_MASUK sheet...');
  const masukSheet = getSheet(SHEET_NAMES.BARANG_MASUK);

  Logger.log('Creating BARANG_KELUAR sheet...');
  const keluarSheet = getSheet(SHEET_NAMES.BARANG_KELUAR);

  // Add test data to BARANG if empty
  const barangData = barangSheet.getDataRange().getValues();
  if (barangData.length <= 1) {
    Logger.log('Adding demo barang data...');
    barangSheet.appendRow([generateId('BRG'), 'Meja Kantor', 'Furniture', 'unit', 15]);
    barangSheet.appendRow([generateId('BRG'), 'Kursi Putar', 'Furniture', 'unit', 8]);
    barangSheet.appendRow([generateId('BRG'), 'Kertas A4', 'ATK', 'rim', 25]);
    barangSheet.appendRow([generateId('BRG'), 'Pulpen', 'ATK', 'box', 5]);
    barangSheet.appendRow([generateId('BRG'), 'Spidol Whiteboard', 'ATK', 'box', 12]);
  }

  Logger.log('=== Database Setup Complete! ===');
  Logger.log('Users sheet created with demo accounts:');
  Logger.log('- admin / admin123');
  Logger.log('- staff / staff123');
  Logger.log('- owner / owner123');

  return {
    success: true,
    message: 'Database setup complete! All sheets created with demo data.'
  };
}

/**
 * Test function to setup initial data (DEPRECATED - use setupDatabase instead)
 */
function setupTestData() {
  const sheet = getSheet(SHEET_NAMES.BARANG);

  // Add some test items if sheet is empty
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    sheet.appendRow([generateId('BRG'), 'Meja Kantor', 'Furniture', 'unit', 15]);
    sheet.appendRow([generateId('BRG'), 'Kursi Putar', 'Furniture', 'unit', 8]);
    sheet.appendRow([generateId('BRG'), 'Kertas A4', 'ATK', 'rim', 25]);
    sheet.appendRow([generateId('BRG'), 'Pulpen', 'ATK', 'box', 5]);
    sheet.appendRow([generateId('BRG'), 'Spidol Whiteboard', 'ATK', 'box', 12]);
  }
}
