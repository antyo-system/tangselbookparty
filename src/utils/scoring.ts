import type { Article, Book, CommunityEvent, SEOCheckItem } from '../types';

/**
 * 1. LIVE SEO CONTENT SCORE CALCULATOR (0 - 100)
 */
export function calculateSEOScore(article: Partial<Article>): {
  score: number;
  checklist: SEOCheckItem[];
  ratingLabel: string;
} {
  const seo = article.seo || {
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
  };

  const title = article.title || '';
  const slug = article.slug || '';
  const metaTitle = seo.metaTitle || title;
  const metaDesc = seo.metaDescription || article.excerpt || '';
  const keyword = (seo.focusKeyword || '').trim().toLowerCase();
  const contentText = Array.isArray(article.content) ? article.content.join(' ') : (article.content || '');
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const relatedBooks = article.relatedBookIds || [];
  const ogAlt = seo.ogImageAlt || '';

  const checklist: SEOCheckItem[] = [];
  let totalScore = 0;

  // Rule 1: Focus Keyword in Title (20 pts)
  const kwInTitle = keyword ? title.toLowerCase().includes(keyword) || metaTitle.toLowerCase().includes(keyword) : false;
  checklist.push({
    rule: 'Kata Kunci di Judul Artikel / Meta Title',
    passed: kwInTitle,
    points: 20,
    suggestion: kwInTitle 
      ? `Kata kunci "${keyword}" ditemukan di judul.` 
      : `Sertakan kata kunci utama "${keyword || '...'}" dalam judul artikel.`
  });
  if (kwInTitle) totalScore += 20;

  // Rule 2: Focus Keyword in Slug (15 pts)
  const kwInSlug = keyword ? slug.toLowerCase().includes(keyword.replace(/\s+/g, '-')) : false;
  checklist.push({
    rule: 'Kata Kunci di URL Slug Artikel',
    passed: kwInSlug,
    points: 15,
    suggestion: kwInSlug 
      ? 'URL Slug mengandung kata kunci target.' 
      : 'Gunakan slug yang ramah SEO dan mengandung kata kunci.'
  });
  if (kwInSlug) totalScore += 15;

  // Rule 3: Focus Keyword in Meta Description & Length (15 pts)
  const kwInMetaDesc = keyword ? metaDesc.toLowerCase().includes(keyword) : false;
  const validMetaLength = metaDesc.length >= 100 && metaDesc.length <= 165;
  const metaPassed = kwInMetaDesc && validMetaLength;
  checklist.push({
    rule: 'Meta Description Optimal & Mengandung Kata Kunci',
    passed: metaPassed,
    points: 15,
    suggestion: metaPassed
      ? `Meta description (${metaDesc.length} karakter) ideal & memiliki keyword.`
      : `Buat Meta Description 100-160 karakter yang memuat kata kunci "${keyword || '...'}" (${metaDesc.length}/160).`
  });
  if (metaPassed) totalScore += 15;
  else if (kwInMetaDesc || validMetaLength) totalScore += 7; // partial credit

  // Rule 4: Depth & Word Count (20 pts)
  const isDepthContent = wordCount >= 300;
  checklist.push({
    rule: 'Kedalaman Konten (Minimal 300 kata)',
    passed: isDepthContent,
    points: 20,
    suggestion: isDepthContent
      ? `Panjang artikel sudah memadai (${wordCount} kata).`
      : `Tambahkan lebih banyak paragraf penjelasan (Saat ini: ${wordCount}/300 kata).`
  });
  if (isDepthContent) totalScore += 20;
  else if (wordCount >= 150) totalScore += 10;

  // Rule 5: Internal Catalog Linking (15 pts)
  const hasRelatedBooks = relatedBooks.length > 0;
  checklist.push({
    rule: 'Internal Linking ke Katalog Buku Komunitas',
    passed: hasRelatedBooks,
    points: 15,
    suggestion: hasRelatedBooks
      ? `${relatedBooks.length} buku terhubung sebagai tautan internal.`
      : 'Hubungkan minimal 1 rekomendasi buku dari katalog fisik komunitas.'
  });
  if (hasRelatedBooks) totalScore += 15;

  // Rule 6: Cover Image ALT Text (15 pts)
  const hasAltText = ogAlt.trim().length >= 5;
  checklist.push({
    rule: 'Deskripsi ALT pada Cover Gambar',
    passed: hasAltText,
    points: 15,
    suggestion: hasAltText
      ? 'Teks ALT gambar cover terisi presisi.'
      : 'Tambahkan teks ALT pada gambar untuk aksesibilitas & Google Image SEO.'
  });
  if (hasAltText) totalScore += 15;

  let ratingLabel = '🔴 Perlu Perbaikan SEO';
  if (totalScore >= 80) ratingLabel = '🟢 Sangat Bagus (SEO Optimized)';
  else if (totalScore >= 50) ratingLabel = '🟡 Cukup Baik (Draft Relevan)';

  return { score: totalScore, checklist, ratingLabel };
}

/**
 * 2. CATALOG HEALTH & COMPLETENESS SCORE CALCULATOR (0 - 100)
 */
export function calculateCatalogHealthScore(book: Partial<Book>): {
  score: number;
  checklist: { rule: string; passed: boolean; points: number; suggestion: string }[];
  ratingLabel: string;
} {
  const checklist = [];
  let totalScore = 0;

  // Rule 1: ISBN & Metadata valid (25 pts)
  const hasIsbn = !!(book.isbn && book.isbn.length >= 8);
  const hasPagesYear = !!(book.pageCount && book.pageCount > 0 && book.publishYear);
  const metaPassed = hasIsbn && hasPagesYear;
  checklist.push({
    rule: 'Kode ISBN & Metadata Publikasi Lengkap',
    passed: metaPassed,
    points: 25,
    suggestion: metaPassed 
      ? 'ISBN dan rincian fisik terdaftar.' 
      : 'Isi nomor ISBN, jumlah halaman, dan tahun terbit buku.'
  });
  if (metaPassed) totalScore += 25;
  else if (hasIsbn || hasPagesYear) totalScore += 12;

  // Rule 2: Precision Shelf Location (25 pts)
  const hasShelf = !!(book.shelfLocation && book.shelfLocation.length >= 5);
  checklist.push({
    rule: 'Kode & Lokasi Rak Fisik Presisi',
    passed: hasShelf,
    points: 25,
    suggestion: hasShelf
      ? `Lokasi terdaftar: "${book.shelfLocation}"`
      : 'Tentukan lokasi rak fisik (misal: "Markas BSD - Rak A-02").'
  });
  if (hasShelf) totalScore += 25;

  // Rule 3: Synopsis & Why Read Options (20 pts)
  const synopsisLen = (book.synopsis || '').length;
  const whyReadCount = (book.whyReadOptions || []).length;
  const synPassed = synopsisLen >= 80 && whyReadCount >= 2;
  checklist.push({
    rule: 'Sinopsis Informatif & 2+ Alasan Wajib Baca',
    passed: synPassed,
    points: 20,
    suggestion: synPassed
      ? 'Sinopsis & kurasi poin rekomendasi lengkap.'
      : 'Tulis sinopsis min. 80 karakter dan minimal 2 alasan pembaca wajib baca.'
  });
  if (synPassed) totalScore += 20;
  else if (synopsisLen >= 40) totalScore += 10;

  // Rule 4: Sample Chapter or Favorite Quote (15 pts)
  const hasSample = !!(book.sampleChapter?.excerpt || book.favoriteQuote);
  checklist.push({
    rule: 'Cuplikan Bab / Favorite Quote Terisi',
    passed: hasSample,
    points: 15,
    suggestion: hasSample
      ? 'Kutipan menarik/sampel bab siap ditampilkan di katalog.'
      : 'Tambahkan sampel bab 1 atau kutipan terbaik dari buku.'
  });
  if (hasSample) totalScore += 15;

  // Rule 5: Replacement Cost & Handover Method (15 pts)
  const hasCost = !!(book.replacementCost && book.replacementCost > 0);
  const hasHandover = !!(book.allowedHandoverMethods && book.allowedHandoverMethods.length > 0);
  const erpPassed = hasCost && hasHandover;
  checklist.push({
    rule: 'Nominal Ganti Rugi & Opsi Serah Terima',
    passed: erpPassed,
    points: 15,
    suggestion: erpPassed
      ? `Est. penggantian Rp${book.replacementCost?.toLocaleString()} & metode serah terima diset.`
      : 'Tentukan nilai penggantian fisik & metode pengambilan (Meetup/Courier).'
  });
  if (erpPassed) totalScore += 15;
  else if (hasCost || hasHandover) totalScore += 7;

  let ratingLabel = '🔴 Data Katalog Incomplete';
  if (totalScore >= 80) ratingLabel = '🟢 Katalog Sangat Lengkap (Verified)';
  else if (totalScore >= 50) ratingLabel = '🟡 Data Katalog Cukup';

  return { score: totalScore, checklist, ratingLabel };
}

/**
 * 3. EVENT READINESS & ENGAGEMENT SCORE CALCULATOR (0 - 100)
 */
export function calculateEventReadinessScore(event: Partial<CommunityEvent>): {
  score: number;
  checklist: { rule: string; passed: boolean; points: number; suggestion: string }[];
  ratingLabel: string;
} {
  const checklist = [];
  let totalScore = 0;

  // Rule 1: Venue & Google Maps Address (30 pts)
  const hasVenueName = !!(event.location && event.location.length >= 3);
  const hasAddressMap = !!(event.venueAddress && event.googleMapsUrl);
  const venuePassed = hasVenueName && hasAddressMap;
  checklist.push({
    rule: 'Detail Alamat Venue & Pin Point Google Maps',
    passed: venuePassed,
    points: 30,
    suggestion: venuePassed
      ? 'Lokasi tempat pelaksanaan terkonfirmasi presisi.'
      : 'Isi nama venue, alamat lengkap, dan tautan lokasi Google Maps.'
  });
  if (venuePassed) totalScore += 30;
  else if (hasVenueName) totalScore += 15;

  // Rule 2: Schedule & Deadline (25 pts)
  const hasTimes = !!(event.startTime && event.endTime);
  const hasDeadline = !!(event.registrationDeadline);
  const schedPassed = hasTimes && hasDeadline;
  checklist.push({
    rule: 'Waktu Operasional & Batas Akhir Pendaftaran',
    passed: schedPassed,
    points: 25,
    suggestion: schedPassed
      ? 'Jam mulai, jam selesai, dan deadline registrasi diset.'
      : 'Tentukan waktu pasti acara dan batas akhir pendaftaran.'
  });
  if (schedPassed) totalScore += 25;
  else if (hasTimes) totalScore += 12;

  // Rule 3: Capacity & Host Caretaker (25 pts)
  const hasCap = !!(event.maxCapacity && event.maxCapacity > 0);
  const hasHost = !!(event.hostCaretakerName && event.hostCaretakerName.length >= 3);
  const opsPassed = hasCap && hasHost;
  checklist.push({
    rule: 'Kapasitas Tempat Duduk & Caretaker Host Assigned',
    passed: opsPassed,
    points: 25,
    suggestion: opsPassed
      ? `Kapasitas: ${event.maxCapacity} orang | Host: ${event.hostCaretakerName}`
      : 'Tentukan kuota peserta & tunjuk Caretaker penanggung jawab acara.'
  });
  if (opsPassed) totalScore += 25;
  else if (hasCap || hasHost) totalScore += 12;

  // Rule 4: Cover Image & Theme Description (20 pts)
  const hasImage = !!(event.image && event.image.length > 5);
  const hasDesc = !!(event.description && event.description.length >= 40);
  const themePassed = hasImage && hasDesc;
  checklist.push({
    rule: 'Poster/Banner Acara & Deskripsi Tema',
    passed: themePassed,
    points: 20,
    suggestion: themePassed
      ? 'Banner acara dan deskripsi tema siap dipublikasikan.'
      : 'Unggah poster acara dan tulis agenda kegiatan minimal 40 karakter.'
  });
  if (themePassed) totalScore += 20;
  else if (hasImage || hasDesc) totalScore += 10;

  let ratingLabel = '🔴 Event Belum Siap (Logistik Kurang)';
  if (totalScore >= 80) ratingLabel = '🟢 Event Siap Dibuka (Ready for Registration)';
  else if (totalScore >= 50) ratingLabel = '🟡 Event Cukup (Perlu Detail Alamat/Host)';

  return { score: totalScore, checklist, ratingLabel };
}
