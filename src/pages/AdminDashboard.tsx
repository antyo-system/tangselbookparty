import React, { useState } from 'react';
import { 
  BookOpen, Clock, CheckCircle2, XCircle, QrCode, Plus, 
  MessageSquare, Search, RotateCcw, Users, Printer, Edit, Trash2, 
  Calendar, BookMarked, Eye, LogOut, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import type { Book, BorrowRequest, ReservationQueueItem, CommunityEvent, Article, Member } from '../types';
import { AddBookModal } from '../components/AddBookModal';
import { AddArticleModal } from '../components/AddArticleModal';
import { AddEventModal } from '../components/AddEventModal';
import { EditMemberModal } from '../components/EditMemberModal';

interface AdminDashboardProps {
  books: Book[];
  requests: BorrowRequest[];
  queues: ReservationQueueItem[];
  events: CommunityEvent[];
  articles: Article[];
  members?: Member[];
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
  onForfeitCollateral?: (requestId: string, targetOwnership: 'owner' | 'community') => void;
  onUpdateMember?: (updatedMember: Member) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  requests,
  queues,
  events,
  articles,
  members = [],
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
  onExitAdmin,
  onForfeitCollateral,
  onUpdateMember
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_loans' | 'inventory' | 'members' | 'articles' | 'events' | 'queues'>('requests');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // CMS Modal States
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeLoans = requests.filter((r) => r.status === 'borrowed' || r.status === 'approved');
  const todayStr = new Date().toISOString().split('T')[0];
  const activeQueues = queues.filter((q) => q.status === 'waiting');

  // Auto-close sidebar on mobile tab change helper
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const filteredInventory = books.filter(
    (b) =>
      b.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden relative">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          title="Tutup Menu Admin"
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION (SLIDE-OVER DRAWER ON MOBILE) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 bg-[#022416] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#053D27] shadow-2xl md:shadow-xl transition-all duration-300 ${
        isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:flex md:w-[68px]'
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
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h2 className="text-sm font-bold text-white leading-tight truncate">Tangsel Book Party</h2>
                <p className="text-[10px] text-[#D0DF00] font-medium mt-0.5 truncate">Caretaker Admin Panel</p>
              </div>
            )}
            {/* Mobile Close Button */}
            {isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white md:hidden"
              >
                ✕
              </button>
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
                onClick={() => handleTabChange('requests')}
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
                onClick={() => handleTabChange('active_loans')}
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
                onClick={() => handleTabChange('queues')}
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
                onClick={() => handleTabChange('inventory')}
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
                onClick={() => handleTabChange('members')}
                title="CMS Anggota Komunitas"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'members'
                    ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                    : 'text-emerald-100 hover:bg-[#053D27] hover:text-[#FFBF00]'
                } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
              >
                <Users className="w-4 h-4 text-[#D0DF00] shrink-0" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">CMS Anggota Komunitas</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">{members.length}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleTabChange('articles')}
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
                onClick={() => handleTabChange('events')}
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

            {/* QUICK ACTIONS */}
            <div className="pt-2 border-t border-[#053D27]">
              <button
                onClick={onOpenScanner}
                title="Launch QR Scanner"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-[#053D27] text-[#D0DF00] border border-[#FFBF00]/30 hover:bg-[#FFBF00] hover:text-[#03321F] transition-all shadow-sm ${
                  !isSidebarOpen ? 'justify-center px-0' : ''
                }`}
              >
                <QrCode className="w-4 h-4 text-[#FFBF00] shrink-0" />
                {isSidebarOpen && <span className="truncate">Launch QR Scanner</span>}
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer / Exit Button */}
        <div className="p-3 border-t border-[#053D27]">
          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              title="Keluar dari Caretaker Mode"
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/80 text-rose-200 border border-rose-800/40 hover:bg-rose-900 hover:text-white transition-all ${
                !isSidebarOpen ? 'justify-center px-0' : ''
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Keluar Caretaker</span>}
            </button>
          )}
        </div>

      </aside>

      {/* MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        
        {/* KEMBANG SELADANG STYLE TOPBAR HEADER */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
              title={isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-[#053D27]" />}
              <span className="hidden sm:inline">{isSidebarOpen ? 'Hide Nav' : 'Menu'}</span>
            </button>

            <h2 className="font-anton text-sm sm:text-lg tracking-wide text-slate-800 uppercase truncate">
              {activeTab === 'requests' && 'Operasional Permintaan Pinjam'}
              {activeTab === 'active_loans' && 'Manajemen Pinjaman Aktif'}
              {activeTab === 'queues' && 'Antrean Reservasi Buku'}
              {activeTab === 'inventory' && 'CMS Katalog Buku Fisik'}
              {activeTab === 'articles' && 'CMS Artikel SEO Komunitas'}
              {activeTab === 'events' && 'CMS Acara & Meetup Komunitas'}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenScanner}
              className="px-3 py-1.5 bg-[#03321F] text-[#FFBF00] hover:bg-[#053D27] rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-[#FFBF00]/30 shadow-xs transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FFBF00]" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          </div>
        </header>

        {/* MOBILE HORIZONTAL SCROLL SUB-NAVBAR */}
        <div className="md:hidden bg-[#022416] px-3 py-2 border-b border-[#053D27] flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none sticky top-[53px] z-20 shadow-sm">
          <button
            onClick={() => handleTabChange('requests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'requests' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Permintaan</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('active_loans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'active_loans' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pinjaman Aktif</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#022416] text-[#D0DF00]">
              {activeLoans.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('queues')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'queues' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Antrean</span>
          </button>

          <button
            onClick={() => handleTabChange('inventory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'inventory' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D0DF00]" />
            <span>Katalog ({books.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('articles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'articles' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#D0DF00]" />
            <span>Artikel ({articles.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('events')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'events' ? 'bg-[#FFBF00] text-[#03321F]' : 'bg-[#053D27] text-emerald-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D0DF00]" />
            <span>Acara ({events.length})</span>
          </button>
        </div>

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

          {/* CMS TAB CONTENT PANELS */}

          {/* CMS TAB 1: PERMINTAAN PINJAM */}
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
                          {(req.collateralBookTitle || req.collateralNotes) && (
                            <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center gap-1 mt-1">
                              <span>🛡️ Jaminan:</span>
                              <span>{req.collateralBookTitle || req.collateralNotes}</span>
                            </div>
                          )}
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

          {/* CMS TAB 2: PINJAMAN AKTIF */}
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
                            {(loan.collateralBookTitle || loan.collateralNotes) && (
                              <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center gap-1 mt-1">
                                <span>🛡️ Jaminan:</span>
                                <span>{loan.collateralBookTitle || loan.collateralNotes}</span>
                              </div>
                            )}
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

                          {loan.collateralBookId && onForfeitCollateral && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => onForfeitCollateral(loan.id, 'owner')}
                                className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                title="Transfer kepemilikan jaminan ke pemilik buku asli sebagai ganti rugi"
                              >
                                ⚖️ Sita ke Pemilik
                              </button>
                              <button
                                type="button"
                                onClick={() => onForfeitCollateral(loan.id, 'community')}
                                className="py-2 px-2.5 bg-[#053D27] hover:bg-[#03291a] text-[#FFBF00] border border-[#FFBF00]/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                title="Transfer kepemilikan jaminan ke rak koleksi perpustakaan komunitas"
                              >
                                🏛️ Sita ke Komunitas
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => onReturnBook(loan.bookId)}
                            className="py-2 px-4 bg-[#053D27] hover:bg-[#FFBF00] hover:text-[#03321F] text-[#D0DF00] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
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

          {/* CMS TAB 3: KATALOG BUKU */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {(showAddBook || editingBook) ? (
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
              ) : (
                <>
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
                      className="w-full sm:w-auto py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Buku Baru (CMS)</span>
                    </button>
                  </div>
                </>
              )}

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
                              <div className="text-[#053D27] font-bold text-[11px]">
                                {book.ownerId === 'usr_admin_01' || book.ownerName.includes('Komunitas')
                                  ? book.shelfLocation
                                  : (book.ownerLocation || book.shelfLocation)}
                              </div>
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
                                {book.status === 'borrowed' && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`[Moderasi Admin Override]\n\nKembalikan paksa buku "${book.title}"? Status buku akan di-reset menjadi 'Tersedia'.`)) {
                                        onReturnBook(book.id);
                                      }
                                    }}
                                    className="p-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-lg transition-colors border border-amber-200"
                                    title="Moderasi Override: Tandai Dikembalikan (Force Return)"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
                                {book.status === 'available' && requests.some((r) => r.bookId === book.id && r.status === 'pending') && (
                                  <button
                                    onClick={() => {
                                      const reqToApprove = requests.find((r) => r.bookId === book.id && r.status === 'pending');
                                      if (reqToApprove && window.confirm(`[Moderasi Admin Override]\n\nSetujui peminjaman "${book.title}" untuk peminjam ${reqToApprove.userName}?`)) {
                                        onApproveRequest(reqToApprove.id);
                                      }
                                    }}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition-colors border border-emerald-200"
                                    title="Moderasi Override: Setujui Peminjaman Pending"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
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
                                  title="Edit Buku CMS"
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

          {/* CMS TAB: CMS ANGGOTA KOMUNITAS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Daftar Anggota Komunitas Tangsel ({members.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">Kelola kontak, domisili, catatan caretaker, serta moderasi status anggota</p>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="p-3.5">Anggota</th>
                        <th className="p-3.5">Kontak & Domisili</th>
                        <th className="p-3.5">Peran</th>
                        <th className="p-3.5 text-center">Buku Saya</th>
                        <th className="p-3.5">Status Governance</th>
                        <th className="p-3.5 text-right">Tindakan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {members.map((m) => {
                        const memberBookCount = books.filter((b) => b.ownerId === m.id || (b.ownerName && b.ownerName.toLowerCase() === m.name.toLowerCase())).length;

                        return (
                          <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-xl border border-slate-200 object-cover shrink-0" />
                                <div>
                                  <div className="font-bold text-slate-900">{m.name}</div>
                                  <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="space-y-0.5">
                                <div className="text-slate-800 font-bold">{m.phone || '-'}</div>
                                <div className="text-[11px] text-emerald-800 font-semibold">{m.domisili || 'Tangsel'}</div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                m.role === 'admin' ? 'bg-[#053D27] text-[#FFBF00] border-[#053D27]' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {m.role === 'admin' ? 'Caretaker' : 'Member'}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="font-mono font-extrabold text-slate-800 text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                                {memberBookCount} Buku
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="space-y-1">
                                {m.isBlacklisted ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 inline-block">
                                    ⛔ Ter-Blacklist
                                  </span>
                                ) : m.borrowingRestricted ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 inline-block">
                                    ⚠️ Borrowing Restricted
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                                    🟢 Normal / Aktif
                                  </span>
                                )}

                                {m.adminNotes && (
                                  <div className="text-[10px] text-amber-800 italic bg-amber-50 p-1 rounded border border-amber-200/60 max-w-xs">
                                    "{m.adminNotes}"
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {m.phone && (
                                  <a
                                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition-colors border border-emerald-200"
                                    title="Hubungi via WhatsApp"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setEditingMember(m)}
                                  className="px-2.5 py-1 bg-[#053D27] hover:bg-[#03321F] text-white font-extrabold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Kelola Data & Status Anggota"
                                >
                                  <Edit className="w-3.5 h-3.5 text-[#FFBF00]" />
                                  <span>Kelola</span>
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

          {/* CMS TAB 4: CMS ARTIKEL SEO */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              {(showAddArticle || editingArticle) ? (
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
              ) : (
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
                    className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Artikel Baru (SEO CMS)</span>
                  </button>
                </div>
              )}

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

          {/* CMS TAB 5: CMS ACARA */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {(showAddEvent || editingEvent) ? (
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
              ) : (
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
                    className="py-2 px-4 bg-[#053D27] text-[#D0DF00] hover:bg-[#FFBF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Acara Baru (CMS Acara)</span>
                  </button>
                </div>
              )}

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
                            {evt.hostAdminName && <span>👤 Host: {evt.hostAdminName}</span>}
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
                          title="Edit Acara CMS"
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

          {/* CMS TAB 6: RESERVATION QUEUES */}
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

        {/* MOBILE FLOATING SCANNER BUTTON (FAB) */}
        <div className="fixed bottom-5 right-5 z-40 md:hidden animate-bounce-subtle">
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-3 bg-[#03321F] text-[#FFBF00] rounded-full shadow-2xl border-2 border-[#FFBF00] font-extrabold text-xs active:scale-95 transition-all"
            title="Buka QR Scanner"
          >
            <QrCode className="w-5 h-5 text-[#FFBF00]" />
            <span>Scan QR</span>
          </button>
        </div>

      </main>

      {/* Edit Member Governance Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaveMember={(updatedMember) => {
            if (onUpdateMember) {
              onUpdateMember(updatedMember);
            }
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};
