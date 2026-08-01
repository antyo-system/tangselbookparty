import React, { useState } from 'react';
import { Shield, BookOpen, Clock, CheckCircle2, XCircle, QrCode, Plus, MessageSquare, Search, RotateCcw, Users, Printer, Edit, Trash2, Calendar, BookMarked, Eye } from 'lucide-react';
import type { Book, BorrowRequest, ReservationQueueItem, CommunityEvent, Article } from '../types';
import { AddBookModal } from '../components/AddBookModal';
import { AddArticleModal } from '../components/AddArticleModal';
import { AddEventModal } from '../components/AddEventModal';

interface AdminDashboardProps {
  books: Book[];
  requests: BorrowRequest[];
  queues: ReservationQueueItem[];
  events: CommunityEvent[];
  articles: Article[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onReturnBook: (bookId: string) => void;
  onSaveBook: (bookData: Omit<Book, 'id' | 'status' | 'rating' | 'reviewsCount' | 'queueCount'> & { id?: string }) => void;
  onDeleteBook: (bookId: string) => void;
  onSaveArticle: (articleData: Omit<Article, 'id' | 'views'> & { id?: string }) => void;
  onDeleteArticle: (articleId: string) => void;
  onSaveEvent: (eventData: Omit<CommunityEvent, 'id' | 'attendeesCount'> & { id?: string }) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenScanner: () => void;
  onShowQR: (book: Book) => void;
  onOpenWAReminder: (request: BorrowRequest, type: 'due_soon' | 'overdue' | 'approval') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  requests,
  queues,
  events,
  articles,
  onApproveRequest,
  onRejectRequest,
  onReturnBook,
  onSaveBook,
  onDeleteBook,
  onSaveArticle,
  onDeleteArticle,
  onSaveEvent,
  onDeleteEvent,
  onOpenScanner,
  onShowQR,
  onOpenWAReminder
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_loans' | 'inventory' | 'articles' | 'events' | 'queues'>('requests');
  const [inventorySearch, setInventorySearch] = useState('');
  
  // CMS Modal States
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeLoans = requests.filter((r) => r.status === 'borrowed' || r.status === 'approved');

  const todayStr = new Date().toISOString().split('T')[0];
  const activeQueues = queues.filter((q) => q.status === 'waiting');

  const filteredInventory = books.filter(
    (b) =>
      b.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Header */}
      <div className="bg-[#053D27] text-white rounded-3xl p-6 sm:p-8 border border-[#FFBF00]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#03321F] text-[#D0DF00] text-xs font-extrabold border border-[#D0DF00]/40">
            <Shield className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span>ADMIN & CARETAKER CMS DASHBOARD</span>
          </div>
          <h1 className="font-anton text-2xl sm:text-4xl text-white tracking-wide">PANEL MANAJEMEN TANGSEL BOOK PARTY</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            CMS terpadu untuk kelola katalog buku & cover, posting artikel SEO, atur jadwal acara komunitas, dan persetujuan peminjaman.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenScanner}
            className="py-2 px-3.5 bg-[#FFBF00] text-[#03321F] hover:bg-[#D0DF00] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Scanner</span>
          </button>

          <button
            onClick={() => {
              setEditingBook(null);
              setShowAddBook(true);
            }}
            className="py-2 px-3.5 bg-[#03321F] text-white hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-[#FFBF00]/40 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-[#D0DF00]" />
            <span>Tambah Buku (CMS)</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Katalog Buku</span>
            <BookOpen className="w-4 h-4 text-[#053D27]" />
          </div>
          <div className="font-anton text-2xl sm:text-3xl text-slate-900">{books.length}</div>
          <p className="text-[10px] text-slate-500 font-medium">Koleksi Fisik Komunitas</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Permintaan Pinjam</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-anton text-2xl sm:text-3xl text-amber-600">{pendingRequests.length}</div>
          <p className="text-[10px] text-slate-500 font-medium">Menunggu Persetujuan</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CMS Artikel</span>
            <BookMarked className="w-4 h-4 text-[#053D27]" />
          </div>
          <div className="font-anton text-2xl sm:text-3xl text-slate-900">{articles.length}</div>
          <p className="text-[10px] text-slate-500 font-medium">Artikel SEO Terpublikasi</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CMS Acara</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-anton text-2xl sm:text-3xl text-slate-900">{events.length}</div>
          <p className="text-[10px] text-slate-500 font-medium">Agenda Book Party</p>
        </div>

      </div>

      {/* Control Tabs Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Permintaan Pinjam ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_loans')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'active_loans'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Pinjaman Aktif ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#FFBF00]" />
          <span>CMS Katalog Buku ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'articles'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-[#FFBF00]" />
          <span>CMS Artikel ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'events'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#FFBF00]" />
          <span>CMS Acara ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queues')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'queues'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Antrean Reservasi ({activeQueues.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {pendingRequests.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Semua permintaan pinjaman sudah disetujui!</p>
              <p className="text-xs">Tidak ada antrean persetujuan baru dari anggota.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={req.bookCover}
                      alt={req.bookTitle}
                      className="w-12 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                          {req.id}
                        </span>
                        <span className="text-xs text-slate-400">Tanggal: {req.requestDate}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h3>
                      <p className="text-xs text-slate-700">
                        Peminjam: <strong className="text-[#053D27]">{req.userName}</strong> ({req.userPhone})
                      </p>
                      <p className="text-xs text-slate-600">
                        Durasi: <strong className="text-[#053D27]">{req.durationDays} Hari</strong> • Metode: <strong className="capitalize text-slate-900">{req.handoverMethod}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => onOpenWAReminder(req, 'approval')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#053D27] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Buka notifikasi WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak</span>
                    </button>

                    <button
                      onClick={() => onApproveRequest(req.id)}
                      className="py-2 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Pinjaman</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE LOANS */}
      {activeTab === 'active_loans' && (
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {activeLoans.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Tidak ada pinjaman aktif saat ini</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeLoans.map((loan) => {
                const isOverdue = loan.dueDate && loan.dueDate < todayStr;

                return (
                  <div key={loan.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={loan.bookCover}
                        alt={loan.bookTitle}
                        className="w-12 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                            {loan.id}
                          </span>
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                              TERLAMBAT
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{loan.bookTitle}</h3>
                        <p className="text-xs text-slate-700">
                          Peminjam: <strong className="text-[#053D27]">{loan.userName}</strong> ({loan.userPhone})
                        </p>
                        <p className="text-xs text-slate-600">
                          Batas Kembalikan: <strong className={isOverdue ? "text-rose-600 font-bold" : "text-[#053D27]"}>{loan.dueDate}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => onOpenWAReminder(loan, isOverdue ? 'overdue' : 'due_soon')}
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#053D27] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Pengingat WA</span>
                      </button>

                      <button
                        onClick={() => onReturnBook(loan.bookId)}
                        className="py-2 px-4 bg-[#053D27] hover:bg-[#FFBF00] hover:text-[#03321F] text-[#D0DF00] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Tandai Dikembalikan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CMS KATALOG BUKU (MANAJEMEN BUKU & COVER) */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul, penulis, ISBN, pemilik..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <button
              onClick={() => {
                setEditingBook(null);
                setShowAddBook(true);
              }}
              className="w-full sm:w-auto py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buku Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#053D27] text-white font-bold border-b border-[#03321F]">
                    <th className="p-3.5">Cover & ID</th>
                    <th className="p-3.5">Judul & Penulis</th>
                    <th className="p-3.5">Genre</th>
                    <th className="p-3.5">Pemilik & Lokasi Rak</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Aksi CMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-10 h-14 rounded-lg object-cover bg-slate-100 shadow-sm flex-shrink-0"
                          />
                          <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                            {book.id}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{book.title}</div>
                        <div className="text-slate-500 text-[11px]">{book.author} • ISBN: {book.isbn}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#053D27] font-bold text-[10px] border border-emerald-200">
                          {book.genre}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{book.ownerName}</div>
                        <div className="text-slate-500 text-[11px]">{book.shelfLocation}</div>
                      </td>
                      <td className="p-3.5">
                        {book.status === 'available' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            Tersedia
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            Dipinjam
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onShowQR(book)}
                            className="p-1.5 bg-slate-100 hover:bg-[#FFBF00] text-slate-700 hover:text-[#03321F] rounded-lg transition-colors"
                            title="Cetak Sticker QR Code"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingBook(book);
                              setShowAddBook(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-lg transition-colors"
                            title="Edit Buku"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus buku "${book.title}" dari katalog?`)) {
                                onDeleteBook(book.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-colors"
                            title="Hapus Buku"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: CMS ARTIKEL (MANAJEMEN ARTIKEL & TIPS LITERASI) */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Artikel & Jurnal SEO</h3>
              <p className="text-xs text-slate-500">Kelola postingan artikel dan tips membaca untuk komunitas.</p>
            </div>
            <button
              onClick={() => {
                setEditingArticle(null);
                setShowAddArticle(true);
              }}
              className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Artikel Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {articles.map((art) => (
              <div key={art.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-20 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#053D27] text-[#D0DF00]">
                        {art.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{art.publishedDate} • {art.readTime}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{art.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-2">
                    <Eye className="w-3.5 h-3.5" />
                    {art.views}
                  </span>
                  <button
                    onClick={() => {
                      setEditingArticle(art);
                      setShowAddArticle(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-xl transition-colors"
                    title="Edit Artikel"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus artikel "${art.title}"?`)) {
                        onDeleteArticle(art.id);
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-colors"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CMS ACARA (MANAJEMEN EVENT & BOOK PARTY) */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Agenda Event & Book Party</h3>
              <p className="text-xs text-slate-500">Atur jadwal meetup dan piknik baca komunitas Tangsel.</p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowAddEvent(true);
              }}
              className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Acara Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-20 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F]">
                        {evt.date}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">{evt.attendeesCount} Hadir</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{evt.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{evt.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingEvent(evt);
                      setShowAddEvent(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-xl transition-colors"
                    title="Edit Acara"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus event "${evt.title}"?`)) {
                        onDeleteEvent(evt.id);
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-colors"
                    title="Hapus Acara"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RESERVATION QUEUES */}
      {activeTab === 'queues' && (
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {activeQueues.length === 0 ? (
            <div className="p-10 text-center text-slate-500 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Tidak ada antrean reservasi saat ini</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeQueues.map((q) => (
                <div key={q.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                        Posisi #{q.queuePosition}
                      </span>
                      <span className="text-xs text-slate-400">Diminta: {q.requestedAt}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{q.bookTitle}</h3>
                    <p className="text-xs text-slate-600">
                      Pemesan: <strong className="text-[#053D27]">{q.userName}</strong> ({q.userPhone})
                    </p>
                    <p className="text-xs text-slate-500">
                      Estimasi Buku Tersedia: <strong className="text-emerald-700">{q.estimatedAvailableDate}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CMS Modals */}
      {showAddBook && (
        <AddBookModal
          bookToEdit={editingBook}
          onClose={() => {
            setShowAddBook(false);
            setEditingBook(null);
          }}
          onAddBook={(bookData) => {
            onSaveBook(bookData);
            setShowAddBook(false);
            setEditingBook(null);
          }}
        />
      )}

      {showAddArticle && (
        <AddArticleModal
          articleToEdit={editingArticle}
          onClose={() => {
            setShowAddArticle(false);
            setEditingArticle(null);
          }}
          onSaveArticle={(articleData) => {
            onSaveArticle(articleData);
            setShowAddArticle(false);
            setEditingArticle(null);
          }}
        />
      )}

      {showAddEvent && (
        <AddEventModal
          eventToEdit={editingEvent}
          onClose={() => {
            setShowAddEvent(false);
            setEditingEvent(null);
          }}
          onSaveEvent={(eventData) => {
            onSaveEvent(eventData);
            setShowAddEvent(false);
            setEditingEvent(null);
          }}
        />
      )}

    </div>
  );
};
