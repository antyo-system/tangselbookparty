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
  ownerId?: string; // ID of member who owns this book ('usr_admin_01' for community books or member ID)
  ownerName: string;
  ownerLocation?: string; // e.g. "Bintaro", "BSD", "Pamulang"
  shelfLocation: string; // e.g. "Rak A-04 (Markas BSD)"
  pageCount: number;
  publishYear: number;
  language: string;
  rating: number;
  reviewsCount: number;
  currentBorrower?: string;
  currentBorrowerId?: string;
  currentDueDate?: string; // ISO date string
  queueCount: number; // how many people are in reservation queue
  allowedHandoverMethods?: HandoverMethod[];
  sku?: string;
  replacementCost?: number;
  conditionGrade?: string;
  catalogHealthScore?: number;
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
  ownerId?: string; // ID of book owner
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
  approvedBy?: 'owner' | 'admin';
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
  readinessScore?: number;
  maxCapacity?: number;
  eventCode?: string;
  hostAdminName?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  readTime: string;
  publishedDate: string;
  coverImage: string;
  views: number;
  seoScore?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
}
