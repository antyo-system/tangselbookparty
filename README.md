# Tangsel Book Party — Platform Perpustakaan Fisik Komunitas 📚

Platform perpustakaan digital dan sistem peminjaman buku fisik peer-to-peer berbasis komunitas untuk **Tangsel Book Party** di Tangerang Selatan (Bintaro, BSD, Pamulang, Ciputat).

---

## 🌟 Konsep Utama: Satu Katalog, Dua Sumber Buku

Tangsel Book Party menggabungkan dua sumber buku dalam satu katalog fisik terpadu:
1. **Koleksi Komunitas Tangsel** — Buku fisik bersama yang dikelola langsung oleh Admin.
2. **Buku Milik Anggota (Member)** — Buku pribadi anggota yang didaftarkan ke katalog publik agar dapat dipinjamkan secara gratis kepada sesama pecinta buku.

Seluruh siklus peminjaman bersifat **100% Gratis** (tanpa biaya sewa atau pendaftaran).

---

## ✨ Fitur-Fitur Utama

### 📖 1. Peminjaman Peer-to-Peer & Katalog Publik
- **Pencarian Instant & Filter**: Cari buku berdasarkan Judul, Penulis, ISBN, Genre, atau Lokasi Rak/Wilayah (Bintaro, BSD, Pamulang, Ciputat).
- **Durasi & Metode Serah Terima**: Pilih durasi peminjaman (7, 14, atau 21 hari) dan metode serah terima (*In-Person Meetup* di acara weekend vs. *Kurir/COD*).
- **Antrean Booking (*Reservation Queue*)**: Otomatisasi antrean dan estimasi ketersediaan buku jika status buku sedang dipinjam.

### 👥 2. Manajemen Akun Member & Buku Saya
- **Form Listing Buku Member**: Anggota dapat menayangkan buku pribadinya ke katalog komunitas secara mandiri melalui modal "Tambahkan Buku Saya".
- **Persetujuan oleh Pemilik**: Pemilik buku berhak menyetujui (*approve*) atau menolak (*reject*) pengajuan pinjam atas buku milik mereka sendiri.
- **Pencatatan Pengembalian**: Pemilik buku dapat menandai pengembalian saat buku fisik telah diterima kembali.

### 🛡️ 3. TANGSEL ADMIN (Admin Dashboard)
- **Moderasi & Override**: Admin memiliki otorisasi penuh untuk melakukan *override approval* atau *force return* jika terjadi kendala/sengketa.
- **Sidebar Navigasi Collapsible (Kembang Seladang Standard)**: Desain sidebar modern dengan mode ringkas (68px) dan mode penuh (256px).
- **CMS Artikel SEO & Event**: Kelola postingan edukasi literasi dan jadwal gathering kumpul baca komunitas di Taman Bintaro, Taman Kota 1 BSD, & Alun-Alun Pamulang.

### 📱 4. Tools Integrasi & Fitur Tambahan
- **QR Code Scanner & Stiker Label**: Generator stiker QR Code fisik dan scanner kamera WebCam/HP untuk check-in/out cepat di acara book party.
- **Integrasi WhatsApp**: Deep link otomatis (`wa.me`) untuk koordinasi serah terima, pesan approval, dan pengingat pengembalian.
- **Keamanan Akun**: Form registrasi publik strictly membuat akun regular `member`. Hak akses admin dikelola secara aman via Supabase BaaS.

---

## 🎨 Palet Warna Visual Brand

- **Dark Emerald**: `#03321F`
- **Forest Green**: `#053D27`
- **Gold Accent**: `#FFBF00`
- **Lime Accent**: `#D0DF00`
- **Pure White**: `#FFFFFF` / `#F8FAFC`
- **Tipografi**: Google Fonts **Montserrat** & **Anton**

---

## 🛠️ Teknologi & Stack

- **Frontend**: React 19 + TypeScript (Strict Mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Database & Auth**: Supabase PostgreSQL BaaS (`@supabase/supabase-js`)
- **Icons**: Lucide React (`lucide-react`)
- **QR Code**: `qrcode.react` & `html5-qrcode`

---

## 🗄️ Setup Database Supabase

Untuk menghubungkan aplikasi dengan Supabase:
1. Buka dashboard proyek Supabase Anda.
2. Buka **SQL Editor**.
3. Salin dan jalankan seluruh isi skrip dari file [`supabase_schema.sql`](file:///d:/01_Projects/tangselbookparty/supabase_schema.sql).
4. Buat file `.env` di root proyek dengan variabel:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

```bash
# Clone repository
git clone https://github.com/antyo-system/tangselbookparty.git

# Masuk ke direktori proyek
cd tangselbookparty

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka `http://localhost:5173/` pada browser Anda.

---

## 📄 Lisensi & Hak Cipta

© 2026 Tangsel Book Party • Dibuat dengan 💚 untuk komunitas pembaca Tangerang Selatan.
