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
var pilihLayanan = document.getElementById("jenisLayanan");
var boxLayanan = document.getElementById("boxLayanan");
var boxGameLain = document.getElementById("boxGameLain");
var inputGameLain = document.getElementById("gameLain");
var inputCatatan = document.getElementById("catatan");
var teksHarga = document.getElementById("hargaPilih");

// Isi pilihan layanan dari daftar harga yang ada di halaman,
// jadi kalau harga diubah di HTML, form ikut berubah.
function isiLayanan() {
  pilihLayanan.innerHTML = "";

  if (pilihGame.value == "lain") {
    // game lain: tidak ada daftar harga, admin yang menentukan
    boxLayanan.hidden = true;
    boxGameLain.hidden = false;
    teksHarga.textContent = "Harga: ditentukan admin";
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

    var opsi = document.createElement("option");
    opsi.textContent = namaLayanan;
    opsi.value = harga;
    pilihLayanan.appendChild(opsi);
  }

  tampilkanHarga();
}

function tampilkanHarga() {
  teksHarga.textContent = "Harga: " + pilihLayanan.value;
}

pilihGame.addEventListener("change", isiLayanan);
pilihLayanan.addEventListener("change", tampilkanHarga);

// Saat form dikirim, buat pesan lalu buka WhatsApp
form.addEventListener("submit", function (e) {
  e.preventDefault();

  var namaGame;
  var layananDipilih;
  var harga;

  if (pilihGame.value == "lain") {
    namaGame = inputGameLain.value || "(belum diisi)";
    layananDipilih = "Request game lain";
    harga = "Tanya admin";
  } else {
    namaGame = pilihGame.options[pilihGame.selectedIndex].text;
    layananDipilih = pilihLayanan.options[pilihLayanan.selectedIndex].text;
    harga = pilihLayanan.value;
  }

  var pesan = "Halo Jokiblox Kilat, saya mau order joki.\n\n";
  pesan += "Nama: " + inputNama.value + "\n";
  pesan += "Game: " + namaGame + "\n";
  pesan += "Layanan: " + layananDipilih + "\n";
  pesan += "Harga: " + harga + "\n";

  if (inputCatatan.value != "") {
    pesan += "Catatan: " + inputCatatan.value + "\n";
  }

  var link = "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(pesan);
  window.open(link, "_blank");
});

// isi pilihan layanan pertama kali saat halaman dibuka
isiLayanan();
