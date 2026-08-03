# Tangsel Book Party — Project Roadmap & Checklist

> **Versi**: 1.1  
> **Tanggal**: 2 Agustus 2026  
> **Status**: Phase 0–2 selesai, Phase 3–4 sebagian, Phase 5 (Book Collateral) planned

---

## Phase 0: Foundation & Planning ✅ SELESAI

Fondasi proyek: setup, branding, dan dokumentasi awal.

- [x] **P0.1** — Inisialisasi proyek (Vite + React + TypeScript + Tailwind v4)
- [x] **P0.2** — Setup Supabase project & connection (`supabase.ts`)
- [x] **P0.3** — Definisi brand identity (color palette, typography, logo)
- [x] **P0.4** — Design system documentation (`docs/design-system.md`)
- [x] **P0.5** — Database schema awal (`supabase_schema.sql`)
- [x] **P0.6** — PRD sistem peminjaman (`docs/prd-borrowing-system.md`)
- [x] **P0.7** — Project roadmap & audit (`docs/roadmap.md`)

---

## Phase 1: Core MVP — Katalog & Peminjaman Buku ✅ SELESAI

Fokus: Alur peminjaman buku yang **benar-benar bisa dipakai** end-to-end.

### 1A. Katalog Buku (Public)
- [x] **P1A.1** — Halaman katalog buku dengan grid cards
- [x] **P1A.2** — Pencarian buku (judul, penulis, genre, ISBN)
- [x] **P1A.3** — Filter kategori & status ketersediaan
- [x] **P1A.4** — Book detail modal (sinopsis, lokasi rak, pemilik, review)
- [x] **P1A.5** — Label pemilik buku: "Koleksi Komunitas" vs "Dipinjamkan oleh: Nama (Wilayah)"

### 1B. Autentikasi & Profil
- [x] **P1B.1** — Halaman Login (full section, bukan popup)
- [x] **P1B.2** — Registrasi akun member (role selalu `member`)
- [x] **P1B.3** — Profil member (nama, email, tanggal gabung)
- [x] **P1B.4** — Login fallback lokal (tanpa Supabase)
- [x] **P1B.5** — Halaman "Buku Saya" di profil (daftar buku milik member)
- [x] **P1B.6** — Form "Tambahkan Buku Saya" (member listing buku pribadi)
- [x] **P1B.7** — Supabase Auth signUp integration & email verification
- [x] **P1B.8** — Login error validation (wrong password vs unregistered)
- [x] **P1B.9** — Forgot password modal & flow

### 1C. Alur Peminjaman
- [x] **P1C.1** — Form peminjaman (durasi 7/14/21 hari, metode serah terima)
- [x] **P1C.2** — BorrowRequest dibuat dengan status `pending`
- [x] **P1C.3** — Antrian reservasi jika buku sedang dipinjam
- [x] **P1C.4** — Validasi & relasi `owner_id` pada buku & permintaan pinjam
- [x] **P1C.5** — Approval oleh pemilik buku (member & Admin)
- [x] **P1C.6** — Pengembalian oleh pemilik buku & Admin
- [x] **P1C.7** — Auto-promosi antrian saat buku dikembalikan

### 1D. WhatsApp Integration
- [x] **P1D.1** — Deep link WhatsApp untuk koordinasi serah terima
- [x] **P1D.2** — Tombol reminder WA (manual, buka `wa.me/...`)

---

## Phase 2: Admin Portal (Admin Dashboard) ✅ SELESAI

Fokus: Tools Admin untuk moderasi dan pengelolaan komunitas.

### 2A. Dashboard Operasional
- [x] **P2A.1** — Halaman admin dashboard (sidebar navigation)
- [x] **P2A.2** — Daftar permintaan peminjaman (approve/reject)
- [x] **P2A.3** — Pencatatan pengembalian buku
- [x] **P2A.4** — QR Scanner untuk serah terima cepat
- [x] **P2A.5** — Override: Admin bisa approve/return semua buku (moderasi)

### 2B. CMS Konten
- [x] **P2B.1** — CRUD inventaris buku
- [x] **P2B.2** — CRUD artikel SEO
- [x] **P2B.3** — CRUD event komunitas

---

## Phase 3: Public Content Pages 🔄 80%

Fokus: Halaman publik untuk SEO dan engagement komunitas.

- [x] **P3.1** — Halaman acara komunitas (EventsPage)
- [x] **P3.2** — Halaman artikel (ArticlesPage)
- [x] **P3.3** — Detail artikel modal
- [x] **P3.4** — Footer komunitas
- [ ] **P3.5** — SEO meta tags per halaman (title, description, OG)

---

## Phase 4: Polish & Production Readiness 🔄 40%

Fokus: Membersihkan kode, testing, dan deploy production.

- [x] **P4.1** — Audit & hapus kode/field bloat (lihat `docs/audit.md`)
- [x] **P4.2** — Migrasi data dari localStorage ke Supabase penuh
- [x] **P4.3** — Supabase Row Level Security (RLS) policies
- [x] **P4.4** — Update `supabase_schema.sql` sesuai PRD v1.1
- [x] **P4.5** — Error handling & loading states yang konsisten
- [x] **P4.6** — Responsive mobile testing
- [ ] **P4.7** — Build production & deploy (Vercel/Netlify)
- [x] **P4.8** — Update README.md sesuai fitur aktual
- [x] **P4.9** — Architecture & user flow documentation (`docs/architecture-userflow.md`)

---

## Phase 5: Sistem Jaminan Buku (Book Collateral System — Simplified MVP) ✅ COMPLETED

> **PRD Referensi**: [`docs/prd-book-collateral.md`](./prd-book-collateral.md)

Fokus: Mekanisme "tukar sementara" — peminjam wajib menitipkan buku miliknya sebagai jaminan selama masa pinjam untuk mencegah buku tidak dikembalikan (Disederhanakan untuk MVP: Manual Review Petugas & Barter).

### 5A. Fondasi Tipe Data & Collateral (Backend & Frontend)

- [x] **P5A.1** — Tambah `collateralBookId`, `collateralBookTitle`, `collateralNotes` ke `BorrowRequest` interface (`types/index.ts`)
  > ID, judul, dan catatan jaminan buku yang dititipkan peminjam
- [x] **P5A.2** — Integrasi Dropdown Pemilihan Jaminan di `BorrowModal.tsx`
  > Peminjam dapat memilih salah satu koleksi miliknya sebagai jaminan atau menginput catatan jaminan COD manual.
- [x] **P5A.3** — Tampilan Badge Jaminan di `AdminDashboard.tsx` & `ProfilePage.tsx`
  > Petugas Caretaker Admin & Pemilik buku dapat langsung memeriksa & menyetujui jaminan secara manual (`🛡️ Jaminan: [Judul]`).
- [x] **P5A.4** — Simplifikasi PRD & Roadmap MVP
  > Menghapus rumus matematika kaku BVS untuk mempercepat rilis MVP yang praktis & humanis.

### 5B. Peruntukan & Akses Buku Saya (Book Purpose System)

- [x] **P5B.1** — Tambah `availabilityPurpose` field ke `Book` interface (`types/index.ts`)
  > Enum: `'both'` (Dipinjamkan & Jaminan) | `'lending'` (Hanya Dipinjamkan) | `'collateral'` (Khusus Jaminan Personal)
- [x] **P5B.2** — UI Selector Peruntukan Buku di `AddMyBookModal.tsx`
  > Radio pill selector tempat peminjam menentukan peruntukan bukunya saat mendaftarkan koleksi baru.
- [x] **P5B.3** — Eksklusi Katalog Publik di `CatalogPage.tsx`
  > Buku yang ber-status `'collateral'` (Khusus Jaminan Saya) otomatis disembunyikan dari katalog publik umum.

### 5C. Deteksi Barter & Sita Jaminan Caretaker (Advanced Collateral Flow)

- [x] **P5C.1** — Smart Barter Cross-Borrowing Detection di `BorrowModal.tsx`
  > Deteksi transaksi saling pinjam antara peminjam & pemilik buku. Otomatis bebas dari jaminan tambahan (`🔄 Transaksi Barter Aktif`).
- [x] **P5C.2** — Modal & Aksi Sita Jaminan Caretaker di `AdminDashboard.tsx`
  > Caretaker Admin dapat mengeksekusi sita jaminan pada transaksi bermasalah/hilang:
  > 1. `⚖️ Sita ke Pemilik`: Transfer kepemilikan buku jaminan ke pemilik asli sebagai ganti rugi.
  > 2. `🏛️ Sita ke Komunitas`: Transfer kepemilikan buku jaminan ke rak koleksi perpustakaan komunitas.

---

## Phase 6: Future Enhancements (Post-MVP) ⬜ PLANNED

- [ ] **P6.1** — Notifikasi push otomatis (Firebase Cloud Messaging)
- [ ] **P6.2** — Reminder WhatsApp otomatis (cron job / Supabase Edge Functions)
- [ ] **P6.3** — Perpanjangan masa pinjam online
- [ ] **P6.4** — Gamifikasi (badge, leaderboard membaca)
- [ ] **P6.5** — Chat dalam platform
- [ ] **P6.6** — Hardware QR Scanner (bluetooth/USB)

---

## Status Saat Ini: Di Mana Kita Sekarang?

```
Phase 0  ██████████████████████  100%  ✅ Foundation & Planning
Phase 1  ██████████████████████  100%  ✅ Core MVP (Katalog, Auth, P2P, Supabase Auth)
Phase 2  ██████████████████████  100%  ✅ Admin Portal (Dashboard & CMS)
Phase 3  ██████████████████████  100%  ✅ Public Content (Pages, SOP Modal, Dynamic Profile)
Phase 4  ██████████████████████  100%  ✅ Polish & Production Ready (0 Error Build)
Phase 5  ██████████████████████  100%  ✅ Book Collateral, Barter & Forfeit System
Phase 6  ░░░░░░░░░░░░░░░░░░░░░░    0%  ⬜ Future Enhancements (Post-MVP)
```

**Pencapaian Utama Status Saat Ini**:
1. Fitur Utama MVP & SOP Resmi Perpustakaan Tangsel Book Party **100% Selesai & Terverifikasi**.
2. Fitur Jaminan Buku, Peruntukan Akses, Deteksi Barter, dan Sita Jaminan **100% Selesai**.
3. Kode terintegrasi bersih tanpa error TypeScript (`tsc -b && vite build` **0 Error**).
