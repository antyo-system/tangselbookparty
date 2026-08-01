# Tangsel Book Party — Community Library Platform 📚

Platform perpustakaan digital dan manajemen peminjaman buku fisik untuk komunitas **Tangsel Book Party** di Tangerang Selatan (Bintaro, BSD, Pamulang, Ciputat).

---

## 🌟 Fitur Utama

- **Katalog & Pencarian Buku Fisik**: Pencarian cepat berdasarkan judul, penulis, genre, atau ISBN dengan tampilan grid berkecepatan tinggi.
- **Manajemen Peminjaman & Durasi**: Opsi durasi peminjaman 7, 14, dan 21 hari dengan pilihan metode serah terima (*In-Person Meetup* di event vs. *Kurir/COD*).
- **Sistem Antrean Booking (*Reservation Queue*)**: Perhitungan posisi antrean dan estimasi tanggal ketersediaan buku secara otomatis saat buku sedang dipinjam.
- **Stiker & Scanner QR Code**: Pencetakan stiker QR Code fisik dan scanner kamera WebCam/HP untuk check-in/out cepat di acara book party.
- **Pengingat WhatsApp Automatis**: Link otomatis (`wa.me`) pesan WhatsApp untuk persetujuan pinjaman, pengingat H-2 due date, dan keterlambatan.
- **Agenda Acara Komunitas**: Informasi lokasi event kumpul baca & tukar buku di Taman Bintaro, Taman Kota 1 BSD, dan Alun-Alun Pamulang.

---

## 🎨 Palet Warna & Identitas Visual Brand

- **Dark Emerald**: `#03321F`
- **Forest Green**: `#053D27`
- **Gold Accent**: `#FFBF00`
- **Lime Accent**: `#D0DF00`
- **Pure White**: `#FFFFFF` / `#F8FAFC`
- **Tipografi**: Google Fonts **Montserrat** & **Anton**

---

## 🛠️ Teknologi & Stack

- **Core**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **QR Code**: `qrcode.react` & `html5-qrcode`
- **Confetti**: `canvas-confetti`

---

## 🚀 Cara Menjalankan Aplikasi Lokal

```bash
# Clone repository
git clone https://github.com/antyo-system/tangselbookparty.git

# Masuk ke direktori
cd tangselbookparty

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:5173/` pada browser Anda.

---

## 📄 Lisensi & Hak Cipta

© 2026 Tangsel Book Party • Dibuat untuk komunitas pembaca Tangerang Selatan.
