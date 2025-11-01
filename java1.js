function tambahData() {
  const name = document.getElementById("name").value.trim();
  const instansi = document.getElementById("instansi").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const purpose = document.getElementById("purpose").value.trim();

  if (!name || !instansi || !contact || !purpose) {
    alert("Harap isi semua data terlebih dahulu.");
    return;
  }

  const now = new Date();
  const jam = String(now.getHours()).padStart(2, "0");
  const menit = String(now.getMinutes()).padStart(2, "0");
  const waktu = jam + ":" + menit;

  const hasilContainer = document.getElementById("formHasilContainer");
  const card = document.createElement("div");
  card.classList.add("hasil-card");

  card.innerHTML =
    "<h5>" + name + "</h5>" +
    "<p><strong>Instansi:</strong> " + instansi + "</p>" +
    "<p><strong>Kontak:</strong> " + contact + "</p>" +
    "<p><strong>Tujuan:</strong> " + purpose + "</p>" +
    "<p class='hasil-waktu'>Waktu masuk: " + waktu + "</p>" +
    "<div class='btn-container'>" +
      "<button type='button' class='btn btn-sm btn-success' onclick='kirimData(this)'>Selesai</button> " +
      "<button type='button' class='btn btn-sm btn-danger' onclick='hapusData(this)'>Hapus</button>" +
    "</div>";

  hasilContainer.appendChild(card);
  document.getElementById("formInput").reset();

  document.getElementById("formWrapper").classList.add("has-results");
  document.getElementById("mainWrapper").classList.remove("single-form");
  document.getElementById("mainWrapper").classList.add("dual-form");
}

function hapusData(button) {
  const card = button.closest(".hasil-card");
  card.remove();
  const hasilContainer = document.getElementById("formHasilContainer");
  if (hasilContainer.children.length === 0) {
    document.getElementById("formWrapper").classList.remove("has-results");
    document.getElementById("mainWrapper").classList.remove("dual-form");
    document.getElementById("mainWrapper").classList.add("single-form");
  }
}

function kirimData(button) {
  const now = new Date();
  const jam = String(now.getHours()).padStart(2, "0");
  const menit = String(now.getMinutes()).padStart(2, "0");
  const waktuKeluar = jam + ":" + menit;

  const card = button.closest(".hasil-card");
  const nama = card.querySelector("h5").innerText;
  const instansi = card.querySelector("p:nth-of-type(1)").innerText.replace("Instansi: ", "");
  const kontak = card.querySelector("p:nth-of-type(2)").innerText.replace("Kontak: ", "");
  const tujuan = card.querySelector("p:nth-of-type(3)").innerText.replace("Tujuan: ", "");
  const waktuMasuk = card.querySelector(".hasil-waktu").innerText.replace("Waktu masuk: ", "");

  card.querySelector(".hasil-waktu").innerText += " | Waktu keluar: " + waktuKeluar;

  const tanggal = new Date().toLocaleDateString("id-ID");
  let dataPengunjung = JSON.parse(localStorage.getItem("pengunjung")) || [];

  dataPengunjung.push({
    nama: nama,
    instansi: instansi,
    noHp: kontak,
    purpose: tujuan,
    date: tanggal,
    jamMasuk: waktuMasuk,
    jamKeluar: waktuKeluar
  });

  localStorage.setItem("pengunjung", JSON.stringify(dataPengunjung));
  alert("✅ Data berhasil dikirim ke daftar pengunjung!");

  card.remove();
  const hasilContainer = document.getElementById("formHasilContainer");
  if (hasilContainer.children.length === 0) {
    document.getElementById("formWrapper").classList.remove("has-results");
    document.getElementById("mainWrapper").classList.remove("dual-form");
    document.getElementById("mainWrapper").classList.add("single-form");
  }

  window.location.href = "dash.html";
}
