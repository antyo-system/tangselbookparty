# 📖 Panduan Admin (Caretaker) — Tangsel Book Party

> Panduan ini untuk kamu yang ditunjuk jadi **pengurus / caretaker** perpustakaan komunitas. Gak perlu ngerti coding. Ikutin aja langkah-langkahnya.

---

## 🔐 Masuk ke Admin Panel

1. Buka website **tangselbookparty.vercel.app**
2. Klik **Masuk** di pojok kanan atas
3. Masukkan email admin & password yang sudah diberikan
4. Kamu akan otomatis masuk ke **Admin Panel** (layar hijau gelap dengan sidebar)

> ⚠️ **Penting**: Akun admin TIDAK bisa dibuat dari halaman daftar biasa. Hanya bisa diatur langsung di database oleh developer.

---

## 🧭 Mengenal Tampilan Admin Panel

Ada **6 menu utama** yang bisa kamu akses:

| Menu | Fungsi |
|------|--------|
| **Permintaan Pinjam** | Menyetujui / menolak permintaan pinjam buku dari anggota |
| **Pinjaman Aktif** | Melihat buku yang sedang dipinjam & menandai pengembalian |
| **Antrean Reservasi** | Melihat siapa saja yang mengantri untuk buku tertentu |
| **CMS Katalog Buku** | Menambah, mengedit, atau menghapus buku di perpustakaan |
| **CMS Artikel SEO** | Menulis & mengelola artikel blog komunitas |
| **CMS Acara Komunitas** | Mengelola jadwal event / meetup baca |

**Di HP**: Geser horizontal di baris tab hijau di bawah header untuk berpindah menu.

---

## ✅ Menyetujui Permintaan Pinjam Buku

Ini adalah tugas utama admin. Saat ada anggota yang mau pinjam buku, kamu yang memutuskan.

1. Buka menu **Permintaan Pinjam**
2. Kamu akan melihat daftar permintaan masuk (kalau ada)
3. Di setiap permintaan, ada info:
   - Judul buku yang diminta
   - Nama & nomor HP peminjam
   - Durasi pinjam (7 / 14 / 21 hari)
   - Metode serah terima (ketemuan / kurir)
4. Pilih aksi:
   - 🟢 **Setujui Pinjaman** → Buku otomatis berstatus "Dipinjam"
   - 🔴 **Tolak** → Permintaan ditolak, buku tetap tersedia
   - 💬 **WhatsApp** → Kirim pesan ke peminjam via WA untuk koordinasi

> 💡 **Tips**: Kalau semua permintaan sudah diproses, akan muncul tanda centang hijau ✅

---

## 📚 Menandai Buku Sudah Dikembalikan

Setelah anggota mengembalikan buku fisik ke kamu:

1. Buka menu **Pinjaman Aktif**
2. Cari buku yang dikembalikan
3. Klik tombol **Tandai Dikembalikan**
4. Selesai! Buku otomatis kembali berstatus "Tersedia" di katalog

> 🔴 Kalau ada label **TERLAMBAT** merah, artinya sudah lewat batas pengembalian. Kamu bisa kirim reminder via tombol **Pengingat WA**.

---

## 📸 Scan QR untuk Serah Terima Cepat

Saat acara gathering / piknik baca, pakai fitur QR supaya lebih cepat:

1. Klik tombol **Scan QR** (ada di header atau tombol melayang di HP)
2. Arahkan kamera ke stiker QR di buku fisik
3. Sistem otomatis mengenali buku dan menampilkan info lengkapnya
4. Lanjutkan proses approve / return dari situ

> 📌 Setiap buku di katalog bisa dicetak stiker QR-nya dari menu **CMS Katalog Buku** → klik ikon QR di buku yang diinginkan.

---

## 📕 Menambah Buku Baru ke Katalog

1. Buka menu **CMS Katalog Buku**
2. Klik tombol **＋ Tambah Buku Baru**
3. Isi form:
   - **Judul** & **Penulis** (wajib)
   - **ISBN** (opsional, bisa dikosongkan)
   - **Genre** (pilih dari dropdown)
   - **Sinopsis** (deskripsi singkat isi buku)
   - **Lokasi Rak** (contoh: "Rak A-02 Markas BSD")
   - **Cover Buku** (tempel link gambar)
4. Klik **Simpan**

**Mengedit / Menghapus buku**: Klik ikon ✏️ (edit) atau 🗑️ (hapus) di samping buku.

---

## 📝 Menulis Artikel Blog

1. Buka menu **CMS Artikel SEO**
2. Klik **＋ Tulis Artikel Baru**
3. Isi form:
   - **Judul Artikel**
   - **Kategori** (Resensi, Tips Membaca, Cerita Komunitas, dll)
   - **Isi Artikel** (tulis bebas)
   - **Gambar Cover** (tempel link gambar)
4. Klik **Publikasikan**

---

## 📅 Mengelola Acara & Meetup

1. Buka menu **CMS Acara Komunitas**
2. Klik **＋ Buat Acara Baru**
3. Isi form:
   - **Nama Acara** (contoh: "Piknik Baca BSD City")
   - **Tanggal & Waktu**
   - **Lokasi** (contoh: "Taman Kota 2, BSD")
   - **Deskripsi Acara**
   - **Kapasitas Maksimal**
4. Klik **Simpan**

---

## 🚪 Keluar dari Admin Panel

- Klik tombol **Keluar Caretaker** di bagian paling bawah sidebar (warna merah)
- Kamu akan kembali ke halaman katalog publik

---

## ❓ FAQ Admin

**Q: Kenapa saya gak bisa masuk ke Admin Panel?**
> Pastikan email & password benar. Akun admin hanya bisa diaktifkan oleh developer di database.

**Q: Saya refresh halaman, kok tetap di Admin Panel?**
> Itu fitur — sesi admin otomatis tersimpan supaya gak perlu login ulang tiap refresh.

**Q: Bagaimana cara cetak stiker QR buku?**
> Di **CMS Katalog Buku**, klik ikon QR di buku yang diinginkan → gambar QR muncul → screenshot atau print.

**Q: Ada anggota yang lupa mengembalikan buku. Gimana?**
> Di menu **Pinjaman Aktif**, klik tombol **Pengingat WA** di buku yang terlambat. Pesan template otomatis terbuka di WhatsApp.

---

*Panduan ini dibuat oleh tim pengembang Tangsel Book Party. Terakhir diperbarui: Agustus 2026.*
