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
- [ ] **P4.3** — Supabase Row Level Security (RLS) policies
- [x] **P4.4** — Update `supabase_schema.sql` sesuai PRD v1.1
- [ ] **P4.5** — Error handling & loading states yang konsisten
- [ ] **P4.6** — Responsive mobile testing
- [ ] **P4.7** — Build production & deploy (Vercel/Netlify)
- [x] **P4.8** — Update README.md sesuai fitur aktual
- [x] **P4.9** — Architecture & user flow documentation (`docs/architecture-userflow.md`)

---

## Phase 5: Sistem Jaminan Buku (Book Collateral) ⬜ PLANNED

> **PRD Referensi**: [`docs/prd-book-collateral.md`](./prd-book-collateral.md)

Fokus: Mekanisme "tukar sementara" — peminjam wajib menitipkan buku miliknya sebagai jaminan selama masa pinjam. Mencegah buku tidak dikembalikan tanpa melibatkan uang.

### 5A. Fondasi Skor & Tipe Data (Backend)

Menyiapkan infrastruktur data untuk Book Value Score (BVS) dan status collateral.

- [ ] **P5A.1** — Tambah `conditionGrade` field ke `Book` interface (`types/index.ts`)
  > Enum: `'Baik'` | `'Cukup'` | `'Kurang'`. Default: `'Baik'`
- [ ] **P5A.2** — Tambah `bvsScore` field ke `Book` interface
  > Auto-calculated integer (1–100). Tidak diisi manual.
- [ ] **P5A.3** — Update `BookStatus` type: tambah `'collateral_hold'`
  > `'available' | 'borrowed' | 'reserved' | 'collateral_hold'`
- [ ] **P5A.4** — Tambah `collateralBookId` & `collateralBookTitle` ke `BorrowRequest` interface
  > ID & judul buku jaminan yang dititipkan peminjam
- [ ] **P5A.5** — Jalankan SQL migration di Supabase
  ```sql
  ALTER TABLE public.books ADD COLUMN IF NOT EXISTS condition_grade TEXT DEFAULT 'Baik';
  ALTER TABLE public.books ADD COLUMN IF NOT EXISTS bvs_score INT;
  ALTER TABLE public.borrow_requests ADD COLUMN IF NOT EXISTS collateral_book_id TEXT;
  ALTER TABLE public.borrow_requests ADD COLUMN IF NOT EXISTS collateral_book_title TEXT;
  ```

### 5B. Implementasi BVS Calculator (Logic)

Membangun fungsi kalkulasi skor otomatis dari metadata buku yang sudah ada.

- [ ] **P5B.1** — Buat fungsi `calculateBVS(book: Book): number` di `services/supabase.ts`
  > Formula: Kondisi (40%) + Halaman (20%) + Tahun (20%) + Rating (20%)
- [ ] **P5B.2** — Auto-calculate BVS saat buku disimpan/di-upsert
  > Panggil `calculateBVS()` di dalam `handleSaveBook` sebelum `updateBooks()`
- [ ] **P5B.3** — Buat fungsi `getEligibleCollateralBooks(borrowerBooks, targetBVS): Book[]`
  > Filter buku milik peminjam yang memenuhi syarat: status `available`, kondisi ≥ `Cukup`, BVS ≥ 60% target

### 5C. UI — Form Pemilihan Jaminan (Frontend)

Menambahkan 1 langkah tambahan ke modal peminjaman (BorrowModal).

- [ ] **P5C.1** — Tambah input "Kondisi Buku" (dropdown: Baik/Cukup/Kurang) di `AddBookModal` & `AddMyBookModal`
  > Ditampilkan saat member mendaftarkan atau mengedit buku
- [ ] **P5C.2** — Tampilkan **BVS Badge** di `BookCard.tsx`
  > 🟢 80-100 (Premium) | 🟡 50-79 (Standard) | 🔴 1-49 (Economy)
- [ ] **P5C.3** — Tambah **Step 2: Pilih Buku Jaminan** di `BorrowModal.tsx`
  > Dropdown/list buku milik peminjam yang eligible. Buku tidak eligible ditampilkan grayed-out.
- [ ] **P5C.4** — Tampilkan info jaminan di halaman detail request (Admin & Member)
  > "Buku Jaminan: [Judul] (BVS: 82)"
- [ ] **P5C.5** — Tampilkan BVS score di `BookDetailModal.tsx`
  > Section kecil di bawah info buku: "Nilai Buku (BVS): 94/100 — Premium"

### 5D. Logic — Lifecycle Jaminan (State Management)

Mengelola status buku jaminan secara otomatis sesuai siklus peminjaman.

- [ ] **P5D.1** — Saat request disubmit: update buku jaminan ke status `collateral_hold`
  > Buku jaminan tidak bisa dipinjam/dihapus selama masa hold
- [ ] **P5D.2** — Saat buku dikembalikan: auto-release jaminan ke `available`
  > Trigger di `handleReturnBook()` — buku jaminan kembali bisa dipakai
- [ ] **P5D.3** — Saat request ditolak/dibatalkan: auto-release jaminan
  > Trigger di `handleRejectRequest()` — jaminan langsung kembali
- [ ] **P5D.4** — Proteksi: blokir penghapusan buku berstatus `collateral_hold`
  > Tampilkan error: "Buku ini sedang digunakan sebagai jaminan peminjaman aktif"

### 5E. Grace Rules & Trust System (Post-MVP)

Pengecualian untuk peminjam baru dan member terpercaya.

- [ ] **P5E.1** — Peminjam tanpa buku terdaftar: boleh pinjam buku BVS ≤ 50 tanpa jaminan (maks 1 aktif)
- [ ] **P5E.2** — Buku komunitas: threshold jaminan turun ke 40% BVS
- [ ] **P5E.3** — Trust badge "Terpercaya": member ≥ 5 pengembalian tepat waktu → threshold 50%
- [ ] **P5E.4** — Trust score tracking di `Member` interface (total_returns, on_time_returns)

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
Phase 3  ██████████████████░░░░   80%  🔄 Public Content (Pages ✅, SEO Meta ❌)
Phase 4  ████████░░░░░░░░░░░░░░   40%  🔄 Polish & Production
Phase 5  ░░░░░░░░░░░░░░░░░░░░░░    0%  ⬜ Book Collateral System
Phase 6  ░░░░░░░░░░░░░░░░░░░░░░    0%  ⬜ Future Enhancements
```

**Prioritas berikutnya**:
1. Selesaikan **Phase 4** — RLS, error handling, deploy production
2. Mulai **Phase 5A** — Fondasi data collateral (types + SQL migration)
3. Lanjut **Phase 5B–5D** — BVS calculator, UI jaminan, lifecycle management
