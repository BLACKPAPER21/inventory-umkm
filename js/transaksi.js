// Transaction Module
// Shared code for barang masuk and keluar

let barangList = [];

// Load barang list for autocomplete
async function loadBarangList() {
  try {
    const result = await api.getBarang();
    if (result.success) {
      barangList = result.data || [];
      populateBarangSelect();
    }
  } catch (error) {
    console.error('Load barang list error:', error);
  }
}

// Populate barang select dropdown
function populateBarangSelect() {
  const select = document.getElementById('idBarang');
  if (!select) return;

  select.innerHTML = '<option value="">Pilih barang...</option>';

  barangList.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id_barang;
    option.textContent = `${item.nama_barang} (Stok: ${item.stok} ${item.satuan})`;
    option.dataset.stok = item.stok;
    option.dataset.nama = item.nama_barang;
    select.appendChild(option);
  });
}

// Get selected barang info
function getSelectedBarang() {
  const select = document.getElementById('idBarang');
  const selectedOption = select.options[select.selectedIndex];

  if (!selectedOption || !selectedOption.value) return null;

  return {
    id: selectedOption.value,
    nama: selectedOption.dataset.nama,
    stok: parseInt(selectedOption.dataset.stok) || 0
  };
}
