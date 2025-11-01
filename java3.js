let dataPengunjung = JSON.parse(localStorage.getItem('pengunjung')) || [];

const tbody = document.querySelector('#tabelPengunjung tbody');
const overlay = document.getElementById('overlay');
const formContainer = document.getElementById('formContainer');
const form = document.getElementById('formList');
const namaInput = document.getElementById('nama');
const instansiInput = document.getElementById('instansi');
const noHpInput = document.getElementById('noHp');
const purposeInput = document.getElementById('purpose');
const editIndexInput = document.getElementById('editIndex');
const batalBtn = document.getElementById('batalBtn');
const formTitle = document.getElementById('formTitle');

const filterSearch = document.getElementById('filterSearch');
const filterTanggalDari = document.getElementById('filterTanggalDari');
const filterTanggalSampai = document.getElementById('filterTanggalSampai');

function renderTabel() {
  tbody.innerHTML = '';

  const searchValue = filterSearch.value.toLowerCase();
  const dari = filterTanggalDari.value ? new Date(filterTanggalDari.value) : null;
  const sampai = filterTanggalSampai.value ? new Date(filterTanggalSampai.value) : null;

  dataPengunjung
    .filter(d => {
      const cocokSearch =
        d.nama.toLowerCase().includes(searchValue) ||
        d.instansi.toLowerCase().includes(searchValue);

      const [hari, bulan, tahun] = d.date.split('/');
      const tanggalData = new Date(`${tahun}-${bulan}-${hari}`);

      let cocokTanggal = true;

      if (dari && !sampai) {
        cocokTanggal = tanggalData.toDateString() === dari.toDateString();
      } else if (dari && sampai) {
        cocokTanggal = tanggalData >= dari && tanggalData <= sampai;
      } else {
        cocokTanggal = true;
      }

      return cocokSearch && cocokTanggal;
    })
    .forEach((data, index) => {
      const row = document.createElement('tr');

      let dropdownMenu = `
        <li><a class="dropdown-item" href="#" onclick="editData(${index})">Edit</a></li>
        <li><a class="dropdown-item text-danger" href="#" onclick="hapusData(${index})">Hapus</a></li>
      `;

      if (data.jamKeluar === '-' || data.jamKeluar === '' || !data.jamKeluar) {
        dropdownMenu = `
          <li><a class="dropdown-item text-success" href="#" onclick="selesaiKunjungan(${index})">Selesai</a></li>
          ${dropdownMenu}
        `;
      }

      row.innerHTML = `
        <td>${data.nama}</td>
        <td>${data.instansi}</td>
        <td>${data.noHp}</td>
        <td class="keperluan">${data.purpose}</td>
        <td>${data.date}</td>
        <td>${data.jamMasuk || '-'}</td>
        <td>
          ${data.jamKeluar || '-'}
          <div class="dropdown d-inline float-end">
            <button class="btn btn-link text-dark p-0 ms-2 dropdown-toggle" data-bs-toggle="dropdown">⋮</button>
            <ul class="dropdown-menu">
              ${dropdownMenu}
            </ul>
          </div>
        </td>
      `;

      if (data.jamKeluar && data.jamKeluar !== '-') {
        row.classList.add('selesai');
      }

      tbody.appendChild(row);
    });
}

function showForm() {
  overlay.style.display = 'block';
  formContainer.style.display = 'block';
}

function hideForm() {
  overlay.style.display = 'none';
  formContainer.style.display = 'none';
  form.reset();
  editIndexInput.value = '';
}

function tambahData() {
  formTitle.textContent = "Tambah Data";
  showForm();
}

function editData(index) {
  const data = dataPengunjung[index];
  namaInput.value = data.nama;
  instansiInput.value = data.instansi;
  noHpInput.value = data.noHp;
  purposeInput.value = data.purpose;
  editIndexInput.value = index;
  formTitle.textContent = "Edit Data";
  showForm();
}

function hapusData(index) {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    dataPengunjung.splice(index, 1);
    localStorage.setItem('pengunjung', JSON.stringify(dataPengunjung));
    renderTabel();
  }
}

function selesaiKunjungan(index) {
  const now = new Date();
  const jamKeluar = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  dataPengunjung[index].jamKeluar = jamKeluar;
  localStorage.setItem('pengunjung', JSON.stringify(dataPengunjung));
  renderTabel();
}

batalBtn.addEventListener('click', hideForm);
overlay.addEventListener('click', hideForm);

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const nama = namaInput.value.trim();
  const instansi = instansiInput.value.trim();
  const noHp = noHpInput.value.trim();
  const purpose = purposeInput.value.trim();

  if (!nama || !instansi || !noHp || !purpose) {
    alert('Semua kolom harus diisi!');
    return;
  }

  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID');
  const jamMasuk = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const dataBaru = { nama, instansi, noHp, purpose, date: tanggal, jamMasuk, jamKeluar: '-' };

  const editIndex = editIndexInput.value;
  if (editIndex === '') {
    dataPengunjung.push(dataBaru);
  } else {
    dataBaru.date = dataPengunjung[editIndex].date;
    dataBaru.jamMasuk = dataPengunjung[editIndex].jamMasuk;
    dataBaru.jamKeluar = dataPengunjung[editIndex].jamKeluar;
    dataPengunjung[editIndex] = dataBaru;
  }

  localStorage.setItem('pengunjung', JSON.stringify(dataPengunjung));
  renderTabel();
  hideForm();
});

[filterSearch, filterTanggalDari, filterTanggalSampai].forEach(input => {
  input.addEventListener('input', renderTabel);
});

renderTabel();

window.editData = editData;
window.hapusData = hapusData;
window.selesaiKunjungan = selesaiKunjungan;
