// Nomor WhatsApp admin (format 62, tanpa 0 di depan)
var nomorWA = "6283138434166";


// ===== 1. Menu untuk tampilan HP =====
var tombolMenu = document.getElementById("tombolMenu");
var menu = document.getElementById("menu");

tombolMenu.addEventListener("click", function () {
  menu.classList.toggle("buka");

  // kasih tahu pembaca layar menu sedang terbuka atau tidak
  var terbuka = menu.classList.contains("buka");
  tombolMenu.setAttribute("aria-expanded", terbuka);
});

// menu menutup lagi setelah salah satu link diklik
var linkMenu = menu.querySelectorAll("a");
for (var i = 0; i < linkMenu.length; i++) {
  linkMenu[i].addEventListener("click", function () {
    menu.classList.remove("buka");
    tombolMenu.setAttribute("aria-expanded", false);
  });
}


// ===== 2. Form order cepat =====
var form = document.getElementById("formOrder");
var inputNama = document.getElementById("nama");
var pilihGame = document.getElementById("game");
var boxLayanan = document.getElementById("boxLayanan");
var daftarLayanan = document.getElementById("daftarLayanan");
var boxGameLain = document.getElementById("boxGameLain");
var inputGameLain = document.getElementById("gameLain");
var inputCatatan = document.getElementById("catatan");
var teksHarga = document.getElementById("hargaPilih");

// Ubah teks harga jadi angka. Contoh: "Rp 2.000 - 5.000" jadi [2000, 5000]
function ambilAngka(teks) {
  var bersih = teks.replace(/\./g, "");
  var hasil = bersih.match(/\d+/g);
  return hasil;
}

function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Isi daftar centang dari daftar harga yang ada di halaman,
// jadi kalau harga diubah di HTML, form ikut berubah.
function isiLayanan() {
  daftarLayanan.innerHTML = "";

  if (pilihGame.value == "lain") {
    // game lain: tidak ada daftar harga, admin yang menentukan
    boxLayanan.hidden = true;
    boxGameLain.hidden = false;
    teksHarga.textContent = "Estimasi harga: ditentukan admin";
    return;
  }

  boxLayanan.hidden = false;
  boxGameLain.hidden = true;

  var daftar;
  if (pilihGame.value == "bee") {
    daftar = document.querySelectorAll(".game-bee .harga li");
  } else {
    daftar = document.querySelectorAll(".game-blox .harga li");
  }

  for (var i = 0; i < daftar.length; i++) {
    var namaLayanan = daftar[i].querySelector("span").textContent;
    var harga = daftar[i].querySelector("b").textContent;

    var baris = document.createElement("label");
    baris.className = "centang";
    baris.innerHTML = '<input type="checkbox" value="' + harga + '">' +
                      "<span>" + namaLayanan + "</span>" +
                      "<b>" + harga + "</b>";

    baris.querySelector("input").addEventListener("change", hitungHarga);
    daftarLayanan.appendChild(baris);
  }

  hitungHarga();
}

// Ambil semua layanan yang dicentang
function layananDipilih() {
  var hasil = [];
  var kotak = daftarLayanan.querySelectorAll("input:checked");

  for (var i = 0; i < kotak.length; i++) {
    var nama = kotak[i].parentElement.querySelector("span").textContent;
    hasil.push({ nama: nama, harga: kotak[i].value });
  }
  return hasil;
}

// Hitung estimasi total (harga terendah sampai tertinggi)
function hitungHarga() {
  if (pilihGame.value == "lain") {
    return;
  }

  var dipilih = layananDipilih();
  if (dipilih.length == 0) {
    teksHarga.textContent = "Estimasi harga: -";
    return;
  }

  var totalMin = 0;
  var totalMax = 0;

  for (var i = 0; i < dipilih.length; i++) {
    var angka = ambilAngka(dipilih[i].harga);
    totalMin += Number(angka[0]);
    totalMax += Number(angka[angka.length - 1]);
  }

  if (totalMin == totalMax) {
    teksHarga.textContent = "Estimasi harga: " + formatRupiah(totalMin);
  } else {
    teksHarga.textContent = "Estimasi harga: " + formatRupiah(totalMin) + " - " + formatRupiah(totalMax);
  }
}

pilihGame.addEventListener("change", isiLayanan);

// Saat form dikirim, buat pesan lalu buka WhatsApp
form.addEventListener("submit", function (e) {
  e.preventDefault();

  var namaGame;
  var pesan = "Halo Jokiblox Kilat, saya mau order joki.\n\n";
  pesan += "Nama: " + inputNama.value + "\n";

  if (pilihGame.value == "lain") {
    namaGame = inputGameLain.value || "(belum diisi)";
    pesan += "Game: " + namaGame + " (request game lain)\n";
  } else {
    var dipilih = layananDipilih();

    if (dipilih.length == 0) {
      alert("Pilih minimal satu layanan dulu ya.");
      return;
    }

    namaGame = pilihGame.options[pilihGame.selectedIndex].text;
    pesan += "Game: " + namaGame + "\n";
    pesan += "Layanan:\n";
    for (var i = 0; i < dipilih.length; i++) {
      pesan += "- " + dipilih[i].nama + " (" + dipilih[i].harga + ")\n";
    }
    pesan += teksHarga.textContent + "\n";
  }

  if (inputCatatan.value != "") {
    pesan += "Catatan: " + inputCatatan.value + "\n";
  }

  var link = "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(pesan);
  window.open(link, "_blank");
});

// isi daftar layanan pertama kali saat halaman dibuka
isiLayanan();
