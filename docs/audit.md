# Audit Kode — Tangsel Book Party

> **Tanggal Audit**: 1 Agustus 2026  
> **Versi Kode**: Pre-MVP (sebelum implementasi PRD v1.1)  
> **Auditor**: System Architect

---

## 1. Ringkasan Temuan

| Kategori | Jumlah Temuan |
|----------|:---:|
| 🔴 Harus dihapus / tidak perlu ada di MVP | 8 |
| 🟡 Perlu disederhanakan (bloat) | 6 |
| 🟢 Sudah tepat, pertahankan | 12 |
| 🔵 Belum ada, perlu ditambahkan | 7 |

---

## 2. 🔴 HARUS DIHAPUS — Tidak Perlu di MVP

### 2.1. Field "ERP" di `types/index.ts` → interface `Book`

**File**: [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L39-L46)

Seluruh blok `// ERP Physical Asset Management` melanggar aturan AGENTS.md (dilarang pakai istilah "ERP") dan tidak relevan untuk perpustakaan komunitas:

```diff
- sku?: string;
- conditionGrade?: BookConditionGrade;
- replacementCost?: number;
- allowedHandoverMethods?: HandoverMethod[];
- catalogHealthScore?: number;
- updatedAt?: string;
- updatedBy?: string;
```

**Alasan**: Komunitas buku bukan warehouse. SKU, replacement cost, catalog health score tidak akan digunakan anggota. Field `allowedHandoverMethods` bisa diganti dengan field sederhana di PRD v1.1.

### 2.2. Field "Goodreads/Kindle" di `types/index.ts` → interface `Book`

**File**: [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L48-L62)

```diff
- whyReadOptions?: string[];
- readingTimeHours?: number;
- communityRecommendationScore?: number;
- ratingDistribution?: { star5..star1 };
- sampleChapter?: { chapterTitle, excerpt };
```

**Alasan**: Fitur "Why Read This" dan "Sample Chapter" adalah nice-to-have yang belum punya real data. Untuk MVP, review & rating sederhana sudah cukup. Ini sesuai UPCOMING_FEATURES.md yang menempatkan ini di Phase 2.

### 2.3. Field "ERP Event Operations" di `types/index.ts` → interface `CommunityEvent`

**File**: [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L120-L135)

```diff
- eventCode?: string;
- eventType?: '...' | '...';
- startTime?: string;
- endTime?: string;
- venueAddress?: string;
- googleMapsUrl?: string;
- maxCapacity?: number;
- ticketPrice?: number;
- registrationDeadline?: string;
- hostAdminName?: string;
- requiredBookTheme?: string;
- readinessScore?: number;
```

**Alasan**: 12 field opsional untuk event yang cukup dikelola dengan 6 field inti (title, date, location, description, image, attendeesCount). Event komunitas di taman/kafe tidak perlu readiness score.

### 2.4. Field "ERP SEO Engine" di `types/index.ts` → interface `Article`

**File**: [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L169-L176)

```diff
- seo?: SEOMetadata;
- seoScore?: number;
- seoChecklist?: SEOCheckItem[];
- relatedBookIds?: string[];
- status?: 'draft' | 'seo_review' | 'scheduled' | 'published' | 'archived';
```

Dan interface `SEOMetadata` + `SEOCheckItem` sepenuhnya.

**Alasan**: Blog komunitas kecil tidak butuh SEO engine dengan live score calculator. Untuk MVP, cukup title + meta description sederhana.

### 2.5. Type `BookConditionGrade` & `EventStatus`

**File**: [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L5) dan [index.ts](file:///d:/01_Projects/tangselbookparty/src/types/index.ts#L107-L109)

```diff
- export type BookConditionGrade = 'new' | 'like_new' | 'good' | 'worn';
- export interface EventStatus { ... }
```

**Alasan**: `BookConditionGrade` terkait ERP bloat. `EventStatus` interface terpisah redundan (sudah ada inline di `CommunityEvent.status`).

### 2.6. `utils/scoring.ts` (277 baris)

**File**: [scoring.ts](file:///d:/01_Projects/tangselbookparty/src/utils/scoring.ts) — 277 baris

Seluruh file berisi SEO score calculator, catalog health score, dan event readiness score. Ini "ERP scoring engine" yang tidak relevan untuk MVP komunitas.

**Aksi**: Hapus seluruh file.

### 2.7. `LoginModal.tsx` (352 baris) — Dead Code

**File**: [LoginModal.tsx](file:///d:/01_Projects/tangselbookparty/src/components/LoginModal.tsx) — 352 baris

Sudah digantikan oleh `LoginPage.tsx` (full section page). Tapi file lama masih ada di repository.

**Aksi**: Hapus file, pastikan tidak ada import reference tersisa.

### 2.8. `canvas-confetti` dependency

**File**: [package.json](file:///d:/01_Projects/tangselbookparty/package.json#L15-L16)

```diff
- "canvas-confetti": "^1.9.4",
- "@types/canvas-confetti": "^1.9.0",
```

**Alasan**: Efek confetti bukan fitur inti. Tambahkan kembali di Phase 5 (gamifikasi) jika dibutuhkan.

---

## 3. 🟡 PERLU DISEDERHANAKAN — Bloat

### 3.1. `AdminDashboard.tsx` — 882 baris (terlalu besar)

**File**: [AdminDashboard.tsx](file:///d:/01_Projects/tangselbookparty/src/pages/AdminDashboard.tsx) — 882 baris

Satu file monolitik yang menangani: sidebar, header, requests table, inventory CRUD, articles CMS, events CMS, active loans, dan queues. Perlu dipecah menjadi sub-komponen yang lebih kecil, tapi ini bisa dilakukan secara bertahap.

**Aksi (nanti)**: Refactor menjadi komponen terpisah per tab.

### 3.2. `AddBookModal.tsx` — Form fields terlalu banyak

**File**: [AddBookModal.tsx](file:///d:/01_Projects/tangselbookparty/src/components/AddBookModal.tsx) — 379 baris

Form menambah buku berisi field-field ERP (SKU, condition grade, replacement cost, catalog health score, sample chapter, why read options) yang tidak perlu untuk MVP.

**Aksi**: Sederhanakan form sesuai PRD v1.1 §4.2 (hanya field esensial).

### 3.3. `AddArticleModal.tsx` — SEO fields berlebihan

**File**: [AddArticleModal.tsx](file:///d:/01_Projects/tangselbookparty/src/components/AddArticleModal.tsx) — 377 baris

Form menambah artikel berisi live SEO score calculator, focus keyword, secondary keywords, canonical URL, OG image alt, dll. Overkill untuk blog komunitas.

**Aksi**: Sederhanakan ke title, content, excerpt, cover image, category.

### 3.4. `AddEventModal.tsx` — Event operations fields berlebihan

**File**: [AddEventModal.tsx](file:///d:/01_Projects/tangselbookparty/src/components/AddEventModal.tsx) — 356 baris

Form event berisi event code, readiness score, ticket price, required book theme, registration deadline. Komunitas hanya butuh: title, date, location, description, image.

**Aksi**: Sederhanakan form fields.

### 3.5. `storage.ts` — Seed data terlalu besar

**File**: [storage.ts](file:///d:/01_Projects/tangselbookparty/src/services/storage.ts) — 464 baris

~75% isi file adalah hardcoded seed data (6 buku, 2 requests, 1 queue, 2 reviews, 3 events, 3 articles). Untuk MVP, ini OK sebagai fallback, tapi field-field ERP di seed data harus disederhanakan bersamaan dengan simplifikasi types.

### 3.6. `App.tsx` — 517 baris state management

**File**: [App.tsx](file:///d:/01_Projects/tangselbookparty/src/App.tsx) — 517 baris

Semua state (books, requests, queues, member, modals) dikelola di satu file root. Untuk MVP masih acceptable, tapi candidate untuk refactor di Phase 4.

---

## 4. 🟢 SUDAH TEPAT — Pertahankan

| File | Baris | Status |
|------|:---:|--------|
| `CatalogPage.tsx` | 171 | ✅ Bersih dan fungsional |
| `EventsPage.tsx` | 113 | ✅ Compact |
| `ArticlesPage.tsx` | 133 | ✅ Compact |
| `BookCard.tsx` | 118 | ✅ Reusable card component |
| `BorrowModal.tsx` | 204 | ✅ Core borrowing form |
| `BookDetailModal.tsx` | 399 | ✅ Lengkap tapi masih fungsional |
| `ProfilePage.tsx` | 328 | ✅ Profil member |
| `LoginPage.tsx` | 354 | ✅ Full section auth page |
| `Navbar.tsx` | 231 | ✅ Navigation |
| `BottomNav.tsx` | 92 | ✅ Mobile bottom nav |
| `Footer.tsx` | 69 | ✅ Compact |
| `QRScannerModal.tsx` | 176 | ✅ Core feature |

---

## 5. 🔵 BELUM ADA — Perlu Ditambahkan

| Item | Prioritas | Keterangan |
|------|:---------:|------------|
| Field `owner_id` di Book type & schema | 🔴 Tinggi | Kunci sistem peer-to-peer |
| Halaman "Buku Saya" di profil member | 🔴 Tinggi | Member listing & manage buku pribadinya |
| Form "Tambahkan Buku Saya" untuk member | 🔴 Tinggi | Berbeda dari admin AddBookModal (lebih sederhana) |
| Approval oleh pemilik buku (bukan hanya admin) | 🔴 Tinggi | Core flow PRD v1.1 |
| Validasi `owner_id !== member.id` (tidak bisa pinjam sendiri) | 🟡 Sedang | UX guard |
| Label "Koleksi Komunitas" vs "Dipinjamkan oleh..." di katalog | 🟡 Sedang | Visual differentiation |
| Supabase RLS policies | 🟡 Sedang | Security for production |

---

## 6. Rekomendasi Urutan Aksi

### Langkah 1: Bersihkan (Delete First)
1. Hapus `LoginModal.tsx` (dead code)
2. Hapus `utils/scoring.ts`
3. Hapus field-field ERP & Goodreads dari `types/index.ts`
4. Hapus `canvas-confetti` dependency
5. Bersihkan seed data di `storage.ts` dari field ERP

### Langkah 2: Sederhanakan
6. Sederhanakan `AddBookModal.tsx` form fields
7. Sederhanakan `AddArticleModal.tsx` form fields
8. Sederhanakan `AddEventModal.tsx` form fields

### Langkah 3: Tambahkan Fitur P2P
9. Tambah `owner_id` ke Book type, schema, dan seed data
10. Buat halaman "Buku Saya" + form listing buku
11. Implementasi approval oleh pemilik buku
12. Validasi `owner_id`

### Langkah 4: Production Prep
13. Update `supabase_schema.sql` sesuai PRD v1.1
14. Setup RLS policies
15. Deploy

---

## 7. File-File Kode yang Harus Berubah

```
HAPUS:
  src/components/LoginModal.tsx          (352 baris dead code)
  src/utils/scoring.ts                   (277 baris ERP scoring)

EDIT BESAR:
  src/types/index.ts                     (hapus ~60 baris field ERP/Goodreads)
  src/components/AddBookModal.tsx         (sederhanakan ~150 baris form)
  src/components/AddArticleModal.tsx      (sederhanakan ~150 baris form)
  src/components/AddEventModal.tsx        (sederhanakan ~150 baris form)
  src/services/storage.ts                (sederhanakan seed data)
  src/pages/AdminDashboard.tsx           (hapus referensi ERP fields)
  supabase_schema.sql                    (tambah owner_id, update fields)
  package.json                           (hapus canvas-confetti)

TAMBAH BARU:
  src/pages/MyBooksPage.tsx              (halaman Buku Saya)
  src/components/AddMyBookForm.tsx        (form listing buku member)
```
