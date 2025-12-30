// Dashboard specific JavaScript
// Load and display dashboard statistics

let stats = {
  totalBarang: 0,
  lowStock: 0,
  barangMasukToday: 0,
  barangKeluarToday: 0
};

async function loadDashboard() {
  try {
    const result = await api.getDashboardStats();

    if (result.success) {
      stats = result.stats;
      updateStatsCards();
      loadRecentTransactions();
    } else {
      showAlert('Gagal memuat data dashboard', 'danger');
    }
  } catch (error) {
    console.error('Dashboard load error:', error);
    showAlert('Terjadi kesalahan saat memuat dashboard', 'danger');
  }
}

function updateStatsCards() {
  // Update stat cards with actual data
  document.getElementById('totalBarang').textContent = formatNumber(stats.totalBarang || 0);
  document.getElementById('lowStock').textContent = formatNumber(stats.lowStock || 0);
  document.getElementById('barangMasuk').textContent = formatNumber(stats.barangMasukToday || 0);
  document.getElementById('barangKeluar').textContent = formatNumber(stats.barangKeluarToday || 0);
}

async function loadRecentTransactions() {
  try {
    const [masukResult, keluarResult] = await Promise.all([
      api.getBarangMasuk({ limit: 5 }),
      api.getBarangKeluar({ limit: 5 })
    ]);

    if (masukResult.success) {
      displayRecentMasuk(masukResult.data || []);
    }

    if (keluarResult.success) {
      displayRecentKeluar(keluarResult.data || []);
    }
  } catch (error) {
    console.error('Recent transactions error:', error);
  }
}

function displayRecentMasuk(data) {
  const tbody = document.getElementById('recentMasukBody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray">Belum ada transaksi hari ini</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.nama_barang}</td>
      <td>${formatNumber(item.jumlah)}</td>
      <td>${formatDate(item.tanggal)}</td>
    </tr>
  `).join('');
}

function displayRecentKeluar(data) {
  const tbody = document.getElementById('recentKeluarBody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray">Belum ada transaksi hari ini</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.nama_barang}</td>
      <td>${formatNumber(item.jumlah)}</td>
      <td>${formatDate(item.tanggal)}</td>
    </tr>
  `).join('');
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', () => {
  if (auth.requireAuth()) {
    // Update user info in sidebar
    document.getElementById('userName').textContent = auth.getUserName();
    document.getElementById('userRole').textContent = auth.getRoleDisplay();
    document.getElementById('userInitial').textContent = auth.getUserName().charAt(0).toUpperCase();

    // Load dashboard data
    loadDashboard();
  }
});
