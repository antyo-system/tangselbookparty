import React, { useState } from 'react';
import { 
  Shield, BookOpen, Clock, CheckCircle2, XCircle, QrCode, Plus, 
  MessageSquare, Search, RotateCcw, Users, Printer, Edit, Trash2, 
  Calendar, BookMarked, Eye, LogOut, ArrowLeft, Activity, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
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
  onExitAdmin?: () => void;
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
  onOpenWAReminder,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_loans' | 'inventory' | 'articles' | 'events' | 'queues'>('requests');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION (KEMBANG SELADANG DESIGN PATTERN) */}
      <aside className={`bg-[#022416] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#053D27] shadow-xl transition-all duration-300 ${
        isSidebarOpen ? 'w-full md:w-64' : 'hidden md:flex md:w-[68px]'
      }`}>
        
        <div className="p-3 space-y-4">
          {/* Brand Header */}
          <div className={`flex items-center gap-3 px-1 py-1.5 ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <img 
              src="/tbp-logo.png" 
              alt="Tangsel Book Party Logo" 
              className="w-9 h-9 shrink-0 rounded-xl object-cover border border-[#FFBF00]/40 shadow-md" 
            />
            {isSidebarOpen && (
              <div className="flex flex-col justify-center min-w-0">
                <h2 className="text-sm font-bold text-white leading-tight truncate">Tangsel Book Party</h2>
                <p className="text-[10px] text-[#D0DF00] font-medium mt-0.5 truncate">Caretaker Panel</p>
              </div>
            )}
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-4 text-xs">
            
            {/* OPERASIONAL PERPUSTAKAAN */}
            <div className="space-y-1">
              {isSidebarOpen ? (
                <div className="px-3 pt-1 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  OPERASIONAL
                </div>
              ) : (
                <div className="my-1 border-t border-[#053D27]" />
              )}
              
              <button
                onClick={() => setActiveTab('requests')}
                title="Permintaan Pinjam"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'requests'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Permintaan Pinjam</span>
                    {pendingRequests.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                        {pendingRequests.length}
                      </span>
                    )}
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('active_loans')}
                title="Pinjaman Aktif"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'active_loans'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Pinjaman Aktif</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#03321F] text-[#D0DF00]">
                      {activeLoans.length}
                    </span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('queues')}
                title="Antrean Reservasi"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'queues'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Users className="w-4 h-4 shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Antrean Reservasi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#03321F] text-[#D0DF00]">
                      {activeQueues.length}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* MANAJEMEN CMS */}
            <div className="space-y-1">
              {isSidebarOpen ? (
                <div className="px-3 pt-1 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  MANAJEMEN CMS
                </div>
              ) : (
                <div className="my-1 border-t border-[#053D27]" />
              )}

              <button
                onClick={() => setActiveTab('inventory')}
                title="CMS Katalog Buku"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <BookOpen className="w-4 h-4 text-[#D0DF00] shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">CMS Katalog Buku</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">{books.length}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('articles')}
                title="CMS Artikel SEO"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'articles'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <BookMarked className="w-4 h-4 text-[#D0DF00] shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">CMS Artikel SEO</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">{articles.length}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('events')}
                title="CMS Acara Komunitas"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'events'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Calendar className="w-4 h-4 text-[#D0DF00] shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">CMS Acara Komunitas</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">{events.length}</span>
                  </div>
                )}
              </button>
            </div>

            {/* UTILITIES */}
            <div className="space-y-1 pt-2 border-t border-[#053D27]">
              <button
                onClick={onOpenScanner}
                title="Launch QR Scanner"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-emerald-200 hover:bg-[#053D27] hover:text-[#D0DF00] transition-colors ${
                  !isSidebarOpen ? 'justify-center px-0' : ''
                }`}
              >
                <QrCode className="w-4 h-4 text-[#FFBF00] shrink-0" />
                {isSidebarOpen && <span>Launch QR Scanner</span>}
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer Action */}
        <div className="p-3 border-t border-[#053D27] bg-[#011a10]">
          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              title="Keluar ke Mode Member"
              className={`w-full py-2.5 px-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-rose-800/50 transition-colors ${
                !isSidebarOpen ? 'px-0' : ''
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Keluar ke Mode Member</span>}
            </button>
          )}
        </div>

      </aside>

      {/* MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* KEMBANG SELADANG STYLE TOPBAR HEADER */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-[#053D27]" />}
              <span className="hidden sm:inline">{isSidebarOpen ? 'Hide Nav' : 'Unhide Nav'}</span>
            </button>

            <h2 className="font-anton text-base sm:text-lg tracking-wide text-slate-800 uppercase truncate">
              {activeTab === 'requests' && 'Operasional Permintaan Pinjam'}
              {activeTab === 'active_loans' && 'Manajemen Pinjaman Aktif'}
              {activeTab === 'queues' && 'Antrean Reservasi Buku'}
              {activeTab === 'inventory' && 'CMS Katalog Buku Fisik'}
              {activeTab === 'articles' && 'CMS Artikel SEO Komunitas'}
              {activeTab === 'events' && 'CMS Acara & Meetup Komunitas'}
            </h2>
          </div>

          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="py-1.5 px-3 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mode User</span>
            </button>
          )}
        </header>

        {/* WORKSPACE BODY */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 flex-1">

          {/* Metric Summary Cards - Only shown in Operational Overview (Requests tab) */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Buku Fisik</span>
                  <BookOpen className="w-4 h-4 text-[#053D27]" />
                </div>
                <div className="font-anton text-2xl sm:text-3xl text-slate-900">{books.length}</div>
                <div className="text-[11px] text-emerald-600 font-bold">Koleksi Terdaftar di Rak</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Permintaan Pending</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-anton text-2xl sm:text-3xl text-amber-600">{pendingRequests.length}</div>
                <div className="text-[11px] text-amber-700 font-bold">Butuh Persetujuan Admin</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CMS Artikel SEO</span>
                  <BookMarked className="w-4 h-4 text-[#053D27]" />
                </div>
                <div className="font-anton text-2xl sm:text-3xl text-slate-900">{articles.length}</div>
                <div className="text-[11px] text-emerald-600 font-bold">Postingan Terpublikasi</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-blue-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CMS Acara</span>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-anton text-2xl sm:text-3xl text-slate-900">{events.length}</div>
                <div className="text-[11px] text-blue-600 font-bold">Agenda Meetup Tangsel</div>
              </div>

            </div>
          )}

          {/* ERP TAB CONTENT PANELS */}

          {/* ERP TAB 1: PERMINTAAN PINJAM */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Operasional Persetujuan Peminjaman Buku</h3>
                  <p className="text-xs text-slate-500">Persetujuan permintaan dari anggota komunitas sebelum serah terima buku.</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-100 text-amber-800">
                  {pendingRequests.length} Antrean
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Semua permintaan pinjaman telah diproses!</p>
                  <p className="text-xs text-slate-400">Tidak ada antrean persetujuan baru.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={req.bookCover}
                          alt={req.bookTitle}
                          className="w-12 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                              {req.id}
                            </span>
                            <span className="text-xs text-slate-400">Diminta: {req.requestDate}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h4>
                          <p className="text-xs text-slate-700">
                            Peminjam: <strong className="text-[#053D27]">{req.userName}</strong> ({req.userPhone})
                          </p>
                          <p className="text-xs text-slate-500">
                            Durasi Pinjam: <strong className="text-slate-800">{req.durationDays} Hari</strong> • Metode: <strong className="capitalize text-slate-900">{req.handoverMethod}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => onOpenWAReminder(req, 'approval')}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#053D27] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Kirim pesan WhatsApp"
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

          {/* ERP TAB 2: PINJAMAN AKTIFF */}
          {activeTab === 'active_loans' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Daftar Peminjaman Aktif & Jatuh Tempo</h3>
                  <p className="text-xs text-slate-500">Monitor buku yang sedang dibawa oleh anggota komunitas.</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#053D27] text-[#D0DF00]">
                  {activeLoans.length} Dipinjam
                </span>
              </div>

              {activeLoans.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Tidak ada pinjaman aktif saat ini</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeLoans.map((loan) => {
                    const isOverdue = loan.dueDate && loan.dueDate < todayStr;

                    return (
                      <div key={loan.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <img
                            src={loan.bookCover}
                            alt={loan.bookTitle}
                            className="w-12 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-sm"
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
                            <h4 className="font-bold text-slate-900 text-sm">{loan.bookTitle}</h4>
                            <p className="text-xs text-slate-700">
                              Peminjam: <strong className="text-[#053D27]">{loan.userName}</strong> ({loan.userPhone})
                            </p>
                            <p className="text-xs text-slate-500">
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

          {/* ERP TAB 3: KATALOG BUKU */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Cari berdasarkan SKU, Judul, ISBN, Penulis, Pemilik, atau Rak..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
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
                  <span>Tambah Buku Baru (CMS)</span>
                </button>
              </div>

              {/* High Density Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#053D27] text-white font-bold border-b border-[#03321F]">
                        <th className="p-3.5">SKU & Cover</th>
                        <th className="p-3.5">Judul, Penulis & ISBN</th>
                        <th className="p-3.5">Genre & Kondisi</th>
                        <th className="p-3.5">Pemilik & Lokasi Rak</th>
                        <th className="p-3.5">Health Audit Score</th>
                        <th className="p-3.5">Status Buku</th>
                        <th className="p-3.5 text-right">Keloka CMS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInventory.map((book) => {
                        const healthScore = book.catalogHealthScore ?? 85;

                        return (
                          <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-10 h-14 rounded-md object-cover bg-slate-100 shadow-sm flex-shrink-0"
                                />
                                <div>
                                  <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded inline-block whitespace-nowrap">
                                    {book.sku || (book.id.startsWith('TBP') ? book.id : `TBP-BK-00${book.id}`)}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono block">ID: #{book.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 text-sm">{book.title}</div>
                              <div className="text-slate-500 text-[11px]">{book.author} • ISBN: {book.isbn}</div>
                              {book.replacementCost && (
                                <div className="text-[10px] text-emerald-700 font-mono">Ganti Rugi: Rp{book.replacementCost.toLocaleString()}</div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="space-y-1">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#053D27] font-bold text-[10px] border border-emerald-200 inline-block">
                                  {book.genre}
                                </span>
                                {book.conditionGrade && (
                                  <div className="text-[10px] text-slate-500 font-medium capitalize">Kondisi: {book.conditionGrade.replace('_', ' ')}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{book.ownerName}</div>
                              <div className="text-[#053D27] font-bold text-[11px]">{book.shelfLocation}</div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border inline-block ${
                                healthScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                healthScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                Health: {healthScore}/100
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
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
                                  title="Cetak Label QR Code"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingBook(book);
                                    setShowAddBook(true);
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-lg transition-colors"
                                  title="Edit Buku ERP"
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ERP TAB 4: CMS ARTIKEL SEO */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Daftar Artikel & SEO Knowledge Engine</h3>
                  <p className="text-xs text-slate-500">Kelola artikel berdaya saing SEO Google Search dengan Live Audit Score Engine.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setShowAddArticle(true);
                  }}
                  className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Artikel Baru (SEO CMS)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                {articles.map((art) => {
                  const seoScore = art.seoScore ?? 85;

                  return (
                    <div key={art.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-20 h-14 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#053D27] text-[#D0DF00]">
                              {art.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              seoScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              SEO: {seoScore}/100
                            </span>
                            <span className="text-[11px] text-slate-400">{art.publishedDate} • {art.readTime}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{art.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                          {art.seo?.focusKeyword && (
                            <div className="text-[10px] font-mono text-slate-500">
                              Keyword: <span className="text-blue-700 font-bold">"{art.seo.focusKeyword}"</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-2">
                          <Eye className="w-3.5 h-3.5" />
                          {art.views} views
                        </span>
                        <button
                          onClick={() => {
                            setEditingArticle(art);
                            setShowAddArticle(true);
                          }}
                          className="p-2 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-xl transition-colors"
                          title="Edit Artikel SEO"
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
                  );
                })}
              </div>
            </div>
          )}

          {/* ERP TAB 5: CMS ACARA */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Agenda & Operasional Event Komunitas</h3>
                  <p className="text-xs text-slate-500">Atur logistik tempat, kapasitas pendaftar, dan Readiness Score acara.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setShowAddEvent(true);
                  }}
                  className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Acara Baru (ERP CMS)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                {events.map((evt) => {
                  const readinessScore = evt.readinessScore ?? 90;
                  const capacity = evt.maxCapacity || 30;

                  return (
                    <div key={evt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-20 h-14 rounded-lg object-cover bg-slate-100 flex-shrink-0 shadow-sm"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                              {evt.eventCode || `EVT-00${evt.id}`}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#053D27] text-white">
                              {evt.date}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              readinessScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              Readiness: {readinessScore}/100
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{evt.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>📍 {evt.location}</span>
                            <span>👥 <strong>{evt.attendeesCount}</strong>/{capacity} Pax</span>
                            {evt.hostCaretakerName && <span>👤 Host: {evt.hostCaretakerName}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingEvent(evt);
                            setShowAddEvent(true);
                          }}
                          className="p-2 bg-slate-100 hover:bg-[#053D27] text-slate-700 hover:text-[#D0DF00] rounded-xl transition-colors"
                          title="Edit Acara ERP"
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
                  );
                })}
              </div>
            </div>
          )}

          {/* ERP TAB 6: RESERVATION QUEUES */}
          {activeTab === 'queues' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Antrean Reservasi Buku</h3>
                  <p className="text-xs text-slate-500">Anggota yang sedang menunggu giliran meminjam buku yang sedang dipinjam.</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#053D27] text-[#D0DF00]">
                  {activeQueues.length} Antrean
                </span>
              </div>

              {activeQueues.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Users className="w-12 h-12 text-slate-300 mx-auto" />
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
                        <h4 className="font-bold text-slate-900 text-sm">{q.bookTitle}</h4>
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

        </div>
      </main>

      {/* CMS MODALS */}
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
