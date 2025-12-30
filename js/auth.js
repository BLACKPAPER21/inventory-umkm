// Authentication Module
// Handles login, logout, and session management

class Auth {
  constructor() {
    this.user = this.getCurrentUser();
  }

  // Get current logged in user from session storage
  getCurrentUser() {
    const userJson = sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Get session token
  getToken() {
    return sessionStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.user !== null && this.getToken() !== null;
  }

  // Login user
  async login(username, password) {
    try {
      console.log('Attempting login...', username);
      console.log('API URL:', CONFIG.API_URL);

      // Use GET with query params - Google Apps Script doGet method
      const params = new URLSearchParams({
        action: 'login',
        username: username,
        password: password
      });

      const url = `${CONFIG.API_URL}?${params.toString()}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        // Store user and token
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.token);
        this.user = data.user;
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Username atau password salah' };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);

      // Provide more specific error messages
      let errorMessage = 'Terjadi kesalahan saat login.\n\n';

      if (error.message.includes('Failed to fetch')) {
        errorMessage += '❌ Tidak dapat terhubung ke server!\n\n';
        errorMessage += 'Kemungkinan penyebab:\n';
        errorMessage += '1. URL Google Apps Script belum benar\n';
        errorMessage += '2. Script belum di-deploy sebagai Web App\n';
        errorMessage += '3. Permission belum diatur ke "Anyone"\n';
        errorMessage += '4. Internet terputus\n\n';
        errorMessage += 'Silakan cek file DEPLOYMENT.md untuk panduan deployment.';
      } else if (error.message.includes('NetworkError')) {
        errorMessage += '❌ Koneksi internet bermasalah.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage += `❌ Server error: ${error.message}`;
      } else {
        errorMessage += error.message;
      }

      return { success: false, message: errorMessage };
    }
  }

  // Logout user
  logout() {
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    this.user = null;
    window.location.href = 'login.html';
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Check if user can access a feature based on role
  canAccess(feature) {
    if (!this.isAuthenticated()) return false;

    const permissions = {
      admin: ['all'],
      staff: ['input_barang_masuk', 'input_barang_keluar', 'view_data'],
      owner: ['view_data', 'view_laporan']
    };

    const userRole = this.user.role;
    const userPermissions = permissions[userRole] || [];

    return userPermissions.includes('all') || userPermissions.includes(feature);
  }

  // Require authentication (call on protected pages)
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  // Get user display name
  getUserName() {
    return this.user ? this.user.nama : '';
  }

  // Get user role display
  getRoleDisplay() {
    const roles = {
      admin: 'Administrator',
      staff: 'Staff',
      owner: 'Pemilik'
    };
    return this.user ? roles[this.user.role] : '';
  }
}

// Create global auth instance
const auth = new Auth();
