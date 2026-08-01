export type BookStatus = 'available' | 'borrowed' | 'reserved';
export type HandoverMethod = 'meetup' | 'courier';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'borrowed' | 'returned' | 'overdue';
export type QueueStatus = 'waiting' | 'ready_for_pickup' | 'fulfilled' | 'cancelled';

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string; // e.g. "Fiction", "Non-Fiction", "Self-Development", "Comics", "Business"
  coverImage: string;
  synopsis: string;
  favoriteQuote?: string;
  quoteSpeaker?: string;
  status: BookStatus;
  ownerName: string;
  shelfLocation: string; // e.g. "Rack A-04 (Markas BSD)"
  pageCount: number;
  publishYear: number;
  language: string;
  rating: number;
  reviewsCount: number;
  currentBorrower?: string;
  currentDueDate?: string; // ISO date string
  queueCount: number; // how many people are in reservation queue

  // Google Play Books, Kindle & Goodreads Inspired Enhancements
  whyReadOptions?: string[]; // "Why Read This Book" reasons
  readingTimeHours?: number; // Estimated Kindle reading time in hours
  communityRecommendationScore?: number; // e.g. 96 (% recommend)
  ratingDistribution?: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
  sampleChapter?: {
    chapterTitle: string;
    excerpt: string;
  };
}

export interface ReservationQueueItem {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  queuePosition: number;
  durationDays: number;
  requestedAt: string;
  estimatedAvailableDate: string;
  status: QueueStatus;
}

export interface BorrowRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  userId: string;
  userName: string;
  userPhone: string;
  requestDate: string; // YYYY-MM-DD
  durationDays: number; // 7, 14, 21
  dueDate?: string;
  returnDate?: string;
  handoverMethod: HandoverMethod;
  status: RequestStatus;
  notes?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedDate: string;
  wishlist: string[]; // book IDs
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  attendeesCount: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  category: string;
  readTime: string;
  publishedDate: string;
  coverImage: string;
  views: number;
}
