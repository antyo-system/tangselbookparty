import { useState, useEffect } from 'react';
import type { Book, BorrowRequest, ReservationQueueItem, BookReview, Member, CommunityEvent, HandoverMethod, Article } from './types';
import { StorageService, GUEST_MEMBER } from './services/storage';
import {
  fetchBooksFromSupabase, upsertBookToSupabase,
  fetchRequestsFromSupabase, upsertRequestToSupabase,
  fetchEventsFromSupabase, upsertEventToSupabase,
  fetchArticlesFromSupabase, upsertArticleToSupabase
} from './services/supabase';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { EventsPage } from './pages/EventsPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { BookDetailModal } from './components/BookDetailModal';
import { BorrowModal } from './components/BorrowModal';
import { QRModal } from './components/QRModal';
import { QRScannerModal } from './components/QRScannerModal';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { SOPModal } from './components/SOPModal';

export function App() {
  // Master Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [queues, setQueues] = useState<ReservationQueueItem[]>([]);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [member, setMember] = useState<Member>(StorageService.getCurrentMember());
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Active Tab & Session Restoration
  const getInitialTab = (): 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login' => {
    try {
      const currentMember = StorageService.getCurrentMember();
      const savedTab = localStorage.getItem('tbp_active_tab_v1');

      if (savedTab && ['catalog', 'events', 'articles', 'profile', 'admin', 'login'].includes(savedTab)) {
        if (savedTab === 'admin' && currentMember.role !== 'admin') {
          return 'catalog';
        }
        return savedTab as any;
      }
      if (currentMember.role === 'admin') {
        return 'admin';
      }
    } catch {
      // fallback
    }
    return 'catalog';
  };

  const [activeTab, setActiveTabState] = useState<'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login'>(getInitialTab);

  const setActiveTab = (tab: 'catalog' | 'events' | 'articles' | 'profile' | 'admin' | 'login') => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('tbp_active_tab_v1', tab);
    } catch {
      // quiet error
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Tangsel Book Party — Perpustakaan Fisik Komunitas';
  }, []);

  // Modal States
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [borrowModalBook, setBorrowModalBook] = useState<Book | null>(null);
  const [qrModalBook, setQrModalBook] = useState<Book | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showSOPModal, setShowSOPModal] = useState(false);
  const [waReminderData, setWaReminderData] = useState<{
    request: BorrowRequest;
    type: 'due_soon' | 'overdue' | 'approval';
  } | null>(null);

  // Toast Notification State & Loading Sync State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initial Load from Storage & Supabase Sync
  useEffect(() => {
    // 1. Instant local load
    setBooks(StorageService.getBooks());
    setRequests(StorageService.getRequests());
    setQueues(StorageService.getQueues());
    setReviews(StorageService.getReviews());
    setEvents(StorageService.getEvents());
    setArticles(StorageService.getArticles());

    // 2. Async Supabase Sync (if configured)
    async function syncSupabaseData() {
      setIsSyncing(true);
      try {
        const [remoteBooks, remoteRequests, remoteEvents, remoteArticles] = await Promise.all([
          fetchBooksFromSupabase(),
          fetchRequestsFromSupabase(),
          fetchEventsFromSupabase(),
          fetchArticlesFromSupabase()
        ]);

        const localBooks = StorageService.getBooks();
        if (remoteBooks && remoteBooks.length > 0) {
          setBooks(remoteBooks);
          StorageService.saveBooksLocallyOnly(remoteBooks);
        } else if (localBooks && localBooks.length > 0) {
          localBooks.forEach((b) => upsertBookToSupabase(b));
        }

        const localRequests = StorageService.getRequests();
        if (remoteRequests && remoteRequests.length > 0) {
          setRequests(remoteRequests);
          StorageService.saveRequestsLocallyOnly(remoteRequests);
        } else if (localRequests && localRequests.length > 0) {
          localRequests.forEach((r) => upsertRequestToSupabase(r));
        }

        const localEvents = StorageService.getEvents();
        if (remoteEvents && remoteEvents.length > 0) {
          setEvents(remoteEvents);
          StorageService.saveEventsLocallyOnly(remoteEvents);
        } else if (localEvents && localEvents.length > 0) {
          localEvents.forEach((evt) => upsertEventToSupabase(evt));
        }

        const localArticles = StorageService.getArticles();
        if (remoteArticles && remoteArticles.length > 0) {
          setArticles(remoteArticles);
          StorageService.saveArticlesLocallyOnly(remoteArticles);
        } else if (localArticles && localArticles.length > 0) {
          localArticles.forEach((art) => upsertArticleToSupabase(art));
        }
      } catch (e) {
        console.warn('Sync warning:', e);
      } finally {
        setIsSyncing(false);
      }
    }

    syncSupabaseData();
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

    // Prevent Duplicate Active Requests by Same Member
    const existingReq = requests.find(
      (r) =>
        r.bookId === bookId &&
        (r.userId === member.id || (r.userName && member.name && r.userName.toLowerCase().trim() === member.name.toLowerCase().trim())) &&
        (r.status === 'pending' || r.status === 'approved' || r.status === 'borrowed')
    );

    if (existingReq) {
      showToast(`Anda sudah memiliki pengajuan aktif untuk "${targetBook.title}".`, 'error');
      setBorrowModalBook(null);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + durationDays);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const newRequest: BorrowRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      bookCover: targetBook.coverImage,
      ownerId: targetBook.ownerId,
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
    showToast(`Permintaan pinjam "${targetBook.title}" berhasil diajukan!`);
  };

  const handleQueueSubmit = (
    bookId: string,
    durationDays: number,
    estimatedDate: string
  ) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    // Prevent Duplicate Queue Entries
    const existingQueue = queues.find(
      (q) =>
        q.bookId === bookId &&
        (q.userId === member.id || (q.userName && member.name && q.userName.toLowerCase().trim() === member.name.toLowerCase().trim())) &&
        q.status === 'waiting'
    );

    if (existingQueue) {
      showToast(`Anda sudah terdaftar di antrean "${targetBook.title}" (Posisi #${existingQueue.queuePosition}).`, 'error');
      setBorrowModalBook(null);
      return;
    }

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
    showToast(`Berhasil mendaftar antrean untuk "${targetBook.title}"!`);
  };

  // Admin / Owner Approval Handlers
  const handleApproveRequest = (requestId: string) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'approved' as const, approvedBy: 'admin' as const } : r
    );

    const updatedBooks = books.map((b) =>
      b.id === targetReq.bookId
        ? {
            ...b,
            status: 'reserved' as const,
            currentBorrower: targetReq.userName,
            currentBorrowerId: targetReq.userId,
            currentDueDate: targetReq.dueDate
          }
        : b
    );

    updateRequests(updatedRequests);
    updateBooks(updatedBooks);
    showToast(`Peminjaman "${targetReq.bookTitle}" disetujui! Peminjam dapat mengonfirmasi serah terima.`);
  };

  // Confirm Physical Handover Receipt (By Borrower or Admin)
  const handleConfirmReceiveBook = (requestId: string) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return;

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + targetReq.durationDays);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, status: 'borrowed' as const, dueDate: dueDateStr } : r
    );

    const updatedBooks = books.map((b) =>
      b.id === targetReq.bookId
        ? {
            ...b,
            status: 'borrowed' as const,
            currentBorrower: targetReq.userName,
            currentBorrowerId: targetReq.userId,
            currentDueDate: dueDateStr
          }
        : b
    );

    updateRequests(updatedRequests);
    updateBooks(updatedBooks);
    showToast(`Konfirmasi serah terima buku "${targetReq.bookTitle}" berhasil!`);
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

  // QR Scan Result Handler (Smart Admin vs Member Scanner Workflow)
  const handleQRScanResult = (bookId: string, action: 'borrow' | 'return') => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;

    const isAdmin = member.role === 'admin';

    if (isAdmin || action === 'return') {
      // Admin Scan -> Instant Book Return
      handleReturnBook(bookId);
      showToast(`[ADMIN SCAN] Buku "${targetBook.title}" resmi dicatat DIKEMBALIKAN!`);
    } else {
      // Member Scan -> Instant Confirm Receipt (or create instant borrow)
      const existingReq = requests.find(
        (r) =>
          r.bookId === bookId &&
          (r.userId === member.id || (r.userName && member.name && r.userName.toLowerCase().trim() === member.name.toLowerCase().trim())) &&
          (r.status === 'pending' || r.status === 'approved' || r.status === 'borrowed')
      );

      if (existingReq) {
        if (existingReq.status === 'pending' || existingReq.status === 'approved') {
          handleConfirmReceiveBook(existingReq.id);
          showToast(`[MEMBER SCAN] Buku "${targetBook.title}" resmi DITERIMA & DIPINJAM!`);
        } else {
          showToast(`[MEMBER SCAN] Anda sedang memegang buku "${targetBook.title}".`);
        }
      } else {
        // Quick instant borrow for member scanning an available book
        const todayStr = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 14);
        const dueDateStr = dueDateObj.toISOString().split('T')[0];

        const quickReq: BorrowRequest = {
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          bookId,
          bookTitle: targetBook.title,
          bookCover: targetBook.coverImage,
          ownerId: targetBook.ownerId,
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
                  status: 'borrowed' as const,
                  currentBorrower: member.name,
                  currentBorrowerId: member.id,
                  currentDueDate: dueDateStr
                }
              : b
          )
        );
        showToast(`[MEMBER SCAN] Buku "${targetBook.title}" resmi DITERIMA & DIPINJAM!`);
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

  const updateArticles = (newArticles: Article[]) => {
    setArticles(newArticles);
    StorageService.saveArticles(newArticles);
  };

  const updateEvents = (newEvents: CommunityEvent[]) => {
    setEvents(newEvents);
    StorageService.saveEvents(newEvents);
  };

  // CMS Katalog Book Save / Delete
  const handleSaveBook = (
    bookData: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }
  ) => {
    if (bookData.id) {
      // Edit existing book
      const nextBooks = books.map((b) => (b.id === bookData.id ? { ...b, ...bookData } : b));
      updateBooks(nextBooks);
    } else {
      // Add new book
      const newBook: Book = {
        ...bookData,
        id: `TBP-BOOK-${String(books.length + 1).padStart(3, '0')}`,
        status: 'available',
        rating: 5.0,
        reviewsCount: 0,
        queueCount: 0
      };
      updateBooks([newBook, ...books]);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    const nextBooks = books.filter((b) => b.id !== bookId);
    updateBooks(nextBooks);
    StorageService.deleteBook(bookId);
  };

  // CMS Article Save / Delete
  const handleSaveArticle = (
    articleData: Omit<Article, 'id' | 'views'> & { id?: string }
  ) => {
    if (articleData.id) {
      const nextArticles = articles.map((a) => (a.id === articleData.id ? { ...a, ...articleData } : a));
      updateArticles(nextArticles);
    } else {
      const newArticle: Article = {
        ...articleData,
        id: `ART-${String(articles.length + 1).padStart(2, '0')}`,
        views: 1
      };
      updateArticles([newArticle, ...articles]);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    const nextArticles = articles.filter((a) => a.id !== articleId);
    updateArticles(nextArticles);
    StorageService.deleteArticle(articleId);
  };

  // CMS Event Save / Delete
  const handleSaveEvent = (
    eventData: Omit<CommunityEvent, 'id' | 'attendeesCount'> & { id?: string }
  ) => {
    if (eventData.id) {
      const nextEvents = events.map((e) => (e.id === eventData.id ? { ...e, ...eventData } : e));
      updateEvents(nextEvents);
    } else {
      const newEvent: CommunityEvent = {
        ...eventData,
        id: `EVT-${String(events.length + 1).padStart(2, '0')}`,
        attendeesCount: 0
      };
      updateEvents([newEvent, ...events]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    const nextEvents = events.filter((e) => e.id !== eventId);
    updateEvents(nextEvents);
    StorageService.deleteEvent(eventId);
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

  // Logout Handler
  const handleLogout = () => {
    setMember(GUEST_MEMBER);
    StorageService.saveCurrentMember(GUEST_MEMBER);
    if (activeTab === 'admin' || activeTab === 'profile') {
      setActiveTab('catalog');
    }
  };

  // Profile Update Handler
  const handleUpdateProfile = (updatedMember: Member) => {
    setMember(updatedMember);
    StorageService.saveCurrentMember(updatedMember);
    if (updatedMember.id !== 'usr_guest') {
      const users = StorageService.getRegisteredUsers();
      const existingIdx = users.findIndex(
        (u) => u.id === updatedMember.id || u.email.toLowerCase() === updatedMember.email.toLowerCase()
      );
      if (existingIdx !== -1) {
        users[existingIdx] = {
          ...users[existingIdx],
          ...updatedMember
        };
        localStorage.setItem('tbp_registered_users_v1', JSON.stringify(users));
      }
    }
    showToast('Profil dan domisili Anda berhasil diperbarui!');
  };

  const isEditingAdmin = activeTab === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased w-full max-w-full overflow-x-hidden box-border">
      
      {/* Sync Indicator Bar */}
      {isSyncing && (
        <div className="bg-[#053D27] text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2 animate-pulse z-50">
          <span className="w-2 h-2 rounded-full bg-[#FFBF00]"></span>
          <span>Menyingkronkan data terbaru dengan server Supabase...</span>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full bg-[#03321F] text-white p-4 rounded-2xl shadow-2xl border border-[#FFBF00]/40 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBF00] shrink-0"></span>
            <p className="text-xs font-semibold text-emerald-100">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-xs text-emerald-300 hover:text-white font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {/* Top Navigation - Hidden when in Admin Dashboard */}
      {!isEditingAdmin && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          member={member}
          toggleRole={handleToggleRole}
          onOpenScanner={() => setShowScanner(true)}
          onOpenLogin={() => setActiveTab('login')}
          onLogout={handleLogout}
          onResetData={handleResetData}
        />
      )}

      {/* Main View Container */}
      <main className={isEditingAdmin ? "flex-1 w-full" : "flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 overflow-x-hidden"}>
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

        {activeTab === 'events' && <EventsPage events={events} searchQuery={searchQuery} />}

        {activeTab === 'articles' && <ArticlesPage articles={articles} searchQuery={searchQuery} />}

        {activeTab === 'profile' && (
          <ProfilePage
            member={member}
            books={books}
            requests={requests}
            queues={queues}
            onSelectBook={(book) => setSelectedBookDetail(book)}
            onBorrowBook={(book) => setBorrowModalBook(book)}
            onToggleWishlist={handleToggleWishlist}
            onAddBook={handleSaveBook}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onReturnBook={handleReturnBook}
            onConfirmReceiveBook={handleConfirmReceiveBook}
            onOpenLogin={() => setActiveTab('login')}
            onUpdateProfile={handleUpdateProfile}
            onOpenSOP={() => setShowSOPModal(true)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={(newMember, targetTab) => {
              setMember(newMember);
              StorageService.saveCurrentMember(newMember);
              setActiveTab(targetTab);
            }}
            onNavigateToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            books={books}
            requests={requests}
            queues={queues}
            events={events}
            articles={articles}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onReturnBook={handleReturnBook}
            onSaveBook={handleSaveBook}
            onDeleteBook={handleDeleteBook}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenScanner={() => setShowScanner(true)}
            onShowQR={(book) => setQrModalBook(book)}
            onOpenWAReminder={(req, type) => setWaReminderData({ request: req, type })}
            onExitAdmin={handleLogout}
          />
        )}
      </main>

      {/* Footer - Hidden when in Admin Dashboard */}
      {!isEditingAdmin && <Footer onOpenSOP={() => setShowSOPModal(true)} />}

      {/* Modals */}
      {selectedBookDetail && (
        <BookDetailModal
          book={selectedBookDetail}
          reviews={reviews}
          isWishlisted={member.wishlist.includes(selectedBookDetail.id)}
          member={member}
          requests={requests}
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
          onOpenSOP={() => setShowSOPModal(true)}
        />
      )}

      {qrModalBook && (
        <QRModal book={qrModalBook} onClose={() => setQrModalBook(null)} />
      )}

      {showScanner && (
        <QRScannerModal
          books={books}
          member={member}
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

      {/* Official SOP Modal */}
      <SOPModal isOpen={showSOPModal} onClose={() => setShowSOPModal(false)} />

      {/* Mobile App-like Bottom Navigation Bar - Hidden when in Admin Dashboard */}
      {!isEditingAdmin && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          member={member}
          onOpenScanner={() => setShowScanner(true)}
        />
      )}

    </div>
  );
}
