// Reports Module
// Generate and export reports

let reportData = [];
let currentReportType = 'inventory';

async function generateReport() {
  const type = document.getElementById('reportType').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (startDate && endDate && startDate > endDate) {
    showAlert('Tanggal awal tidak boleh lebih besar dari tanggal akhir', 'warning');
    return;
  }

  currentReportType = type;

  try {
    const filters = {
      startDate,
      endDate
    };

    const result = await api.getLaporan(type, filters);

    if (result.success) {
      reportData = result.data || [];
      renderReport();
      updateSummary(result.summary);
    } else {
      showAlert('Gagal mengambil data laporan', 'danger');
    }
  } catch (error) {
    console.error('Generate report error:', error);
    showAlert('Terjadi kesalahan saat membuat laporan', 'danger');
  }
}

function renderReport() {
  const tbody = document.getElementById('reportTableBody');
  const thead = document.getElementById('reportTableHead');

  if (reportData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray">Tidak ada data untuk ditampilkan. Pilih jenis laporan dan klik "Buat Laporan"</td></tr>';
    return;
  }

  // Set table headers based on report type
  if (currentReportType === 'inventory') {
    thead.innerHTML = `
      <tr>
        <th>ID Barang</th>
        <th>Nama Barang</th>
        <th>Kategori</th>
        <th>Satuan</th>
        <th>Stok</th>
        <th>Status</th>
      </tr>
    `;

    tbody.innerHTML = reportData.map(item => `
      <tr>
        <td><code>${item.id_barang}</code></td>
        <td><strong>${item.nama_barang}</strong></td>
        <td><span class="badge badge-primary">${item.kategori}</span></td>
        <td>${item.satuan}</td>
        <td><strong class="${item.stok <= CONFIG.LOW_STOCK_THRESHOLD ? 'text-warning' : 'text-success'}">${formatNumber(item.stok)}</strong></td>
        <td>
          ${item.stok <= CONFIG.LOW_STOCK_THRESHOLD
            ? '<span class="badge badge-warning">Stok Menipis</span>'
            : '<span class="badge badge-success">Stok Aman</span>'}
        </td>
      </tr>
    `).join('');
  } else if (currentReportType === 'masuk') {
    thead.innerHTML = `
      <tr>
        <th>Tanggal</th>
        <th>ID Barang</th>
        <th>Nama Barang</th>
        <th>Jumlah Masuk</th>
        <th>User</th>
      </tr>
    `;

    tbody.innerHTML = reportData.map(item => `
      <tr>
        <td>${formatDate(item.tanggal)}</td>
        <td><code>${item.id_barang}</code></td>
        <td><strong>${item.nama_barang}</strong></td>
        <td><span class="badge badge-success">+${formatNumber(item.jumlah)}</span></td>
        <td>${item.user || '-'}</td>
      </tr>
    `).join('');
  } else if (currentReportType === 'keluar') {
    thead.innerHTML = `
      <tr>
        <th>Tanggal</th>
        <th>ID Barang</th>
        <th>Nama Barang</th>
        <th>Jumlah Keluar</th>
        <th>User</th>
      </tr>
    `;

    tbody.innerHTML = reportData.map(item => `
      <tr>
        <td>${formatDate(item.tanggal)}</td>
        <td><code>${item.id_barang}</code></td>
        <td><strong>${item.nama_barang}</strong></td>
        <td><span class="badge badge-danger">-${formatNumber(item.jumlah)}</span></td>
        <td>${item.user || '-'}</td>
      </tr>
    `).join('');
  }

  // Show export buttons
  document.getElementById('exportButtons').classList.remove('hidden');
}

function updateSummary(summary) {
  if (!summary) return;

  const summaryDiv = document.getElementById('reportSummary');
  let html = '<div class="stats-grid">';

 if (currentReportType === 'inventory') {
    html += `
      <div class="stat-card">
        <h4 class="stat-card-title">Total Barang</h4>
        <p class="stat-card-value">${formatNumber(summary.totalBarang || 0)}</p>
      </div>
      <div class="stat-card warning">
        <h4 class="stat-card-title">Stok Menipis</h4>
        <p class="stat-card-value">${formatNumber(summary.lowStock || 0)}</p>
       </div>
    `;
  } else if (currentReportType === 'masuk') {
    html += `
      <div class="stat-card success">
        <h4 class="stat-card-title">Total Transaksi</h4>
        <p class="stat-card-value">${formatNumber(summary.totalTransaksi || 0)}</p>
      </div>
      <div class="stat-card">
        <h4 class="stat-card-title">Total Barang Masuk</h4>
        <p class="stat-card-value">${formatNumber(summary.totalJumlah || 0)}</p>
      </div>
    `;
  } else if (currentReportType === 'keluar') {
    html += `
      <div class="stat-card danger">
        <h4 class="stat-card-title">Total Transaksi</h4>
        <p class="stat-card-value">${formatNumber(summary.totalTransaksi || 0)}</p>
      </div>
      <div class="stat-card">
        <h4 class="stat-card-title">Total Barang Keluar</h4>
        <p class="stat-card-value">${formatNumber(summary.totalJumlah || 0)}</p>
      </div>
    `;
  }

  html += '</div>';
  summaryDiv.innerHTML = html;
}

function exportToExcel() {
  if (reportData.length === 0) {
    showAlert('Tidak ada data untuk diekspor', 'warning');
    return;
  }

  // Convert data to CSV format
  let csv = '';
  const headers = getHeadersForType(currentReportType);
  csv += headers.join(',') + '\n';

  reportData.forEach(row => {
    const values = getValuesForType(row, currentReportType);
    csv += values.map(v => `"${v}"`).join(',') + '\n';
  });

  // Download CSV file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `laporan_${currentReportType}_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showAlert('Data berhasil diekspor ke Excel/CSV', 'success');
}

function exportToPDF() {
  showAlert('Gunakan Print (Ctrl+P) dan pilih "Save as PDF"', 'info');
  window.print();
}

function getHeadersForType(type) {
  if (type === 'inventory') {
    return ['ID Barang', 'Nama Barang', 'Kategori', 'Satuan', 'Stok'];
  } else if (type === 'masuk') {
    return ['Tanggal', 'ID Barang', 'Nama Barang', 'Jumlah Masuk', 'User'];
  } else if (type === 'keluar') {
    return ['Tanggal', 'ID Barang', 'Nama Barang', 'Jumlah Keluar', 'User'];
  }
  return [];
}

function getValuesForType(row, type) {
  if (type === 'inventory') {
    return [row.id_barang, row.nama_barang, row.kategori, row.satuan, row.stok];
  } else if (type === 'masuk' || type === 'keluar') {
    return [formatDate(row.tanggal), row.id_barang, row.nama_barang, row.jumlah, row.user || '-'];
  }
  return [];
}
