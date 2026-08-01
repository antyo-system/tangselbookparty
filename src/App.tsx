import { useState, useEffect } from 'react';
import type { Book, BorrowRequest, ReservationQueueItem, BookReview, Member, CommunityEvent, HandoverMethod, Article } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { EventsPage } from './pages/EventsPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BookDetailModal } from './components/BookDetailModal';
import { BorrowModal } from './components/BorrowModal';
import { QRModal } from './components/QRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal';
import { AddBookModal } from './components/AddBookModal';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';

export function App() {
  // Master Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [queues, setQueues] = useState<ReservationQueueItem[]>([]);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [member, setMember] = useState<Member>(StorageService.getCurrentMember());
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'catalog' | 'events' | 'articles' | 'profile' | 'admin'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [borrowModalBook, setBorrowModalBook] = useState<Book | null>(null);
  const [qrModalBook, setQrModalBook] = useState<Book | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [waReminderData, setWaReminderData] = useState<{
    request: BorrowRequest;
    type: 'due_soon' | 'overdue' | 'approval';
  } | null>(null);

  // Initial Load from Storage
  useEffect(() => {
    setBooks(StorageService.getBooks());
    setRequests(StorageService.getRequests());
    setQueues(StorageService.getQueues());
    setReviews(StorageService.getReviews());
    setEvents(StorageService.getEvents());
    setArticles(StorageService.getArticles());
  }, []);

  // Save changes helper
  const updateBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    StorageService.saveBooks(newBooks);
  };

  const updateRequests = (newRequests: BorrowRequest[]) => {
    setRequests(newRequests);
    StorageService.saveRequests(newRequests);
  };

  const updateQueues = (newQueues: ReservationQueueItem[]) => {
    setQueues(newQueues);
    StorageService.saveQueues(newQueues);
  };

  const updateReviews = (newReviews: BookReview[]) => {
    setReviews(newReviews);
    StorageService.saveReviews(newReviews);
  };

  const updateMember = (newMember: Member) => {
    setMember(newMember);
    StorageService.saveCurrentMember(newMember);
  };

  // Borrow / Queue Request Handlers
  const handleBorrowSubmit = (
    bookId: string,
    durationDays: number,
    handoverMethod: HandoverMethod,
    notes: string
  ) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + durationDays);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const newRequest: BorrowRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookCover: targetBook.coverImage,
      userId: member.id,
      userName: member.name,
      userPhone: member.phone,
      requestDate: todayStr,
      durationDays,
      dueDate: dueDateStr,
      handoverMethod,
      status: 'pending',
      notes
    };

    const nextRequests = [newRequest, ...requests];
    updateRequests(nextRequests);
    setBorrowModalBook(null);
  };

  const handleQueueSubmit = (
    bookId: string,
    durationDays: number,
    estimatedDate: string
  ) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    const currentBookQueues = queues.filter((q) => q.bookId === bookId && q.status === 'waiting');
    const newPosition = currentBookQueues.length + 1;

    const newQueueItem: ReservationQueueItem = {
      id: `QUEUE-${Math.floor(500 + Math.random() * 9000)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      userId: member.id,
      userName: member.name,
      userPhone: member.phone,
      queuePosition: newPosition,
      durationDays,
      requestedAt: new Date().toISOString().split('T')[0],
      estimatedAvailableDate: estimatedDate,
      status: 'waiting'
    };

    // Update book queue count
    const updatedBooks = books.map((b) =>
      b.id === bookId ? { ...b, queueCount: b.queueCount + 1 } : b
    );

    updateBooks(updatedBooks);
    updateQueues([...queues, newQueueItem]);
    setBorrowModalBook(null);
  };

  // Admin Approval Handlers
  const handleApproveRequest = (requestId: string) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'borrowed' as const } : r
    );

    const updatedBooks = books.map((b) =>
      b.id === targetReq.bookId
        ? {
            ...b,
            status: 'borrowed' as const,
            currentBorrower: targetReq.userName,
            currentDueDate: targetReq.dueDate
          }
        : b
    );

    updateRequests(updatedRequests);
    updateBooks(updatedBooks);
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );
    updateRequests(updatedRequests);
  };

  // Record Book Return
  const handleReturnBook = (bookId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Update active borrow request status to returned
    const updatedRequests = requests.map((r) =>
      r.bookId === bookId && (r.status === 'borrowed' || r.status === 'approved')
        ? { ...r, status: 'returned' as const, returnDate: todayStr }
        : r
    );

    // Update book status to available
    const updatedBooks = books.map((b) =>
      b.id === bookId
        ? {
            ...b,
            status: 'available' as const,
            currentBorrower: undefined,
            currentDueDate: undefined
          }
        : b
    );

    updateRequests(updatedRequests);
    updateBooks(updatedBooks);
  };

  // QR Scan Result Handler
  const handleQRScanResult = (bookId: string, action: 'borrow' | 'return') => {
    if (action === 'return') {
      handleReturnBook(bookId);
    } else {
      // Find pending request or borrow directly
      const pending = requests.find((r) => r.bookId === bookId && r.status === 'pending');
      if (pending) {
        handleApproveRequest(pending.id);
      } else {
        // Quick borrow default
        const todayStr = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 14);
        const dueDateStr = dueDateObj.toISOString().split('T')[0];

        const targetBook = books.find((b) => b.id === bookId);
        if (!targetBook) return;

        const quickReq: BorrowRequest = {
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          bookId,
          bookTitle: targetBook.title,
          bookCover: targetBook.coverImage,
          userId: member.id,
          userName: member.name,
          userPhone: member.phone,
          requestDate: todayStr,
          durationDays: 14,
          dueDate: dueDateStr,
          handoverMethod: 'meetup',
          status: 'borrowed'
        };

        updateRequests([quickReq, ...requests]);
        updateBooks(
          books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  status: 'borrowed',
                  currentBorrower: member.name,
                  currentDueDate: dueDateStr
                }
              : b
          )
        );
      }
    }
  };

  // Review Submit
  const handleAddReview = (bookId: string, rating: number, comment: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRev: BookReview = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      bookId,
      userName: member.name,
      userAvatar: member.avatar,
      rating,
      comment,
      createdAt: todayStr
    };

    const nextReviews = [newRev, ...reviews];
    updateReviews(nextReviews);

    // Recalculate book average rating
    const bookRevs = nextReviews.filter((r) => r.bookId === bookId);
    const avgRating = bookRevs.reduce((acc, curr) => acc + curr.rating, 0) / bookRevs.length;

    const updatedBooks = books.map((b) =>
      b.id === bookId
        ? {
            ...b,
            rating: Number(avgRating.toFixed(1)),
            reviewsCount: bookRevs.length
          }
        : b
    );

    updateBooks(updatedBooks);

    if (selectedBookDetail && selectedBookDetail.id === bookId) {
      setSelectedBookDetail({
        ...selectedBookDetail,
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: bookRevs.length
      });
    }
  };

  // Add New Book
  const handleAddBookSubmit = (
    newBookData: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'>
  ) => {
    const newBook: Book = {
      ...newBookData,
      id: `TBP-BOOK-${String(books.length + 1).padStart(3, '0')}`,
      status: 'available',
      rating: 5.0,
      reviewsCount: 0,
      queueCount: 0
    };

    updateBooks([newBook, ...books]);
    setShowAddBook(false);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (bookId: string) => {
    const exists = member.wishlist.includes(bookId);
    const nextWishlist = exists
      ? member.wishlist.filter((id) => id !== bookId)
      : [...member.wishlist, bookId];

    updateMember({ ...member, wishlist: nextWishlist });
  };

  // Toggle Member / Admin Role
  const handleToggleRole = () => {
    const nextRole = member.role === 'admin' ? 'member' : 'admin';
    updateMember({ ...member, role: nextRole });
  };

  // Reset sample data
  const handleResetData = () => {
    if (window.confirm('Reset all library data back to initial sample state?')) {
      StorageService.resetToDefault();
      setBooks(StorageService.getBooks());
      setRequests(StorageService.getRequests());
      setQueues(StorageService.getQueues());
      setReviews(StorageService.getReviews());
      setMember(StorageService.getCurrentMember());
      setEvents(StorageService.getEvents());
      setArticles(StorageService.getArticles());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased w-full max-w-full overflow-x-hidden box-border">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        member={member}
        toggleRole={handleToggleRole}
        onOpenScanner={() => setShowScanner(true)}
        onResetData={handleResetData}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 overflow-x-hidden">
        {activeTab === 'catalog' && (
          <CatalogPage
            books={books}
            searchQuery={searchQuery}
            member={member}
            onSelectBook={(book) => setSelectedBookDetail(book)}
            onBorrowBook={(book) => setBorrowModalBook(book)}
            onShowQR={(book) => setQrModalBook(book)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'events' && <EventsPage events={events} />}

        {activeTab === 'articles' && <ArticlesPage articles={articles} />}

        {activeTab === 'profile' && (
          <ProfilePage
            member={member}
            books={books}
            requests={requests}
            queues={queues}
            onSelectBook={(book) => setSelectedBookDetail(book)}
            onBorrowBook={(book) => setBorrowModalBook(book)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            books={books}
            requests={requests}
            queues={queues}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onReturnBook={handleReturnBook}
            onOpenAddBook={() => setShowAddBook(true)}
            onOpenScanner={() => setShowScanner(true)}
            onShowQR={(book) => setQrModalBook(book)}
            onOpenWAReminder={(req, type) => setWaReminderData({ request: req, type })}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedBookDetail && (
        <BookDetailModal
          book={selectedBookDetail}
          reviews={reviews}
          isWishlisted={member.wishlist.includes(selectedBookDetail.id)}
          onClose={() => setSelectedBookDetail(null)}
          onBorrow={(b) => setBorrowModalBook(b)}
          onShowQR={(b) => setQrModalBook(b)}
          onToggleWishlist={handleToggleWishlist}
          onAddReview={handleAddReview}
        />
      )}

      {borrowModalBook && (
        <BorrowModal
          book={borrowModalBook}
          member={member}
          onClose={() => setBorrowModalBook(null)}
          onSubmitBorrow={handleBorrowSubmit}
          onSubmitQueue={handleQueueSubmit}
        />
      )}

      {qrModalBook && (
        <QRModal book={qrModalBook} onClose={() => setQrModalBook(null)} />
      )}

      {showScanner && (
        <QRScannerModal
          books={books}
          onClose={() => setShowScanner(false)}
          onScanResult={handleQRScanResult}
        />
      )}

      {waReminderData && (
        <WhatsAppReminderModal
          request={waReminderData.request}
          type={waReminderData.type}
          onClose={() => setWaReminderData(null)}
        />
      )}

      {showAddBook && (
        <AddBookModal
          onClose={() => setShowAddBook(false)}
          onAddBook={handleAddBookSubmit}
        />
      )}

      {/* Mobile App-like Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        member={member}
        onOpenScanner={() => setShowScanner(true)}
      />

    </div>
  );
}
