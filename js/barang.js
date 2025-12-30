// Barang Management JavaScript
// CRUD operations for inventory items

let allBarang = [];
let filteredBarang = [];
let currentPage = 1;
const itemsPerPage = CONFIG.ITEMS_PER_PAGE;

// Load all items
async function loadBarang() {
  try {
    const result = await api.getBarang();

    if (result.success) {
      allBarang = result.data || [];
      filteredBarang = [...allBarang];
      renderTable();
    } else {
      showAlert('Gagal memuat data barang', 'danger');
    }
  } catch (error) {
    console.error('Load barang error:', error);
    showAlert('Terjadi kesalahan saat memuat data', 'danger');
  }
}

// Render table
function renderTable() {
  const tbody = document.getElementById('barangTableBody');
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredBarang.slice(start, end);

  if (paginatedData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <h3>Belum ada data barang</h3>
            <p>Klik tombol "Tambah Barang" untuk menambahkan barang baru</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = paginatedData.map(item => `
    <tr>
      <td>${item.id_barang}</td>
      <td><strong>${item.nama_barang}</strong></td>
      <td><span class="badge badge-primary">${item.kategori}</span></td>
      <td>${item.satuan}</td>
      <td><strong class="${item.stok <= CONFIG.LOW_STOCK_THRESHOLD ? 'text-warning' : 'text-success'}">${formatNumber(item.stok)}</strong></td>
      <td>
        <div class="table-actions-cell">
          <button class="btn btn-sm btn-secondary" onclick="editBarang('${item.id_barang}')">
            ✏️ Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmDeleteBarang('${item.id_barang}', '${item.nama_barang}')">
            🗑️ Hapus
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination();
}

// Pagination
function renderPagination() {
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  const pagination = document.getElementById('pagination');

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = `
    <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      ← Prev
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span style="color: var(--color-gray)">...</span>';
    }
  }

  html += `
    <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      Next →
    </button>
  `;

  pagination.innerHTML = html;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderTable();
}

// Search functionality
function searchBarang(query) {
  query = query.toLowerCase();
  filteredBarang = allBarang.filter(item =>
    item.id_barang.toLowerCase().includes(query) ||
    item.nama_barang.toLowerCase().includes(query) ||
    item.kategori.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderTable();
}

// Show add modal
function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Tambah Barang Baru';
  // Form doesn't have ID, so select it by querySelector
  const form = document.querySelector('#barangModal form');
  if (form) form.reset();
  document.getElementById('barangId').value = '';
  showModal('barangModal');
}

// Show edit modal
function editBarang(id) {
  const item = allBarang.find(b => b.id_barang === id);
  if (!item) return;

  document.getElementById('modalTitle').textContent = 'Edit Barang';
  document.getElementById('barangId').value = item.id_barang;
  document.getElementById('namaBarang').value = item.nama_barang;
  document.getElementById('kategori').value = item.kategori;
  document.getElementById('satuan').value = item.satuan;
  document.getElementById('stokAwal').value = item.stok;

  showModal('barangModal');
}

// Save barang (add or update)
async function saveBarang(event) {
  event.preventDefault();

  const id = document.getElementById('barangId').value;
  const data = {
    nama_barang: document.getElementById('namaBarang').value.trim(),
    kategori: document.getElementById('kategori').value.trim(),
    satuan: document.getElementById('satuan').value.trim(),
    stok: parseInt(document.getElementById('stokAwal').value) || 0
  };

  try {
    let result;
    if (id) {
      // Update existing
      data.id_barang = id;
      result = await api.updateBarang(data);
    } else {
      // Add new
      result = await api.addBarang(data);
    }

    if (result.success) {
      showAlert(id ? 'Barang berhasil diperbarui' : 'Barang berhasil ditambahkan', 'success');
      hideModal('barangModal');
      loadBarang();
    } else {
      showAlert(result.message || 'Gagal menyimpan barang', 'danger');
    }
  } catch (error) {
    console.error('Save barang error:', error);
    showAlert('Terjadi kesalahan saat menyimpan', 'danger');
  }
}

// Confirm delete
function confirmDeleteBarang(id, nama) {
  if (confirm(`Apakah Anda yakin ingin menghapus barang "${nama}"?`)) {
    deleteBarang(id);
  }
}

// Delete barang
async function deleteBarang(id) {
  try {
    const result = await api.deleteBarang(id);

    if (result.success) {
      showAlert('Barang berhasil dihapus', 'success');
      loadBarang();
    } else {
      showAlert(result.message || 'Gagal menghapus barang', 'danger');
    }
  } catch (error) {
    console.error('Delete barang error:', error);
    showAlert('Terjadi kesalahan saat menghapus', 'danger');
  }
}

// Modal controls
function showModal(id) {
  document.getElementById(id).classList.add('show');
}

function hideModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (auth.requireAuth()) {
    // Update user info
    document.getElementById('userName').textContent = auth.getUserName();
    document.getElementById('userRole').textContent = auth.getRoleDisplay();
    document.getElementById('userInitial').textContent = auth.getUserName().charAt(0).toUpperCase();

    // Load data
    loadBarang();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
      searchBarang(e.target.value);
    }, 300));
  }
});
