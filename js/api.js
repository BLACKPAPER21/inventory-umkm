// API Module
// Handles all API communications with Google Apps Script backend

class API {
  constructor() {
    this.baseURL = CONFIG.API_URL;
  }

  // Generic API call method - using GET to avoid CORS issues
  async call(action, data = {}) {
    try {
      showLoading();

      // Build query parameters
      const params = new URLSearchParams({
        action: action,
        ...data
      });

      const url = `${this.baseURL}?${params.toString()}`;
      console.log('API Call:', action, data);

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      hideLoading();

      return result;
    } catch (error) {
      hideLoading();
      console.error('API Error:', error);
      throw new Error('Terjadi kesalahan saat menghubungi server');
    }
  }

  // Get all items
  async getBarang() {
    return this.call('getBarang');
  }

  // Add new item
  async addBarang(data) {
    return this.call('addBarang', data);
  }

  // Update item
  async updateBarang(data) {
    return this.call('updateBarang', data);
  }

  // Delete item
  async deleteBarang(id) {
    return this.call('deleteBarang', { id_barang: id });
  }

  // Get incoming goods transactions
  async getBarangMasuk(filters = {}) {
    return this.call('getBarangMasuk', filters);
  }

  // Add incoming goods transaction
  async addBarangMasuk(data) {
    return this.call('addBarangMasuk', data);
  }

  // Get outgoing goods transactions
  async getBarangKeluar(filters = {}) {
    return this.call('getBarangKeluar', filters);
  }

  // Add outgoing goods transaction
  async addBarangKeluar(data) {
    return this.call('addBarangKeluar', data);
  }

  // Get reports with filters
  async getLaporan(type, filters = {}) {
    return this.call('getLaporan', { type, ...filters });
  }

  // Get dashboard statistics
  async getDashboardStats() {
    return this.call('getDashboardStats');
  }
}

// Create global API instance
const api = new API();

// Utility Functions
function showLoading(text = 'Memuat...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">${text}</div>
    `;
    document.body.appendChild(overlay);
  }

  setTimeout(() => {
    overlay.classList.add('show');
  }, 10);
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 300);
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} animate-fadeIn`;
  alertDiv.innerHTML = `
    <span>${getAlertIcon(type)}</span>
    <span>${message}</span>
  `;

  const container = document.querySelector('.main-content') || document.body;
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 300);
  }, 5000);
}

function getAlertIcon(type) {
  const icons = {
    success: '✓',
    warning: '⚠',
    danger: '✕',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
