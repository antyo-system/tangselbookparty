# Tangsel Book Party — Project Roadmap & Checklist

> **Versi**: 1.0  
> **Tanggal**: 1 Agustus 2026  
> **Status**: Phase 0 selesai, Phase 1 sedang berjalan

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

## Phase 1: Core MVP — Katalog & Peminjaman Buku 🔄 IN PROGRESS

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

## Phase 2: Admin Portal (Admin Dashboard)

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
- [ ] **P2B.4** — Simplifikasi form CMS (hapus field yang tidak perlu)

---

## Phase 3: Public Content Pages

Fokus: Halaman publik untuk SEO dan engagement komunitas.

- [x] **P3.1** — Halaman acara komunitas (EventsPage)
- [x] **P3.2** — Halaman artikel (ArticlesPage)
- [x] **P3.3** — Detail artikel modal
- [x] **P3.4** — Footer komunitas
- [ ] **P3.5** — SEO meta tags per halaman (title, description, OG)

---

## Phase 4: Polish & Production Readiness

Fokus: Membersihkan kode, testing, dan deploy production.

- [x] **P4.1** — Audit & hapus kode/field bloat (lihat `docs/audit.md`)
- [x] **P4.2** — Migrasi data dari localStorage ke Supabase penuh
- [ ] **P4.3** — Supabase Row Level Security (RLS) policies
- [x] **P4.4** — Update `supabase_schema.sql` sesuai PRD v1.1 (tambah `owner_id`, dll.)
- [ ] **P4.5** — Error handling & loading states yang konsisten
- [ ] **P4.6** — Responsive mobile testing
- [ ] **P4.7** — Build production & deploy (Vercel/Netlify)
- [x] **P4.8** — Update README.md sesuai fitur aktual

---

## Phase 5: Future Enhancements (Post-MVP)

- [ ] **P5.1** — Notifikasi push otomatis (Firebase Cloud Messaging)
- [ ] **P5.2** — Reminder WhatsApp otomatis (cron job / Supabase Edge Functions)
- [ ] **P5.3** — Perpanjangan masa pinjam online
- [ ] **P5.4** — Reputasi / trust score pemilik & peminjam
- [ ] **P5.5** — Gamifikasi (badge, leaderboard membaca)
- [ ] **P5.6** — Chat dalam platform
- [ ] **P5.7** — Hardware QR Scanner (bluetooth/USB)

---

## Status Saat Ini: Di Mana Kita Sekarang?

```
Phase 0  ██████████████████████  100%  ✅ Foundation
Phase 1  ██████████████████████  100%  ✅ Core MVP (Katalog, Auth, P2P Lending, Buku Saya, Approval)
Phase 2  ██████████████████████  100%  ✅ Admin Portal (Dashboard & CMS Form Simplifikasi)
Phase 3  ██████████████████░░░░   80%  🔄 Public Content (Pages ✅, SEO Meta ❌)
Phase 4  ░░░░░░░░░░░░░░░░░░░░░░    0%  ⬜ Polish & Production
Phase 5  ░░░░░░░░░░░░░░░░░░░░░░    0%  ⬜ Future
```

**Prioritas berikutnya**: Selesaikan **Phase 1** (P1A.5, P1B.5, P1B.6, P1C.4-7) — fitur peer-to-peer lending yang belum ada.
