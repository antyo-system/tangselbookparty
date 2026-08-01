import type { Book, BorrowRequest, ReservationQueueItem, BookReview, Member, CommunityEvent, Article } from '../types';

const INITIAL_BOOKS: Book[] = [
  {
    id: 'TBP-BOOK-001',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    genre: 'Pengembangan Diri',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Cara mudah dan terbukti untuk membangun kebiasaan baik dan merubah kebiasaan buruk. Perubahan kecil 1% setiap hari memberikan hasil luar biasa melalui akumulasi efek pertumbuhan.',
    favoriteQuote: 'Anda tidak naik ke tingkat tujuan Anda. Anda jatuh ke tingkat sistem Anda.',
    quoteSpeaker: 'James Clear',
    status: 'borrowed',
    ownerName: 'Fian (Bintaro)',
    shelfLocation: 'Rak A-01 (Markas Bintaro)',
    pageCount: 320,
    publishYear: 2018,
    language: 'Bahasa Indonesia',
    rating: 4.9,
    reviewsCount: 18,
    currentBorrower: 'Budi Santoso',
    currentDueDate: '2026-08-10',
    queueCount: 2,
    readingTimeHours: 5.2,
    communityRecommendationScore: 98,
    whyReadOptions: [
      'Kerangka kerja teruji: Pelajari bagaimana perbaikan 1% setiap hari terakumulasi menjadi hasil besar.',
      'Strategi praktis: 4 Hukum Perubahan Kebiasaan (Jadikan terlihat, menarik, mudah, & memuaskan).',
      'Favorit Komunitas: Buku terfavorit pilihan anggota Tangsel Book Party 2 tahun berturut-turut.'
    ],
    ratingDistribution: { star5: 85, star4: 12, star3: 3, star2: 0, star1: 0 }
  },
  {
    id: 'TBP-BOOK-002',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    isbn: '978-6024248475',
    genre: 'Pengembangan Diri',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Penerapan filsafat Stoisisme dalam kehidupan modern untuk mengendalikan emosi negatif dan menemukan ketenangan jiwa di tengah dinamika perkotaan.',
    favoriteQuote: 'Beberapa hal berada di bawah kendali kita, sedangkan hal-hal lain tidak.',
    quoteSpeaker: 'Epictetus / Henry M.',
    status: 'available',
    ownerName: 'Sarah (BSD)',
    shelfLocation: 'Rak A-04 (Taman Kota 1 BSD)',
    pageCount: 346,
    publishYear: 2019,
    language: 'Bahasa Indonesia',
    rating: 4.8,
    reviewsCount: 24,
    queueCount: 0,
    readingTimeHours: 4.8,
    communityRecommendationScore: 95,
    whyReadOptions: [
      'Stoisisme lokal: Menjelaskan filsafat Yunani-Romawi kuno dengan gaya bahasa santai khas generasi muda Tangsel.',
      'Dikotomi Kendali: Mengajarkan cara membedakan hal yang bisa kita atur vs hal di luar kendali kita.',
      'Anti Overthinking: Panduan praktis mengatasi kecemasan era sosial media.'
    ],
    ratingDistribution: { star5: 78, star4: 18, star3: 4, star2: 0, star1: 0 }
  },
  {
    id: 'TBP-BOOK-003',
    title: 'Psychology of Money',
    author: 'Morgan Housel',
    isbn: '978-0857197689',
    genre: 'Bisnis',
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Pelajaran abadi tentang kekayaan, ketakutan, dan kebahagiaan. Memahami keuangan bukan hanya soal matematika, tetapi tentang perilaku dan psikologi manusia.',
    favoriteQuote: 'Menghabiskan uang untuk menunjukkan kepada orang lain seberapa banyak uang yang Anda miliki adalah cara tercepat untuk memiliki lebih sedikit uang.',
    quoteSpeaker: 'Morgan Housel',
    status: 'available',
    ownerName: 'Nadia (Pamulang)',
    shelfLocation: 'Rak B-02 (Alun-Alun Pamulang)',
    pageCount: 256,
    publishYear: 2020,
    language: 'Bahasa Indonesia',
    rating: 4.9,
    reviewsCount: 15,
    queueCount: 0,
    readingTimeHours: 4.0,
    communityRecommendationScore: 97,
    whyReadOptions: [
      'Psikologi keuangan: Membahas bagaimana emosi mengatur kebebasan finansial melebihi rumus matematika.',
      '19 cerita pendek: Sangat mudah dicerna dalam sesi membaca santai 15 menit per hari.',
      'Perspektif jangka panjang: Mengajarkan kesabaran, kebebasan, dan manajemen risiko.'
    ],
    ratingDistribution: { star5: 82, star4: 15, star3: 3, star2: 0, star1: 0 }
  },
  {
    id: 'TBP-BOOK-004',
    title: 'Bumi',
    author: 'Tere Liye',
    isbn: '978-6020301129',
    genre: 'Fiksi',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Petualangan Raib, Ali, dan Seli menjelajahi dunia paralel penuh dengan misteri dan kekuatan klan yang mengagumkan.',
    favoriteQuote: 'Dunia ini adalah petualangan besar bagi mereka yang berani melangkah.',
    quoteSpeaker: 'Tere Liye',
    status: 'borrowed',
    ownerName: 'Rian (Ciputat)',
    shelfLocation: 'Rak F-01 (Taman Bintaro Sector 7)',
    pageCount: 440,
    publishYear: 2014,
    language: 'Bahasa Indonesia',
    rating: 4.7,
    reviewsCount: 30,
    currentBorrower: 'Dewi Lestari',
    currentDueDate: '2026-08-04',
    queueCount: 1,
    readingTimeHours: 6.5,
    communityRecommendationScore: 94,
    whyReadOptions: [
      'Serial Dunia Paralel pertama: Pembuka kisah imajinatif legendaris karya Tere Liye.',
      'Karakter relatable: Persahabatan Raib, Seli, dan Ali yang menghibur dan penuh kejutan.',
      'World-building magis: Dunia Bulan, Matahari, dan Bintang yang kaya akan fantasi.'
    ],
    ratingDistribution: { star5: 75, star4: 20, star3: 5, star2: 0, star1: 0 }
  },
  {
    id: 'TBP-BOOK-005',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    isbn: '978-9793062792',
    genre: 'Fiksi',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Kisah perjuangan 10 anak Belitung dalam menggapai cita-cita di tengah keterbatasan fasilitas pendidikan.',
    favoriteQuote: 'Bermimpilah, karena Tuhan akan memeluk mimpi-mimpimu.',
    quoteSpeaker: 'Andrea Hirata',
    status: 'available',
    ownerName: 'Komunitas Tangsel',
    shelfLocation: 'Rak F-03 (Bintaro Creative Hub)',
    pageCount: 529,
    publishYear: 2005,
    language: 'Bahasa Indonesia',
    rating: 4.9,
    reviewsCount: 42,
    queueCount: 0,
    readingTimeHours: 7.2,
    communityRecommendationScore: 99,
    whyReadOptions: [
      'Inspiratif & Emosional: Perjuangan menguras air mata dan membakar semangat belajar.',
      'Masterpiece Indonesia: Novel paling berpengaruh yang telah diterjemahkan ke 40+ bahasa dunia.',
      'Karakter Lintang & Mahar: Pembukti bahwa kemauan mengalahkan segala keterbatasan.'
    ],
    ratingDistribution: { star5: 90, star4: 8, star3: 2, star2: 0, star1: 0 }
  },
  {
    id: 'TBP-BOOK-006',
    title: 'Sapiens: Riwayat Singkat Umat Manusia',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    genre: 'Non-Fiksi',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Bagaimana Homo sapiens menguasai Bumi: perjalanan luar biasa kemanusiaan dari kera yang tak dikenal menjadi penguasa planet.',
    favoriteQuote: 'Konsistensi adalah tempat bermain bagi pikiran yang membosankan.',
    quoteSpeaker: 'Yuval Harari',
    status: 'available',
    ownerName: 'Arif (Serpong)',
    shelfLocation: 'Rak NF-02 (Taman Kota 1 BSD)',
    pageCount: 443,
    publishYear: 2014,
    language: 'Bahasa Indonesia',
    rating: 4.8,
    reviewsCount: 20,
    queueCount: 0,
    readingTimeHours: 6.8,
    communityRecommendationScore: 96,
    whyReadOptions: [
      'Perspektif Sejarah Besar: Pandangan menyeluruh tentang Revolusi Kognitif, Pertanian, dan Sains.',
      'Wawasan Mendalam: Menjelaskan bagaimana mitos bersama (uang, agama, korporasi) menyatukan miliaran manusia.',
      'Bestseller Global: Buku wajib untuk memahami masyarakat modern.'
    ],
    ratingDistribution: { star5: 80, star4: 15, star3: 5, star2: 0, star1: 0 }
  }
];

const INITIAL_REQUESTS: BorrowRequest[] = [
  {
    id: 'REQ-1001',
    bookId: 'TBP-BOOK-001',
    bookTitle: 'Atomic Habits',
    bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    userId: 'USER-01',
    userName: 'Budi Santoso',
    userPhone: '+6281234567890',
    requestDate: '2026-07-27',
    durationDays: 14,
    dueDate: '2026-08-10',
    handoverMethod: 'meetup',
    status: 'borrowed',
    notes: 'Akan diambil saat Book Party Sabtu di Taman Bintaro'
  },
  {
    id: 'REQ-1002',
    bookId: 'TBP-BOOK-004',
    bookTitle: 'Bumi',
    bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    userId: 'USER-02',
    userName: 'Dewi Lestari',
    userPhone: '+6281987654321',
    requestDate: '2026-07-28',
    durationDays: 7,
    dueDate: '2026-08-04',
    handoverMethod: 'courier',
    status: 'borrowed',
    notes: 'Dikirim via Kurir Instant (GoSend)'
  }
];

const INITIAL_QUEUES: ReservationQueueItem[] = [
  {
    id: 'QUEUE-501',
    bookId: 'TBP-BOOK-001',
    bookTitle: 'Atomic Habits',
    userId: 'USER-04',
    userName: 'Rina Marlina',
    userPhone: '+6281311223344',
    queuePosition: 1,
    durationDays: 14,
    requestedAt: '2026-07-29',
    estimatedAvailableDate: '2026-08-11',
    status: 'waiting'
  }
];

const INITIAL_REVIEWS: BookReview[] = [
  {
    id: 'REV-01',
    bookId: 'TBP-BOOK-001',
    userName: 'Aditya Perkasa',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
    rating: 5,
    comment: 'Buku ini sangat mengubah cara saya membangun kebiasaan membaca tiap malam. Wajib baca untuk anggota komunitas Tangsel!',
    createdAt: '2026-07-20'
  },
  {
    id: 'REV-02',
    bookId: 'TBP-BOOK-002',
    userName: 'Siti Nurhaliza',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    rating: 5,
    comment: 'Filosofi teras dikemas dengan sangat menyenangkan dan relate dengan lika-liku kehidupan anak muda Tangsel.',
    createdAt: '2026-07-22'
  }
];

const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'EVT-01',
    title: 'Tangsel Weekend Book Party @ Taman Bintaro',
    date: 'Sabtu, 8 Agustus 2026 - 15:30 WIB',
    location: 'Taman Bintaro Sector 7 (Dekat Bintaro Plaza)',
    description: 'Bawa 1-2 buku favoritmu, duduk santai membaca piknik di rumput taman, tukar cerita dengan sesama pecinta buku Tangsel, dan lakukan serah terima buku fisik secara langsung!',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 42
  },
  {
    id: 'EVT-02',
    title: 'Piknik Baca & Swap Buku @ Taman Kota 1 BSD',
    date: 'Minggu, 16 Agustus 2026 - 08:30 WIB',
    location: 'Taman Kota 1 BSD (Jl. Letnan Sutopo, Serpong)',
    description: 'Sesi baca pagi hari bernuansa teduh pepohonan Taman Kota 1 BSD. Dilanjutkan dengan diskusi buku santai dan serah terima peminjaman fisik buku komunitas.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 28
  },
  {
    id: 'EVT-03',
    title: 'Kopi & Diskusi Buku @ Alun-Alun Pamulang',
    date: 'Sabtu, 22 Agustus 2026 - 16:00 WIB',
    location: 'Alun-Alun Pamulang (Area Depan Kantor Walikota)',
    description: 'Kumpul sore santai pecinta buku area Pamulang, Ciputat, dan sekitarnya. Nikmati senja sambil membaca buku favorit dan bertukar koleksi novel fisik.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    attendeesCount: 35
  }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'ART-01',
    title: '5 Spot Baca Buku Hidden Gem & Quiet Cafe Terfavorit di Bintaro & BSD',
    slug: '5-spot-baca-buku-hidden-gem-bintaro-bsd',
    excerpt: 'Mencari tempat membaca buku fisik yang tenang dengan pepohonan rimbun dan kopi nikmat di Tangerang Selatan? Simak 5 rekomendasi lokasi terbaik dari komunitas.',
    content: [
      'Membaca buku fisik memerlukan suasana yang tenang dan kondusif. Di kawasan Tangerang Selatan (Bintaro, BSD, Pamulang), terdapat beberapa lokasi ruang terbuka dan kafe berkonsep syahdu yang sangat cocok untuk menghabiskan akhir pekan bersama buku kesayangan.',
      '1. Taman Bintaro Sector 7: Area pepohonan teduh dengan banyak bangku taman kayu. Sangat ramah untuk pembaca solo maupun kelompok kecil.',
      '2. Bintaro Creative Hub: Fasilitas ruang terbuka kreatif lengkap dengan rak buku komunitas dan koneksi tenang.',
      '3. Taman Kota 1 BSD (Serpong): Hutan kota bernuansa sejuk dengan suara gemericik air dan hembusan angin sepoi-sepoi.',
      '4. Katros Kopi Pamulang: Kafe ramah pembaca dengan sudut Quiet Reading Corner khusus hari Sabtu sore.',
      '5. Alun-Alun Pemkot Pamulang: Area santai sore hari yang cocok untuk membaca buku fiksi dan menikmati makanan ringan lokal.'
    ],
    author: 'Tim Komunitas Tangsel',
    category: 'Literasi Tangsel',
    readTime: '4 menit baca',
    publishedDate: '1 Agustus 2026',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    views: 342
  },
  {
    id: 'ART-02',
    title: 'Panduan Lengkap Peminjaman Buku Fisik Gratis Antar Anggota Komunitas',
    slug: 'panduan-peminjaman-buku-fisik-gratis',
    excerpt: 'Ingin meminjam buku fisik di Tangsel Book Party? Pelajari alur pengajuan, serah terima COD/meetup, dan etika merawat buku komunitas.',
    content: [
      'Tangsel Book Party hadir sebagai perpustakaan fisik independen berbasis komunitas. Seluruh proses peminjaman buku antar anggota dilakukan secara gratis tanpa biaya sewa.',
      'Langkah 1: Cari & Pilih Buku. Jelajahi katalog online kami untuk menemukan buku fiksi, non-fiksi, maupun pengembangan diri.',
      'Langkah 2: Pilih Durasi Peminjaman (7, 14, atau 21 hari) dan Metode Serah Terima (In-Person Meetup di event weekend atau Kurir/COD).',
      'Langkah 3: Persetujuan WhatsApp. Sistem akan membuat tautan konfirmasi pesan WhatsApp langsung ke pemilik buku.',
      'Langkah 4: Kembalikan Tepat Waktu. Jaga kebersihan sampul dan halaman buku agar anggota berikutnya dapat menikmati bacaan dengan nyaman.'
    ],
    author: 'Fian (Founder)',
    category: 'Panduan Komunitas',
    readTime: '3 menit baca',
    publishedDate: '28 Juli 2026',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    views: 520
  },
  {
    id: 'ART-03',
    title: 'Manfaat Membaca Buku Fisik vs E-Book: Meningkatkan Fokus & Retensi Memori',
    slug: 'manfaat-membaca-buku-fisik-vs-ebook',
    excerpt: 'Mengapa memegang buku kertas dan membalik halaman secara fisik memberikan ketenangan mental dan retensi ingatan yang lebih tinggi?',
    content: [
      'Di era serba digital dengan paparan layar smartphone yang konstan, membaca buku fisik menawarkan pengalaman tactile (sentuhan) yang tak tergantikan.',
      'Studi neurologi menunjukkan bahwa tekstur kertas, aroma buku, dan navigasi fisik membantu otak menciptakan peta kognitif (*cognitive map*) yang memperkuat ingatan atas materi yang dibaca.',
      'Selain itu, membaca buku kertas sebelum tidur terbukti bebas radiasi sinar biru (*blue light*), membantu tidur lebih nyenyak dan mengurangi tingkat stres harian.'
    ],
    author: 'Sarah (Anggota BSD)',
    category: 'Gaya Hidup & Kesehatan',
    readTime: '5 menit baca',
    publishedDate: '25 Juli 2026',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    views: 418
  }
];

const CURRENT_MEMBER: Member = {
  id: 'USER-01',
  name: 'Budi Santoso',
  email: 'budi.santoso@tangselbookparty.org',
  phone: '+6281234567890',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
  role: 'member',
  joinedDate: 'Januari 2025',
  wishlist: ['TBP-BOOK-002', 'TBP-BOOK-003']
};

const KEYS = {
  BOOKS: 'tbp_books_v5',
  REQUESTS: 'tbp_requests_v5',
  QUEUES: 'tbp_queues_v5',
  REVIEWS: 'tbp_reviews_v5',
  MEMBER: 'tbp_member_v5',
  EVENTS: 'tbp_events_v5',
  ARTICLES: 'tbp_articles_v5'
};

export const StorageService = {
  getBooks(): Book[] {
    const data = localStorage.getItem(KEYS.BOOKS);
    if (!data) {
      localStorage.setItem(KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(data);
  },

  saveBooks(books: Book[]): void {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  },

  getRequests(): BorrowRequest[] {
    const data = localStorage.getItem(KEYS.REQUESTS);
    if (!data) {
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
  },

  saveRequests(requests: BorrowRequest[]): void {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
  },

  getQueues(): ReservationQueueItem[] {
    const data = localStorage.getItem(KEYS.QUEUES);
    if (!data) {
      localStorage.setItem(KEYS.QUEUES, JSON.stringify(INITIAL_QUEUES));
      return INITIAL_QUEUES;
    }
    return JSON.parse(data);
  },

  saveQueues(queues: ReservationQueueItem[]): void {
    localStorage.setItem(KEYS.QUEUES, JSON.stringify(queues));
  },

  getReviews(): BookReview[] {
    const data = localStorage.getItem(KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  },

  saveReviews(reviews: BookReview[]): void {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  },

  getCurrentMember(): Member {
    const data = localStorage.getItem(KEYS.MEMBER);
    if (!data) {
      localStorage.setItem(KEYS.MEMBER, JSON.stringify(CURRENT_MEMBER));
      return CURRENT_MEMBER;
    }
    return JSON.parse(data);
  },

  saveCurrentMember(member: Member): void {
    localStorage.setItem(KEYS.MEMBER, JSON.stringify(member));
  },

  getEvents(): CommunityEvent[] {
    const data = localStorage.getItem(KEYS.EVENTS);
    if (!data) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(data);
  },

  getArticles(): Article[] {
    const data = localStorage.getItem(KEYS.ARTICLES);
    if (!data) {
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(data);
  },

  resetToDefault(): void {
    localStorage.setItem(KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(KEYS.QUEUES, JSON.stringify(INITIAL_QUEUES));
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(KEYS.MEMBER, JSON.stringify(CURRENT_MEMBER));
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
};
